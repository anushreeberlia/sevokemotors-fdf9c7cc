const { scrapeImages, MARUTI_SOURCES, MARUTI_MODELS } = require('./scraper');

// Example 1: Scrape from predefined Maruti sources
async function example1() {
  console.log('Example 1: Scraping from official Maruti websites');
  
  const urls = MARUTI_SOURCES.official;
  const results = await scrapeImages(urls, {
    carModel: 'swift',
    outputFolder: 'downloads',
    onProgress: (progress) => {
      console.log('Progress:', progress);
    }
  });
  
  console.log('Results:', results);
}

// Example 2: Scrape from custom URLs
async function example2() {
  console.log('Example 2: Scraping from custom URLs');
  
  const customUrls = [
    'https://www.marutisuzuki.com/channels/arena/cars/swift',
    'https://www.autocarindia.com/car-news/maruti-suzuki-swift',
    'https://www.zigwheels.com/newcars/maruti-suzuki/swift'
  ];
  
  const results = await scrapeImages(customUrls, {
    carModel: 'swift-custom',
    outputFolder: 'custom-downloads',
    minWidth: 400,
    minHeight: 300,
    concurrent: 2
  });
  
  console.log('Custom scraping results:', results);
}

// Example 3: Scrape multiple car models
async function example3() {
  console.log('Example 3: Scraping multiple car models');
  
  const modelsToScrape = ['swift', 'baleno', 'dzire'];
  const urls = [...MARUTI_SOURCES.official, ...MARUTI_SOURCES.news];
  
  for (const model of modelsToScrape) {
    console.log(`Scraping images for ${model}...`);
    
    try {
      const results = await scrapeImages(urls, {
        carModel: model,
        outputFolder: 'multi-model-downloads',
        onProgress: (progress) => {
          if (progress.stage === 'downloading') {
            process.stdout.write(`\r${model}: ${progress.completed}/${progress.total}`);
          }
        }
      });
      
      console.log(`\n${model} completed: ${results.successful.length} images`);
      
    } catch (error) {
      console.error(`Error scraping ${model}:`, error.message);
    }
    
    // Wait between models to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

// Example 4: Advanced configuration
async function example4() {
  console.log('Example 4: Advanced configuration');
  
  const urls = ['https://www.marutisuzuki.com/channels/arena/cars'];
  
  const results = await scrapeImages(urls, {
    carModel: 'premium-collection',
    outputFolder: 'premium-images',
    timeout: 45000,
    minWidth: 600,
    minHeight: 400,
    maxFileSize: 3 * 1024 * 1024, // 3MB
    concurrent: 1, // Be gentle on servers
    allowedFormats: ['jpg', 'png'],
    onProgress: (progress) => {
      console.log(`Stage: ${progress.stage}`);
      
      if (progress.stage === 'extracting') {
        console.log(`Extracting from: ${progress.currentUrl}`);
        console.log(`Found ${progress.foundImages} images so far`);
      } else if (progress.stage === 'downloading') {
        console.log(`Progress: ${progress.completed}/${progress.total}`);
        console.log(`Success: ${progress.successful}, Failed: ${progress.failed}`);
      }
    }
  });
  
  console.log('Advanced scraping completed:');
  console.log(`Total downloaded: ${results.successful.length}`);
  console.log(`Failed: ${results.failed.length}`);
  console.log(`Skipped: ${results.skipped.length}`);
  
  // Log detailed results
  if (results.failed.length > 0) {
    console.log('\nFailed downloads:');
    results.failed.forEach(fail => {
      console.log(`- ${fail.url}: ${fail.error}`);
    });
  }
  
  if (results.skipped.length > 0) {
    console.log('\nSkipped images:');
    results.skipped.slice(0, 5).forEach(skip => {
      console.log(`- ${skip.url}: ${skip.reason}`);
    });
  }
}

// Run examples
if (require.main === module) {
  console.log('🚗 Maruti Image Scraper Examples\n');
  
  const examples = {
    '1': example1,
    '2': example2,
    '3': example3,
    '4': example4
  };
  
  const exampleNumber = process.argv[2] || '1';
  
  if (examples[exampleNumber]) {
    examples[exampleNumber]()
      .then(() => console.log('\n✅ Example completed!'))
      .catch(error => console.error('❌ Example failed:', error));
  } else {
    console.log('Usage: node example-usage.js [1|2|3|4]');
    console.log('1 - Official Maruti websites');
    console.log('2 - Custom URLs');
    console.log('3 - Multiple car models');
    console.log('4 - Advanced configuration');
  }
}