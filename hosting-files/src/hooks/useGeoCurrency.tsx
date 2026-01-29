import { useState, useEffect } from 'react';

interface GeoLocation {
  country: string;
  countryCode: string;
  currency: string;
  currencySymbol: string;
}

// Currency mapping based on country codes
const CURRENCY_MAP: Record<string, { currency: string; symbol: string }> = {
  'US': { currency: 'USD', symbol: '$' },
  'GB': { currency: 'GBP', symbol: '£' },
  'EU': { currency: 'EUR', symbol: '€' },
  'DE': { currency: 'EUR', symbol: '€' },
  'FR': { currency: 'EUR', symbol: '€' },
  'ES': { currency: 'EUR', symbol: '€' },
  'IT': { currency: 'EUR', symbol: '€' },
  'NL': { currency: 'EUR', symbol: '€' },
  'CA': { currency: 'CAD', symbol: 'C$' },
  'AU': { currency: 'AUD', symbol: 'A$' },
  'JP': { currency: 'JPY', symbol: '¥' },
  'CN': { currency: 'CNY', symbol: '¥' },
  'IN': { currency: 'INR', symbol: '₹' },
  'BR': { currency: 'BRL', symbol: 'R$' },
  'MX': { currency: 'MXN', symbol: '$' },
  'RU': { currency: 'RUB', symbol: '₽' },
  'KR': { currency: 'KRW', symbol: '₩' },
  'SG': { currency: 'SGD', symbol: 'S$' },
  'HK': { currency: 'HKD', symbol: 'HK$' },
  'CH': { currency: 'CHF', symbol: 'CHF' },
  'SE': { currency: 'SEK', symbol: 'kr' },
  'NO': { currency: 'NOK', symbol: 'kr' },
  'DK': { currency: 'DKK', symbol: 'kr' },
  'PL': { currency: 'PLN', symbol: 'zł' },
  'CZ': { currency: 'CZK', symbol: 'Kč' },
  'HU': { currency: 'HUF', symbol: 'Ft' },
  'TR': { currency: 'TRY', symbol: '₺' },
  'ZA': { currency: 'ZAR', symbol: 'R' },
  'EG': { currency: 'EGP', symbol: 'E£' },
  'NG': { currency: 'NGN', symbol: '₦' },
  'KE': { currency: 'KES', symbol: 'KSh' },
  'GH': { currency: 'GHS', symbol: 'GH₵' },
  'MA': { currency: 'MAD', symbol: 'DH' },
  'TN': { currency: 'TND', symbol: 'د.ت' },
  'AE': { currency: 'AED', symbol: 'د.إ' },
  'SA': { currency: 'SAR', symbol: '﷼' },
  'QA': { currency: 'QAR', symbol: '﷼' },
  'KW': { currency: 'KWD', symbol: 'د.ك' },
  'BH': { currency: 'BHD', symbol: '.د.ب' },
  'OM': { currency: 'OMR', symbol: '﷼' },
  'JO': { currency: 'JOD', symbol: 'د.ا' },
  'LB': { currency: 'LBP', symbol: '£' },
  'IL': { currency: 'ILS', symbol: '₪' },
  'TH': { currency: 'THB', symbol: '฿' },
  'VN': { currency: 'VND', symbol: '₫' },
  'MY': { currency: 'MYR', symbol: 'RM' },
  'ID': { currency: 'IDR', symbol: 'Rp' },
  'PH': { currency: 'PHP', symbol: '₱' },
  'BD': { currency: 'BDT', symbol: '৳' },
  'PK': { currency: 'PKR', symbol: '₨' },
  'LK': { currency: 'LKR', symbol: '₨' },
  'NP': { currency: 'NPR', symbol: '₨' },
  'MM': { currency: 'MMK', symbol: 'K' },
  'KH': { currency: 'KHR', symbol: '៛' },
  'LA': { currency: 'LAK', symbol: '₭' },
  'MN': { currency: 'MNT', symbol: '₮' },
  'KZ': { currency: 'KZT', symbol: '₸' },
  'UZ': { currency: 'UZS', symbol: 'лв' },
  'UA': { currency: 'UAH', symbol: '₴' },
  'BY': { currency: 'BYN', symbol: 'Br' },
  'MD': { currency: 'MDL', symbol: 'L' },
  'GE': { currency: 'GEL', symbol: '₾' },
  'AM': { currency: 'AMD', symbol: '֏' },
  'AZ': { currency: 'AZN', symbol: '₼' },
  'TJ': { currency: 'TJS', symbol: 'SM' },
  'KG': { currency: 'KGS', symbol: 'лв' },
  'TM': { currency: 'TMT', symbol: 'T' },
  'AF': { currency: 'AFN', symbol: '؋' },
  'IQ': { currency: 'IQD', symbol: 'ع.د' },
  'IR': { currency: 'IRR', symbol: '﷼' },
  'SY': { currency: 'SYP', symbol: '£' },
  'YE': { currency: 'YER', symbol: '﷼' },
};

export function useGeoCurrency() {
  const [geoLocation, setGeoLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocationFromCoords = async (latitude: number, longitude: number): Promise<GeoLocation | null> => {
    try {
      // Using a free geocoding service
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      if (data.countryCode) {
        const countryCode = data.countryCode.toUpperCase();
        const currencyInfo = CURRENCY_MAP[countryCode] || { currency: 'USD', symbol: '$' };
        
        return {
          country: data.countryName || data.country || 'Unknown',
          countryCode,
          currency: currencyInfo.currency,
          currencySymbol: currencyInfo.symbol,
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const getLocationFromIP = async (): Promise<GeoLocation | null> => {
    try {
      console.log('Fetching location from IP...');
      // Using a free IP geolocation service
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      console.log('IP geolocation response:', data);
      
      if (data.country_code) {
        const countryCode = data.country_code.toUpperCase();
        const currencyInfo = CURRENCY_MAP[countryCode] || { currency: 'USD', symbol: '$' };
        
        const location = {
          country: data.country_name || 'Unknown',
          countryCode,
          currency: currencyInfo.currency,
          currencySymbol: currencyInfo.symbol,
        };
        
        console.log('Location detected from IP:', location);
        return location;
      }
      return null;
    } catch (error) {
      console.error('IP geolocation error:', error);
      return null;
    }
  };

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);

    // Check if location is already cached
    const cachedLocation = localStorage.getItem('userGeoLocation');
    if (cachedLocation) {
      try {
        const parsed = JSON.parse(cachedLocation);
        setGeoLocation(parsed);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem('userGeoLocation');
      }
    }

    try {
      // Use IP-based detection as primary method
      console.log('Detecting location via IP address...');
      const ipLocation = await getLocationFromIP();
      
      if (ipLocation) {
        setGeoLocation(ipLocation);
        localStorage.setItem('userGeoLocation', JSON.stringify(ipLocation));
        console.log('Location detected via IP:', ipLocation);
      } else {
        // Fallback to default USD if IP detection fails
        console.warn('IP detection failed, using USD fallback');
        const fallback = {
          country: 'Unknown',
          countryCode: 'US',
          currency: 'USD',
          currencySymbol: '$',
        };
        setGeoLocation(fallback);
        localStorage.setItem('userGeoLocation', JSON.stringify(fallback));
        setError('Could not detect location, using USD');
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Location detection error:', err);
      setError('Failed to detect location');
      
      // Ultimate fallback to USD
      const fallback = {
        country: 'Unknown',
        countryCode: 'US',
        currency: 'USD',
        currencySymbol: '$',
      };
      setGeoLocation(fallback);
      localStorage.setItem('userGeoLocation', JSON.stringify(fallback));
      setIsLoading(false);
    }
  };

  const setCurrency = (currency: string, symbol: string) => {
    if (geoLocation) {
      const updated = {
        ...geoLocation,
        currency,
        currencySymbol: symbol,
      };
      setGeoLocation(updated);
      localStorage.setItem('userGeoLocation', JSON.stringify(updated));
    }
  };

  const clearCache = () => {
    localStorage.removeItem('userGeoLocation');
    setGeoLocation(null);
    detectLocation();
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return {
    geoLocation,
    isLoading,
    error,
    detectLocation,
    setCurrency,
    clearCache,
  };
}