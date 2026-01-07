import { getProductsByCategoryAndBrand, getProductsByCategoryAndBrandSync } from '@/lib/products'
import ProductGrid from '@/components/ProductGrid'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Essentials Official - Premium Streetwear Collection | Essentials Jacket',
  description: 'Shop Essentials Official premium streetwear collection. Browse hoodies, t-shirts, jackets, tracksuits, and more. High-quality Essentials clothing with bold designs.',
  keywords: 'Essentials Official, Essentials clothing, Essentials hoodies, Essentials t-shirts, Essentials jackets, streetwear, premium clothing, Essentials tracksuits',
  openGraph: {
    title: 'Essentials Official - Premium Streetwear Collection',
    description: 'Shop Essentials Official premium streetwear collection. Browse hoodies, t-shirts, jackets, tracksuits, and more.',
    url: 'https://essentialsjacket.com',
    siteName: 'Essentials Official',
    type: 'website',
    images: [
      {
        url: 'https://essentialsjacket.com/Essentials.jpeg',
        alt: 'Essentials Official',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Essentials Official - Premium Streetwear Collection',
    description: 'Shop Essentials Official premium streetwear collection.',
    images: ['https://essentialsjacket.com/Essentials.jpeg'],
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/',
  },
}

export default async function Home() {
  // Get Essentials products by category for homepage sections (ordered by product count)
  // Try WooCommerce first, fallback to local data
  const hoodies = (await getProductsByCategoryAndBrand('hoodies', 'essentials') || []).slice(0, 8)
  const tshirts = (await getProductsByCategoryAndBrand('t-shirts', 'essentials') || []).slice(0, 8)
  const jackets = (await getProductsByCategoryAndBrand('jackets', 'essentials') || []).slice(0, 8)
  const sweatshirts = (await getProductsByCategoryAndBrand('sweatshirts', 'essentials') || []).slice(0, 8)
  const tracksuits = (await getProductsByCategoryAndBrand('tracksuits', 'essentials') || []).slice(0, 8)
  const sweatpants = (await getProductsByCategoryAndBrand('sweatpants', 'essentials') || []).slice(0, 8)
  const shorts = (await getProductsByCategoryAndBrand('shorts', 'essentials') || []).slice(0, 8)

  // Structured data for homepage
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Essentials Official',
    url: 'https://essentialsjacket.com',
    description: 'Premium streetwear collection from Essentials Official',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://essentialsjacket.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Essentials Official',
    url: 'https://essentialsjacket.com',
    logo: 'https://essentialsjacket.com/Essentials.jpeg',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@essentialsclothing.us'
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1218 S Glendale Ave, Suite 132',
      addressLocality: 'Glendale',
      addressRegion: 'CA',
      postalCode: '91205',
      addressCountry: 'US'
    }
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Hoodies</h2>
                <Link href="/hoodies" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials T-Shirts</h2>
                <Link href="/t-shirts" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Jackets</h2>
                <Link href="/jackets" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Sweatshirts</h2>
                <Link href="/sweatshirts" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Tracksuits</h2>
                <Link href="/tracksuits" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Sweatpants</h2>
                <Link href="/sweatpants" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">Essentials Shorts</h2>
                <Link href="/shorts" className="text-white hover:text-gray-300 text-sm md:text-base font-medium underline">
                  View All
                </Link>
              </div>
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
