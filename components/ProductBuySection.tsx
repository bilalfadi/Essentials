'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ProductBuySectionProps {
  productSlug: string;
}

export default function ProductBuySection({ productSlug }: ProductBuySectionProps) {
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      {/* Size Selector */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          Select Size <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">
          Quantity <span className="text-red-500">*</span>
        </label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      {/* Buy Now Button - Local Checkout */}
      <Link
        href={`/checkout?product=${productSlug}&size=${encodeURIComponent(selectedSize)}&quantity=${quantity}`}
        className="bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition-colors duration-200 mb-4 w-full text-center block"
      >
        Buy Now
      </Link>
    </>
  );
}

