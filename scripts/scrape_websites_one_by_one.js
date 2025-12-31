const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Add your websites here - visit 20-30 different websites
const websites = [
  {
    name: 'hellstarofficialstudio',
    urls: [
      'https://hellstarofficialstudio.com/store/',
      'https://hellstarofficialstudio.com/hoodies/',
      'https://hellstarofficialstudio.com/t-shirts/',
      'https://hellstarofficialstudio.com/tracksuits/',
      'https://hellstarofficialstudio.com/sweatpants/',
      'https://hellstarofficialstudio.com/shorts/',
    ]
  },
  {
    name: 'hellstar.store',
    urls: [
      'https://hellstar.store/',
    ]
  }
  // Add more websites here as we find them
];

let allProducts = [];
let productIdCounter = 1;
const seenTitles = new Set();

function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractCategory(title, url) {
  const lower = (title + ' ' + url).toLowerCase();
  if (lower.includes('hoodie')) return 'hoodies';
  if (lower.includes('t-shirt') || lower.includes('tshirt')) return 't-shirts';
  if (lower.includes('tracksuit')) return 'tracksuits';
  if (lower.includes('sweatpant')) return 'sweatpants';
  if (lower.includes('short')) return 'shorts';
  return 'hoodies';
}

function extractPrice(text) {
  const nums = text.match(/[\d.]+/g);
  if (!nums) return { price: 299.99, discountPrice: null };
  const prices = nums.map(n => parseFloat(n)).filter(p => p > 0 && p < 10000);
  if (prices.length === 0) return { price: 299.99, discountPrice: null };
  if (prices.length === 1) return { price: prices[0], discountPrice: null };
  const sorted = prices.sort((a, b) => b - a);
  return { price: sorted[0], discountPrice: sorted[1] };
}

async function scrapePage(page, url) {
  console.log(`\n📄 [${new Date().toLocaleTimeString()}] Visiting: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 120000 });
    await new Promise(r => setTimeout(r, 5000));
    
    // Scroll to load
    for (let i = 0; i < 20; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(r => setTimeout(r, 2000));
    }
    
    // Click Load More
    for (let i = 0; i < 30; i++) {
      try {
        const buttons = await page.$$('button, a, [onclick*="load"], [onclick*="more"]');
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', btn);
          if (text.includes('load') || text.includes('more') || text.includes('next')) {
            const visible = await page.evaluate(el => {
              const r = el.getBoundingClientRect();
              return r.top < window.innerHeight && r.bottom > 0 && r.width > 0;
            }, btn);
            if (visible) {
              await btn.click();
              await new Promise(r => setTimeout(r, 3000));
            }
          }
        }
      } catch (e) { break; }
    }
    
    // Extract products
    const products = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      
      // All product links
      document.querySelectorAll('a[href*="/product/"], a[href*="/shop/"], a[href*="/p/"], a[href*="product"]').forEach(link => {
        const img = link.querySelector('img');
        const titleEl = link.querySelector('h1, h2, h3, h4, .title, [class*="title"], [class*="name"]');
        const priceEl = link.querySelector('.price, [class*="price"], .amount, [class*="cost"]');
        
        const title = (titleEl?.textContent || link.textContent || '').trim();
        const image = img?.src || img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || '';
        const priceText = (priceEl?.textContent || '').trim();
        
        if (title && title.length > 5 && !seen.has(title)) {
          seen.add(title);
          results.push({ title, image, priceText, link: link.href });
        }
      });
      
      // Product cards
      document.querySelectorAll('article, .product, [class*="product"], .product-item, .product-card, [class*="card"]').forEach(card => {
        const link = card.querySelector('a') || card.closest('a');
        if (!link) return;
        
        const img = card.querySelector('img');
        const titleEl = card.querySelector('h1, h2, h3, h4, .title, [class*="title"], [class*="name"]');
        const priceEl = card.querySelector('.price, [class*="price"], .amount');
        
        const title = (titleEl?.textContent || card.textContent || '').trim();
        const image = img?.src || img?.getAttribute('data-src') || '';
        const priceText = (priceEl?.textContent || '').trim();
        
        if (title && title.length > 5 && !seen.has(title)) {
          seen.add(title);
          results.push({ title, image, priceText, link: link.href || '' });
        }
      });
      
      return results;
    });
    
    console.log(`  ✓ Found ${products.length} products`);
    
    let newCount = 0;
    for (const p of products) {
      if (!p.title || p.title.length < 5) continue;
      const titleLower = p.title.toLowerCase();
      if (seenTitles.has(titleLower)) continue;
      
      seenTitles.add(titleLower);
      const slug = generateSlug(p.title);
      const category = extractCategory(p.title, url);
      const { price, discountPrice } = extractPrice(p.priceText);
      
      allProducts.push({
        id: productIdCounter++,
        title: p.title.trim(),
        slug,
        category,
        price,
        discountPrice,
        image: p.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
        description: `${p.title.trim()} - Premium quality streetwear`
      });
      newCount++;
    }
    
    console.log(`  ✅ Added ${newCount} new (Total: ${allProducts.length})`);
    
    // Save after each page
    const outputPath = path.join(__dirname, '..', 'data', 'products.json');
    fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
    
    return newCount;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return 0;
  }
}

async function main() {
  console.log('🚀 Starting to scrape websites one by one...\n');
  console.log(`Target: 1000+ products\n`);
  
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 120000
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
  try {
    for (const website of websites) {
      console.log(`\n🌐 Website: ${website.name}`);
      console.log(`   URLs: ${website.urls.length}\n`);
      
      for (let i = 0; i < website.urls.length; i++) {
        console.log(`\n[${i + 1}/${website.urls.length}]`);
        await scrapePage(page, website.urls[i]);
        await new Promise(r => setTimeout(r, 4000));
      }
    }
  } finally {
    await browser.close();
  }
  
  console.log(`\n\n📊 Final: ${allProducts.length} products`);
  const byCat = {};
  allProducts.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
  console.log('By category:', byCat);
  
  const outputPath = path.join(__dirname, '..', 'data', 'products.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  console.log(`\n✅ Saved to: ${outputPath}`);
}

main().catch(console.error);

