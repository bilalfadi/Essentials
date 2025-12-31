export default function ShippingPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Shipping Policy</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-4">
          <p>
            We ship worldwide from our warehouse in Glendale, California. Here's everything you need to know about shipping.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Shipping Options</h2>
          <p>
            We offer various shipping options to meet your needs. Shipping costs and delivery times vary by location.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Processing Time</h2>
          <p>
            Orders are typically processed within 1-3 business days. During peak seasons, processing may take longer.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">International Shipping</h2>
          <p>
            We ship internationally. Shipping costs and delivery times vary by destination. Customs and import duties may apply.
          </p>
          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Tracking</h2>
          <p>
            Once your order ships, you'll receive a tracking number via email to monitor your package's journey.
          </p>
        </div>
      </div>
    </div>
  )
}

