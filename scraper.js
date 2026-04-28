const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { URL } = require('url');
const sharp = require('sharp');

// Default configuration
const DEFAULT_CONFIG = {
  outputFolder: 'images',
  carModel: 'maruti',
  timeout: 30000,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  minWidth: 300,
  minHeight: 200,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  concurrent: 3
};

// Maruti Suzuki car models for better image filtering
const MARUTI_MODELS = [
  'swift', 'dzire', 'baleno', 'vitara', 'brezza', 'alto', 'wagon-r',
  's-presso', 'celerio', 'eeco', 'ertiga', 'xl6', 's-cross', 'ciaz',
  'jimny', 'grand-vitara', 'fronx', 'invicto'
];

class ImageScraper {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.downloadedCount = 0;
    this.errorCount = 0;
    this.results = {
      successful: [],
      failed: [],
      skipped: []
    };
  }

  // Main scraping function
  async scrapeImages(urls, options = {}) {
    const config = { ...this.config, ...options };
    console.log(`Starting image scraping for ${config.carModel}`);
    console.log(`Target URLs: ${urls.length}`);
    
    // Ensure output directory exists
    const outputPath = path.join(__dirname, config.outputFolder, config.carModel);
    await fs.ensureDir(outputPath);
    
    this.results = { successful: [], failed: [], skipped: [] };
    this.downloadedCount = 0;
    this.errorCount = 0;
    
    const allImageUrls = new Set();
    
    // Extract image URLs from each page
    for (const url of urls) {
      try {
        console.log(`Extracting images from: ${url}`);
        const imageUrls = await this.extractImageUrls(url);
        imageUrls.forEach(imgUrl => allImageUrls.add(imgUrl));
        
        if (config.onProgress) {
          config.onProgress({
            stage: 'extracting',
            currentUrl: url,
            totalUrls: urls.length,
            foundImages: allImageUrls.size
          });
        }
      } catch (error) {
        console.error(`Error extracting from ${url}:`, error.message);
        this.results.failed.push({ url, error: error.message, stage: 'extraction' });
      }
    }
    
    console.log(`Found ${allImageUrls.size} unique image URLs`);
    
    // Download images with concurrency control
    const imageUrlArray = Array.from(allImageUrls);
    const chunks = this.chunkArray(imageUrlArray, config.concurrent);
    
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const promises = chunk.map(imageUrl => 
        this.downloadImage(imageUrl, outputPath, config)
      );
      
      await Promise.allSettled(promises);
      
      if (config.onProgress) {
        config.onProgress({
          stage: 'downloading',
          completed: Math.min((i + 1) * config.concurrent, imageUrlArray.length),
          total: imageUrlArray.length,
          successful: this.results.successful.length,
          failed: this.results.failed.length
        });
      }
    }
    
    console.log(`Scraping completed. Downloaded: ${this.results.successful.length}, Failed: ${this.results.failed.length}`);
    return this.results;
  }
  
  // Extract image URLs from a webpage
  async extractImageUrls(pageUrl) {
    try {
      const response = await axios.get(pageUrl, {
        timeout: this.config.timeout,
        headers: {
          'User-Agent': this.config.userAgent
        }
      });
      
      const $ = cheerio.load(response.data);
      const imageUrls = new Set();
      
      // Extract from img tags
      $('img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy');
        if (src) {
          const absoluteUrl = this.resolveUrl(src, pageUrl);
          if (this.isValidImageUrl(absoluteUrl)) {
            imageUrls.add(absoluteUrl);
          }
        }
      });
      
      // Extract from CSS background images
      $('[style*="background-image"]').each((index, element) => {
        const style = $(element).attr('style');
        const match = style.match(/background-image:\s*url\(['"]?([^'"\)]+)['"]?\)/);
        if (match && match[1]) {
          const absoluteUrl = this.resolveUrl(match[1], pageUrl);
          if (this.isValidImageUrl(absoluteUrl)) {
            imageUrls.add(absoluteUrl);
          }
        }
      });
      
      return Array.from(imageUrls);
    } catch (error) {
      console.error(`Error fetching page ${pageUrl}:`, error.message);
      throw error;
    }
  }
  
  // Download and process a single image
  async downloadImage(imageUrl, outputPath, config) {
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: config.timeout,
        headers: {
          'User-Agent': config.userAgent
        },
        maxContentLength: config.maxFileSize
      });
      
      const buffer = Buffer.from(response.data);
      
      // Get image metadata
      const metadata = await sharp(buffer).metadata();
      
      // Validate image dimensions
      if (metadata.width < config.minWidth || metadata.height < config.minHeight) {
        this.results.skipped.push({
          url: imageUrl,
          reason: `Image too small: ${metadata.width}x${metadata.height}`
        });
        return;
      }
      
      // Generate filename
      const filename = this.generateFilename(imageUrl, config.carModel, metadata.format);
      const filepath = path.join(outputPath, filename);
      
      // Skip if file already exists
      if (await fs.pathExists(filepath)) {
        this.results.skipped.push({
          url: imageUrl,
          reason: 'File already exists',
          filename
        });
        return;
      }
      
      // Process and save image
      await sharp(buffer)
        .resize(800, 600, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toFile(filepath);
      
      this.results.successful.push({
        url: imageUrl,
        filename,
        filepath,
        dimensions: `${metadata.width}x${metadata.height}`,
        size: buffer.length,
        format: metadata.format
      });
      
      this.downloadedCount++;
      console.log(`Downloaded: ${filename}`);
      
    } catch (error) {
      this.results.failed.push({
        url: imageUrl,
        error: error.message,
        stage: 'download'
      });
      this.errorCount++;
      console.error(`Failed to download ${imageUrl}:`, error.message);
    }
  }
  
  // Helper functions
  resolveUrl(url, base) {
    try {
      return new URL(url, base).href;
    } catch {
      return null;
    }
  }
  
  isValidImageUrl(url) {
    if (!url) return false;
    
    const extension = path.extname(url.split('?')[0]).toLowerCase().substring(1);
    return this.config.allowedFormats.includes(extension);
  }
  
  generateFilename(url, carModel, format) {
    const urlPath = new URL(url).pathname;
    const originalName = path.basename(urlPath, path.extname(urlPath));
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    
    return `${carModel}_${originalName}_${timestamp}_${random}.jpg`;
  }
  
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

// Predefined URLs for Maruti Suzuki car images
const MARUTI_SOURCES = {
  official: [
    'https://www.marutisuzuki.com/channels/arena/cars',
    'https://www.marutisuzuki.com/channels/nexa/cars'
  ],
  news: [
    'https://www.autocarindia.com/car-news/maruti-suzuki',
    'https://www.zigwheels.com/newcars/maruti-suzuki',
    'https://www.carwale.com/maruti-suzuki-cars/'
  ],
  reviews: [
    'https://www.team-bhp.com/forum/indian-car-scene/',
    'https://www.cardekho.com/maruti-suzuki'
  ]
};

// Export scraper class and helper functions
module.exports = {
  ImageScraper,
  scrapeImages: async (urls, config = {}) => {
    const scraper = new ImageScraper(config);
    return await scraper.scrapeImages(urls, config);
  },
  MARUTI_SOURCES,
  MARUTI_MODELS
};