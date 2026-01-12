'use client';

import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useCurrency } from '@/components/CurrencySelector';

interface CurrencyContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  setCurrencyWithoutSave?: (currency: string) => void;
  convertPrice: (usdPrice: number) => number;
  formatPrice: (usdPrice: number) => string;
  currencies: Record<string, { code: string; symbol: string; name: string }>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const currencyData = useCurrency();

  // Listen to currencyChanged events to update context (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency: newCurrency } = event.detail;
      if (newCurrency && currencyData.currencies[newCurrency]) {
        // Use setCurrencyWithoutSave for auto-detected currency (no localStorage save)
        // The event detail will indicate if it's auto-detected or manual
        if (currencyData.setCurrencyWithoutSave) {
          currencyData.setCurrencyWithoutSave(newCurrency);
        } else {
          currencyData.setCurrency(newCurrency);
        }
      }
    };

    window.addEventListener('currencyChanged', handleCurrencyChange as EventListener);
    return () => {
      window.removeEventListener('currencyChanged', handleCurrencyChange as EventListener);
    };
  }, [currencyData]);

  return (
    <CurrencyContext.Provider value={currencyData}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrencyContext() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrencyContext must be used within a CurrencyProvider');
  }
  return context;
}

