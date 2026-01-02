const fs = require('fs');
const path = require('path');

// Read CSV files - Use Essentials CSV
const essentialsCsvPath = path.join(__dirname, '..', 'data', 'essentials.csv');
const jsonPath = path.join(__dirname, '..', 'data', 'products.json');
const bilalPath = path.join(__dirname, '..', 'public', 'bilal');

// Get all image files from bilal folder
function getAllImages() {
  if (!fs.existsSync(bilalPath)) {
    return [];
  }
  return fs.readdirSync(bilalPath).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
}

// Find matching image for product name
function findImage(productName, imageFiles) {
  // Normalize product name: remove special chars, convert to lowercase
  const normalized = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
  
  // Try exact match first
  for (const file of imageFiles) {
    const fileBase = path.basename(file, path.extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');
    
    if (fileBase === normalized || fileBase.includes(normalized) || normalized.includes(fileBase)) {
      return `/bilal/${file}`;
    }
  }
  
  // Try partial match
  const nameWords = normalized.split('_').filter(w => w.length > 3);
  for (const file of imageFiles) {
    const fileBase = path.basename(file, path.extname(file))
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_');
    
    let matchCount = 0;
    for (const word of nameWords) {
      if (fileBase.includes(word)) {
        matchCount++;
      }
    }
    
    if (matchCount >= Math.min(3, nameWords.length)) {
      return `/bilal/${file}`;
    }
  }
  
  return null;
}

const imageFiles = getAllImages();
console.log(`📁 Found ${imageFiles.length} images in bilal folder`);

// Read Essentials CSV file
const allCsvContent = [];
if (fs.existsSync(essentialsCsvPath)) {
  allCsvContent.push(fs.readFileSync(essentialsCsvPath, 'utf-8'));
}

const combinedContent = allCsvContent.join('\n');
const lines = combinedContent.split('\n').filter(line => line.trim());

// Get headers
const headers = lines[0].split(',').map(h => h.trim());

console.log('Headers:', headers);

// Parse CSV rows
const products = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Simple CSV parsing (handles quoted values)
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
  values.push(current.trim()); // Last value
  
  if (values.length >= headers.length) {
    const row = {};
    headers.forEach((header, index) => {
      let value = values[index] || '';
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      row[header] = value;
    });
    
    // Only process if has name
    if (row.name && row.name.trim()) {
      // Map CSV columns to our JSON format
      const title = row.name.trim();
      
      // Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Map category for Essentials products
      // Since CSV category column has "Essentials" (brand), infer from title
      let category = (row.category || '').trim().toLowerCase();
      const titleLower = title.toLowerCase();
      
      // First try to infer from title (more reliable)
      if (titleLower.includes('tracksuit')) {
        category = 'tracksuits';
      } else if (titleLower.includes('sweatpant') || titleLower.includes('sweat pant')) {
        category = 'sweatpants';
      } else if (titleLower.includes('short') && !titleLower.includes('sleeve')) {
        category = 'shorts';
      } else if (titleLower.includes('jacket') || titleLower.includes('parka') || titleLower.includes('coat')) {
        category = 'jackets';
      } else if (titleLower.includes('hoodie')) {
        category = 'hoodies';
      } else if (titleLower.includes('sweatshirt') || titleLower.includes('sweat shirt') || titleLower.includes('crewneck')) {
        category = 'sweatshirts';
      } else if (titleLower.includes('sweater')) {
        category = 'sweaters';
      } else if (titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('shirt') && !titleLower.includes('sweat')) {
        category = 't-shirts';
      } else if (titleLower.includes('long sleeve') || titleLower.includes('long-sleeve')) {
        category = 'long-sleeves';
      } else if (titleLower.includes('pant') && !titleLower.includes('sweat')) {
        category = 'pants';
      } else if (titleLower.includes('jean')) {
        category = 'jeans';
      } else if (titleLower.includes('beanie')) {
        category = 'beanies';
      } else if (titleLower.includes('hat') && !titleLower.includes('hoodie')) {
        category = 'hats';
      } else if (titleLower.includes('shoe') || titleLower.includes('adilette') || titleLower.includes('lo')) {
        category = 'shoes';
      } else if (titleLower.includes('tight') || titleLower.includes('compression')) {
        category = 'pants';
      } else {
        // Try category column as fallback
        if (category === 'tracksuit' || category.includes('tracksuit')) {
          category = 'tracksuits';
        } else if (category === 'shorts' || category.includes('short')) {
          category = 'shorts';
        } else if (category === 'jacket' || category.includes('jacket')) {
          category = 'jackets';
        } else if (category === 'shirt' || category.includes('shirt')) {
          category = 't-shirts';
        } else if (category === 'hoodie' || category.includes('hoodie')) {
          category = 'hoodies';
        } else if (category === 'sweatshirt' || category.includes('sweatshirt')) {
          category = 'sweatshirts';
        } else if (category === 'sweatpants' || category.includes('sweatpant')) {
          category = 'sweatpants';
        } else {
          category = 't-shirts'; // default
        }
      }
      
      // Parse prices (remove £, $ and commas)
      const priceStr = (row.original_price || row.price || '').replace(/[£$,]/g, '').trim();
      const discountPriceStr = (row.price || '').replace(/[£$,]/g, '').trim();
      
      // Parse and validate prices
      const parsedPrice = priceStr ? parseFloat(priceStr) : null;
      const parsedDiscountPrice = discountPriceStr && discountPriceStr !== priceStr ? parseFloat(discountPriceStr) : null;
      
      // Ensure prices are valid numbers (not NaN)
      const price = (parsedPrice && !isNaN(parsedPrice) && parsedPrice > 0) ? parsedPrice : 299.99;
      const discountPrice = (parsedDiscountPrice && !isNaN(parsedDiscountPrice) && parsedDiscountPrice > 0) ? parsedDiscountPrice : null;
      
      // Find matching local image from bilal folder (prefer local images)
      const localImage = findImage(title, imageFiles);
      const imagePath = localImage || row.image_url || '';
      
      // For Essentials products, use local images if available, otherwise use image_url
      // Don't skip if no local image - use image_url as fallback
      if (!localImage && !row.image_url) {
        console.log(`⚠️  Skipping "${title}" - no image found`);
        continue;
      }
      
      // Determine brand - use Essentials
      const brand = (row.brand || '').trim() || 'Essentials';
      
      const product = {
        id: products.length + 1,
        title: title,
        slug: slug,
        category: category,
        price: price,
        discountPrice: discountPrice,
        image: imagePath,
        description: row.description || title,
        brand: 'Essentials'
      };
      
      products.push(product);
    }
  }
}

console.log(`\n✅ Parsed ${products.length} products`);

// Count matched images
const matchedImages = products.filter(p => p.image.startsWith('/bilal/')).length;
console.log(`🖼️  Matched ${matchedImages} local images`);

// Save to JSON
fs.writeFileSync(jsonPath, JSON.stringify(products, null, 2));

console.log(`✅ Saved to: ${jsonPath}`);

// Show summary
const byCategory = {};
const byBrand = {};
products.forEach(p => {
  byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  byBrand[p.brand] = (byBrand[p.brand] || 0) + 1;
});

console.log('\n📊 By category:');
Object.entries(byCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

console.log('\n🏷️  By brand:');
Object.entries(byBrand).forEach(([brand, count]) => {
  console.log(`  ${brand}: ${count}`);
});

// Show Essentials categories specifically
const essentialsProducts = products.filter(p => p.brand === 'Essentials');
const essentialsByCategory = {};
essentialsProducts.forEach(p => {
  essentialsByCategory[p.category] = (essentialsByCategory[p.category] || 0) + 1;
});

if (essentialsProducts.length > 0) {
  console.log('\n⭐ Essentials products by category:');
  Object.entries(essentialsByCategory).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });
}

