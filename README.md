# Maruti Suzuki Image Scraper

A powerful Node.js script to scrape reference pictures of Maruti Suzuki cars from specified websites. The scraper handles errors gracefully, provides detailed logging, and saves images to organized folders.

## Features

- 🚗 **Car-specific scraping** - Organized by Maruti Suzuki models
- 🖼️ **Image processing** - Automatic resizing and format conversion
- 📊 **Progress tracking** - Real-time progress updates
- 🛡️ **Error handling** - Graceful error recovery and detailed logging
- 💾 **Data persistence** - Job tracking with JSON database
- 🌐 **Web API** - REST API for managing scraping jobs
- 🖥️ **CLI interface** - Interactive command-line tool
- ⚡ **Concurrent downloads** - Configurable parallel processing
- 📁 **Organized storage** - Images sorted by car model

## Installation

```bash
npm install
```

## Usage

### 1. Web API Server

Start the API server:

```bash
npm start
```

The server will run on port 3000 (or PORT environment variable).

#### API Endpoints:

- `GET /` - API documentation
- `POST /scrape` - Start a scraping job
- `GET /jobs` - List all scraping jobs
- `GET /jobs/:id` - Get specific job details
- `GET /images` - List scraped images

#### Start a scraping job:

```bash
curl -X POST http://localhost:3000/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://www.marutisuzuki.com/channels/arena/cars/swift",
      "https://www.autocarindia.com/car-news/maruti-suzuki-swift"
    ],
    "carModel": "swift",
    "outputFolder": "downloads"
  }'
```

### 2. Command Line Interface

Run the interactive CLI:

```bash
node cli-scraper.js
```

The CLI provides options to:
- Scrape from predefined Maruti sources
- Scrape from custom URLs
- Scrape specific car models
- View scraping history

### 3. Programmatic Usage

```javascript
const { scrapeImages, MARUTI_SOURCES } = require('./scraper');

// Basic usage
const results = await scrapeImages([
  'https://www.marutisuzuki.com/channels/arena/cars/swift'
], {
  carModel: 'swift',
  outputFolder: 'images'
});

console.log(`Downloaded ${results.successful.length} images`);
```

#### Advanced configuration:

```javascript
const results = await scrapeImages(urls, {
  carModel: 'baleno',
  outputFolder: 'custom-folder',
  timeout: 30000,
  minWidth: 400,
  minHeight: 300,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  concurrent: 3,
  allowedFormats: ['jpg', 'png', 'webp'],
  onProgress: (progress) => {
    console.log('Progress:', progress);
  }
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `carModel` | string | 'maruti' | Car model name for organization |
| `outputFolder` | string | 'images' | Base output directory |
| `timeout` | number | 30000 | Request timeout in milliseconds |
| `minWidth` | number | 300 | Minimum image width |
| `minHeight` | number | 200 | Minimum image height |
| `maxFileSize` | number | 5MB | Maximum file size |
| `concurrent` | number | 3 | Concurrent downloads |
| `allowedFormats` | array | ['jpg','jpeg','png','webp'] | Allowed image formats |
| `onProgress` | function | null | Progress callback function |

## Supported Maruti Models

The scraper includes predefined support for:

- Swift, Dzire, Baleno
- Vitara Brezza, S-Cross
- Alto, WagonR, Celerio
- Ertiga, XL6, Ciaz
- Grand Vitara, Fronx, Invicto
- And more...

## Predefined Sources

The scraper includes URLs for:

- **Official websites**: marutisuzuki.com
- **News sites**: autocarindia.com, zigwheels.com
- **Review sites**: team-bhp.com, cardekho.com

## File Structure

```
images/
├── swift/
│   ├── swift_image1_timestamp_hash.jpg
│   └── swift_image2_timestamp_hash.jpg
├── baleno/
│   └── baleno_image1_timestamp_hash.jpg
data/
└── scraper.json          # Job database
scraping-log-*.json       # Detailed logs
```

## Error Handling

The scraper handles various error scenarios:

- Network timeouts and connection errors
- Invalid image formats or corrupted files
- Images too small or large
- Duplicate images (automatic skipping)
- Server rate limiting (respectful delays)

## Logging

- **Console logging**: Real-time progress and errors
- **Database logging**: Job status and results in JSON
- **File logging**: Detailed scraping logs with timestamps
- **API logging**: HTTP request/response logging

## Rate Limiting & Ethics

The scraper is designed to be respectful:

- Configurable delays between requests
- User-Agent headers to identify requests
- Concurrent download limits
- Timeout handling to avoid hanging requests

## Examples

See `example-usage.js` for detailed usage examples:

```bash
# Run basic example
node example-usage.js 1

# Run custom URLs example
node example-usage.js 2

# Run multiple models example
node example-usage.js 3

# Run advanced configuration example
node example-usage.js 4
```

## Environment Variables

- `PORT` - API server port (default: 3000)
- `DB_PATH` - Database file path (default: /data/scraper.json)

## License

MIT License - see LICENSE file for details.

## Disclaimer

This scraper is intended for educational and reference purposes. Please respect websites' robots.txt files and terms of service. Always ensure you have permission to scrape content from websites.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
