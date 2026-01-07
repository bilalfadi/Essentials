const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Common logo URLs for Fear of God / Essentials
const logoUrls = [
  'https://fearofgod.com/cdn/shop/files/logo.svg',
  'https://fearofgod.com/cdn/shop/files/logo.png',
  'https://fearofgod.com/cdn/shop/t/303/assets/logo.svg',
  'https://fearofgod.com/cdn/shop/t/303/assets/logo.png',
  'https://cdn.shopify.com/s/files/1/2576/5462/files/logo.svg',
  'https://cdn.shopify.com/s/files/1/2576/5462/files/logo.png',
];

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(); });
      fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
    });
    request.on('error', reject);
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Timeout'));
    });
    request.setTimeout(10000);
  });
}

async function downloadLogo() {
  console.log('📥 Downloading Fear of God logo...\n');
  
  for (const url of logoUrls) {
    try {
      const ext = url.endsWith('.svg') ? 'svg' : 'png';
      const filename = `fear-of-god-logo.${ext}`;
      const filepath = path.join(publicDir, filename);
      
      console.log(`Trying: ${url}`);
      await downloadImage(url, filepath);
      console.log(`✅ Successfully downloaded: ${filename}`);
      console.log(`📁 Saved to: ${filepath}\n`);
      return;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    }
  }
  
  console.log('⚠️  Could not download logo from any URL. Using fallback.');
  console.log('💡 You can manually download the logo from https://fearofgod.com and save it as public/fear-of-god-logo.png or .svg');
}

downloadLogo().catch(console.error);

