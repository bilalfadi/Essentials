'use client';

import { useState, useEffect, useRef } from 'react';
import { COUNTRIES, getCurrencyForCountry } from '@/lib/currency';

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
const STORAGE_KEY_COUNTRY = 'selected_country';
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_COUNTRY = 'US';

export function useCurrency() {
  const [currency, setCurrencyState] = useState<string>(DEFAULT_CURRENCY);

  // Load saved currency on mount (client-side only to prevent hydration errors)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem(STORAGE_KEY);
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrencyState(savedCurrency);
      }
    }
  }, []);

  // Set currency with saving to localStorage (for manual selection)
  const setCurrency = (newCurrency: string) => {
    if (CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newCurrency);
      }
    }
  };

  // Set currency without saving to localStorage (for auto-detection)
  const setCurrencyWithoutSave = (newCurrency: string) => {
    if (CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
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
    setCurrency,
    setCurrencyWithoutSave,
    convertPrice,
    formatPrice,
    currencies: CURRENCIES,
  };
}

/**
 * Detect country from IP address using multiple client-side APIs
 */
async function detectCountryFromIP(): Promise<string> {
  // Client-side APIs to try
  const apis = [
    { url: 'https://ipapi.co/json/', key: 'country_code' },
    { url: 'https://ip-api.com/json/?fields=status,countryCode', key: 'countryCode' },
    { url: 'https://geojs.io/geo.json', key: 'country' },
    { url: 'https://api.country.is', key: 'country' },
  ];

  // Try each API sequentially
  for (const api of apis) {
    try {
      const response = await fetch(api.url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const countryCode = data[api.key];

      if (countryCode && typeof countryCode === 'string') {
        const upperCode = countryCode.toUpperCase();
        console.log(`Country detected via ${api.url}: ${upperCode}`);
        return upperCode;
      }
    } catch (error) {
      console.log(`API ${api.url} failed:`, error);
      continue;
    }
  }

  // If all client-side APIs fail or return 'US', try server-side API
  let detectedCountry = 'US';
  
  try {
    const response = await fetch('/api/detect-country');
    if (response.ok) {
      const data = await response.json();
      if (data.country && data.country !== 'US') {
        detectedCountry = data.country.toUpperCase();
        console.log(`Country detected via server API: ${detectedCountry}`);
      }
    }
  } catch (error) {
    console.log('Server-side API failed:', error);
  }

  return detectedCountry;
}

export default function CurrencySelector() {
  const { currency, setCurrency, setCurrencyWithoutSave, currencies } = useCurrency();
  const [selectedCountry, setSelectedCountry] = useState<string>(DEFAULT_COUNTRY);
  const [mounted, setMounted] = useState(false);
  const hasAutoDetected = useRef(false);

  // Set mounted state on client-side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect country and currency on mount (client-side only)
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    // Only auto-detect if user hasn't manually selected a country
    const savedCountry = localStorage.getItem(STORAGE_KEY_COUNTRY);
    
    if (savedCountry) {
      // User has manually selected a country, use that
      setSelectedCountry(savedCountry);
      const savedCurrency = getCurrencyForCountry(savedCountry);
      if (savedCurrency && CURRENCIES[savedCurrency]) {
        setCurrency(savedCurrency);
      }
      return;
    }

    // Auto-detect country from IP
    if (!hasAutoDetected.current) {
      hasAutoDetected.current = true;
      
      detectCountryFromIP().then((detectedCountry) => {
        const country = COUNTRIES.find(c => c.code === detectedCountry);
        
        if (country) {
          setSelectedCountry(detectedCountry);
          const detectedCurrency = country.currency;
          
          // Set currency without saving to localStorage (auto-detection)
          if (CURRENCIES[detectedCurrency]) {
            setCurrencyWithoutSave(detectedCurrency);
            
            // Dispatch currencyChanged event for other components
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('currencyChanged', {
                detail: {
                  currency: detectedCurrency,
                  countryCode: detectedCountry,
                },
              }));
            }
            
            console.log(`Auto-detected: ${detectedCountry} -> ${detectedCurrency}`);
          }
        }
      }).catch((error) => {
        console.error('Country detection failed:', error);
      });
    }
  }, [mounted, setCurrency, setCurrencyWithoutSave]);

  // Listen to currencyChanged events from other sources (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency: newCurrency, countryCode } = event.detail;
      if (newCurrency && CURRENCIES[newCurrency]) {
        setCurrency(newCurrency);
        if (countryCode) {
          setSelectedCountry(countryCode);
        }
      }
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, [setCurrency]);

  // Handle manual currency selection
  const handleCurrencySelect = (currencyCode: string) => {
    setCurrency(currencyCode);
    
    // Find country for this currency
    const country = COUNTRIES.find(c => c.currency === currencyCode);
    if (country) {
      setSelectedCountry(country.code);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_COUNTRY, country.code);
      }
    }
    
    // Dispatch currencyChanged event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('currencyChanged', {
        detail: {
          currency: currencyCode,
          countryCode: country?.code || selectedCountry,
        },
      }));
    }
  };

  return (
    <div className="relative">
      <select
        value={currency}
        onChange={(e) => handleCurrencySelect(e.target.value)}
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
