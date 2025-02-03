const fs = require('fs');  // Correctly importing fs module
const path = require('path');
const { SitemapStream } = require('sitemap');

// Define your base URL
const BASE_URL = 'https://www.smart-serving.com';

// Example list of restaurants (you can replace this with dynamic fetching from your backend)
const restaurants = ['karai-chettinad', 'xyz-restaurant', 'delicious-bites'];

// List of static pages
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/menu', changefreq: 'daily', priority: 0.9 },
  { url: '/my-orders', changefreq: 'weekly', priority: 0.8 },
];

// Add dynamic restaurant-specific pages
restaurants.forEach((restaurant) => {
  links.push({ url: `/${restaurant}/menu_items`, changefreq: 'daily', priority: 0.9 });
  links.push({ url: `/${restaurant}/orders`, changefreq: 'weekly', priority: 0.8 });
});

function generateSitemap() {
  const sitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  
  // Create the SitemapStream instance
  const stream = new SitemapStream({ hostname: BASE_URL });
  
  // Create a writable stream to save the sitemap
  const writeStream = fs.createWriteStream(sitemapPath); // Corrected to fs.createWriteStream

  // Pipe the SitemapStream into the file write stream
  stream.pipe(writeStream);

  // Add links to the sitemap
  links.forEach((link) => stream.write(link));
  
  // End the stream
  stream.end();

  // Event listeners for stream completion and errors
  writeStream.on('finish', () => console.log('✅ Sitemap generated successfully!'));
  writeStream.on('error', (err) => console.error('❌ Error writing sitemap:', err));
}

generateSitemap();
