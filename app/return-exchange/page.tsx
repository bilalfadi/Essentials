import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Return & Exchange Policy - Essentials Official | Essentials Jacket',
  description: 'Essentials Official return and exchange policy. Learn how to return or exchange items, return conditions, and processing information.',
  keywords: 'Essentials return, exchange policy, return policy',
  openGraph: {
    title: 'Return & Exchange Policy - Essentials Official',
    description: 'Essentials Official return and exchange policy.',
    url: 'https://essentialsjacket.com/return-exchange',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/return-exchange',
  },
}

export default function ReturnExchange() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Return & Exchange</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-4">
          <p>
            We want you to be completely satisfied with your purchase. If you're not happy with your order, we're here to help.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Return Policy</h2>
          <p>
            Items can be returned within 30 days of purchase, provided they are in original condition with tags attached.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Exchange Policy</h2>
          <p>
            Exchanges are available for different sizes or colors, subject to availability. Please contact us to initiate an exchange.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How to Return</h2>
          <p>
            1. Contact our customer service team<br />
            2. Receive a return authorization<br />
            3. Ship the item back to our warehouse<br />
            4. Receive your refund or exchange
          </p>
        </div>
      </div>
    </div>
  )
}

