const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Websites to scrape
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
  if (lower.includes('t-shirt') || lower.includes('tshirt') || lower.includes('shirt')) return 't-shirts';
  if (lower.includes('tracksuit')) return 'tracksuits';
  if (lower.includes('sweatpant')) return 'sweatpants';
  if (lower.includes('short')) return 'shorts';
  return 'hoodies';
}

function extractPrice(text) {
  if (!text) return { price: '', discountPrice: '' };
  const nums = text.match(/[\d.]+/g);
  if (!nums) return { price: '', discountPrice: '' };
  const prices = nums.map(n => parseFloat(n)).filter(p => p > 0 && p < 10000);
  if (prices.length === 0) return { price: '', discountPrice: '' };
  if (prices.length === 1) return { price: prices[0].toFixed(2), discountPrice: '' };
  const sorted = prices.sort((a, b) => b - a);
  return { price: sorted[0].toFixed(2), discountPrice: sorted[1].toFixed(2) };
}

async function scrapePage(page, url) {
  console.log(`\n📄 Scraping: ${url}`);
  
  try {
    console.log('  Navigating to page...');
    await page.goto(url, { 
      waitUntil: 'domcontentloaded', 
      timeout: 120000 
    });
    console.log('  Page loaded, waiting 5 seconds...');
    await new Promise(r => setTimeout(r, 5000));
    console.log('  Starting to scroll...');
    
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
    
    // Extract products - ONLY real data, no dummy
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
      
      // Only save if we have real data
      if (p.title && p.title.trim()) {
        allProducts.push({
          id: productIdCounter++,
          title: p.title.trim(),
          slug: slug,
          category: category,
          price: price,
          discountPrice: discountPrice,
          image: p.image || '',
          description: p.title.trim()
        });
        newCount++;
      }
    }
    
    console.log(`  ✅ Added ${newCount} new (Total: ${allProducts.length})`);
    
    return newCount;
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return 0;
  }
}

function saveToCSV(products) {
  const csvPath = path.join(__dirname, '..', 'data', 'scraped_products.csv');
  
  // CSV header
  let csv = 'id,title,slug,category,price,discountPrice,image,description\n';
  
  // CSV rows
  for (const product of products) {
    const row = [
      product.id,
      `"${product.title.replace(/"/g, '""')}"`,
      product.slug,
      product.category,
      product.price,
      product.discountPrice,
      `"${product.image.replace(/"/g, '""')}"`,
      `"${product.description.replace(/"/g, '""')}"`
    ].join(',');
    csv += row + '\n';
  }
  
  fs.writeFileSync(csvPath, csv, 'utf8');
  console.log(`\n✅ Saved ${products.length} products to: ${csvPath}`);
}

async function main() {
  console.log('🚀 Starting to scrape products to CSV...\n');
  console.log('Only real scraped data, no dummy data\n');
  
  let browser;
  let page;
  
  try {
    // Use Puppeteer's installed Chrome
    const executablePath = puppeteer.executablePath();
    console.log(`Using Chrome: ${executablePath || 'default'}`);
    
    const launchOptions = {
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      timeout: 180000,
      ignoreHTTPSErrors: true,
      protocolTimeout: 180000
    };
    
    if (executablePath) {
      launchOptions.executablePath = executablePath;
    }
    
    console.log('Launching browser...');
    browser = await puppeteer.launch(launchOptions);
    console.log('Browser launched successfully');
    
    console.log('Creating new page...');
    page = await browser.newPage();
    console.log('Page created successfully');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Ignore errors
    page.on('error', (err) => {
      console.log('Page error (ignored):', err.message);
    });
    
    page.on('pageerror', (err) => {
      console.log('Page error (ignored):', err.message);
    });
    
    browser.on('disconnected', () => {
      console.log('⚠️ Browser disconnected - trying to continue...');
    });
    
    browser.on('targetcreated', () => {
      console.log('✓ New target created');
    });
    
    browser.on('targetdestroyed', () => {
      console.log('⚠️ Target destroyed');
    });
    
    for (const website of websites) {
      console.log(`\n🌐 Website: ${website.name}`);
      
      for (let i = 0; i < website.urls.length; i++) {
        try {
          console.log(`\n[${i + 1}/${website.urls.length}]`);
          await scrapePage(page, website.urls[i]);
          await new Promise(r => setTimeout(r, 5000));
        } catch (err) {
          console.error(`Error on ${website.urls[i]}:`, err.message);
          // Try to reconnect
          try {
            if (browser) await browser.close();
          } catch (e) {}
          
          try {
            browser = await puppeteer.launch({
              headless: false,
              args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
              timeout: 180000
            });
            page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
          } catch (e) {
            console.error('Failed to reconnect:', e.message);
            break;
          }
        }
      }
    }
  } catch (error) {
    console.error('Main error:', error.message);
  } finally {
    try {
      if (browser) {
        await browser.close();
      }
    } catch (e) {
      console.log('Error closing browser:', e.message);
    }
  }
  
  // Save to CSV
  if (allProducts.length > 0) {
    saveToCSV(allProducts);
    console.log(`\n📊 Total products scraped: ${allProducts.length}`);
    
    const byCat = {};
    allProducts.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
    console.log('By category:', byCat);
  } else {
    console.log('\n⚠️  No products found');
  }
}

main().catch(console.error);

