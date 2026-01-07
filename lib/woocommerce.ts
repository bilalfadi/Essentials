// WooCommerce API Configuration
const WOOCOMMERCE_URL = 'https://payment.essentialsjacket.com';
const CONSUMER_KEY = 'ck_2a5b631771504e2f65c279f2049dfc564909f553';
const CONSUMER_SECRET = 'cs_46d1a9dc72f66b9a64670da2cdab4e548cc539c7';

// WooCommerce Product Interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  status: string;
  description: string;
  short_description: string;
  regular_price: string;
  sale_price: string;
  images: Array<{
    id: number;
    src: string;
    name: string;
    alt: string;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  external_url: string;
  button_text: string;
}

// Create Basic Auth Header
function getAuthHeader(): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
  }
  return btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
}

// Load Local Image Mapping
let localImageMap: Record<string, string> = {};

if (typeof window === 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    const mappingPath = path.join(process.cwd(), 'data', 'product-image-mapping.json');
    if (fs.existsSync(mappingPath)) {
      localImageMap = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
    }
  } catch (e) {
    // Ignore if mapping file not found
  }
}

// Fetch All Products from WooCommerce (with pagination)
export async function fetchWooCommerceProducts(): Promise<WooCommerceProduct[]> {
  const allProducts: WooCommerceProduct[] = [];
  let page = 1;
  const auth = getAuthHeader();

  console.log('[WooCommerce] Starting fetch...');

  while (true) {
    try {
      const url = new URL(`${WOOCOMMERCE_URL}/wp-json/wc/v3/products`);
      url.searchParams.append('per_page', '100');
      url.searchParams.append('page', page.toString());
      url.searchParams.append('status', 'publish');

      console.log(`[WooCommerce] Fetching page ${page}...`);

      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        next: { revalidate: 3600 },
      });

      console.log(`[WooCommerce] Response status: ${response.status}`);

      if (!response.ok) {
        if (page === 1) {
          console.error(`[WooCommerce] API Error: ${response.status}`);
          return [];
        }
        break;
      }

      const products: WooCommerceProduct[] = await response.json();
      console.log(`[WooCommerce] Page ${page}: ${products.length} products`);

      if (products.length === 0) {
        break;
      }

      allProducts.push(...products);

      if (products.length < 100) {
        break;
      }

      page++;
    } catch (error) {
      console.error('[WooCommerce] Error:', error);
      return [];
    }
  }

  console.log(`[WooCommerce] Total products fetched: ${allProducts.length}`);
  return allProducts;
}

// Map Category Name to Our Format
function mapCategory(categoryName: string, categorySlug: string): string {
  const name = categoryName.toLowerCase();
  
  if (name.includes('t-shirt') || name.includes('tee') || name.includes('tshirt')) {
    return 't-shirts';
  }
  if (name.includes('hoodie')) {
    return 'hoodies';
  }
  if (name.includes('jacket')) {
    return 'jackets';
  }
  if (name.includes('tracksuit')) {
    return 'tracksuits';
  }
  if (name.includes('sweatpant')) {
    return 'sweatpants';
  }
  if (name.includes('sweatshirt') || name.includes('crewneck')) {
    return 'sweatshirts';
  }
  if (name.includes('short') && !name.includes('sleeve')) {
    return 'shorts';
  }
  
  return categorySlug || 'uncategorized';
}

// Map WooCommerce Product to Our Product Format
export function mapWooCommerceToProduct(wcProduct: WooCommerceProduct) {
  const category = wcProduct.categories[0];
  let categoryName = category?.name || '';
  let categorySlug = category?.slug || 'uncategorized';
  
  // If category is uncategorized, try to detect from product title
  if (categoryName.toLowerCase() === 'uncategorized' || categorySlug === 'uncategorized') {
    const titleLower = wcProduct.name.toLowerCase();
    if (titleLower.includes('hoodie')) {
      categoryName = 'Hoodies';
      categorySlug = 'hoodies';
    } else if (titleLower.includes('t-shirt') || titleLower.includes('tee') || titleLower.includes('tshirt')) {
      categoryName = 'T-Shirts';
      categorySlug = 't-shirts';
    } else if (titleLower.includes('jacket')) {
      categoryName = 'Jackets';
      categorySlug = 'jackets';
    } else if (titleLower.includes('tracksuit')) {
      categoryName = 'Tracksuits';
      categorySlug = 'tracksuits';
    } else if (titleLower.includes('sweatpant')) {
      categoryName = 'Sweatpants';
      categorySlug = 'sweatpants';
    } else if (titleLower.includes('sweatshirt') || titleLower.includes('crewneck')) {
      categoryName = 'Sweatshirts';
      categorySlug = 'sweatshirts';
    } else if (titleLower.includes('short') && !titleLower.includes('sleeve')) {
      categoryName = 'Shorts';
      categorySlug = 'shorts';
    }
  }
  
  const mappedCategory = mapCategory(categoryName, categorySlug);

  // Use local image if available, otherwise WooCommerce image
  const localImage = localImageMap[wcProduct.slug];
  const imageUrl = localImage || wcProduct.images[0]?.src || '';

  return {
    id: wcProduct.id,
    title: wcProduct.name,
    slug: wcProduct.slug,
    category: mappedCategory,
    price: wcProduct.regular_price ? parseFloat(wcProduct.regular_price) : null,
    discountPrice: wcProduct.sale_price ? parseFloat(wcProduct.sale_price) : null,
    image: imageUrl,
    description: wcProduct.description || wcProduct.short_description || wcProduct.name,
    brand: 'Essentials',
    woocommerceId: wcProduct.id,
    woocommerceUrl: wcProduct.external_url || wcProduct.permalink,
    buttonText: wcProduct.button_text || 'Buy Now',
  };
}

// WooCommerce Order Interface
export interface WooCommerceOrder {
  id?: number;
  status: string;
  currency: string;
  date_created: string;
  date_modified: string;
  total: string;
  customer_id: number;
  payment_method: string;
  payment_method_title: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  line_items: Array<{
    product_id: number;
    quantity: number;
    price: string;
  }>;
}

// Create Order in WooCommerce
export async function createWooCommerceOrder(orderData: {
  billing: WooCommerceOrder['billing'];
  shipping: WooCommerceOrder['shipping'];
  line_items: WooCommerceOrder['line_items'];
  payment_method: string;
  payment_method_title: string;
}): Promise<WooCommerceOrder | null> {
  try {
    const auth = getAuthHeader();
    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/orders`;

    const orderPayload = {
      payment_method: orderData.payment_method,
      payment_method_title: orderData.payment_method_title,
      set_paid: false,
      billing: orderData.billing,
      shipping: orderData.shipping,
      line_items: orderData.line_items,
      shipping_lines: [
        {
          method_id: 'flat_rate',
          method_title: 'Flat Rate',
          total: '10.00'
        }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[WooCommerce] Order creation error:', response.status, errorText);
      return null;
    }

    const order: WooCommerceOrder = await response.json();
    console.log('[WooCommerce] Order created:', order.id);
    return order;
  } catch (error) {
    console.error('[WooCommerce] Error creating order:', error);
    return null;
  }
}

// Get Product by ID from WooCommerce
export async function getWooCommerceProductById(productId: number): Promise<WooCommerceProduct | null> {
  try {
    const auth = getAuthHeader();
    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/products/${productId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const product: WooCommerceProduct = await response.json();
    return product;
  } catch (error) {
    console.error('[WooCommerce] Error fetching product:', error);
    return null;
  }
}

// WooCommerce Payment Gateway Interface
export interface WooCommercePaymentGateway {
  id: string;
  title: string;
  description: string;
  order: number;
  enabled: boolean;
  method_title: string;
  method_description: string;
  settings: Record<string, any>;
}

// Get Available Payment Methods from WooCommerce
export async function getWooCommercePaymentMethods(): Promise<WooCommercePaymentGateway[]> {
  try {
    const auth = getAuthHeader();
    const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/payment_gateways`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('[WooCommerce] Payment methods fetch error:', response.status);
      // Return default payment methods if API fails
      return [
        {
          id: 'bacs',
          title: 'Direct Bank Transfer',
          description: 'Make your payment directly into our bank account.',
          order: 0,
          enabled: true,
          method_title: 'Direct Bank Transfer',
          method_description: 'Make your payment directly into our bank account.',
          settings: {},
        },
        {
          id: 'cod',
          title: 'Cash on Delivery',
          description: 'Pay with cash upon delivery.',
          order: 1,
          enabled: true,
          method_title: 'Cash on Delivery',
          method_description: 'Pay with cash upon delivery.',
          settings: {},
        },
      ];
    }

    const gateways: WooCommercePaymentGateway[] = await response.json();
    
    // Filter only enabled payment methods
    const enabledGateways = gateways
      .filter(gateway => gateway.enabled)
      .sort((a, b) => a.order - b.order);

    console.log(`[WooCommerce] Found ${enabledGateways.length} enabled payment methods`);
    return enabledGateways;
  } catch (error) {
    console.error('[WooCommerce] Error fetching payment methods:', error);
    // Return default payment methods on error
    return [
      {
        id: 'bacs',
        title: 'Direct Bank Transfer',
        description: 'Make your payment directly into our bank account.',
        order: 0,
        enabled: true,
        method_title: 'Direct Bank Transfer',
        method_description: 'Make your payment directly into our bank account.',
        settings: {},
      },
    ];
  }
}