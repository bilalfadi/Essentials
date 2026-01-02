import { getProductsByCategoryAndBrand } from '@/lib/products'
import ProductGrid from '@/components/ProductGrid'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  // Get Essentials products by category for homepage sections (ordered by product count)
  const hoodies = getProductsByCategoryAndBrand('hoodies', 'essentials').slice(0, 8)
  const tshirts = getProductsByCategoryAndBrand('t-shirts', 'essentials').slice(0, 8)
  const jackets = getProductsByCategoryAndBrand('jackets', 'essentials').slice(0, 8)
  const sweatshirts = getProductsByCategoryAndBrand('sweatshirts', 'essentials').slice(0, 8)
  const tracksuits = getProductsByCategoryAndBrand('tracksuits', 'essentials').slice(0, 8)
  const sweatpants = getProductsByCategoryAndBrand('sweatpants', 'essentials').slice(0, 8)
  const shorts = getProductsByCategoryAndBrand('shorts', 'essentials').slice(0, 8)

  return (
    <>
      {/* Hero Section - Promotional Banner */}
      <section className="relative w-full bg-black border-b border-gray-900">
        <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
          <Image
            src="/Essentials.jpeg"
            alt="Essentials Official Hero"
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* Category Sections - Essentials Categories */}
      <div id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hoodies - 42 products */}
        {hoodies.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Hoodies</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials hoodies are known for their blend of premium quality, striking graphics, and streetwear credibility. A badge of style for those who appreciate bold design and exceptional craftsmanship.
                </p>
              </div>
            </div>
            <ProductGrid products={hoodies} />
          </section>
        )}

        {/* T-Shirts - 33 products */}
        {tshirts.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials T-Shirts</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials T-shirts feature bold graphics and premium quality materials. The designs carry real weight—metaphorically and physically. Made with durable cotton that stands the test of time.
                </p>
              </div>
            </div>
            <ProductGrid products={tshirts} />
          </section>
        )}

        {/* Jackets - 20 products */}
        {jackets.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Jackets</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials jackets combine premium materials with bold streetwear designs. From leather jackets to track jackets, each piece features the brand's signature aesthetic and quality craftsmanship.
                </p>
              </div>
            </div>
            <ProductGrid products={jackets} />
          </section>
        )}

        {/* Sweatshirts - 15 products */}
        {sweatshirts.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Sweatshirts</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials sweatshirts offer comfort and style with premium materials and distinctive designs. Perfect for layering or wearing on their own, these crewneck sweatshirts are a wardrobe essential.
                </p>
              </div>
            </div>
            <ProductGrid products={sweatshirts} />
          </section>
        )}

        {/* Tracksuits - 13 products */}
        {tracksuits.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Tracksuits</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials tracksuits combine premium comfort with bold streetwear design. The brand's edgy graphics, quality materials, and limited releases make them a must-have for streetwear enthusiasts.
                </p>
              </div>
            </div>
            <ProductGrid products={tracksuits} />
          </section>
        )}

        {/* Sweatpants - 10 products */}
        {sweatpants.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Sweatpants</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials sweatpants combine comfort, toughness, and edge in a way that fits today's culture. Consistent design, quality materials, and that signature Essentials aesthetic make these sweatpants more than just loungewear—they're a statement piece.
                </p>
              </div>
            </div>
            <ProductGrid products={sweatpants} />
          </section>
        )}

        {/* Shorts - 9 products */}
        {shorts.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Essentials Shorts</h2>
              <div className="max-w-4xl">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                  Essentials shorts are made with streetwear culture in mind. They feature eye-catching graphic prints, high-quality materials, and a distinct relaxed fit that will make you stand out.
                </p>
              </div>
            </div>
            <ProductGrid products={shorts} />
          </section>
        )}

      </div>

      {/* Essentials Overview Section - After Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <section className="mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 md:mb-8">Essentials Overview</h2>
          <div className="text-gray-300 space-y-5 md:space-y-6 max-w-4xl text-base md:text-lg leading-relaxed">
            <p>
              Essentials is a streetwear brand that has been making waves in the fashion industry. The brand combines bold designs with premium quality, creating pieces that stand out in the streetwear scene.
            </p>
            <p>
              Known for their distinctive aesthetic and high-quality materials, Essentials offers a range of products including jackets, hoodies, t-shirts, shorts, and accessories. Each piece reflects the brand's commitment to style and quality.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
