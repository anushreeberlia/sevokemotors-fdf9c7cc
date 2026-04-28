import { NextResponse } from 'next/server';
import { scrapeImages } from '../../../scraper';

export async function GET() {
    try {
        const images = await scrapeImages();
        return NextResponse.json({ success: true, images });
    } catch (error) {
        console.error('Error scraping images:', error);
        return NextResponse.json({ success: false, message: 'Scraping failed' });
    }
}