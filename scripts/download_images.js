const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const csvPath = path.join(__dirname, '..', 'data', 'essentials.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim());
const imageUrlIndex = headers.indexOf('image_url');

const imagesDir = path.join(__dirname, '..', 'public', 'product-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

console.log('ðŸ“¥ Starting Image Download...\n');
console.log(`ðŸ“ Saving to: ${imagesDir}\n`);

const imageUrls = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  if (values.length > imageUrlIndex && values[imageUrlIndex]) {
    let imageUrl = values[imageUrlIndex];
    if (imageUrl.startsWith('"') && imageUrl.endsWith('"')) {
      imageUrl = imageUrl.slice(1, -1);
    }
    if (imageUrl && imageUrl.startsWith('http')) {
      imageUrls.push(imageUrl);
    }
  }
}

console.log(`ðŸ“Š Found ${imageUrls.length} images to download\n`);

function downloadImage(url, filepath, retries = 3) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, { timeout: 30000 }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadImage(response.headers.location, filepath, retries).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        if (retries > 0) {
          setTimeout(() => downloadImage(url, filepath, retries - 1).then(resolve).catch(reject), 1000);
          return;
        }
        reject(new Error(`Failed: ${response.statusCode}`));
        return;
      }
      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);
      fileStream.on('finish', () => { fileStream.close(); resolve(); });
      fileStream.on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
    });
    request.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => downloadImage(url, filepath, retries - 1).then(resolve).catch(reject), 1000);
      } else {
        reject(err);
      }
    });
    request.on('timeout', () => {
      request.destroy();
      if (retries > 0) {
        setTimeout(() => downloadImage(url, filepath, retries - 1).then(resolve).catch(reject), 1000);
      } else {
        reject(new Error('Timeout'));
      }
    });
    request.setTimeout(30000);
  });
}

async function downloadAllImages() {
  let successCount = 0;
  let errorCount = 0;
  const imageMap = {};
  const startTime = Date.now();
  
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i];
    try {
      const urlParts = imageUrl.split('/');
      const originalFilename = urlParts[urlParts.length - 1].split('?')[0];
      let ext = originalFilename.split('.').pop() || 'jpg';
      if (ext.length > 4) ext = 'jpg';
      const safeFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50);
      const filename = `img-${String(i + 1).padStart(4, '0')}-${safeFilename}`;
      const filepath = path.join(imagesDir, filename);
      
      console.log(`[${i + 1}/${imageUrls.length}] Downloading: ${originalFilename.substring(0, 40)}...`);
      await downloadImage(imageUrl, filepath);
      imageMap[imageUrl] = `/product-images/${filename}`;
      successCount++;
      if (i < imageUrls.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    } catch (error) {
      console.error(`  âŒ Error: ${error.message.substring(0, 100)}`);
      errorCount++;
    }
  }
  
  const mappingPath = path.join(__dirname, '..', 'data', 'image-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(imageMap, null, 2));
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\nâœ… Download Complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${imageUrls.length}`);
  console.log(`   Time: ${duration}s`);
  console.log(`\nðŸ“„ Image mapping saved to: ${mappingPath}`);
}

downloadAllImages().catch(console.error);