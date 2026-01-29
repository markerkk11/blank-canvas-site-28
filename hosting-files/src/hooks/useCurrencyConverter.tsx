import { useState, useEffect } from 'react';

interface ExchangeRates {
  [key: string]: number;
}

interface CurrencyConverter {
  rates: ExchangeRates | null;
  isLoading: boolean;
  error: string | null;
  convertAmount: (amount: number, fromCurrency: string, toCurrency: string) => number;
  formatCurrency: (amount: number, currency: string, symbol: string) => string;
}

// Fallback exchange rates (updated periodically)
const FALLBACK_RATES: ExchangeRates = {
  'USD': 1.00,
  'EUR': 0.85,
  'GBP': 0.73,
  'CAD': 1.35,
  'AUD': 1.45,
  'JPY': 110.0,
  'CHF': 0.92,
  'CNY': 7.20,
  'INR': 75.0,
  'BRL': 5.20,
  'MXN': 20.0,
  'RUB': 74.0,
  'KRW': 1180.0,
  'SGD': 1.35,
  'HKD': 7.80,
  'SEK': 8.60,
  'NOK': 8.70,
  'DKK': 6.35,
  'PLN': 3.85,
  'CZK': 21.5,
  'HUF': 295.0,
  'TRY': 8.50,
  'ZAR': 14.5,
  'EGP': 15.7,
  'NGN': 411.0,
  'KES': 108.0,
  'GHS': 6.10,
  'MAD': 9.20,
  'TND': 2.80,
  'AED': 3.67,
  'SAR': 3.75,
  'QAR': 3.64,
  'KWD': 0.30,
  'BHD': 0.38,
  'OMR': 0.38,
  'JOD': 0.71,
  'LBP': 1507.0,
  'ILS': 3.25,
  'THB': 33.0,
  'VND': 23000.0,
  'MYR': 4.15,
  'IDR': 14200.0,
  'PHP': 50.0,
  'BDT': 85.0,
  'PKR': 175.0,
  'LKR': 200.0,
  'NPR': 120.0,
  'MMK': 1400.0,
  'KHR': 4100.0,
  'LAK': 9500.0,
  'MNT': 2850.0,
  'KZT': 425.0,
  'UZS': 10600.0,
  'UAH': 27.0,
  'BYN': 2.60,
  'MDL': 17.8,
  'GEL': 3.10,
  'AMD': 480.0,
  'AZN': 1.70,
  'TJS': 11.3,
  'KGS': 84.5,
  'TMT': 3.50,
  'AFN': 77.0,
  'IQD': 1460.0,
  'IRR': 42000.0,
  'SYP': 2512.0,
  'YER': 250.0,
};

export function useCurrencyConverter(): CurrencyConverter {
  const [rates, setRates] = useState<ExchangeRates | null>(FALLBACK_RATES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch live rates from a free API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        
        if (response.ok) {
          const data = await response.json();
          setRates(data.rates);
          setError(null);
        } else {
          // Use fallback rates if API fails
          console.warn('Exchange rate API failed, using fallback rates');
          setRates(FALLBACK_RATES);
        }
      } catch (err) {
        console.warn('Failed to fetch exchange rates, using fallback:', err);
        setRates(FALLBACK_RATES);
        setError('Using offline rates');
      } finally {
        setIsLoading(false);
      }
    };

    // Check if rates are cached and less than 1 hour old
    const cachedRates = localStorage.getItem('exchangeRates');
    const cacheTimestamp = localStorage.getItem('exchangeRatesTimestamp');
    const oneHour = 60 * 60 * 1000;

    if (cachedRates && cacheTimestamp) {
      const timeDiff = Date.now() - parseInt(cacheTimestamp);
      if (timeDiff < oneHour) {
        setRates(JSON.parse(cachedRates));
        setIsLoading(false);
        return;
      }
    }

    fetchRates();
  }, []);

  // Cache rates when they change
  useEffect(() => {
    if (rates && rates !== FALLBACK_RATES) {
      localStorage.setItem('exchangeRates', JSON.stringify(rates));
      localStorage.setItem('exchangeRatesTimestamp', Date.now().toString());
    }
  }, [rates]);

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (!rates || fromCurrency === toCurrency) return amount;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;

    // Convert to USD first, then to target currency
    const usdAmount = amount / fromRate;
    const convertedAmount = usdAmount * toRate;

    return Math.round(convertedAmount * 100) / 100; // Round to 2 decimal places
  };

  const formatCurrency = (amount: number, currency: string, symbol: string): string => {
    // Handle different formatting for different currencies
    if (currency === 'JPY' || currency === 'KRW' || currency === 'VND') {
      // No decimal places for these currencies
      return `${symbol}${Math.round(amount).toLocaleString()}`;
    }
    
    return `${symbol}${amount.toFixed(2)}`;
  };

  return {
    rates,
    isLoading,
    error,
    convertAmount,
    formatCurrency,
  };
}