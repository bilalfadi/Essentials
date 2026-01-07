'use client';

import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface ProductPriceProps {
  price: number;
  discountPrice?: number | null;
  showDiscount?: boolean;
}

export default function ProductPrice({ price, discountPrice, showDiscount = true }: ProductPriceProps) {
  const { formatPrice } = useCurrencyContext();
  
  const discountPercent = discountPrice && price > 0
    ? Math.round(((price - discountPrice) / price) * 100)
    : null;

  return (
    <div>
      {discountPrice ? (
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-2xl md:text-3xl font-bold text-white">{formatPrice(discountPrice)}</span>
          {discountPercent && showDiscount && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
              -{discountPercent}%
            </span>
          )}
        </div>
      ) : (
        <span className="text-2xl md:text-3xl font-bold text-white">{formatPrice(price)}</span>
      )}
      {discountPrice && price > 0 && (
        <div className="text-gray-500 text-sm">
          <span className="line-through">{formatPrice(price)}</span>
          <span className="ml-2">Original price was: {formatPrice(price)}.</span>
          <span className="text-white ml-1">{formatPrice(discountPrice)} Current price is: {formatPrice(discountPrice)}.</span>
        </div>
      )}
    </div>
  );
}

