import { getProductsByCategoryAndBrand, getProductsByCategoryAndBrandSync } from '@/lib/products'
import ProductGrid from '@/components/ProductGrid'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

const category = 'tracksuits'
const categoryName = 'Tracksuits'

// Generate metadata for SEO
export const metadata: Metadata = {
  title: `${categoryName} - Essentials Official | Premium Streetwear`,
  description: `Shop ${categoryName} from Essentials Official. Premium quality ${categoryName.toLowerCase()} with bold streetwear designs.`,
  keywords: `Essentials ${categoryName}, ${categoryName} Essentials, Essentials ${categoryName} collection, streetwear ${categoryName}, premium ${categoryName}`,
  openGraph: {
    title: `${categoryName} - Essentials Official`,
    description: `Shop ${categoryName} from Essentials Official. Premium quality ${categoryName.toLowerCase()}.`,
    url: `https://essentialsjacket.com/${category}`,
    siteName: 'Essentials Official',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${categoryName} - Essentials Official`,
    description: `Shop ${categoryName} from Essentials Official.`,
  },
  alternates: {
    canonical: `https://essentialsjacket.com/${category}`,
  },
}

export default async function CategoryPage() {
  // Get only Essentials products - Try WooCommerce first, fallback to local data
  const essentialsProducts = await getProductsByCategoryAndBrand(category, 'essentials') || getProductsByCategoryAndBrandSync(category, 'essentials')
  const allProducts = essentialsProducts

  // Category-specific descriptions for Essentials
  const categoryDescriptions: Record<string, string> = {
    'hoodies': "Essentials hoodies are known for their blend of premium quality, striking graphics, and streetwear credibility. A badge of style for those who appreciate bold design and exceptional craftsmanship.",
    't-shirts': "Essentials T-shirts feature bold graphics and premium quality materials. The designs carry real weight—metaphorically and physically. Made with durable cotton that stands the test of time.",
    'tracksuits': "Essentials tracksuits combine premium comfort with bold streetwear design. The brand's edgy graphics, quality materials, and limited releases make them a must-have for streetwear enthusiasts.",
    'sweatpants': "Essentials sweatpants combine comfort, toughness, and edge in a way that fits today's culture. Consistent design, quality materials, and that signature Essentials aesthetic make these sweatpants more than just loungewear—they're a statement piece.",
    'shorts': "Essentials shorts are made with streetwear culture in mind. They feature eye-catching graphic prints, high-quality materials, and a distinct relaxed fit that will make you stand out.",
    'jackets': "Essentials jackets combine premium materials with bold streetwear designs. From leather jackets to track jackets, each piece features the brand's signature aesthetic and quality craftsmanship.",
    'jeans': "Essentials jeans feature unique designs with raw edges and airbrushed details. Made with premium denim, these jeans offer both style and durability for the modern streetwear enthusiast.",
    'beanies': "Stay warm and stylish with Essentials beanies. Featuring the brand's signature designs and premium materials, these beanies are the perfect accessory for any streetwear outfit.",
    'hats': "From snapback hats to fitted caps, Essentials offers a wide range of headwear. Each hat features unique designs, premium materials, and the brand's distinctive streetwear aesthetic.",
    'ski-masks': "Essentials ski masks combine functionality with streetwear style. Perfect for cold weather and making a bold fashion statement.",
    'long-sleeves': "Essentials long sleeve shirts offer comfort and style with the brand's signature designs. Perfect for layering or wearing on their own.",
    'sweaters': "Essentials sweaters provide warmth and style with premium materials and distinctive designs. Perfect for the colder months.",
    'pants': "Essentials pants combine comfort and style with the brand's signature aesthetic. From track pants to casual wear, each piece offers quality and design.",
    'bags': "Complete your streetwear look with Essentials bags. From cross-body bags to backpacks, each piece features the brand's iconic logos and premium quality.",
    'collaborations': "Exclusive Essentials collaborations featuring unique designs and limited edition pieces from special partnerships.",
    'sweatshirts': "Essentials sweatshirts offer comfort and style with premium materials and distinctive designs. Perfect for layering or wearing on their own, these crewneck sweatshirts are a wardrobe essential."
  }

  const description = categoryDescriptions[category] || ''

  // Structured data for category page
  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Essentials Official`,
    description: description,
    url: `https://essentialsjacket.com/${category}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: allProducts.length,
      itemListElement: allProducts.slice(0, 10).map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: product.title,
          url: `https://essentialsjacket.com/${product.slug}`,
          image: product.image.startsWith('http') ? product.image : `https://essentialsjacket.com${product.image}`,
          brand: {
            '@type': 'Brand',
            name: 'Essentials'
          },
          offers: {
            '@type': 'Offer',
            price: product.discountPrice || product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }
      }))
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">{categoryName}</h1>
          <p className="text-gray-400 mb-3 md:mb-6 text-sm md:text-base">{allProducts.length} products available</p>
        </div>

        {/* Essentials Products Section */}
        {essentialsProducts.length > 0 && (
          <section className="mb-16 md:mb-20">
            <ProductGrid products={essentialsProducts} />
            {description && (
              <div className="mt-8">
                <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">{description}</p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  )
}
