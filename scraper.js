// Assuming this is your current scraping function setup.
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeImages() {
    const url = 'https://www.marutisuzuki.com/'; // Replace with the actual URL to scrape
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const images = [];

    $('img').each((_, element) => {
        const imgSrc = $(element).attr('src');
        if (imgSrc) {
            images.push(imgSrc);
        }
    });

    return images;
}

module.exports = { scrapeImages };