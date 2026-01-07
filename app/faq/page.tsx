import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ - Essentials Official | Essentials Jacket',
  description: 'Frequently asked questions about Essentials Official. Find answers about products, shipping, returns, sizing, and more.',
  keywords: 'Essentials FAQ, Essentials questions, Essentials help, Essentials support',
  openGraph: {
    title: 'FAQ - Essentials Official',
    description: 'Frequently asked questions about Essentials Official.',
    url: 'https://essentialsjacket.com/faq',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/faq',
  },
}

export default function FAQ() {
  const faqs = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Shipping times vary by location. Domestic orders typically arrive within 5-7 business days, while international orders may take 10-21 business days. You will receive a tracking number once your order ships.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes, we ship worldwide. International shipping costs and delivery times vary by destination. Customs and import duties may apply depending on your location.',
        },
        {
          q: 'How can I track my order?',
          a: 'Once your order ships, you will receive an email with a tracking number. You can use this number to track your package on the carrier\'s website.',
        },
        {
          q: 'Can I change or cancel my order?',
          a: 'If you need to change or cancel your order, please contact us immediately. We process orders quickly, so changes must be requested as soon as possible. Once an order has shipped, it cannot be cancelled.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition with tags attached. Please see our Return & Exchange page for full details.',
        },
        {
          q: 'How do I return an item?',
          a: 'To initiate a return, please contact our customer service team. We will provide you with a return authorization and instructions. Returns must be sent to our warehouse address.',
        },
        {
          q: 'Do you offer exchanges?',
          a: 'Yes, we offer exchanges for different sizes or colors, subject to availability. Please contact us to arrange an exchange.',
        },
        {
          q: 'How long does it take to process a refund?',
          a: 'Once we receive your returned item, refunds are typically processed within 5-7 business days. The refund will be issued to your original payment method.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          q: 'How do I know what size to order?',
          a: 'Please refer to our Size Guides page for detailed measurements and sizing information. If you\'re between sizes, we recommend sizing up for a more comfortable fit.',
        },
        {
          q: 'Are your products authentic?',
          a: 'Yes, all products sold on Essentials Official are 100% authentic and genuine. We source directly from authorized suppliers. Please see our Authenticity Service page for more information.',
        },
        {
          q: 'What materials are used in Essentials products?',
          a: 'Essentials products are made from premium materials including high-quality cotton, polyester blends, and other premium fabrics. Specific material information is available on each product page.',
        },
        {
          q: 'Do you restock sold-out items?',
          a: 'We do our best to restock popular items, but availability cannot be guaranteed. Sign up for our newsletter to be notified when items are back in stock.',
        },
      ],
    },
    {
      category: 'Payment & Security',
      questions: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, PayPal, and other secure payment methods. All transactions are processed securely.',
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes, we use industry-standard encryption and secure payment processing to protect your information. We never store your full payment details.',
        },
        {
          q: 'Do you charge sales tax?',
          a: 'Sales tax is applied based on your shipping address and local tax regulations. The final amount will be shown at checkout.',
        },
      ],
    },
    {
      category: 'Account & Support',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'You can create an account during checkout or by clicking the account icon in the navigation. Having an account allows you to track orders and save your information.',
        },
        {
          q: 'How can I contact customer service?',
          a: 'You can reach us via email at support@essentialsclothing.us or through our Contact Us page. We typically respond within 24-48 hours.',
        },
        {
          q: 'What are your customer service hours?',
          a: 'Our customer service team is available Monday through Friday, 9 AM to 5 PM PST. We aim to respond to all inquiries within 24-48 hours.',
        },
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Frequently Asked Questions</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-8">
          <p className="text-lg">
            Find answers to the most common questions about Essentials Official. If you don't find what you're looking for, please don't hesitate to contact us.
          </p>

          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">{section.category}</h2>
              <div className="space-y-6">
                {section.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-semibold text-white mb-2">{faq.q}</h3>
                    <p className="text-gray-400">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-3">Still Have Questions?</h3>
            <p className="mb-4">
              Can't find the answer you're looking for? Our customer service team is here to help. Reach out to us and we'll get back to you as soon as possible.
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

