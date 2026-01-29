import { useState } from 'react';
import { MapPin, Settings, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useGeoCurrency } from "@/hooks/useGeoCurrency";
import { useTranslation } from "@/hooks/useTranslation";

interface GeoCurrencyDisplayProps {
  className?: string;
}

const POPULAR_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
];

export function GeoCurrencyDisplay({ className = "" }: GeoCurrencyDisplayProps) {
  const { geoLocation, isLoading, setCurrency, detectLocation } = useGeoCurrency();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('');

  const handleCurrencyChange = (currencyCode: string) => {
    const currency = POPULAR_CURRENCIES.find(c => c.code === currencyCode);
    if (currency) {
      setCurrency(currency.code, currency.symbol);
      setSelectedCurrency(currencyCode);
      setIsOpen(false);
    }
  };

  const handleDetectAgain = () => {
    detectLocation();
  };

  if (isLoading) {
    return (
      <div className={`flex items-center text-sm text-gray-600 ${className}`}>
        <MapPin className="w-4 h-4 mr-2 animate-pulse" />
        <span>{t('detectingLocationViaIP')}</span>
      </div>
    );
  }

  if (!geoLocation) {
    return (
      <div className={`flex items-center text-sm text-gray-600 ${className}`}>
        <MapPin className="w-4 h-4 mr-2" />
        <span>{t('locationUnavailable')}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDetectAgain}
          className="ml-2 h-6 px-2 text-xs"
        >
          {t('tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{geoLocation.country}</span>
          <span className="mx-1">•</span>
          <span className="font-medium">
            {geoLocation.currencySymbol} {geoLocation.currency}
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-6 px-2 text-xs hover:bg-gray-100"
        >
          <Settings className="w-3 h-3" />
        </Button>
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border shadow-lg z-50 w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">{t('currencySettings')}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {t('weDetectedYoureIn')} {geoLocation.country} {t('viaYourIPAddress')}
              </p>
            </div>
            
            <div>
              <Select value={selectedCurrency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('selectCurrency')} />
                </SelectTrigger>
                <SelectContent>
                  {POPULAR_CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center justify-between w-full">
                        <span>{currency.symbol} {currency.code}</span>
                        <span className="text-gray-500 text-sm">{currency.name}</span>
                        {geoLocation.currency === currency.code && (
                          <Check className="w-4 h-4 text-green-600 ml-2" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDetectAgain}
                className="text-xs"
              >
                {t('detectAgain')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-xs"
              >
                {t('close')}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}