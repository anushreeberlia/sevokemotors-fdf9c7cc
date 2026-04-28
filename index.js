const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const scraper = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Maruti Image Scraper API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      '/scrape': 'POST - Start scraping images',
      '/jobs': 'GET - List all scraping jobs',
      '/images': 'GET - List scraped images',
      '/images/:filename': 'GET - View specific image'
    }
  });
});

// Start scraping endpoint
app.post('/scrape', async (req, res) => {
  try {
    const { urls, carModel, outputFolder } = req.body;
    
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' });
    }

    const jobId = Date.now();
    const job = {
      id: jobId,
      urls,
      carModel: carModel || 'unknown',
      outputFolder: outputFolder || 'downloads',
      status: 'started',
      createdAt: new Date().toISOString(),
      images: []
    };

    // Save job to database
    db.insert('jobs', job);
    
    // Start scraping in background
    scrapeImagesBackground(jobId, urls, job.carModel, job.outputFolder);
    
    res.json({
      message: 'Scraping job started',
      jobId,
      status: 'started'
    });
  } catch (error) {
    console.error('Error starting scrape job:', error);
    res.status(500).json({ error: 'Failed to start scraping job' });
  }
});

// Get all jobs
app.get('/jobs', (req, res) => {
  try {
    const jobs = db.getAll('jobs') || [];
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get specific job
app.get('/jobs/:id', (req, res) => {
  try {
    const job = db.getById('jobs', parseInt(req.params.id));
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// List scraped images
app.get('/images', (req, res) => {
  try {
    const imagesDir = path.join(__dirname, 'images');
    
    if (!fs.existsSync(imagesDir)) {
      return res.json({ images: [] });
    }
    
    const images = fs.readdirSync(imagesDir)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => {
        const filePath = path.join(imagesDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          size: stats.size,
          createdAt: stats.birthtime.toISOString(),
          url: `/images/${file}`
        };
      });
    
    res.json({ images });
  } catch (error) {
    console.error('Error listing images:', error);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Background scraping function
async function scrapeImagesBackground(jobId, urls, carModel, outputFolder) {
  try {
    console.log(`Starting background scraping job ${jobId} for ${carModel}`);
    
    // Update job status
    db.update('jobs', jobId, { status: 'running', startedAt: new Date().toISOString() });
    
    const results = await scraper.scrapeImages(urls, {
      outputFolder,
      carModel,
      onProgress: (progress) => {
        console.log(`Job ${jobId} progress:`, progress);
        const job = db.getById('jobs', jobId);
        if (job) {
          db.update('jobs', jobId, { 
            progress,
            lastUpdated: new Date().toISOString()
          });
        }
      }
    });
    
    // Update job with results
    db.update('jobs', jobId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      results,
      totalImages: results.successful.length,
      errors: results.failed
    });
    
    console.log(`Job ${jobId} completed. Downloaded ${results.successful.length} images.`);
    
  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    
    db.update('jobs', jobId, {
      status: 'failed',
      error: error.message,
      failedAt: new Date().toISOString()
    });
  }
}

app.listen(PORT, () => {
  console.log(`Image scraper server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} for API documentation`);
});