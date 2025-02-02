const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

const BASE_URL = 'https://www.smart-serving.com';

// Example list of restaurants (you can replace this with a dynamic fetch from your backend)
const restaurants = ['karai-chettinad', 'xyz-restaurant', 'delicious-bites'];

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/menu', changefreq: 'daily', priority: 0.9 },
  { url: '/my-orders', changefreq: 'weekly', priority: 0.8 },
];

// Add dynamic restaurant-specific pages
restaurants.forEach((restaurant) => {
  links.push({ url: `/${restaurant}/menu`, changefreq: 'daily', priority: 0.9 });
  links.push({ url: `/${restaurant}/orders`, changefreq: 'weekly', priority: 0.8 });
});

async function generateSitemap() {
  // Create a new SitemapStream instance with your base URL
  const stream = new SitemapStream({ hostname: BASE_URL });

  // Write each link into the stream
  links.forEach((link) => stream.write(link));
  stream.end();

  try {
    // Convert the stream into a buffer
    const data = await streamToPromise(stream);
    // Write the sitemap.xml file to the public directory
    fs.writeFileSync(path.resolve(__dirname, '../public/sitemap.xml'), data.toString());
    console.log('✅ Sitemap generated successfully!');
  } catch (err) {
    console.error('❌ Error generating sitemap:', err);
  }
}

generateSitemap();
