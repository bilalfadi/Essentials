'use client'

import Link from 'next/link'

interface Product {
  id: number
  title: string
  slug: string
  category: string
  price: number
  discountPrice: number | null
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calculate discount percentage
  const discountPercent = product.discountPrice && product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : null

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden bg-gray-900 rounded-lg">
        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2 left-2 z-10 bg-black text-white px-2 py-1 text-xs font-bold">
            {discountPercent}%
          </div>
        )}

        {/* Product Image */}
        <div className="relative w-full aspect-square bg-gray-800 overflow-hidden">
          <img
            src={product.image || ''}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              console.error('Image failed to load:', product.image);
              // Show placeholder instead of hiding
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23333" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>

        {/* Product Info */}
        <div className="p-3 md:p-4">
          <h3 className="text-white font-medium mb-2 text-sm md:text-base group-hover:text-gray-300 transition-colors line-clamp-2">
            {product.title}
          </h3>
          <div className="flex items-center space-x-2">
            {product.discountPrice ? (
              <>
                <span className="text-white font-semibold text-sm md:text-base">${product.discountPrice.toFixed(2)}</span>
                <span className="text-gray-500 line-through text-xs md:text-sm">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-white font-semibold text-sm md:text-base">${product.price.toFixed(2)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

