import { getAllProducts } from '@/lib/products'
import ProductGrid from '@/components/ProductGrid'

export default function StorePage() {
  const allProducts = getAllProducts()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Shop</h1>
        <p className="text-gray-400 mb-4 md:mb-6 text-sm md:text-base">Browse our complete Essentials collection</p>
      </div>

      {/* Essentials Products Section */}
      {allProducts.length > 0 && (
        <section className="mb-16 md:mb-20">
          <div className="mb-6 md:mb-8">
            <p className="text-gray-400 mb-4 text-sm md:text-base">{allProducts.length} products available</p>
          </div>
          <ProductGrid products={allProducts} />
        </section>
      )}
      
      {/* Content Section - After Products */}
      <div className="mt-12 md:mt-16">
        <div className="text-gray-400 space-y-3 md:space-y-4 max-w-4xl text-sm md:text-base leading-relaxed">
          <p>
            Essentials is a streetwear brand that has been making waves in the fashion industry. The brand combines bold designs with premium quality, creating pieces that stand out in the streetwear scene.
          </p>
          <p>
            Essentials offers a range of products including jackets, hoodies, t-shirts, shorts, sweatpants, and accessories like hats and beanies. Each piece reflects the brand's commitment to style and quality.
          </p>
        </div>
      </div>
    </div>
  )
}

