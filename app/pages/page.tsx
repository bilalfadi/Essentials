import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pages - Essentials Official | Essentials Jacket',
  description: 'Browse all pages on Essentials Official. Find information about authenticity, sizing, FAQs, customer care, and more.',
  keywords: 'Essentials pages, all pages, site pages, navigation',
  openGraph: {
    title: 'Pages - Essentials Official',
    description: 'Browse all pages on Essentials Official.',
    url: 'https://essentialsjacket.com/pages',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/pages',
  },
}

const allPages = [
  {
    category: 'Information',
    pages: [
      { name: 'About Us', href: '/about-us', description: 'Learn about Essentials Official - our story, mission, and commitment to quality.' },
      { name: 'Contact Us', href: '/contact-us', description: 'Get in touch with us for questions, support, or inquiries.' },
    ],
  },
  {
    category: 'Customer Service',
    pages: [
      { name: 'Customer Care', href: '/customer-care', description: 'Customer care and support for all your needs.' },
      { name: 'FAQ', href: '/faq', description: 'Frequently asked questions and answers about our products and services.' },
      { name: 'Size Guides', href: '/size-guides', description: 'Find the perfect fit with our comprehensive size guides.' },
      { name: 'Authenticity Service', href: '/authenticity-service', description: 'Verify the authenticity of your Essentials products.' },
    ],
  },
  {
    category: 'Policies',
    pages: [
      { name: 'Shipping Policy', href: '/shipping-policy', description: 'Learn about shipping options, processing times, and delivery information.' },
      { name: 'Return & Exchange', href: '/return-exchange', description: 'Our return and exchange policy and procedures.' },
      { name: 'Refund & Cancellation', href: '/refund-cancellation', description: 'Information about refunds and order cancellations.' },
      { name: 'Privacy Policy', href: '/privacy-policy', description: 'Our privacy policy and how we handle your data.' },
    ],
  },
  {
    category: 'Shopping',
    pages: [
      { name: 'Shop', href: '/store', description: 'Browse our complete collection of Essentials products.' },
      { name: 'Hoodies', href: '/hoodies', description: 'Shop Essentials hoodies collection.' },
      { name: 'T-Shirts', href: '/t-shirts', description: 'Shop Essentials t-shirts collection.' },
      { name: 'Jackets', href: '/jackets', description: 'Shop Essentials jackets collection.' },
      { name: 'Sweatshirts', href: '/sweatshirts', description: 'Shop Essentials sweatshirts collection.' },
      { name: 'Tracksuits', href: '/tracksuits', description: 'Shop Essentials tracksuits collection.' },
      { name: 'Sweatpants', href: '/sweatpants', description: 'Shop Essentials sweatpants collection.' },
      { name: 'Shorts', href: '/shorts', description: 'Shop Essentials shorts collection.' },
    ],
  },
]

export default function PagesListed() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-4">All Pages</h1>
      <p className="text-gray-400 text-lg mb-12">
        Browse all available pages on Essentials Official. Find information, policies, and shop our collections.
      </p>

      <div className="space-y-12">
        {allPages.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-2xl font-semibold text-white mb-6">{category.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.pages.map((page, pageIndex) => (
                <Link
                  key={pageIndex}
                  href={page.href}
                  className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-white transition-colors group"
                >
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {page.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {page.description}
                  </p>
                  <div className="mt-4 flex items-center text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Visit Page
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-3">Can't Find What You're Looking For?</h3>
        <p className="text-gray-400 mb-4">
          If you need additional help or have questions, our customer service team is here to assist you.
        </p>
        <Link
          href="/contact-us"
          className="inline-block bg-white text-black px-6 py-3 rounded-md font-semibold hover:bg-gray-200 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}

