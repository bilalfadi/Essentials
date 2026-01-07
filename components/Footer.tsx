import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Warehouse */}
          <div>
            <h4 className="text-white font-medium mb-4">Warehouse</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              1218 S Glendale Ave, Suite 132, Glendale,<br />
              CA 91205<br />
              United States
            </p>
          </div>

          {/* Collection */}
          <div>
            <h4 className="text-white font-medium mb-4">Collection</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/store" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/hoodies" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Hoodie
                </Link>
              </li>
              <li>
                <Link href="/t-shirts" className="text-gray-400 hover:text-white text-sm transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/tracksuits" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Tracksuits
                </Link>
              </li>
              <li>
                <Link href="/sweatpants" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sweatpants
                </Link>
              </li>
              <li>
                <Link href="/shorts" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Shorts
                </Link>
              </li>
              <li>
                <Link href="/sweatshirts" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Sweatshirts
                </Link>
              </li>
              <li>
                <Link href="/pants" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Pants
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/return-exchange" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Return & Exchange
                </Link>
              </li>
              <li>
                <Link href="/refund-cancellation" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/authenticity-service" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Authenticity Service
                </Link>
              </li>
              <li>
                <Link href="/size-guides" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Size Guides
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/customer-care" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Customer Care
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-medium mb-4">Newsletter</h4>
            <form className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white border border-gray-800"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white border border-gray-800"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-white text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-200 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-900">
          <p className="text-gray-400 text-sm text-center">
            Essentials Official {new Date().getFullYear()} - Premium Streetwear Collection
          </p>
        </div>
      </div>
    </footer>
  )
}
