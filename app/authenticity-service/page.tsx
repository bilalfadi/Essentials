import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Authenticity Service - Essentials Official | Essentials Jacket',
  description: 'Verify the authenticity of your Essentials products. Learn how to identify genuine Essentials items and protect yourself from counterfeits.',
  keywords: 'Essentials authenticity, verify Essentials, genuine Essentials, authentic Essentials products',
  openGraph: {
    title: 'Authenticity Service - Essentials Official',
    description: 'Verify the authenticity of your Essentials products.',
    url: 'https://essentialsjacket.com/authenticity-service',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/authenticity-service',
  },
}

export default function AuthenticityService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Authenticity Service</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-6">
          <p className="text-lg">
            At Essentials Official, we are committed to ensuring you receive only authentic, genuine products. We understand the importance of authenticity and have implemented strict measures to guarantee the quality and legitimacy of every item we sell.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How to Verify Authenticity</h2>
          <p>
            All authentic Essentials products come with specific features and identifiers that help you verify their authenticity:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Official Essentials branding and labels</li>
            <li>Quality materials and construction</li>
            <li>Proper packaging and tags</li>
            <li>Unique product codes and serial numbers where applicable</li>
            <li>Purchase from authorized retailers only</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">What We Guarantee</h2>
          <p>
            When you purchase from Essentials Official, you can be confident that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>All products are 100% authentic and genuine</li>
            <li>Items are sourced directly from authorized suppliers</li>
            <li>Quality is guaranteed with our authenticity promise</li>
            <li>Full support for any authenticity concerns</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Reporting Counterfeits</h2>
          <p>
            If you suspect you have received a counterfeit product or have concerns about authenticity, please contact us immediately. We take counterfeiting seriously and will investigate any reports.
          </p>
          <p>
            Contact our authenticity team at: <a href="mailto:support@essentialsclothing.us" className="text-white hover:underline">support@essentialsclothing.us</a>
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Why Authenticity Matters</h2>
          <p>
            Purchasing authentic Essentials products ensures you receive:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Premium quality materials and craftsmanship</li>
            <li>Proper fit and sizing as designed</li>
            <li>Durability and longevity</li>
            <li>Support from our customer service team</li>
            <li>Warranty and return policies</li>
          </ul>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-3">Need Help Verifying Your Product?</h3>
            <p className="mb-4">
              If you have questions about the authenticity of your Essentials product, our team is here to help. Reach out to us with photos and details, and we'll assist you in verifying your item.
            </p>
            <a
              href="/contact-us"
              className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

