import { useState, useEffect } from 'react';
import { MobileOperatorsService } from '@/services/mobileOperatorsService';

interface CountriesStatsProps {
  showList?: boolean;
  maxCountries?: number;
}

export function CountriesStats({ showList = true, maxCountries = 10 }: CountriesStatsProps) {
  const [stats, setStats] = useState<{
    totalCountries: number;
    totalOperators: number;
    countriesWithOperators: number;
  } | null>(null);
  const [countries, setCountries] = useState<Array<{name: string, operatorCount: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await MobileOperatorsService.fetchCountriesWithOperators();
        
        setStats({
          totalCountries: data.stats.totalCountries,
          totalOperators: data.stats.totalOperators,
          countriesWithOperators: data.stats.countriesWithOperators
        });

        // Get top countries with most operators
        const topCountries = data.countries
          .filter(c => c.operators.length > 0)
          .sort((a, b) => b.operatorCount - a.operatorCount)
          .slice(0, maxCountries)
          .map(c => ({ name: c.name, operatorCount: c.operatorCount }));
        
        setCountries(topCountries);
      } catch (error) {
        console.error('Failed to load countries stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [maxCountries]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
        <span className="ml-2">Loading countries data...</span>
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load country statistics.</div>;
  }

  return (
    <div>
      <p className="mb-4" style={{color: '#004a59'}}>
        We recharge mobile numbers globally, across {stats.totalCountries.toLocaleString()} countries 
        with {stats.totalOperators.toLocaleString()} mobile operators. Popular countries include:
      </p>
      
      {showList && (
        <ul className="list-disc ml-6 space-y-1">
          {countries.map((country, index) => (
            <li key={`${country.name}-${index}`}>
              <span className="font-medium">Recharge {country.name}</span>
              <span className="text-sm text-gray-600 ml-2">({country.operatorCount} operators)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PopularCountriesList() {
  return <CountriesStats showList={true} maxCountries={8} />;
}