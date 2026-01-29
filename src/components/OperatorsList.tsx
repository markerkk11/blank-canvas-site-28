import { useState, useEffect } from 'react';
import { MobileOperatorsService } from '@/services/mobileOperatorsService';

interface Operator {
  name: string;
  country: string;
  countryCode: string;
}

interface OperatorsListProps {
  maxOperators?: number;
  showByRegion?: boolean;
}

export function OperatorsList({ maxOperators = 20, showByRegion = false }: OperatorsListProps) {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadOperators = async () => {
      try {
        setLoading(true);
        const data = await MobileOperatorsService.fetchCountriesWithOperators();
        
        // Flatten all operators with their countries
        const allOperators: Operator[] = [];
        data.countries.forEach(country => {
          country.operators.forEach(operator => {
            allOperators.push({
              name: operator,
              country: country.name,
              countryCode: country.code
            });
          });
        });

        // Sort operators alphabetically and take the requested amount
        const sortedOperators = allOperators
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, maxOperators);

        setOperators(sortedOperators);
        setTotalCount(allOperators.length);
      } catch (error) {
        console.error('Failed to load operators:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, [maxOperators]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
        <span className="ml-2">Loading operators...</span>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4" style={{color: '#004a59'}}>
        Currently you can send top-up to over {totalCount.toLocaleString()} operator networks globally across {' '}
        {Math.floor(totalCount / 10)} countries. Popular choices include:
      </p>
      
      {showByRegion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {operators.map((operator, index) => (
            <div key={`${operator.name}-${operator.countryCode}-${index}`} 
                 className="flex items-center justify-between p-2 rounded border border-gray-100">
              <span className="font-medium">{operator.name}</span>
              <span className="text-sm text-gray-600">{operator.country}</span>
            </div>
          ))}
        </div>
      ) : (
        <ul className="list-disc ml-6 space-y-1 columns-1 md:columns-2 gap-6">
          {operators.map((operator, index) => (
            <li key={`${operator.name}-${operator.countryCode}-${index}`} className="break-inside-avoid">
              <span className="font-medium">{operator.name}</span>
              <span className="text-sm text-gray-600 ml-2">({operator.country})</span>
            </li>
          ))}
          {operators.length < totalCount && (
            <li className="text-gray-500 italic">
              ... and {(totalCount - operators.length).toLocaleString()} more operators worldwide
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function PopularOperatorsList() {
  return <OperatorsList maxOperators={24} showByRegion={false} />;
}

export function AllOperatorsList() {
  return <OperatorsList maxOperators={100} showByRegion={true} />;
}