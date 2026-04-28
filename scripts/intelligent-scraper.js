const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const probeImageSize = require('probe-image-size');
const crypto = require('crypto');

class IntelligentMarutiScraper {
  constructor() {
    this.marutiModels = [
      'swift', 'baleno', 'dzire', 'vitara-brezza', 'alto', 'wagon-r',
      'celerio', 'ertiga', 'xl6', 'ciaz', 'grand-vitara', 'fronx',
      'invicto', 's-cross', 'jimny', 'eeco'
    ];
    
    this.targetSources = [
      'https://www.marutisuzuki.com',
      'https://www.autocarindia.com',
      'https://www.zigwheels.com'
    ];
    
    this.imageDatabase = new Map();
    this.processedUrls = new Set();
    this.downloadedHashes = new Set();
    
    this.stats = {
      totalFound: 0,
      totalDownloaded: 0,
      duplicatesSkipped: 0,
      errorCount: 0,
      modelBreakdown: {}
    };
  }

  async initialize() {
    console.log('🚗 Initializing Intelligent Maruti Scraper...');
    
    try {
      await fs.ensureDir('./public/images/cars');
      await fs.ensureDir('./data');
      await this.loadExistingDatabase();
      console.log('✅ Scraper initialized successfully');
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      throw error;
    }
  }

  async loadExistingDatabase() {
    try {
      const dbPath = './data/image-database.json';
      if (await fs.pathExists(dbPath)) {
        const data = await fs.readJson(dbPath);
        if (data.images && Array.isArray(data.images)) {
          this.imageDatabase = new Map(data.images);
        }
        if (data.hashes && Array.isArray(data.hashes)) {
          this.downloadedHashes = new Set(data.hashes);
        }
        console.log(`📚 Loaded ${this.imageDatabase.size} existing images from database`);
      }
    } catch (error) {
      console.log('📚 No existing database found, starting fresh');
    }
  }

  async saveDatabase() {
    try {
      const dbPath = './data/image-database.json';
      const data = {
        images: Array.from(this.imageDatabase.entries()),
        hashes: Array.from(this.downloadedHashes),
        lastUpdated: new Date().toISOString(),
        stats: this.stats
      };
      
      await fs.writeJson(dbPath, data, { spaces: 2 });
      console.log('💾 Database saved successfully');
    } catch (error) {
      console.error('❌ Failed to save database:', error.message);
    }
  }

  isCarImage(imgSrc, alt = '') {
    const carKeywords = [
      'swift', 'baleno', 'dzire', 'brezza', 'alto', 'wagon', 'celerio',
      'ertiga', 'xl6', 'ciaz', 'vitara', 'fronx', 'invicto', 'cross',
      'maruti', 'suzuki', 'car', 'vehicle', 'sedan', 'hatchback', 'suv'
    ];
    
    const excludeKeywords = [
      'logo', 'icon', 'button', 'arrow', 'social', 'facebook',
      'twitter', 'instagram', 'banner', 'ad', 'advertisement'
    ];
    
    const imgSrcLower = imgSrc.toLowerCase();
    const altLower = alt.toLowerCase();
    
    if (excludeKeywords.some(keyword => 
      imgSrcLower.includes(keyword) || altLower.includes(keyword)
    )) {
      return false;
    }
    
    return carKeywords.some(keyword => 
      imgSrcLower.includes(keyword) || altLower.includes(keyword)
    );
  }

  detectCarModel(imgSrc, alt = '') {
    const text = `${imgSrc} ${alt}`.toLowerCase();
    
    for (const model of this.marutiModels) {
      const modelVariations = [
        model,
        model.replace('-', ''),
        model.replace('-', ' '),
        model.split('-')[0]
      ];
      
      if (modelVariations.some(variation => text.includes(variation))) {
        return model;
      }
    }
    
    return 'general';
  }

  async analyzeImage(imageBuffer) {
    try {
      const metadata = await sharp(imageBuffer).metadata();
      
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        size: imageBuffer.length,
        isValid: (metadata.width >= 300 && metadata.height >= 200 && imageBuffer.length < 5 * 1024 * 1024)
      };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  generateImageHash(buffer) {
    return crypto.createHash('md5').update(buffer).digest('hex');
  }

  async downloadAndProcessImage(imageUrl, model, alt = '') {
    try {
      console.log(`📥 Downloading: ${imageUrl.substring(0, 60)}...`);
      
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SevokeMotors-Bot/1.0)'
        }
      });
      
      const imageBuffer = Buffer.from(response.data);
      const imageHash = this.generateImageHash(imageBuffer);
      
      if (this.downloadedHashes.has(imageHash)) {
        this.stats.duplicatesSkipped++;
        return { success: false, reason: 'duplicate' };
      }
      
      const analysis = await this.analyzeImage(imageBuffer);
      if (!analysis.isValid) {
        return { success: false, reason: 'invalid_image', details: analysis.error };
      }
      
      const timestamp = Date.now();
      const filename = `${model}_${timestamp}_${imageHash.substring(0, 8)}.webp`;
      const filepath = path.join('./public/images/cars', filename);
      
      let processedBuffer = await sharp(imageBuffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
      
      await fs.writeFile(filepath, processedBuffer);
      
      const imageInfo = {
        filename: filename,
        originalUrl: imageUrl,
        model: model,
        alt: alt,
        hash: imageHash,
        downloadedAt: new Date().toISOString(),
        dimensions: { width: analysis.width, height: analysis.height },
        fileSize: processedBuffer.length
      };
      
      this.imageDatabase.set(imageHash, imageInfo);
      this.downloadedHashes.add(imageHash);
      
      this.stats.totalDownloaded++;
      this.stats.modelBreakdown[model] = (this.stats.modelBreakdown[model] || 0) + 1;
      
      console.log(`✅ Saved: ${filename}`);
      return { success: true, filename: filename, info: imageInfo };
      
    } catch (error) {
      this.stats.errorCount++;
      console.error(`❌ Download failed: ${error.message}`);
      return { success: false, reason: 'download_error', error: error.message };
    }
  }

  async scrapeWebsite(url) {
    if (this.processedUrls.has(url)) {
      return { images: [], reason: 'already_processed' };
    }
    
    console.log(`🔍 Scraping: ${url}`);
    
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SevokeMotors-Bot/1.0)'
        }
      });
      
      const $ = cheerio.load(response.data);
      const foundImages = [];
      
      $('img').each((index, element) => {
        const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('data-lazy');
        const alt = $(element).attr('alt') || '';
        
        if (!src) return;
        
        let imageUrl = src;
        if (src.startsWith('//')) {
          imageUrl = 'https:' + src;
        } else if (src.startsWith('/')) {
          try {
            const baseUrl = new URL(url);
            imageUrl = baseUrl.origin + src;
          } catch (e) {
            return;
          }
        } else if (!src.startsWith('http')) {
          try {
            const baseUrl = new URL(url);
            imageUrl = new URL(src, baseUrl).href;
          } catch (e) {
            return;
          }
        }
        
        if (this.isCarImage(imageUrl, alt)) {
          const model = this.detectCarModel(imageUrl, alt);
          foundImages.push({ url: imageUrl, alt, model });
          this.stats.totalFound++;
        }
      });
      
      this.processedUrls.add(url);
      console.log(`📸 Found ${foundImages.length} potential car images`);
      
      return { images: foundImages };
      
    } catch (error) {
      console.error(`❌ Error scraping ${url}:`, error.message);
      return { images: [], error: error.message };
    }
  }

  async intelligentSearch() {
    console.log('🧠 Starting intelligent search for Maruti Suzuki images...');
    
    const allImageCandidates = [];
    
    for (const baseUrl of this.targetSources) {
      try {
        const paths = ['/cars', '/new-cars', '/maruti-suzuki', '/maruti', ''];
        
        for (const urlPath of paths) {
          const fullUrl = baseUrl + urlPath;
          const result = await this.scrapeWebsite(fullUrl);
          
          if (result.images && result.images.length > 0) {
            allImageCandidates.push(...result.images);
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Error with source ${baseUrl}:`, error.message);
      }
    }
    
    const prioritizedImages = allImageCandidates.sort((a, b) => {
      const priorityModels = ['swift', 'baleno', 'dzire', 'vitara-brezza'];
      const aPriority = priorityModels.indexOf(a.model);
      const bPriority = priorityModels.indexOf(b.model);
      
      if (aPriority !== -1 && bPriority !== -1) {
        return aPriority - bPriority;
      } else if (aPriority !== -1) {
        return -1;
      } else if (bPriority !== -1) {
        return 1;
      }
      return 0;
    });
    
    console.log(`🎯 Found ${prioritizedImages.length} potential images, starting downloads...`);
    
    const concurrency = 2;
    
    for (let i = 0; i < prioritizedImages.length; i += concurrency) {
      const batch = prioritizedImages.slice(i, i + concurrency);
      
      const batchPromises = batch.map(async (imageCandidate) => {
        return await this.downloadAndProcessImage(
          imageCandidate.url,
          imageCandidate.model,
          imageCandidate.alt
        );
      });
      
      await Promise.all(batchPromises);
      
      const progress = Math.min(i + concurrency, prioritizedImages.length);
      console.log(`📊 Progress: ${progress}/${prioritizedImages.length}`);
      
      if (i + concurrency < prioritizedImages.length) {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

  async generateReport() {
    console.log('\n📊 INTELLIGENT SCRAPING REPORT');
    console.log('================================');
    console.log(`🔍 Total Images Found: ${this.stats.totalFound}`);
    console.log(`✅ Successfully Downloaded: ${this.stats.totalDownloaded}`);
    console.log(`⏭️  Duplicates Skipped: ${this.stats.duplicatesSkipped}`);
    console.log(`❌ Errors: ${this.stats.errorCount}`);
    console.log('\n📈 Model Breakdown:');
    
    for (const [model, count] of Object.entries(this.stats.modelBreakdown)) {
      const displayName = model.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      console.log(`   ${displayName}: ${count} images`);
    }
  }

  async run() {
    try {
      await this.initialize();
      await this.intelligentSearch();
      await this.saveDatabase();
      await this.generateReport();
      
      console.log('\n🎉 Intelligent scraping completed successfully!');
      
    } catch (error) {
      console.error('❌ Scraping failed:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const scraper = new IntelligentMarutiScraper();
  scraper.run();
}

module.exports = IntelligentMarutiScraper;