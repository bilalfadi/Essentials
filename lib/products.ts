import { fetchWooCommerceProducts, mapWooCommerceToProduct } from './woocommerce';

export interface Product {
  id: number;
  title: string;
  slug: string;
  category: string;
  price: number | null;
  discountPrice: number | null;
  image: string;
  description: string;
  brand?: string;
  woocommerceId?: number;
  woocommerceUrl?: string;
  buttonText?: string;
}

// Get All Products from WooCommerce
export async function getAllProducts(): Promise<Product[]> {
  try {
    console.log('[Products] Fetching all products...');
    const wcProducts = await fetchWooCommerceProducts();
    console.log(`[Products] WooCommerce returned: ${wcProducts?.length || 0} products`);
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(mapWooCommerceToProduct);
      console.log(`[Products] Mapped to ${mapped.length} products`);
      return mapped;
    }
  } catch (error) {
    console.error('[Products] Error:', error);
  }
  console.log('[Products] Returning empty array');
  return [];
}

// Get Product by Slug
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const wcProducts = await fetchWooCommerceProducts();
    const wcProduct = wcProducts.find((p) => p.slug === slug);
    if (wcProduct) {
      return mapWooCommerceToProduct(wcProduct);
    }
  } catch (error) {
    console.error('Error fetching product from WooCommerce:', error);
  }
  return undefined;
}

// Get Products by Category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const wcProducts = await fetchWooCommerceProducts();
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(mapWooCommerceToProduct);
      const normalizedCategory = category.toLowerCase().trim();
      return mapped.filter((product) => {
        const productCategory = (product.category || '').toLowerCase().trim();
        return productCategory === normalizedCategory;
      });
    }
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
  }
  return [];
}

// Get Products by Category and Brand
export async function getProductsByCategoryAndBrand(
  category: string,
  brand: 'hellstar' | 'trapstar' | 'essentials'
): Promise<Product[]> {
  if (brand.toLowerCase() !== 'essentials') {
    return [];
  }

  try {
    const wcProducts = await fetchWooCommerceProducts();
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(mapWooCommerceToProduct);
      const normalizedCategory = category.toLowerCase().trim();
      return mapped.filter((product) => {
        const productCategory = (product.category || '').toLowerCase().trim();
        return productCategory === normalizedCategory;
      });
    }
  } catch (error) {
    console.error('Error fetching products from WooCommerce:', error);
  }
  return [];
}

// Search Products
export async function searchProducts(query: string): Promise<Product[]> {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return [];

  try {
    const wcProducts = await fetchWooCommerceProducts();
    if (wcProducts && wcProducts.length > 0) {
      const mapped = wcProducts.map(mapWooCommerceToProduct);
      return mapped.filter((product) =>
        product.title.toLowerCase().includes(lowerQuery)
      );
    }
  } catch (error) {
    console.error('Error searching products from WooCommerce:', error);
  }
  return [];
}


// Synchronous versions for backward compatibility (return empty arrays)
export function getAllProductsSync(): Product[] {
  return [];
}

export function getProductBySlugSync(slug: string): Product | undefined {
  return undefined;
}

export function getProductsByCategorySync(category: string): Product[] {
  return [];
}

export function getProductsByCategoryAndBrandSync(
  category: string,
  brand: 'hellstar' | 'trapstar' | 'essentials'
): Product[] {
  return [];
}