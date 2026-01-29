import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, ChevronRight, User, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DingHeader from "@/components/DingHeader";
import { useTranslation } from "@/hooks/useTranslation";
import countriesTopImage from "@/assets/countries-top.png";
import { MobileOperatorsService } from "@/services/mobileOperatorsService";
import { useToast } from "@/hooks/use-toast";

interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  operators: string[];
}

// Initial empty array - will be populated with live API data from Ding API
const initialCountries: Country[] = [];

const regions = [
  "All Countries",
  "Africa",
  "Asia | The Pacific",
  "Central | North America",
  "Europe",
  "South America",
  "The Caribbean"
];

export function CountriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Countries");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Live API data state
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);

  // Load countries from Ding API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        console.log('🌍 [CountriesPage] Loading countries from comprehensive mobile operators data...');
        
        const data = await MobileOperatorsService.fetchCountriesWithOperators();
        
        // Convert API data to our Country interface format (include all countries)
        const convertedCountries: Country[] = data.countries.map(country => ({
          code: country.code,
          name: country.name,
          flag: `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`,
          region: country.region,
          operators: country.operators
        }));

        setCountries(convertedCountries);
        setCountriesError(null);
        
        console.log(`✅ Loaded ${convertedCountries.length} countries with operators`);

      } catch (error) {
        console.error('❌ Failed to load countries in CountriesPage:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
        setCountriesError('Failed to load countries. Please try again.');
        
        toast({
          title: "Error Loading Countries",
          description: "Using fallback data. Please refresh to try again.",
          variant: "destructive",
          duration: 5000,
        });
        
        // Fallback to a basic set if API fails
        setCountries([
          {
            code: "US",
            name: "United States",
            flag: "https://flagcdn.com/w40/us.png",
            region: "Central | North America",
            operators: ["AT&T", "T-Mobile", "Verizon"]
          },
          {
            code: "IN",
            name: "India", 
            flag: "https://flagcdn.com/w40/in.png",
            region: "Asia | The Pacific",
            operators: ["Airtel", "Jio", "Vodafone"]
          }
        ]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, [toast]);

  const handleDropdownMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsDropdownVisible(true);
  };

  const handleDropdownMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDropdownVisible(false);
    }, 2000);
  };

  const handleAccountAction = () => {
    if (isAuthenticated) {
      navigate('/order');
    } else {
      navigate('/authorization', { state: { from: location.pathname } });
    }
  };

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.operators.some(op => op.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === "All Countries" || country.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const handleCountryClick = (country: Country) => {
    navigate('/topup', {
      state: {
        selectedCountry: {
          code: country.code,
          name: country.name,
          flag: country.flag,
          dialCode: countries.find(c => c.code === country.code)?.code === "US" ? "+1" : 
                   countries.find(c => c.code === country.code)?.code === "GB" ? "+44" : "+1"
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      <DingHeader />
      
      {/* Background decorations */}
      <img 
        src="/lovable-uploads/8c4fb3b0-f9c7-46af-b613-e4d0d7c8b91f.png"
        alt="Star decoration" 
        className="hidden md:block absolute top-[20px] right-[20px] w-120 h-360 opacity-100 z-50 transform rotate-[216deg]"
      />
      
      {/* Hero Section */}
      <div className="h-[25rem] md:h-[35rem] relative overflow-hidden z-0" style={{ backgroundColor: '#ccfff6' }}>
        <div className="flex flex-col items-center justify-start px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-center mt-[25px]" style={{ color: '#004a59' }}>{t('sendTopUpWorldwide')}</h1>
          <p className="text-base md:text-lg mb-8 text-center max-w-2xl mt-[20px] px-4" style={{ color: '#004a59' }}>{t('workWithMoreOperators')}</p>
        </div>
        <img 
          src={countriesTopImage}
          alt="Countries top banner" 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 max-w-full h-auto max-h-[400px] md:max-h-[600px]"
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row rounded-tr-6xl shadow-lg mx-2 md:mx-8 my-6" style={{ marginTop: '0rem', marginLeft: '0rem', background: 'linear-gradient(to right, white 0%, white 85%, #ccfff6 85%, #ccfff6 100%)' }}>
        {/* Mobile Region Selector */}
        <div className="lg:hidden p-4 bg-white">
          <div className="mb-4">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-base bg-white"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 p-4 bg-gray-50 relative">
          <div className="bg-white rounded-tl-3xl rounded-bl-3xl rounded-tr-xl rounded-br-xl border border-gray-200 shadow-sm overflow-hidden sticky top-6 ml-[20px] xl:ml-[50px]">
              {regions.map((region, index) => (
                <div
                  key={region}
                  className={`flex items-center justify-between px-4 xl:px-6 py-4 cursor-pointer transition-all duration-200 ${
                    index !== regions.length - 1 ? 'border-b border-gray-100' : ''
                  } ${
                    index === 0 ? 'rounded-tl-3xl' : ''
                  } ${
                    selectedRegion === region 
                      ? 'bg-gray-100 text-teal-700 font-medium' 
                      : 'text-teal-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedRegion(region)}
                >
                <span className="text-sm xl:text-base">{region}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-4 lg:p-6 bg-white lg:rounded-tr-[3rem] lg:mr-4">
          {/* Search Bar */}
          <div className="mb-4 lg:mb-6">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder={t('beginSearch')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-full border border-gray-300 bg-white text-base"
                />
              </div>
            </div>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {isLoadingCountries ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Countries</h3>
                <p className="text-gray-600 text-center">Fetching live data from Ding API...</p>
              </div>
            ) : countriesError ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-red-600 text-center">
                  <h3 className="text-xl font-semibold mb-2">Error Loading Countries</h3>
                  <p className="mb-4">{countriesError}</p>
                  <Button onClick={() => window.location.reload()} variant="outline">
                    Retry
                  </Button>
                </div>
              </div>
            ) : filteredCountries.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Countries Found</h3>
                <p className="text-gray-600">Try adjusting your search or region filter.</p>
              </div>
            ) : (
              filteredCountries.map((country) => (
              <Card 
                key={country.code}
                className="p-4 hover:shadow-lg active:scale-95 transition-all duration-300 cursor-pointer bg-white border border-gray-200 rounded-tl-3xl rounded-tr-xl rounded-bl-xl rounded-br-xl touch-manipulation"
                onClick={() => handleCountryClick(country)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">{country.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {country.operators.length} {country.operators.length !== 1 ? t('operators') : t('operator_other')}
                    </p>
                    <div className="text-sm text-teal-600">
                      {country.operators.join(", ")}
                    </div>
                  </div>
                  <div className="ml-4">
                    <img 
                      src={country.flag} 
                      alt={`${country.name} flag`} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                </div>
              </Card>
            )))}
          </div>
        </div>
      </div>
    </div>
  );
}