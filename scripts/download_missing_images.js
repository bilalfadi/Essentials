const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// WooCommerce API Configuration (same as lib/woocommerce.ts)
const WOOCOMMERCE_URL = 'https://payment.essentialsjacket.com';
const CONSUMER_KEY = 'ck_c8da2c7777f941db2d1bbc9473eb123b3d7eaf0c';
const CONSUMER_SECRET = 'cs_be0129200d5d22f57290ec5d58d3ffe842415dbe';

const imagesDir = path.join(__dirname, '..', 'public', 'product-images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Load existing mapping
const mappingPath = path.join(__dirname, '..', 'data', 'product-image-mapping.json');
let productImageMapping = {};
if (fs.existsSync(mappingPath)) {
  productImageMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
}

// Get all existing files
const existingFiles = new Set();
fs.readdirSync(imagesDir).forEach(file => {
  const nameWithoutExt = file.split('.')[0];
  existingFiles.add(nameWithoutExt);
});

console.log('📥 Starting Missing Images Download...\n');
console.log(`📁 Saving to: ${imagesDir}\n`);

function getAuthHeader() {
  return Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
}

async function fetchAllProducts() {
  const allProducts = [];
  let page = 1;
  const auth = getAuthHeader();

  while (true) {
    try {
      const url = new URL(`${WOOCOMMERCE_URL}/wp-json/wc/v3/products`);
      url.searchParams.append('per_page', '100');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('status', 'publish');

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        if (page === 1) {
          console.error(`❌ API Error: ${response.status}`);
          return [];
        }
        break;
      }

      const products = await response.json();
      if (products.length === 0) {
        break;
      }

      allProducts.push(...products);

      if (products.length < 100) {
        break;
      }

      page++;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  }

  return allProducts;
}

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

async function downloadMissingImages() {
  console.log('🔄 Fetching products from WooCommerce...\n');
  const products = await fetchAllProducts();
  console.log(`✅ Found ${products.length} products\n`);

  let downloaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    const slug = product.slug;
    const mappedPath = productImageMapping[slug];
    
    if (!mappedPath) continue;
    
    // Extract filename from mapping (e.g., "/product-images/img-0001-..." -> "img-0001-...")
    const filename = mappedPath.replace('/product-images/', '');
    const nameWithoutExt = filename.split('.')[0];
    
    // Check if file exists (with any extension)
    const fileExists = existingFiles.has(nameWithoutExt);
    
    if (fileExists) {
      skipped++;
      continue;
    }

    // Get image from WooCommerce
    let imageUrl = product.images?.[0]?.src;
    
    // If no image in WooCommerce, try to find from original source
    if (!imageUrl) {
      // Try to get from original image-mapping.json if exists
      const imageMappingPath = path.join(__dirname, '..', 'data', 'image-mapping.json');
      if (fs.existsSync(imageMappingPath)) {
        const imageMapping = JSON.parse(fs.readFileSync(imageMappingPath, 'utf-8'));
        // Try to find by product name or slug
        for (const [url, localPath] of Object.entries(imageMapping)) {
          if (localPath === mappedPath || url.includes(product.slug) || url.includes(product.name.toLowerCase().substring(0, 20))) {
            imageUrl = url;
            break;
          }
        }
      }
    }
    
    if (!imageUrl) {
      console.log(`⚠️  No image for: ${product.name.substring(0, 50)}`);
      errors++;
      continue;
    }

    // Determine extension from URL or default to jpg
    let ext = 'jpg';
    try {
      const urlExt = imageUrl.split('.').pop()?.split('?')[0]?.toLowerCase();
      if (urlExt && ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(urlExt)) {
        ext = urlExt === 'jpeg' ? 'jpg' : urlExt;
      }
    } catch (e) {
      // Use default
    }

    // If filename already has extension info, use it
    const finalFilename = filename.includes('.') ? filename : `${filename}.${ext}`;
    const filepath = path.join(imagesDir, finalFilename);

    try {
      console.log(`[${downloaded + skipped + errors + 1}/${products.length}] Downloading: ${finalFilename.substring(0, 50)}...`);
      await downloadImage(imageUrl, filepath);
      downloaded++;
      existingFiles.add(nameWithoutExt);
      
      // Small delay to avoid overwhelming server
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`  ❌ Error: ${error.message.substring(0, 100)}`);
      errors++;
    }
  }

  console.log(`\n✅ Download Complete!`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Skipped (already exist): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Total: ${products.length}`);
}

downloadMissingImages().catch(console.error);

