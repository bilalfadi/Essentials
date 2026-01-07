import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guides - Essentials Official | Essentials Jacket',
  description: 'Find the perfect fit with our comprehensive size guides for Essentials clothing. Measurements, sizing charts, and fit information for all products.',
  keywords: 'Essentials size guide, Essentials sizing, size chart, fit guide, measurements',
  openGraph: {
    title: 'Size Guides - Essentials Official',
    description: 'Find the perfect fit with our comprehensive size guides.',
    url: 'https://essentialsjacket.com/size-guides',
    siteName: 'Essentials Official',
    type: 'website',
  },
  alternates: {
    canonical: 'https://essentialsjacket.com/size-guides',
  },
}

export default function SizeGuides() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Size Guides</h1>
      <div className="prose prose-invert max-w-none">
        <div className="text-gray-400 space-y-6">
          <p className="text-lg">
            Finding the perfect fit is essential. Use our size guides below to ensure you select the right size for your Essentials products. All measurements are in inches and are approximate.
          </p>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How to Measure</h2>
          <p>
            For the most accurate fit, measure yourself while wearing lightweight clothing:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, under your arms</li>
            <li><strong>Waist:</strong> Measure around your natural waistline</li>
            <li><strong>Hips:</strong> Measure around the fullest part of your hips</li>
            <li><strong>Length:</strong> Measure from the top of the shoulder to the desired length</li>
            <li><strong>Sleeve:</strong> Measure from the shoulder seam to the wrist</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Tops & Hoodies</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700 mt-4">
              <thead>
                <tr className="bg-gray-900">
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Size</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Chest (inches)</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Length (inches)</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Sleeve (inches)</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr>
                  <td className="border border-gray-700 px-4 py-3">S</td>
                  <td className="border border-gray-700 px-4 py-3">36-38</td>
                  <td className="border border-gray-700 px-4 py-3">27</td>
                  <td className="border border-gray-700 px-4 py-3">25</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3">M</td>
                  <td className="border border-gray-700 px-4 py-3">40-42</td>
                  <td className="border border-gray-700 px-4 py-3">28</td>
                  <td className="border border-gray-700 px-4 py-3">26</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3">L</td>
                  <td className="border border-gray-700 px-4 py-3">44-46</td>
                  <td className="border border-gray-700 px-4 py-3">29</td>
                  <td className="border border-gray-700 px-4 py-3">27</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3">XL</td>
                  <td className="border border-gray-700 px-4 py-3">48-50</td>
                  <td className="border border-gray-700 px-4 py-3">30</td>
                  <td className="border border-gray-700 px-4 py-3">28</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3">XXL</td>
                  <td className="border border-gray-700 px-4 py-3">52-54</td>
                  <td className="border border-gray-700 px-4 py-3">31</td>
                  <td className="border border-gray-700 px-4 py-3">29</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Bottoms & Pants</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700 mt-4">
              <thead>
                <tr className="bg-gray-900">
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Size</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Waist (inches)</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Hip (inches)</th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-white font-semibold">Inseam (inches)</th>
                </tr>
              </thead>
              <tbody className="text-gray-400">
                <tr>
                  <td className="border border-gray-700 px-4 py-3">S</td>
                  <td className="border border-gray-700 px-4 py-3">30-32</td>
                  <td className="border border-gray-700 px-4 py-3">36-38</td>
                  <td className="border border-gray-700 px-4 py-3">30</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3">M</td>
                  <td className="border border-gray-700 px-4 py-3">34-36</td>
                  <td className="border border-gray-700 px-4 py-3">40-42</td>
                  <td className="border border-gray-700 px-4 py-3">31</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3">L</td>
                  <td className="border border-gray-700 px-4 py-3">38-40</td>
                  <td className="border border-gray-700 px-4 py-3">44-46</td>
                  <td className="border border-gray-700 px-4 py-3">32</td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="border border-gray-700 px-4 py-3">XL</td>
                  <td className="border border-gray-700 px-4 py-3">42-44</td>
                  <td className="border border-gray-700 px-4 py-3">48-50</td>
                  <td className="border border-gray-700 px-4 py-3">33</td>
                </tr>
                <tr>
                  <td className="border border-gray-700 px-4 py-3">XXL</td>
                  <td className="border border-gray-700 px-4 py-3">46-48</td>
                  <td className="border border-gray-700 px-4 py-3">52-54</td>
                  <td className="border border-gray-700 px-4 py-3">34</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Fit Notes</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Essentials products are designed with a relaxed, comfortable fit</li>
            <li>If you're between sizes, we recommend sizing up for a looser fit</li>
            <li>All measurements are body measurements, not garment measurements</li>
            <li>Some items may have a slightly oversized fit by design</li>
            <li>For specific product fit information, check individual product pages</li>
          </ul>

          <h2 className="text-2xl font-semibold text-white mt-8 mb-4">International Sizing</h2>
          <p>
            Our size chart corresponds to US sizing. For international customers:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>UK:</strong> Same as US sizing</li>
            <li><strong>EU:</strong> Typically one size larger (e.g., US M = EU L)</li>
            <li><strong>Asia:</strong> Typically one size smaller (e.g., US M = Asia L)</li>
          </ul>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mt-8">
            <h3 className="text-xl font-semibold text-white mb-3">Still Unsure About Your Size?</h3>
            <p className="mb-4">
              If you need help determining your size or have questions about fit, our customer service team is here to assist you.
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

