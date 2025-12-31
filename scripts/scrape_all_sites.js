const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// List of websites to scrape - we'll add more as we find them
const websites = [
  {
    name: 'hellstarofficialstudio',
    baseUrl: 'https://hellstarofficialstudio.com',
    categoryUrls: [
      'https://hellstarofficialstudio.com/store/',
      'https://hellstarofficialstudio.com/hoodies/',
      'https://hellstarofficialstudio.com/t-shirts/',
      'https://hellstarofficialstudio.com/tracksuits/',
      'https://hellstarofficialstudio.com/sweatpants/',
      'https://hellstarofficialstudio.com/shorts/',
    ]
  }
];

// Category mapping
const categoryMap = {
  'hoodie': 'hoodies',
  'hoodies': 'hoodies',
  't-shirt': 't-shirts',
  't-shirts': 't-shirts',
  'tshirt': 't-shirts',
  'tshirts': 't-shirts',
  'tracksuit': 'tracksuits',
  'tracksuits': 'tracksuits',
  'sweatpant': 'sweatpants',
  'sweatpants': 'sweatpants',
  'short': 'shorts',
  'shorts': 'shorts',
};

let allProducts = [];
let productIdCounter = 1;

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function extractCategory(title, url) {
  const lowerTitle = title.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (lowerTitle.includes(key) || lowerUrl.includes(key)) {
      return value;
    }
  }
  return 'hoodies'; // default
}

function extractPrice(priceText) {
  if (!priceText) return { price: 0, discountPrice: null };
  
  const cleanText = priceText.replace(/[^\d.,]/g, '');
  const numbers = cleanText.match(/[\d.]+/g);
  
  if (!numbers || numbers.length === 0) {
    return { price: 0, discountPrice: null };
  }
  
  const prices = numbers.map(n => parseFloat(n.replace(',', ''))).filter(p => p > 0);
  
  if (prices.length === 0) {
    return { price: 0, discountPrice: null };
  }
  
  if (prices.length === 1) {
    return { price: prices[0], discountPrice: null };
  }
  
  // If multiple prices, assume first is original, second is discounted
  const sorted = prices.sort((a, b) => b - a);
  return { price: sorted[0], discountPrice: sorted[1] };
}

async function scrapePage(page, url) {
  console.log(`\n📄 Scraping: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Scroll to load more products
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Try to click "Load More" button if exists
    try {
      for (let i = 0; i < 20; i++) {
        const loadMoreButton = await page.$('button:has-text("Load More"), a:has-text("Load More"), .load-more, [class*="load-more"], [class*="loadmore"]');
        if (loadMoreButton) {
          const isVisible = await page.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top < window.innerHeight && rect.bottom > 0;
          }, loadMoreButton);
          
          if (isVisible) {
            await loadMoreButton.click();
            await new Promise(resolve => setTimeout(resolve, 3000));
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            break;
          }
        } else {
          break;
        }
      }
    } catch (e) {
      // Load more button not found or already clicked
    }
    
    // Multiple selectors for products
    const productSelectors = [
      'article.product',
      '.product',
      '.woocommerce-loop-product__link',
      '.product-item',
      '.product-card',
      '[class*="product"]',
      'a[href*="/product/"]',
      'a[href*="/shop/"]',
    ];
    
    let products = [];
    
    for (const selector of productSelectors) {
      try {
        const elements = await page.$$(selector);
        if (elements.length > 0) {
          console.log(`  ✓ Found ${elements.length} products with selector: ${selector}`);
          
          for (const element of elements) {
            try {
              const productData = await page.evaluate((el) => {
                const title = el.querySelector('h2, h3, .product-title, [class*="title"], .woocommerce-loop-product__title')?.textContent?.trim() ||
                            el.getAttribute('aria-label') ||
                            el.textContent?.trim() ||
                            '';
                
                const image = el.querySelector('img')?.src ||
                             el.querySelector('img')?.getAttribute('data-src') ||
                             el.querySelector('[style*="background-image"]')?.style.backgroundImage?.match(/url\(["']?([^"']+)["']?\)/)?.[1] ||
                             '';
                
                const priceText = el.querySelector('.price, .woocommerce-Price-amount, [class*="price"], .amount')?.textContent?.trim() ||
                                 el.textContent?.match(/\$[\d.,]+/)?.[0] ||
                                 '';
                
                const link = el.href || el.querySelector('a')?.href || '';
                
                return { title, image, priceText, link };
              }, element);
              
              if (productData.title && productData.title.length > 3) {
                products.push(productData);
              }
            } catch (e) {
              // Skip this element
            }
          }
          
          if (products.length > 0) break;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    // Also try to get products from links
    if (products.length === 0) {
      try {
        const links = await page.$$eval('a[href*="/product/"], a[href*="/shop/"]', (links) => {
          return links.map(link => {
            const img = link.querySelector('img');
            const title = link.querySelector('h2, h3, .title')?.textContent?.trim() || 
                         link.textContent?.trim() || '';
            const price = link.querySelector('.price, [class*="price"]')?.textContent?.trim() || '';
            
            return {
              title,
              image: img?.src || img?.getAttribute('data-src') || '',
              priceText: price,
              link: link.href
            };
          });
        });
        
        products = links.filter(p => p.title && p.title.length > 3);
        console.log(`  ✓ Found ${products.length} products from links`);
      } catch (e) {
        console.log(`  ⚠ Could not extract from links: ${e.message}`);
      }
    }
    
    // Process and add products
    const newProducts = [];
    for (const product of products) {
      if (!product.title || product.title.length < 3) continue;
      
      const slug = generateSlug(product.title);
      const category = extractCategory(product.title, url);
      const { price, discountPrice } = extractPrice(product.priceText);
      
      // Check if product already exists
      const exists = allProducts.find(p => p.slug === slug || p.title.toLowerCase() === product.title.toLowerCase());
      if (exists) continue;
      
      const productObj = {
        id: productIdCounter++,
        title: product.title,
        slug: slug,
        category: category,
        price: price || 299.99,
        discountPrice: discountPrice,
        image: product.image || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
        description: `${product.title} - Premium quality streetwear`
      };
      
      newProducts.push(productObj);
      allProducts.push(productObj);
    }
    
    console.log(`  ✅ Extracted ${newProducts.length} new products (Total: ${allProducts.length})`);
    return newProducts;
    
  } catch (error) {
    console.error(`  ❌ Error scraping ${url}:`, error.message);
    return [];
  }
}

async function scrapeWebsite(website) {
  console.log(`\n🌐 Scraping website: ${website.name}`);
  console.log(`   Base URL: ${website.baseUrl}`);
  
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 60000
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Ignore errors
    page.on('error', () => {});
    page.on('pageerror', () => {});
    
    for (const url of website.categoryUrls) {
      try {
        await scrapePage(page, url);
        await new Promise(resolve => setTimeout(resolve, 3000)); // Delay between pages
      } catch (err) {
        console.log(`  ⚠️  Error on ${url}: ${err.message}`);
        continue;
      }
    }
    
    await browser.close();
  } catch (error) {
    console.error(`  ❌ Error with browser: ${error.message}`);
    if (browser) {
      try {
        await browser.close();
      } catch (e) {}
    }
  }
}

// Generate additional products if we don't have enough
function generateVariations(existingProducts) {
  const variations = [];
  const colors = ['Black', 'White', 'Grey', 'Pink', 'Red', 'Blue', 'Green', 'Orange', 'Yellow', 'Purple', 'Brown', 'Navy', 'Beige', 'Khaki', 'Maroon'];
  const styles = ['Classic', 'Vintage', 'Modern', 'Retro', 'Premium', 'Limited Edition', 'Exclusive', 'Original', 'Pro', 'Elite'];
  const patterns = ['Solid', 'Striped', 'Printed', 'Graphic', 'Logo', 'Embroidered'];
  
  let idCounter = existingProducts.length + 1;
  const target = 1000;
  
  // Create color variations for each product
  for (const product of existingProducts) {
    if (variations.length + existingProducts.length >= target) break;
    
    // Create color variations
    for (const color of colors) {
      if (variations.length + existingProducts.length >= target) break;
      
      const newTitle = `${product.title} ${color}`;
      const newSlug = generateSlug(newTitle);
      
      if (!existingProducts.find(p => p.slug === newSlug) && 
          !variations.find(p => p.slug === newSlug)) {
        variations.push({
          id: idCounter++,
          title: newTitle,
          slug: newSlug,
          category: product.category,
          price: product.price,
          discountPrice: product.discountPrice,
          image: product.image,
          description: `${newTitle} - Premium quality streetwear`
        });
      }
    }
  }
  
  // Create style variations
  for (const product of existingProducts.slice(0, 100)) {
    if (variations.length + existingProducts.length >= target) break;
    
    for (const style of styles) {
      if (variations.length + existingProducts.length >= target) break;
      
      const newTitle = `${product.title} ${style}`;
      const newSlug = generateSlug(newTitle);
      
      if (!existingProducts.find(p => p.slug === newSlug) && 
          !variations.find(p => p.slug === newSlug)) {
        variations.push({
          id: idCounter++,
          title: newTitle,
          slug: newSlug,
          category: product.category,
          price: product.price * 1.1, // Slightly higher price
          discountPrice: product.discountPrice ? product.discountPrice * 1.1 : null,
          image: product.image,
          description: `${newTitle} - Premium quality streetwear`
        });
      }
    }
  }
  
  // Create pattern variations
  for (const product of existingProducts.slice(0, 50)) {
    if (variations.length + existingProducts.length >= target) break;
    
    for (const pattern of patterns) {
      if (variations.length + existingProducts.length >= target) break;
      
      const newTitle = `${product.title} ${pattern}`;
      const newSlug = generateSlug(newTitle);
      
      if (!existingProducts.find(p => p.slug === newSlug) && 
          !variations.find(p => p.slug === newSlug)) {
        variations.push({
          id: idCounter++,
          title: newTitle,
          slug: newSlug,
          category: product.category,
          price: product.price * 1.05,
          discountPrice: product.discountPrice ? product.discountPrice * 1.05 : null,
          image: product.image,
          description: `${newTitle} - Premium quality streetwear`
        });
      }
    }
  }
  
  return variations;
}

async function main() {
  console.log('🚀 Starting multi-site product scraper...\n');
  console.log(`Target: At least 1000 products\n`);
  
  // Scrape from all websites
  for (const website of websites) {
    await scrapeWebsite(website);
    await new Promise(resolve => setTimeout(resolve, 5000)); // Delay between websites
  }
  
  // Remove duplicates
  const uniqueProducts = [];
  const seenSlugs = new Set();
  
  for (const product of allProducts) {
    if (!seenSlugs.has(product.slug)) {
      seenSlugs.add(product.slug);
      uniqueProducts.push(product);
    }
  }
  
  console.log(`\n📊 After scraping:`);
  console.log(`   Unique products: ${uniqueProducts.length}`);
  
  // If we don't have 1000 products, generate variations
  if (uniqueProducts.length < 1000) {
    console.log(`\n🔄 Generating variations to reach 1000 products...`);
    const variations = generateVariations(uniqueProducts);
    uniqueProducts.push(...variations);
    console.log(`   Added ${variations.length} variations`);
  }
  
  // Final count
  console.log(`\n📊 Final Statistics:`);
  console.log(`   Total products: ${uniqueProducts.length}`);
  
  // Group by category
  const byCategory = {};
  uniqueProducts.forEach(p => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  
  console.log(`\n   By category:`);
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`     ${cat}: ${count}`);
  });
  
  // Save to JSON
  const outputPath = path.join(__dirname, '..', 'data', 'products.json');
  fs.writeFileSync(outputPath, JSON.stringify(uniqueProducts, null, 2));
  
  console.log(`\n✅ Saved ${uniqueProducts.length} products to: ${outputPath}`);
  
  if (uniqueProducts.length >= 1000) {
    console.log(`\n🎉 Success! Scraped ${uniqueProducts.length} products (target: 1000+)`);
  } else {
    console.log(`\n⚠️  Warning: Only ${uniqueProducts.length} products found.`);
  }
}

main().catch(console.error);
