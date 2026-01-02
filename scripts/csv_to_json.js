const fs = require('fs');
const path = require('path');

// Read CSV files - Use Essentials CSV
const essentialsCsvPath = path.join(__dirname, '..', 'data', 'essentials.csv');
const jsonPath = path.join(__dirname, '..', 'data', 'products.json');

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
      let rawTitle = row.name.trim();
      
      // Clean the title - remove all the extra e-commerce text
      // Remove patterns like: "Add to wishlist", "Original price was", "Current price is", "Select options", "Compare", "Quick view", etc.
      let cleanTitle = rawTitle
        .replace(/^-\d+%\s*/i, '') // Remove leading discount percentage
        .replace(/add\s+to\s+wishlist/gi, '')
        .replace(/original\s+price\s+was[^.]*\./gi, '')
        .replace(/current\s+price\s+is[^.]*\./gi, '')
        .replace(/select\s+options/gi, '')
        .replace(/compare/gi, '')
        .replace(/quick\s+view/gi, '')
        .replace(/\$\d+\.\d+/g, '') // Remove price strings like $200.00
        .replace(/\$\d+/g, '') // Remove price strings like $200
        .replace(/new\s+collection/gi, '')
        .replace(/fear\s+of\s+god/gi, '')
        .replace(/00\.\./g, '') // Remove "00.." artifacts
        .replace(/,\s*,/g, ',') // Remove double commas
        .replace(/,\s*$/g, '') // Remove trailing commas
        .replace(/^\s*,\s*/g, '') // Remove leading commas
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/\s*,\s*/g, ' ') // Replace commas with spaces
        .trim();
      
      // If cleaned title is too short or empty, try to extract product name from original
      // Look for patterns like "Essentials [Product Name]" or extract first meaningful part
      if (cleanTitle.length < 10) {
        // Try to find product name after "Essentials" or before first price
        const essentialsMatch = rawTitle.match(/essentials\s+([^$]+?)(?:\s*\$|\s*new|$)/i);
        if (essentialsMatch && essentialsMatch[1]) {
          cleanTitle = 'Essentials ' + essentialsMatch[1].trim();
        } else {
          // Fallback: take first 80 characters and clean
          cleanTitle = rawTitle.substring(0, 80)
            .replace(/^-\d+%\s*/i, '')
            .replace(/add\s+to\s+wishlist/gi, '')
            .replace(/\$\d+\.\d+/g, '')
            .trim();
        }
      }
      
      // Limit title length to 100 characters
      if (cleanTitle.length > 100) {
        cleanTitle = cleanTitle.substring(0, 97) + '...';
      }
      
      // Generate slug from cleaned title (max 100 characters for filename safety)
      let slug = cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s]+/g, '') // Remove special characters first
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
      
      // Limit slug length to 100 characters to prevent ENAMETOOLONG errors
      if (slug.length > 100) {
        slug = slug.substring(0, 100).replace(/-$/, ''); // Remove trailing hyphen if cut mid-word
      }
      
      // Use cleaned title for product
      const title = cleanTitle;
      
      // Map category for Essentials products
      // Since CSV category column has "Essentials" (brand), infer from title
      let category = (row.category || '').trim().toLowerCase();
      const titleLower = cleanTitle.toLowerCase();
      
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
      
      // Use only remote image URL from CSV - no local images
      const imagePath = (row.image_url || '').trim();
      
      // Skip if no remote image URL
      if (!imagePath || !imagePath.startsWith('http')) {
        console.log(`⚠️  Skipping "${title}" - no remote image URL found`);
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

// Count remote images
const remoteImages = products.filter(p => p.image.startsWith('http')).length;
console.log(`🖼️  Using ${remoteImages} remote images`);

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

