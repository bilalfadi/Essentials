'use client';

import { useState, useEffect } from 'react';

interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  MYR: { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  THB: { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  IDR: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  PHP: { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  VND: { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  TWD: { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  ARS: { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  CLP: { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  COP: { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  PEN: { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  EGP: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  TRY: { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  ILS: { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  PLN: { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  CZK: { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  SEK: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  NOK: { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  DKK: { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  NZD: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
};

// Exchange rates (simplified - in production, fetch from API)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  CAD: 1.35,
  GBP: 0.79,
  EUR: 0.92,
  AUD: 1.52,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.1,
  PKR: 278.5,
  AED: 3.67,
  SAR: 3.75,
  SGD: 1.34,
  MYR: 4.68,
  THB: 35.8,
  IDR: 15650,
  PHP: 55.8,
  VND: 24500,
  KRW: 1320,
  HKD: 7.82,
  TWD: 31.5,
  MXN: 17.1,
  BRL: 4.95,
  ARS: 850,
  CLP: 920,
  COP: 3900,
  PEN: 3.7,
  ZAR: 18.5,
  EGP: 31,
  NGN: 1450,
  KES: 130,
  GHS: 12.5,
  TRY: 30.2,
  ILS: 3.65,
  RUB: 92,
  PLN: 4.0,
  CZK: 22.5,
  SEK: 10.5,
  NOK: 10.7,
  DKK: 6.85,
  CHF: 0.88,
  NZD: 1.64,
};

const STORAGE_KEY = 'selected_currency';
const DEFAULT_CURRENCY = 'USD';

export function useCurrency() {
  const [currency, setCurrency] = useState<string>(DEFAULT_CURRENCY);

  // Load saved currency on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY);
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setCurrency(savedCurrency);
    }
  }, []);

  const setCurrencyWithSave = (newCurrency: string) => {
    if (CURRENCIES[newCurrency]) {
      setCurrency(newCurrency);
      localStorage.setItem(STORAGE_KEY, newCurrency);
    }
  };

  const convertPrice = (usdPrice: number): number => {
    const rate = EXCHANGE_RATES[currency] || 1.0;
    return usdPrice * rate;
  };

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = convertPrice(usdPrice);
    const currencyInfo = CURRENCIES[currency];
    
    if (!currencyInfo) {
      return `$${convertedPrice.toFixed(2)}`;
    }

    // Format based on currency
    if (currency === 'JPY' || currency === 'KRW' || currency === 'VND' || currency === 'IDR') {
      return `${currencyInfo.symbol}${Math.round(convertedPrice)}`;
    }

    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  return {
    currency,
    setCurrency: setCurrencyWithSave,
    convertPrice,
    formatPrice,
    currencies: CURRENCIES,
  };
}

export default function CurrencySelector() {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="bg-gray-900 border border-gray-700 text-white px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-white text-xs"
      >
        {Object.values(currencies).map((curr) => (
          <option key={curr.code} value={curr.code}>
            {curr.symbol} {curr.code}
          </option>
        ))}
      </select>
    </div>
  );
}

