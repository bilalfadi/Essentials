const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Multiple websites to visit one by one
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
    name: 'hellstar',
    urls: [
      'https://hellstar.com/collections/hoodies',
      'https://hellstar.com/collections/t-shirts',
      'https://hellstar.com/collections/tracksuits',
      'https://hellstar.com/collections/sweatpants',
      'https://hellstar.com/collections/shorts',
    ]
  },
  {
    name: 'hellstarclothing',
    urls: [
      'https://hellstarclothing.com/hoodies',
      'https://hellstarclothing.com/t-shirts',
      'https://hellstarclothing.com/tracksuits',
      'https://hellstarclothing.com/sweatpants',
      'https://hellstarclothing.com/shorts',
    ]
  }
];

let allProducts = [];
let productIdCounter = 1;
const seenTitles = new Set();

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractCategory(title, url) {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  if (lowerTitle.includes('hoodie') || lowerUrl.includes('hoodie')) return 'hoodies';
  if (lowerTitle.includes('t-shirt') || lowerTitle.includes('tshirt') || lowerUrl.includes('t-shirt')) return 't-shirts';
  if (lowerTitle.includes('tracksuit') || lowerUrl.includes('tracksuit')) return 'tracksuits';
  if (lowerTitle.includes('sweatpant') || lowerUrl.includes('sweatpant')) return 'sweatpants';
  if (lowerTitle.includes('short') || lowerUrl.includes('short')) return 'shorts';
  
  return 'hoodies'; // default
}

function extractPrice(priceText) {
  if (!priceText) return null; // Return null if no price found - skip product
  
  const numbers = priceText.match(/[\d.]+/g);
  if (!numbers || numbers.length === 0) {
    return null; // Skip if no price
  }
  
  const prices = numbers.map(n => parseFloat(n.replace(',', ''))).filter(p => p > 0 && p < 10000);
  if (prices.length === 0) {
    return null; // Skip if no valid price
  }
  
  if (prices.length === 1) {
    return { price: prices[0], discountPrice: null };
  }
  
  const sorted = prices.sort((a, b) => b - a);
  return { price: sorted[0], discountPrice: sorted[1] };
}

async function scrapeUrl(page, url, websiteName) {
  console.log(`\n📄 Visiting: ${url}`);
  
  let retries = 3;
  let loaded = false;
  
  while (retries > 0 && !loaded) {
    try {
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 60000 
      }).catch(() => {});
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      loaded = true;
    } catch (error) {
      retries--;
      if (retries === 0) {
        console.error(`  ❌ Failed after 3 attempts: ${error.message}`);
        return 0;
      }
      console.log(`  ⚠️  Retry ${3 - retries}/3...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  if (!loaded) {
    return 0;
  }
  
  try {
    
    // Scroll multiple times to load content
    for (let i = 0; i < 15; i++) {
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Click Load More buttons
    for (let i = 0; i < 25; i++) {
      try {
        const buttons = await page.$$('button, a, [class*="load"], [class*="more"], [class*="next"]');
        for (const btn of buttons) {
          const text = await page.evaluate(el => el.textContent?.toLowerCase() || '', btn);
          if (text.includes('load more') || text.includes('show more') || text.includes('next')) {
            const isVisible = await page.evaluate((el) => {
              const rect = el.getBoundingClientRect();
              return rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0;
            }, btn);
            
            if (isVisible) {
              await btn.click();
              await new Promise(resolve => setTimeout(resolve, 3000));
              await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
      } catch (e) {
        break;
      }
    }
    
    // Extract products using multiple methods
    const products = await page.evaluate(() => {
      const results = [];
      
      // Method 1: Find all product links
      const productLinks = document.querySelectorAll('a[href*="/product/"], a[href*="/shop/"], a[href*="/p/"]');
      productLinks.forEach(link => {
        const img = link.querySelector('img');
        const titleEl = link.querySelector('h2, h3, h4, .title, [class*="title"], [class*="name"]');
        const priceEl = link.querySelector('.price, [class*="price"], .amount, [class*="cost"]');
        
        const title = titleEl?.textContent?.trim() || link.textContent?.trim() || '';
        const image = img?.src || img?.getAttribute('data-src') || img?.getAttribute('data-lazy-src') || '';
        const priceText = priceEl?.textContent?.trim() || '';
        
        if (title && title.length > 5) {
          results.push({ title, image, priceText, link: link.href });
        }
      });
      
      // Method 2: Find product cards/articles
      const productCards = document.querySelectorAll('article, .product, [class*="product"], .product-item, .product-card');
      productCards.forEach(card => {
        const link = card.querySelector('a') || card.closest('a');
        if (!link) return;
        
        const img = card.querySelector('img');
        const titleEl = card.querySelector('h2, h3, h4, .title, [class*="title"], [class*="name"]');
        const priceEl = card.querySelector('.price, [class*="price"], .amount');
        
        const title = titleEl?.textContent?.trim() || card.textContent?.trim() || '';
        const image = img?.src || img?.getAttribute('data-src') || '';
        const priceText = priceEl?.textContent?.trim() || '';
        
        if (title && title.length > 5 && !results.find(r => r.title === title)) {
          results.push({ title, image, priceText, link: link.href || '' });
        }
      });
      
      // Method 3: Find all images with product-like structure
      const images = document.querySelectorAll('img[src*="product"], img[src*="shop"], img[alt*="Hellstar"], img[alt*="Hoodie"], img[alt*="T-Shirt"]');
      images.forEach(img => {
        const parent = img.closest('a, article, .product, [class*="product"]');
        if (parent) {
          const titleEl = parent.querySelector('h2, h3, h4, .title');
          const title = titleEl?.textContent?.trim() || img.alt || '';
          const priceEl = parent.querySelector('.price, [class*="price"]');
          const priceText = priceEl?.textContent?.trim() || '';
          
          if (title && title.length > 5 && !results.find(r => r.title === title)) {
            results.push({ 
              title, 
              image: img.src || img.getAttribute('data-src') || '', 
              priceText,
              link: parent.href || ''
            });
          }
        }
      });
      
      return results;
    });
    
    console.log(`  ✓ Found ${products.length} products on page`);
    
    // Process products
    let newCount = 0;
    for (const product of products) {
      if (!product.title || product.title.length < 5) continue;
      
      const titleLower = product.title.toLowerCase();
      if (seenTitles.has(titleLower)) continue;
      
      seenTitles.add(titleLower);
      
      const slug = generateSlug(product.title);
      const category = extractCategory(product.title, url);
      const priceData = extractPrice(product.priceText);
      
      // Skip if no price found
      if (!priceData) {
        continue;
      }
      
      // Only add if we have actual image from website
      if (!product.image || product.image.length < 10) {
        continue; // Skip products without real images
      }
      
      const productObj = {
        id: productIdCounter++,
        title: product.title.trim(),
        slug: slug,
        category: category,
        price: priceData.price,
        discountPrice: priceData.discountPrice,
        image: product.image,
        description: product.title.trim()
      };
      
      allProducts.push(productObj);
      newCount++;
    }
    
    console.log(`  ✅ Added ${newCount} new products (Total: ${allProducts.length})`);
    
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
  console.log('🚀 Starting to scrape from multiple websites...\n');
  console.log('Target: 1000+ products\n');
  
  let browser;
  let page;
  
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process'
      ],
      timeout: 120000,
      ignoreHTTPSErrors: true
    });
    
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Hide automation
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });
    
    // Ignore errors
    page.on('error', (err) => {
      console.log(`  ⚠️  Page error (ignored): ${err.message}`);
    });
    page.on('pageerror', (err) => {
      console.log(`  ⚠️  Page error (ignored): ${err.message}`);
    });
    page.on('requestfailed', (req) => {
      // Ignore failed requests
    });
    
    // Visit each website's URLs one by one
    for (const website of websites) {
      console.log(`\n🌐 Website: ${website.name}`);
      console.log(`   Total URLs: ${website.urls.length}\n`);
      
      for (let i = 0; i < website.urls.length; i++) {
        const url = website.urls[i];
        console.log(`\n[${i + 1}/${website.urls.length}]`);
        try {
          await scrapeUrl(page, url, website.name);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait between pages
        } catch (err) {
          console.error(`  ⚠️  Error on ${url}: ${err.message}`);
          // Try to recreate page if connection lost
          try {
            await page.close();
            page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
          } catch (e) {
            console.error(`  ❌ Could not recreate page: ${e.message}`);
          }
          continue; // Continue to next URL
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait between websites
    }
    
  } catch (error) {
    console.error('Error during scraping:', error.message);
  } finally {
    if (page) {
      try {
        await page.close();
      } catch (e) {}
    }
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
  }
  
  // Final statistics
  console.log(`\n\n📊 Final Statistics:`);
  console.log(`   Total products: ${allProducts.length}`);
  
  const byCategory = {};
  allProducts.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  
  console.log(`\n   By category:`);
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`     ${cat}: ${count}`);
  });
  
  const outputPath = path.join(__dirname, '..', 'data', 'products.json');
  fs.writeFileSync(outputPath, JSON.stringify(allProducts, null, 2));
  
  console.log(`\n✅ Saved ${allProducts.length} products to: ${outputPath}`);
  
  if (allProducts.length >= 1000) {
    console.log(`\n🎉 Success! Scraped ${allProducts.length} products (target: 1000+)`);
  } else {
    console.log(`\n⚠️  Need ${1000 - allProducts.length} more products`);
  }
}

main().catch(console.error);

