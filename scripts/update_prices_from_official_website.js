const https = require('https');
const http = require('http');

const WOOCOMMERCE_URL = 'https://payment.essentialsjacket.com';
const CONSUMER_KEY = 'ck_2a5b631771504e2f65c279f2049dfc564909f553';
const CONSUMER_SECRET = 'cs_46d1a9dc72f66b9a64670da2cdab4e548cc539c7';
const OFFICIAL_WEBSITE = 'fearofgod.com';

// Price mapping from official website (fearofgod.com)
// Based on actual prices seen on the website
const OFFICIAL_PRICES = {
  // Hoodies
  'hoodie': { regular: 179, sale: 155 },
  'oversized-hoodie': { regular: 179, sale: 155 },
  'round-neck-sweater': { regular: 200, sale: 179 },
  'abc-hoodie': { regular: 170, sale: 160 },
  'fg-hoodie': { regular: 170, sale: 159 },
  'harvest-hoodie': { regular: 169, sale: 155 },
  
  // T-Shirts
  'tee': { regular: 125, sale: 100 },
  't-shirt': { regular: 125, sale: 100 },
  '1977-tee': { regular: 125, sale: 100 },
  '1977-t-shirt': { regular: 125, sale: 99 },
  'baseball-tee': { regular: 125, sale: 100 },
  
  // Jackets
  'jacket': { regular: 300, sale: 275 },
  'denim-jacket': { regular: 230, sale: 200 },
  'half-zip-jacket': { regular: 255, sale: 225 },
  'puffer-jacket': { regular: 300, sale: 275 },
  'coach-jacket': { regular: 299, sale: 275 },
  'hooded-jacket': { regular: 300, sale: 279 },
  'windbreaker': { regular: 300, sale: 275 },
  '3m-puffer': { regular: 300, sale: 275 },
  'work-jacket': { regular: 300, sale: 275 },
  
  // Sweatshirts
  'sweatshirt': { regular: 170, sale: 159 },
  'crewneck': { regular: 170, sale: 159 },
  'crewneck-sweatshirt': { regular: 169, sale: 149 },
  'thunderbird-crewneck': { regular: 170, sale: 155 },
  '8-crewneck': { regular: 170, sale: 159 },
  
  // Tracksuits
  'tracksuit': { regular: 269, sale: 255 },
  'oversized-tracksuit': { regular: 269, sale: 255 },
  'california-tracksuit': { regular: 269, sale: 249 },
  'spring-tracksuit': { regular: 270, sale: 255 },
  'spring-hoodie-tracksuit': { regular: 279, sale: 255 },
  
  // Sweatpants
  'sweatpant': { regular: 130, sale: null },
  'sweatpants': { regular: 130, sale: null },
  'flare-sweatpant': { regular: 130, sale: null },
  'classic-sweatpant': { regular: 130, sale: null },
  'tearaway-sweatpant': { regular: 130, sale: null },
  
  // Shorts
  'short': { regular: 60, sale: null },
  'shorts': { regular: 60, sale: null },
  'classic-short': { regular: 60, sale: null },
};

// Function to extract price from product title
function getPriceFromTitle(title) {
  const titleLower = title.toLowerCase();
  
  // Hoodies
  if (titleLower.includes('hoodie')) {
    if (titleLower.includes('oversized')) {
      return OFFICIAL_PRICES['oversized-hoodie'];
    }
    if (titleLower.includes('round neck') || titleLower.includes('sweater')) {
      return OFFICIAL_PRICES['round-neck-sweater'];
    }
    if (titleLower.includes('abc')) {
      return OFFICIAL_PRICES['abc-hoodie'];
    }
    if (titleLower.includes('fg') && !titleLower.includes('fg7')) {
      return OFFICIAL_PRICES['fg-hoodie'];
    }
    if (titleLower.includes('harvest')) {
      return OFFICIAL_PRICES['harvest-hoodie'];
    }
    return OFFICIAL_PRICES['hoodie'];
  }
  
  // T-Shirts
  if (titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('tshirt')) {
    if (titleLower.includes('1977')) {
      if (titleLower.includes('dark gray') || titleLower.includes('black')) {
        return OFFICIAL_PRICES['1977-t-shirt'];
      }
      return OFFICIAL_PRICES['1977-tee'];
    }
    if (titleLower.includes('baseball')) {
      return OFFICIAL_PRICES['baseball-tee'];
    }
    return OFFICIAL_PRICES['t-shirt'];
  }
  
  // Jackets
  if (titleLower.includes('jacket')) {
    if (titleLower.includes('denim')) {
      return OFFICIAL_PRICES['denim-jacket'];
    }
    if (titleLower.includes('half zip')) {
      return OFFICIAL_PRICES['half-zip-jacket'];
    }
    if (titleLower.includes('puffer')) {
      if (titleLower.includes('3m')) {
        return OFFICIAL_PRICES['3m-puffer'];
      }
      return OFFICIAL_PRICES['puffer-jacket'];
    }
    if (titleLower.includes('coach')) {
      return OFFICIAL_PRICES['coach-jacket'];
    }
    if (titleLower.includes('hooded')) {
      return OFFICIAL_PRICES['hooded-jacket'];
    }
    if (titleLower.includes('work')) {
      return OFFICIAL_PRICES['work-jacket'];
    }
    return OFFICIAL_PRICES['jacket'];
  }
  
  if (titleLower.includes('windbreaker')) {
    return OFFICIAL_PRICES['windbreaker'];
  }
  
  // Sweatshirts
  if (titleLower.includes('sweatshirt') || titleLower.includes('crewneck')) {
    if (titleLower.includes('thunderbird')) {
      return OFFICIAL_PRICES['thunderbird-crewneck'];
    }
    if (titleLower.includes('8 crewneck') || titleLower.includes('8-crewneck')) {
      return OFFICIAL_PRICES['8-crewneck'];
    }
    if (titleLower.includes('crewneck sweatshirt') || titleLower.includes('crewneck-sweatshirt')) {
      return OFFICIAL_PRICES['crewneck-sweatshirt'];
    }
    return OFFICIAL_PRICES['sweatshirt'];
  }
  
  // Tracksuits
  if (titleLower.includes('tracksuit')) {
    if (titleLower.includes('oversized')) {
      return OFFICIAL_PRICES['oversized-tracksuit'];
    }
    if (titleLower.includes('california')) {
      return OFFICIAL_PRICES['california-tracksuit'];
    }
    if (titleLower.includes('spring')) {
      if (titleLower.includes('hoodie')) {
        return OFFICIAL_PRICES['spring-hoodie-tracksuit'];
      }
      return OFFICIAL_PRICES['spring-tracksuit'];
    }
    return OFFICIAL_PRICES['tracksuit'];
  }
  
  // Sweatpants
  if (titleLower.includes('sweatpant')) {
    if (titleLower.includes('flare')) {
      return OFFICIAL_PRICES['flare-sweatpant'];
    }
    if (titleLower.includes('classic')) {
      return OFFICIAL_PRICES['classic-sweatpant'];
    }
    if (titleLower.includes('tearaway')) {
      return OFFICIAL_PRICES['tearaway-sweatpant'];
    }
    return OFFICIAL_PRICES['sweatpant'];
  }
  
  // Shorts
  if (titleLower.includes('short') && !titleLower.includes('sleeve')) {
    if (titleLower.includes('classic')) {
      return OFFICIAL_PRICES['classic-short'];
    }
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
  console.log('🔄 Starting price update from official website (fearofgod.com)...\n');
  
  try {
    // Fetch all products from WooCommerce
    console.log('📦 Fetching products from WooCommerce...');
    let allProducts = [];
    let page = 1;
    
    while (true) {
      const products = await makeWooCommerceRequest(`products?per_page=100&page=${page}&status=publish`);
      
      if (!Array.isArray(products) || products.length === 0) {
        break;
      }
      
      allProducts = allProducts.concat(products);
      
      if (products.length < 100) {
        break;
      }
      
      page++;
    }
    
    console.log(`✅ Found ${allProducts.length} products\n`);
    
    let updated = 0;
    let skipped = 0;
    
    for (const product of allProducts) {
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

