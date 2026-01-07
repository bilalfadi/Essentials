const https = require('https');
const fs = require('fs');
const path = require('path');

const WOOCOMMERCE_URL = 'https://payment.essentialsjacket.com';
const CONSUMER_KEY = 'ck_2a5b631771504e2f65c279f2049dfc564909f553';
const CONSUMER_SECRET = 'cs_46d1a9dc72f66b9a64670da2cdab4e548cc539c7';

// Official Essentials website prices (from fearofgod.com)
// These are approximate prices - you may need to adjust based on actual website
const OFFICIAL_PRICES = {
  // Hoodies - typically $150-$200
  'hoodie': { regular: 179, sale: 155 },
  'oversized-hoodie': { regular: 179, sale: 155 },
  'round-neck-sweater': { regular: 200, sale: 179 },
  
  // T-Shirts - typically $100-$125
  'tee': { regular: 125, sale: 100 },
  't-shirt': { regular: 125, sale: 100 },
  '1977-tee': { regular: 125, sale: 100 },
  
  // Jackets - typically $230-$300
  'jacket': { regular: 255, sale: 225 },
  'denim-jacket': { regular: 230, sale: 200 },
  'half-zip-jacket': { regular: 255, sale: 225 },
  'puffer-jacket': { regular: 300, sale: 275 },
  'coach-jacket': { regular: 299, sale: 275 },
  
  // Sweatshirts - typically $169-$200
  'sweatshirt': { regular: 169, sale: 149 },
  'crewneck': { regular: 170, sale: 159 },
  'crewneck-sweatshirt': { regular: 170, sale: 155 },
  
  // Tracksuits - typically $269-$270
  'tracksuit': { regular: 269, sale: 255 },
  'oversized-tracksuit': { regular: 269, sale: 255 },
  
  // Sweatpants - typically $130-$170
  'sweatpant': { regular: 150, sale: 130 },
  'sweatpants': { regular: 150, sale: 130 },
  
  // Shorts - typically $50-$80
  'short': { regular: 60, sale: 50 },
  'shorts': { regular: 60, sale: 50 },
};

// Function to determine price based on product title
function getPriceFromTitle(title) {
  const titleLower = title.toLowerCase();
  
  // Check for specific patterns
  if (titleLower.includes('hoodie')) {
    if (titleLower.includes('oversized')) {
      return OFFICIAL_PRICES['oversized-hoodie'];
    }
    if (titleLower.includes('round neck') || titleLower.includes('sweater')) {
      return OFFICIAL_PRICES['round-neck-sweater'];
    }
    return OFFICIAL_PRICES['hoodie'];
  }
  
  if (titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('tshirt')) {
    if (titleLower.includes('1977')) {
      return OFFICIAL_PRICES['1977-tee'];
    }
    return OFFICIAL_PRICES['t-shirt'];
  }
  
  if (titleLower.includes('jacket')) {
    if (titleLower.includes('denim')) {
      return OFFICIAL_PRICES['denim-jacket'];
    }
    if (titleLower.includes('half zip')) {
      return OFFICIAL_PRICES['half-zip-jacket'];
    }
    if (titleLower.includes('puffer')) {
      return OFFICIAL_PRICES['puffer-jacket'];
    }
    if (titleLower.includes('coach')) {
      return OFFICIAL_PRICES['coach-jacket'];
    }
    return OFFICIAL_PRICES['jacket'];
  }
  
  if (titleLower.includes('sweatshirt') || titleLower.includes('crewneck')) {
    return OFFICIAL_PRICES['sweatshirt'];
  }
  
  if (titleLower.includes('tracksuit')) {
    if (titleLower.includes('oversized')) {
      return OFFICIAL_PRICES['oversized-tracksuit'];
    }
    return OFFICIAL_PRICES['tracksuit'];
  }
  
  if (titleLower.includes('sweatpant')) {
    return OFFICIAL_PRICES['sweatpant'];
  }
  
  if (titleLower.includes('short')) {
    return OFFICIAL_PRICES['short'];
  }
  
  // Default prices
  return { regular: 150, sale: null };
}

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

async function updatePrices() {
  console.log('🔄 Starting price update from official website...\n');
  
  try {
    // Fetch all products from WooCommerce
    console.log('📦 Fetching products from WooCommerce...');
    const products = await makeWooCommerceRequest('products?per_page=100&status=publish');
    
    if (!Array.isArray(products)) {
      console.error('❌ Failed to fetch products');
      return;
    }
    
    console.log(`✅ Found ${products.length} products\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      const prices = getPriceFromTitle(product.name);
      const updateData = {
        regular_price: prices.regular.toString(),
      };
      
      if (prices.sale) {
        updateData.sale_price = prices.sale.toString();
      } else {
        updateData.sale_price = '';
      }
      
      try {
        await makeWooCommerceRequest(`products/${product.id}`, 'PUT', updateData);
        console.log(`✅ Updated: ${product.name}`);
        console.log(`   Regular: $${prices.regular}${prices.sale ? `, Sale: $${prices.sale}` : ''}`);
        updated++;
      } catch (error) {
        console.error(`❌ Failed to update ${product.name}:`, error.message);
        skipped++;
      }
    }
    
    console.log(`\n✨ Price update complete!`);
    console.log(`   Updated: ${updated} products`);
    console.log(`   Skipped: ${skipped} products`);
    
  } catch (error) {
    console.error('❌ Error updating prices:', error);
  }
}

// Run the update
updatePrices();

