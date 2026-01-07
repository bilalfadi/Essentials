const fs = require('fs');
const path = require('path');

const mappingPath = path.join(__dirname, '..', 'data', 'product-image-mapping.json');
const imagesDir = path.join(__dirname, '..', 'public', 'product-images');

// Read current mapping
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

// Get all actual files
const actualFiles = {};
fs.readdirSync(imagesDir).forEach(file => {
  const baseName = file.replace(/\.[^.]+$/, '');
  actualFiles[baseName] = file;
});

// Update mapping with correct file names
let updated = 0;
const updatedMapping = {};

for (const [slug, oldPath] of Object.entries(mapping)) {
  // Extract base name from old path (e.g., "/product-images/img-0001-..." -> "img-0001-...")
  const oldFileName = oldPath.replace('/product-images/', '');
  const baseName = oldFileName.split('.')[0];
  
  // Find actual file
  if (actualFiles[baseName]) {
    const newPath = `/product-images/${actualFiles[baseName]}`;
    updatedMapping[slug] = newPath;
    if (oldPath !== newPath) {
      console.log(`Updated: ${slug}`);
      console.log(`  Old: ${oldPath}`);
      console.log(`  New: ${newPath}\n`);
      updated++;
    }
  } else {
    // Keep old path if file not found
    updatedMapping[slug] = oldPath;
    console.log(`⚠️  File not found for: ${slug} (${baseName})`);
  }
}

// Write updated mapping
fs.writeFileSync(mappingPath, JSON.stringify(updatedMapping, null, 2));
console.log(`\n✅ Updated ${updated} mappings`);
console.log(`📁 Mapping saved to: ${mappingPath}`);

