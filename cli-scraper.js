#!/usr/bin/env node

const { ImageScraper, MARUTI_SOURCES, MARUTI_MODELS } = require('./scraper');
const readline = require('readline');
const fs = require('fs');

// Command line interface for the scraper
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function displayMenu() {
  console.log('\n🚗 Maruti Suzuki Image Scraper');
  console.log('================================');
  console.log('1. Scrape from predefined Maruti sources');
  console.log('2. Scrape from custom URLs');
  console.log('3. Scrape specific car model');
  console.log('4. List available car models');
  console.log('5. View scraping history');
  console.log('6. Exit');
  console.log('================================');
}

function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function scrapeFromPredefined() {
  console.log('\nAvailable sources:');
  console.log('1. Official Maruti Suzuki websites');
  console.log('2. News and review websites');
  console.log('3. All sources');
  
  const choice = await askQuestion('Select source (1-3): ');
  let urls = [];
  
  switch (choice) {
    case '1':
      urls = MARUTI_SOURCES.official;
      break;
    case '2':
      urls = [...MARUTI_SOURCES.news, ...MARUTI_SOURCES.reviews];
      break;
    case '3':
      urls = [...MARUTI_SOURCES.official, ...MARUTI_SOURCES.news, ...MARUTI_SOURCES.reviews];
      break;
    default:
      console.log('Invalid choice');
      return;
  }
  
  const carModel = await askQuestion('Car model (or "all" for general): ');
  await startScraping(urls, carModel === 'all' ? 'maruti' : carModel);
}

async function scrapeFromCustomUrls() {
  console.log('\nEnter URLs to scrape (one per line, empty line to finish):');
  const urls = [];
  
  while (true) {
    const url = await askQuestion('URL: ');
    if (!url.trim()) break;
    
    try {
      new URL(url);
      urls.push(url);
      console.log(`✓ Added: ${url}`);
    } catch {
      console.log('❌ Invalid URL, skipping');
    }
  }
  
  if (urls.length === 0) {
    console.log('No valid URLs provided');
    return;
  }
  
  const carModel = await askQuestion('Car model: ');
  await startScraping(urls, carModel || 'custom');
}

async function scrapeSpecificModel() {
  console.log('\nAvailable Maruti models:');
  MARUTI_MODELS.forEach((model, index) => {
    console.log(`${index + 1}. ${model.charAt(0).toUpperCase() + model.slice(1)}`);
  });
  
  const choice = await askQuestion('Select model number: ');
  const modelIndex = parseInt(choice) - 1;
  
  if (modelIndex < 0 || modelIndex >= MARUTI_MODELS.length) {
    console.log('Invalid choice');
    return;
  }
  
  const selectedModel = MARUTI_MODELS[modelIndex];
  const urls = [...MARUTI_SOURCES.official, ...MARUTI_SOURCES.news];
  
  await startScraping(urls, selectedModel);
}

async function startScraping(urls, carModel) {
  console.log(`\n🚀 Starting scraping for: ${carModel}`);
  console.log(`📊 URLs to scrape: ${urls.length}`);
  console.log(`📁 Output folder: images/${carModel}`);
  
  const scraper = new ImageScraper();
  
  try {
    const results = await scraper.scrapeImages(urls, {
      carModel,
      outputFolder: 'images',
      onProgress: (progress) => {
        if (progress.stage === 'extracting') {
          process.stdout.write(`\r🔍 Extracting from ${progress.currentUrl.substring(0, 50)}...`);
        } else if (progress.stage === 'downloading') {
          process.stdout.write(`\r📥 Downloaded ${progress.completed}/${progress.total} images`);
        }
      }
    });
    
    console.log('\n\n✅ Scraping completed!');
    console.log(`📸 Successfully downloaded: ${results.successful.length}`);
    console.log(`❌ Failed downloads: ${results.failed.length}`);
    console.log(`⏭️ Skipped images: ${results.skipped.length}`);
    
    if (results.failed.length > 0) {
      console.log('\n❌ Failed downloads:');
      results.failed.slice(0, 5).forEach(fail => {
        console.log(`   ${fail.url}: ${fail.error}`);
      });
      if (results.failed.length > 5) {
        console.log(`   ... and ${results.failed.length - 5} more`);
      }
    }
    
    // Save results to log
    const logFile = `scraping-log-${Date.now()}.json`;
    fs.writeFileSync(logFile, JSON.stringify({
      timestamp: new Date().toISOString(),
      carModel,
      urls,
      results
    }, null, 2));
    
    console.log(`📝 Detailed log saved to: ${logFile}`);
    
  } catch (error) {
    console.error('\n❌ Scraping failed:', error.message);
  }
}

function listModels() {
  console.log('\n🚗 Available Maruti Suzuki Models:');
  console.log('==================================');
  MARUTI_MODELS.forEach((model, index) => {
    const displayName = model.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    console.log(`${(index + 1).toString().padStart(2)}. ${displayName}`);
  });
}

function viewHistory() {
  console.log('\n📜 Scraping History:');
  const logFiles = fs.readdirSync('.').filter(file => file.startsWith('scraping-log-'));
  
  if (logFiles.length === 0) {
    console.log('No scraping history found.');
    return;
  }
  
  logFiles.sort().reverse().slice(0, 10).forEach((file, index) => {
    try {
      const log = JSON.parse(fs.readFileSync(file));
      console.log(`${index + 1}. ${log.carModel} - ${new Date(log.timestamp).toLocaleString()}`);
      console.log(`   Success: ${log.results.successful.length}, Failed: ${log.results.failed.length}`);
    } catch {
      console.log(`${index + 1}. ${file} (corrupted)`);
    }
  });
}

async function main() {
  console.log('🚗 Welcome to Maruti Suzuki Image Scraper!');
  
  while (true) {
    displayMenu();
    const choice = await askQuestion('Select option (1-6): ');
    
    switch (choice) {
      case '1':
        await scrapeFromPredefined();
        break;
      case '2':
        await scrapeFromCustomUrls();
        break;
      case '3':
        await scrapeSpecificModel();
        break;
      case '4':
        listModels();
        break;
      case '5':
        viewHistory();
        break;
      case '6':
        console.log('👋 Goodbye!');
        rl.close();
        process.exit(0);
      default:
        console.log('❌ Invalid choice, please try again.');
    }
    
    await askQuestion('\nPress Enter to continue...');
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Goodbye!');
  rl.close();
  process.exit(0);
});

// Run the CLI if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}