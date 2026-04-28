import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Starting intelligent image scraping...');
    
    // Run the intelligent scraper
    const { stdout, stderr } = await execAsync('node scripts/intelligent-scraper.js', {
      cwd: process.cwd(),
      timeout: 300000,
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
    });
    
    if (stderr) {
      console.warn('Scraper warnings:', stderr);
    }
    
    console.log('Scraper output:', stdout);
    
    // Read the results
    const dbPath = path.join(process.cwd(), 'data/image-database.json');
    let results = { 
      message: 'Scraping completed', 
      images: [], 
      stats: { totalDownloaded: 0, totalFound: 0, errorCount: 0 }
    };
    
    try {
      const dbContent = await fs.readFile(dbPath, 'utf-8');
      const database = JSON.parse(dbContent);
      
      results = {
        message: 'Intelligent scraping completed successfully',
        images: database.images || [],
        stats: database.stats || { totalDownloaded: 0, totalFound: 0, errorCount: 0 },
        lastUpdated: database.lastUpdated
      };
    } catch (dbError) {
      console.warn('Could not read database:', dbError);
    }
    
    return NextResponse.json({
      success: true,
      ...results
    });
    
  } catch (error) {
    console.error('Error running intelligent scraper:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to run intelligent scraping',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode = 'auto' } = body;
    
    console.log('🎯 Starting targeted scraping...', { mode });
    
    const { stdout, stderr } = await execAsync('node scripts/intelligent-scraper.js', {
      cwd: process.cwd(),
      timeout: 300000,
      env: {
        ...process.env,
        SCRAPER_MODE: mode,
        NODE_OPTIONS: '--max-old-space-size=4096'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Targeted scraping completed',
      output: stdout,
      warnings: stderr
    });
    
  } catch (error) {
    console.error('Error in targeted scraping:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Targeted scraping failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}