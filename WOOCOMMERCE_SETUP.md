# WooCommerce Integration Setup

## Overview
This project now integrates with WooCommerce to:
1. Import products from `essentials.csv` to WooCommerce
2. Fetch products live from WooCommerce API
3. Use WooCommerce external links for "Buy Now" buttons

## WooCommerce Credentials
- **URL**: `https://payment.essentialsjacket.com`
- **Consumer Key**: `ck_c8da2c7777f941db2d1bbc9473eb123b3d7eaf0c`
- **Consumer Secret**: `cs_be0129200d5d22f57290ec5d58d3ffe842415dbe`

## Import Products to WooCommerce

### Step 1: Run the Import Script
```bash
node scripts/import_to_woocommerce.js
```

This script will:
- Read all products from `data/essentials.csv`
- Clean product titles and extract categories
- Create products in WooCommerce via REST API
- Set external URLs for each product
- Display progress and results

### Step 2: Verify Import
After import, check your WooCommerce admin panel to verify all products were created successfully.

## Live Product Fetching

The website now fetches products from WooCommerce API with automatic fallback to local JSON data:

### How It Works
1. **Primary**: Fetches from WooCommerce API (cached for 1 hour)
2. **Fallback**: Uses local `data/products.json` if WooCommerce is unavailable

### Updated Files
- `lib/woocommerce.ts` - WooCommerce API integration
- `lib/products.ts` - Updated to use WooCommerce with fallback
- All page components - Updated to async functions

## Buy Now Button

All product pages now use WooCommerce external links for the "Buy Now" button:
- Links directly to WooCommerce product page
- Opens in new tab
- Uses product's `external_url` from WooCommerce

## API Endpoints Used

- `GET /wp-json/wc/v3/products` - Fetch all products
- `GET /wp-json/wc/v3/products/{id}` - Fetch single product
- `POST /wp-json/wc/v3/products` - Create product
- `PUT /wp-json/wc/v3/products/{id}` - Update product

## Notes

- Products are cached for 1 hour to reduce API calls
- If WooCommerce API fails, the site automatically falls back to local data
- External URLs are set automatically during import
- All products are set as "In Stock" by default

