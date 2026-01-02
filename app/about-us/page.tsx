import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Essentials Official | Essentials Jacket',
  description: 'Learn about Essentials Official - Premium streetwear brand combining bold designs with premium quality. Our mission, story, and commitment to quality.',
  keywords: 'Essentials about us, Essentials brand story, Essentials mission, streetwear brand',
  openGraph: {
    title: 'About Us - Essentials Official',
    description: 'Learn about Essentials Official - Premium streetwear brand.',
    url: 'https://essentialsjacket.com/about-us',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/about-us',
  },
}

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">About Us</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-4">
          <p>
            Essentials is a streetwear brand that has been making waves in the fashion industry. The brand combines bold designs with premium quality, creating pieces that stand out in the streetwear scene.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Story</h2>
          <p>
            We started with a vision to create premium streetwear that stands out from the crowd. Our designs blend bold aesthetics with quality craftsmanship.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Our Mission</h2>
          <p>
            To deliver unique, high-quality streetwear that represents individuality and self-expression. Every piece is designed with attention to detail and made to last.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Quality First</h2>
          <p>
            We use premium materials and handcrafted production to ensure every item meets our high standards. Our clothing is made to be worn, not just collected.
          </p>
        </div>
      </div>
    </div>
  )
}

