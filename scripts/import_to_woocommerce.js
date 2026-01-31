const fs = require('fs');
const path = require('path');
const https = require('https');

const WOOCOMMERCE_URL = 'https://payment.essentialsjacket.com';
const CONSUMER_KEY = 'ck_c8da2c7777f941db2d1bbc9473eb123b3d7eaf0c';
const CONSUMER_SECRET = 'cs_be0129200d5d22f57290ec5d58d3ffe842415dbe';

// Load image mapping for reference (but won't use in WooCommerce)
const mappingPath = path.join(__dirname, '..', 'data', 'image-mapping.json');
let imageMapping = {};
if (fs.existsSync(mappingPath)) {
  imageMapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  console.log(`ðŸ“· Loaded ${Object.keys(imageMapping).length} image mappings (for local use)\n`);
}

const csvPath = path.join(__dirname, '..', 'data', 'essentials.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim());

console.log('ðŸ“¦ Starting WooCommerce Import (without images - using local images)...\n');
console.log(`ðŸ“ Reading CSV: ${csvPath}`);
console.log(`ðŸ“Š Total lines: ${lines.length - 1}\n`);

const products = [];

function generateUniqueSKU(rowSku, productName, index) {
  if (rowSku && rowSku.trim()) {
    return rowSku.trim();
  }
  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').substring(0, 25);
  const timestamp = Date.now().toString().slice(-8);
  return `essentials-${slug}-${timestamp}-${index}`;
}

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

  if (values.length >= headers.length) {
    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      row[header] = value;
    });

    if (row.name && row.name.trim()) {
      let cleanTitle = row.name.trim()
        .replace(/^-\d+%\s*/i, '')
        .replace(/add\s+to\s+wishlist/gi, '')
        .replace(/original\s+price\s+was[^.]*\./gi, '')
        .replace(/current\s+price\s+is[^.]*\./gi, '')
        .replace(/select\s+options/gi, '')
        .replace(/compare/gi, '')
        .replace(/quick\s+view/gi, '')
        .replace(/\$\d+\.\d+/g, '')
        .replace(/\$\d+/g, '')
        .replace(/new\s+collection/gi, '')
        .replace(/fear\s+of\s+god/gi, '')
        .replace(/,\s*$/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanTitle.length < 10) {
        const essentialsMatch = row.name.match(/essentials\s+([^$]+?)(?:\s*\$|\s*new|$)/i);
        if (essentialsMatch && essentialsMatch[1]) {
          cleanTitle = 'Essentials ' + essentialsMatch[1].trim();
        }
      }

      if (cleanTitle.length > 100) {
        cleanTitle = cleanTitle.substring(0, 97) + '...';
      }

      if (cleanTitle.toLowerCase().includes('payment and billing policy') ||
          cleanTitle.toLowerCase() === 'description' ||
          !row.image_url || !row.image_url.startsWith('http')) {
        continue;
      }

      const priceStr = (row.original_price || row.price || '').replace(/[Â£$,]/g, '').trim();
      const discountPriceStr = (row.price || '').replace(/[Â£$,]/g, '').trim();
      const parsedPrice = priceStr ? parseFloat(priceStr) : null;
      const parsedDiscountPrice = discountPriceStr && discountPriceStr !== priceStr ? parseFloat(discountPriceStr) : null;
      const regularPrice = (parsedPrice && !isNaN(parsedPrice) && parsedPrice > 0) ? parsedPrice.toString() : '';
      const salePrice = (parsedDiscountPrice && !isNaN(parsedDiscountPrice) && parsedDiscountPrice > 0) ? parsedDiscountPrice.toString() : '';

      const titleLower = cleanTitle.toLowerCase();
      let category = 'uncategorized';
      if (titleLower.includes('tracksuit')) {
        category = 'tracksuits';
      } else if (titleLower.includes('sweatpant')) {
        category = 'sweatpants';
      } else if (titleLower.includes('short') && !titleLower.includes('sleeve')) {
        category = 'shorts';
      } else if (titleLower.includes('jacket')) {
        category = 'jackets';
      } else if (titleLower.includes('hoodie')) {
        category = 'hoodies';
      } else if (titleLower.includes('sweatshirt') || titleLower.includes('crewneck')) {
        category = 'sweatshirts';
      } else if (titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('shirt') && !titleLower.includes('sweat')) {
        category = 't-shirts';
      }

      // Store local image path for later use (not in WooCommerce)
      const localImagePath = imageMapping[row.image_url] || null;
      
      products.push({
        name: cleanTitle,
        type: 'external',
        regular_price: regularPrice,
        sale_price: salePrice,
        description: row.description || cleanTitle,
        short_description: cleanTitle,
        categories: [{ name: category }],
        images: [], // No images in WooCommerce - will use local images
        stock_status: 'instock',
        manage_stock: false,
        external_url: '',
        button_text: 'Buy Now',
        sku: generateUniqueSKU(row.sku, cleanTitle, products.length + 1),
        _localImagePath: localImagePath, // Store for mapping
        _originalImageUrl: row.image_url // Store original URL
      });
    }
  }
}

console.log(`âœ… Parsed ${products.length} valid products\n`);

function makeWooCommerceRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${WOOCOMMERCE_URL}/wp-json/wc/v3/${endpoint}`);
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      rejectUnauthorized: false
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData.substring(0, 200)}`));
        }
      });
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function importProducts() {
  console.log('ðŸš€ Starting import to WooCommerce (without images)...\n');
  let successCount = 0;
  let errorCount = 0;
  const productImageMap = {}; // Store product slug -> local image path mapping

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      console.log(`[${i + 1}/${products.length}] Importing: ${product.name.substring(0, 50)}...`);
      
      // Create product without images
      const productData = {
        name: product.name,
        type: product.type,
        regular_price: product.regular_price,
        sale_price: product.sale_price,
        description: product.description,
        short_description: product.short_description,
        categories: product.categories,
        stock_status: product.stock_status,
        manage_stock: product.manage_stock,
        external_url: product.external_url,
        button_text: product.button_text,
        sku: product.sku
      };
      
      const result = await makeWooCommerceRequest('products', 'POST', productData);
      console.log(`  âœ… Created (ID: ${result.id}, Slug: ${result.slug})`);
      
      if (result && result.id) {
        // Update external URL
        try {
          const externalUrl = `${WOOCOMMERCE_URL}/product/${result.slug}/`;
          await makeWooCommerceRequest(`products/${result.id}`, 'PUT', { external_url: externalUrl });
          console.log(`  âœ… URL updated`);
        } catch (e) {}
        
        // Store mapping: product slug -> local image path
        if (product._localImagePath) {
          productImageMap[result.slug] = product._localImagePath;
        }
        
        successCount++;
      }
      
      if (i < products.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`  âŒ Error: ${error.message.substring(0, 150)}`);
      errorCount++;
    }
  }

  // Save product to image mapping
  const productImageMappingPath = path.join(__dirname, '..', 'data', 'product-image-mapping.json');
  fs.writeFileSync(productImageMappingPath, JSON.stringify(productImageMap, null, 2));
  console.log(`\nðŸ“„ Product-Image mapping saved to: ${productImageMappingPath}`);

  console.log(`\nâœ… Import Complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${products.length}`);
  console.log(`\nðŸ’¡ Note: Images are stored locally and will be used from public/product-images/`);
}

importProducts().catch(console.error);