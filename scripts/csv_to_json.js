const fs = require('fs');
const path = require('path');

// Read CSV file
const csvPath = path.join(__dirname, '..', 'data', 'products.csv');
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

const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n').filter(line => line.trim());

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
      
      // Map category
      let category = (row.category || '').toLowerCase();
      if (category.includes('hoodie')) category = 'hoodies';
      else if (category.includes('shirt') || category.includes('t-shirt')) category = 't-shirts';
      else if (category.includes('tracksuit')) category = 'tracksuits';
      else if (category.includes('sweatpant')) category = 'sweatpants';
      else if (category.includes('short')) category = 'shorts';
      else if (category.includes('jacket')) category = 'jackets';
      else if (category.includes('jean')) category = 'jeans';
      else if (category.includes('beanie')) category = 'beanies';
      else if (category.includes('hat')) category = 'hats';
      else if (category.includes('ski mask')) category = 'ski-masks';
      else if (category.includes('long sleeve')) category = 'long-sleeves';
      else if (category.includes('sweater')) category = 'sweaters';
      else if (category.includes('pant') && !category.includes('sweat')) category = 'pants';
      else if (category === 'uncategorized') category = 'hoodies'; // default uncategorized to hoodies
      else category = 'hoodies'; // default
      
      // Parse prices (remove $ and commas)
      const priceStr = (row.original_price || row.price || '').replace(/[$,]/g, '');
      const discountPriceStr = (row.price || '').replace(/[$,]/g, '');
      
      const price = priceStr ? parseFloat(priceStr) : 299.99;
      const discountPrice = discountPriceStr && discountPriceStr !== priceStr ? parseFloat(discountPriceStr) : null;
      
      // Find matching local image
      const localImage = findImage(title, imageFiles);
      
      // Only add product if it has a local image
      if (!localImage) {
        console.log(`⚠️  Skipping "${title}" - no local image found`);
        continue;
      }
      
      const product = {
        id: products.length + 1,
        title: title,
        slug: slug,
        category: category,
        price: price,
        discountPrice: discountPrice,
        image: localImage,
        description: row.description || title
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
products.forEach(p => {
  byCategory[p.category] = (byCategory[p.category] || 0) + 1;
});

console.log('\n📊 By category:');
Object.entries(byCategory).forEach(([cat, count]) => {
  console.log(`  ${cat}: ${count}`);
});

