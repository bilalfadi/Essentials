import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy - Essentials Official | Essentials Jacket',
  description: 'Essentials Official refund and cancellation policy. Learn about our cancellation process, refund policy, and processing times.',
  keywords: 'Essentials refund, cancellation policy, refund policy',
  openGraph: {
    title: 'Refund & Cancellation Policy - Essentials Official',
    description: 'Essentials Official refund and cancellation policy.',
    url: 'https://essentialsjacket.com/refund-cancellation',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/refund-cancellation',
  },
}

export default function RefundCancellation() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Refund & Cancellation</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-4">
          <p>
            We understand that sometimes you may need to cancel an order or request a refund. Here's our policy on refunds and cancellations.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Cancellation Policy</h2>
          <p>
            Orders can be cancelled within 24 hours of placement, before the item has been shipped. Once shipped, standard return policy applies.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Refund Policy</h2>
          <p>
            Refunds will be processed to the original payment method within 5-10 business days after we receive and inspect the returned item.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Processing Time</h2>
          <p>
            Refunds typically take 5-10 business days to appear in your account, depending on your payment provider.
          </p>
        </div>
      </div>
    </div>
  )
}

