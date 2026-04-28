import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const dbPath = path.join(process.cwd(), 'data/image-database.json');
    
    // Check if database exists
    try {
      await fs.access(dbPath);
    } catch (error) {
      // Database doesn't exist, return empty result
      return NextResponse.json({
        success: true,
        images: [],
        stats: { totalDownloaded: 0 },
        message: 'No images database found. Run scraping first.'
      });
    }
    
    // Read and parse the database
    const dbContent = await fs.readFile(dbPath, 'utf-8');
    const database = JSON.parse(dbContent);
    
    // Handle different database formats
    let images = [];
    if (Array.isArray(database.images)) {
      if (database.images.length > 0 && Array.isArray(database.images[0])) {
        // Map format [[hash, imageInfo], ...]
        images = database.images.map(([hash, imageInfo]: [string, any]) => ({
          hash,
          ...imageInfo
        }));
      } else {
        // Array format [imageInfo, ...]
        images = database.images;
      }
    }
    
    return NextResponse.json({
      success: true,
      images: images,
      stats: database.stats || { totalDownloaded: 0 },
      lastUpdated: database.lastUpdated,
      totalCount: images.length
    });
    
  } catch (error) {
    console.error('Error reading image database:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to read image database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Trigger the intelligent scraper by calling the scrape endpoint
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/scrape`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to trigger image scraping',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}