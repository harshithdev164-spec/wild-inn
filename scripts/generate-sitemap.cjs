const fs = require('fs');
const path = require('path');

// 1. Base URL
const BASE_URL = 'https://www.wildinn.in';

// 2. Static Pages with priorities and update rates
const STATIC_PAGES = [
  { path: '', priority: '1.0', changefreq: 'daily' },
  { path: 'about', priority: '0.7', changefreq: 'weekly' },
  { path: 'experiences', priority: '0.9', changefreq: 'weekly' },
  { path: 'reels', priority: '0.8', changefreq: 'weekly' },
  { path: 'gallery', priority: '0.7', changefreq: 'weekly' },
  { path: 'contact', priority: '0.7', changefreq: 'monthly' }
];

// Helper to extract keys using Regex from files
function extractKeys(filePath, regex) {
  try {
    const content = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8');
    const matches = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return [];
  }
}

// Extract dynamic destination IDs
let destinationIds = extractKeys('src/data/destinationsData.ts', /id:\s*['"]([^'"]+)['"]/g);

if (destinationIds.length === 0) {
  destinationIds = ['kabini', 'bandipur', 'masinagudi'];
}

const lastmod = new Date().toISOString().split('T')[0];

let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add static pages
STATIC_PAGES.forEach(page => {
  const urlPath = page.path ? `/${page.path}` : '';
  sitemapXml += `
  <url>
    <loc>${BASE_URL}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
});

// Add destination pages (0.9 priority as requested)
destinationIds.forEach(id => {
  sitemapXml += `
  <url>
    <loc>${BASE_URL}/experiences/${id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

sitemapXml += `
</urlset>`;

// Write to public folder
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
console.log('sitemap.xml successfully generated inside public/ folder!');
