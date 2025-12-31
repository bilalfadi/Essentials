import { getAllProducts, getProductsByCategory } from '@/lib/products'
import ProductGrid from '@/components/ProductGrid'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const allProducts = getAllProducts()
  
  // Get products by category for homepage sections
  const hoodies = getProductsByCategory('hoodies').slice(0, 8)
  const tshirts = getProductsByCategory('t-shirts').slice(0, 8)
  const tracksuits = getProductsByCategory('tracksuits').slice(0, 8)
  const sweatpants = getProductsByCategory('sweatpants').slice(0, 8)
  const shorts = getProductsByCategory('shorts').slice(0, 8)
  const jackets = getProductsByCategory('jackets').slice(0, 8)
  const beanies = getProductsByCategory('beanies').slice(0, 8)
  const hats = getProductsByCategory('hats').slice(0, 8)

  return (
    <>
      {/* Hero Section - Promotional Banner */}
      <section className="relative w-full bg-black border-b border-gray-900">
        <div className="relative w-full" style={{ height: '70vh', minHeight: '500px' }}>
          <Image
            src="/cc.jpg"
            alt="Hellstar Studio Hero"
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* Category Sections */}
      <div id="collections" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Hoodies</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed mb-3">
              The Hellstar hoodie's popularity comes from its blend of premium quality, striking graphics, and streetwear credibility. It is a badge of style for the brave, as celebrities, rappers, and influencers have been spotted wearing these distinctive pieces.
            </p>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              When you're hunting for a hoodie, quality is king. Hellstar hoodies have been making waves, but are they really worth the hype? I've taken a deep dive into what makes these hoodies tick. They cost more than your average hoodie, but the craftsmanship and design speak for themselves.
            </p>
          </div>
          <ProductGrid products={hoodies} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Shirts</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Hellstar is not an established brand. The loudness of their T-shirts is not childish. The designs carry some real weight—metaphorically and physically. It is not thin cotton that deteriorates after two washes.
            </p>
          </div>
          <ProductGrid products={tshirts} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Sweatsuits</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Hellstar tracksuits are popular because they are both fashion-forward and wearable because they combine premium comfort with bold streetwear design. The brand's edgy graphics, quality materials, and limited releases make them a must-have for streetwear.
            </p>
          </div>
          <ProductGrid products={tracksuits} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Sweatpants</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Hellstar Sweatpants' Rebirth. Because they combine comfort, toughness, and edge in a way that fits today's culture, Hellstar sweatpants have become a must-have for streetwear. Consistent design, quality materials, and that signature Hellstar aesthetic make these sweatpants more than just loungewear—they're a statement piece.
            </p>
          </div>
          <ProductGrid products={sweatpants} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Shorts</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Hellstar Shorts are athletic shorts of high quality made with streetwear culture in mind. They frequently have eye-catching graphic prints, high-quality materials, and a distinct relaxed fit that will make you stand out.
            </p>
          </div>
          <ProductGrid products={shorts} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Jackets</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Hellstar jackets combine premium materials with bold streetwear designs. From leather jackets to track jackets, each piece features the brand's signature aesthetic and quality craftsmanship.
            </p>
          </div>
          <ProductGrid products={jackets} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Beanies</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              Stay warm and stylish with Hellstar beanies. Featuring the brand's iconic logos and designs, these beanies are perfect for completing your streetwear look.
            </p>
          </div>
          <ProductGrid products={beanies} />
        </section>

        <section className="mb-12 md:mb-20">
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3">Hellstar Hats</h2>
            <p className="text-gray-400 max-w-3xl text-sm md:text-base leading-relaxed">
              From snapback hats to fitted caps, Hellstar offers a wide range of headwear. Each hat features unique designs, premium materials, and the brand's distinctive streetwear aesthetic.
            </p>
          </div>
          <ProductGrid products={hats} />
        </section>
      </div>

      {/* Hellstar Overview Section - After Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">Hellstar Overview</h2>
          <div className="text-gray-400 space-y-3 md:space-y-4 max-w-4xl text-sm md:text-base leading-relaxed">
            <p>
              The Streetwear Brand Taking Over Your Wardrobe Is Hellstar. Hellstar is probably showing up everywhere if you've been browsing fashion websites or Instagram in recent times. The company does not dominate the streetwear scene by accident—it's built on a foundation of bold design, premium quality, and a unique aesthetic that speaks to a generation looking for something different.
            </p>
            <p>
              Hellstar is an alternative streetwear brand mixing dark, rebellious cyberpunk and Christian-inspired themes. Founded in 2020 by Sean Holland and Joseph Pendleton, it's about "finding stars in hell".
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
