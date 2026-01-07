import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Care - Essentials Official | Essentials Jacket',
  description: 'Customer care and support for Essentials Official. Get help with orders, returns, product questions, and more. We\'re here to help.',
  keywords: 'Essentials customer care, Essentials support, customer service, help center',
  openGraph: {
    title: 'Customer Care - Essentials Official',
    description: 'Customer care and support for Essentials Official.',
    url: 'https://essentialsjacket.com/customer-care',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/customer-care',
  },
}

export default function CustomerCare() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Customer Care</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-6">
          <p className="text-lg">
            At Essentials Official, your satisfaction is our priority. Our dedicated customer care team is here to assist you with any questions, concerns, or support you may need.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How Can We Help?</h2>
          <p>
            Whether you need assistance with an order, have questions about our products, or need help with returns and exchanges, we're here for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Order Support</h3>
              <p className="mb-4">
                Need help with your order? Track shipments, update addresses, or get information about order status.
              </p>
              <a
                href="/contact-us"
                className="text-white hover:underline font-medium"
              >
                Get Order Help →
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Returns & Exchanges</h3>
              <p className="mb-4">
                Questions about returns or exchanges? We'll help you process returns and find the perfect size or style.
              </p>
              <a
                href="/return-exchange"
                className="text-white hover:underline font-medium"
              >
                Learn More →
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Product Information</h3>
              <p className="mb-4">
                Have questions about sizing, materials, or product details? Check our guides or contact us.
              </p>
              <a
                href="/size-guides"
                className="text-white hover:underline font-medium"
              >
                View Size Guides →
              </a>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Account Support</h3>
              <p className="mb-4">
                Need help with your account, password reset, or account settings? We're here to assist.
              </p>
              <a
                href="/contact-us"
                className="text-white hover:underline font-medium"
              >
                Get Account Help →
              </a>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Information</h2>
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Email Support</h3>
                <p className="text-gray-400">
                  <a href="mailto:support@essentialsclothing.us" className="text-white hover:underline">
                    support@essentialsclothing.us
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-1">We typically respond within 24-48 hours</p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Warehouse Address</h3>
                <p className="text-gray-400">
                  1218 S Glendale Ave, Suite 132<br />
                  Glendale, CA 91205<br />
                  United States
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Customer Service Hours</h3>
                <p className="text-gray-400">
                  Monday - Friday: 9:00 AM - 5:00 PM PST<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Common Topics</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="text-white mr-3">•</span>
              <div>
                <a href="/shipping-policy" className="text-white hover:underline font-medium">
                  Shipping Information
                </a>
                <p className="text-gray-500 text-sm">Learn about shipping options, delivery times, and tracking</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-white mr-3">•</span>
              <div>
                <a href="/return-exchange" className="text-white hover:underline font-medium">
                  Returns & Exchanges
                </a>
                <p className="text-gray-500 text-sm">Our return policy and how to process returns</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-white mr-3">•</span>
              <div>
                <a href="/size-guides" className="text-white hover:underline font-medium">
                  Size Guides
                </a>
                <p className="text-gray-500 text-sm">Find the perfect fit with our sizing charts</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-white mr-3">•</span>
              <div>
                <a href="/faq" className="text-white hover:underline font-medium">
                  Frequently Asked Questions
                </a>
                <p className="text-gray-500 text-sm">Answers to common questions</p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-white mr-3">•</span>
              <div>
                <a href="/authenticity-service" className="text-white hover:underline font-medium">
                  Authenticity Service
                </a>
                <p className="text-gray-500 text-sm">Verify the authenticity of your products</p>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Get in Touch</h2>
          <p>
            Have a question that isn't covered here? We'd love to hear from you. Use the form on our Contact Us page or email us directly.
          </p>
          <div className="mt-6">
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

