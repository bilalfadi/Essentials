'use client';

import { useState, useEffect } from 'react';
import { useCurrencyContext } from '@/contexts/CurrencyContext';

interface PriceDisplayProps {
  price: number;
  discountPrice?: number | null;
  className?: string;
}

/**
 * PriceDisplay component that automatically updates when currency changes
 * Listens to currencyChanged events for real-time updates
 */
export default function PriceDisplay({ price, discountPrice, className = '' }: PriceDisplayProps) {
  const { formatPrice } = useCurrencyContext();
  const [currentPrice, setCurrentPrice] = useState(price);
  const [currentDiscountPrice, setCurrentDiscountPrice] = useState(discountPrice);

  // Update prices when props change
  useEffect(() => {
    setCurrentPrice(price);
    setCurrentDiscountPrice(discountPrice);
  }, [price, discountPrice]);

  // Listen to currencyChanged events for automatic updates
  useEffect(() => {
    const handleCurrencyChange = () => {
      // Force re-render by updating state
      setCurrentPrice(prev => prev);
      setCurrentDiscountPrice(prev => prev);
    };

    window.addEventListener('currencyChanged', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange);
    };
  }, []);

  const discountPercent = currentDiscountPrice && currentPrice > 0
    ? Math.round(((currentPrice - currentDiscountPrice) / currentPrice) * 100)
    : null;

  return (
    <div className={className}>
      {currentDiscountPrice ? (
        <div className="flex items-center space-x-2">
          <span className="text-white font-semibold">{formatPrice(currentDiscountPrice)}</span>
          <span className="text-gray-500 line-through text-sm">{formatPrice(currentPrice)}</span>
          {discountPercent && (
            <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold">
              -{discountPercent}%
            </span>
          )}
        </div>
      ) : (
        <span className="text-white font-semibold">{formatPrice(currentPrice)}</span>
      )}
    </div>
  );
}
