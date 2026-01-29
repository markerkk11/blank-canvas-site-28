import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, ChevronDown, ChevronRight, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DingHeader from "@/components/DingHeader";
import { useTranslation } from "@/hooks/useTranslation";
import countriesTopImage from "@/assets/countries-top.png";

interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
  operators: string[];
}

const countries: Country[] = [
  // Africa
  { code: "DZ", name: "Algeria", flag: "https://flagcdn.com/w40/dz.png", region: "Africa", operators: ["Djezzy", "Mobilis", "Ooredoo"] },
  { code: "AO", name: "Angola", flag: "https://flagcdn.com/w40/ao.png", region: "Africa", operators: ["Africell Angola", "Movicel Angola", "Unitel Angola"] },
  { code: "EG", name: "Egypt", flag: "https://flagcdn.com/w40/eg.png", region: "Africa", operators: ["Orange", "Vodafone", "WE"] },
  { code: "ET", name: "Ethiopia", flag: "https://flagcdn.com/w40/et.png", region: "Africa", operators: ["Ethio Telecom", "Safaricom"] },
  { code: "GH", name: "Ghana", flag: "https://flagcdn.com/w40/gh.png", region: "Africa", operators: ["AirtelTigo", "MTN", "Vodafone"] },
  { code: "KE", name: "Kenya", flag: "https://flagcdn.com/w40/ke.png", region: "Africa", operators: ["Airtel", "Safaricom", "Telkom"] },
  { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png", region: "Africa", operators: ["IAM", "Orange", "inwi"] },
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/w40/ng.png", region: "Africa", operators: ["Airtel", "Glo", "MTN", "9mobile"] },
  { code: "ZA", name: "South Africa", flag: "https://flagcdn.com/w40/za.png", region: "Africa", operators: ["Cell C", "MTN", "Vodacom"] },
  { code: "TZ", name: "Tanzania", flag: "https://flagcdn.com/w40/tz.png", region: "Africa", operators: ["Airtel", "Halotel", "Tigo", "Vodacom"] },
  
  // Asia & Pacific
  { code: "AF", name: "Afghanistan", flag: "https://flagcdn.com/w40/af.png", region: "Asia | The Pacific", operators: ["AWCC", "Atoma", "Etisalat", "Roshan"] },
  { code: "AS", name: "American Samoa", flag: "https://flagcdn.com/w40/as.png", region: "Asia | The Pacific", operators: ["BlueSky"] },
  { code: "AU", name: "Australia", flag: "https://flagcdn.com/w40/au.png", region: "Asia | The Pacific", operators: ["Optus", "Telstra", "Vodafone"] },
  { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png", region: "Asia | The Pacific", operators: ["Banglalink", "Grameenphone", "Robi"] },
  { code: "CN", name: "China", flag: "https://flagcdn.com/w40/cn.png", region: "Asia | The Pacific", operators: ["China Mobile", "China Telecom", "China Unicom"] },
  { code: "HK", name: "Hong Kong", flag: "https://flagcdn.com/w40/hk.png", region: "Asia | The Pacific", operators: ["3HK", "CSL", "SmarTone"] },
  { code: "IN", name: "India", flag: "https://flagcdn.com/w40/in.png", region: "Asia | The Pacific", operators: ["Airtel", "Jio", "Vi"] },
  { code: "ID", name: "Indonesia", flag: "https://flagcdn.com/w40/id.png", region: "Asia | The Pacific", operators: ["Indosat", "Telkomsel", "XL"] },
  { code: "JP", name: "Japan", flag: "https://flagcdn.com/w40/jp.png", region: "Asia | The Pacific", operators: ["au", "Docomo", "SoftBank"] },
  { code: "MY", name: "Malaysia", flag: "https://flagcdn.com/w40/my.png", region: "Asia | The Pacific", operators: ["Celcom", "Digi", "Maxis"] },
  { code: "NZ", name: "New Zealand", flag: "https://flagcdn.com/w40/nz.png", region: "Asia | The Pacific", operators: ["2degrees", "Spark", "Vodafone"] },
  { code: "PK", name: "Pakistan", flag: "https://flagcdn.com/w40/pk.png", region: "Asia | The Pacific", operators: ["Jazz", "Telenor", "Ufone", "Zong"] },
  { code: "PH", name: "Philippines", flag: "https://flagcdn.com/w40/ph.png", region: "Asia | The Pacific", operators: ["Globe", "Smart", "Sun"] },
  { code: "SG", name: "Singapore", flag: "https://flagcdn.com/w40/sg.png", region: "Asia | The Pacific", operators: ["M1", "Singtel", "StarHub"] },
  { code: "KR", name: "South Korea", flag: "https://flagcdn.com/w40/kr.png", region: "Asia | The Pacific", operators: ["KT", "LG U+", "SK Telecom"] },
  { code: "LK", name: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png", region: "Asia | The Pacific", operators: ["Dialog", "Hutch", "Mobitel"] },
  { code: "TH", name: "Thailand", flag: "https://flagcdn.com/w40/th.png", region: "Asia | The Pacific", operators: ["AIS", "True", "dtac"] },
  { code: "VN", name: "Vietnam", flag: "https://flagcdn.com/w40/vn.png", region: "Asia | The Pacific", operators: ["MobiFone", "Viettel", "Vinaphone"] },
  
  // Central | North America
  { code: "CA", name: "Canada", flag: "https://flagcdn.com/w40/ca.png", region: "Central | North America", operators: ["Bell", "Rogers", "Telus"] },
  { code: "CR", name: "Costa Rica", flag: "https://flagcdn.com/w40/cr.png", region: "Central | North America", operators: ["ICE", "Movistar"] },
  { code: "SV", name: "El Salvador", flag: "https://flagcdn.com/w40/sv.png", region: "Central | North America", operators: ["Claro", "Digicel", "Movistar"] },
  { code: "GT", name: "Guatemala", flag: "https://flagcdn.com/w40/gt.png", region: "Central | North America", operators: ["Claro", "Movistar", "Tigo"] },
  { code: "HN", name: "Honduras", flag: "https://flagcdn.com/w40/hn.png", region: "Central | North America", operators: ["Claro", "Tigo"] },
  { code: "MX", name: "Mexico", flag: "https://flagcdn.com/w40/mx.png", region: "Central | North America", operators: ["AT&T", "Movistar", "Telcel"] },
  { code: "NI", name: "Nicaragua", flag: "https://flagcdn.com/w40/ni.png", region: "Central | North America", operators: ["Claro", "Movistar"] },
  { code: "PA", name: "Panama", flag: "https://flagcdn.com/w40/pa.png", region: "Central | North America", operators: ["Claro", "Digicel", "Movistar"] },
  { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png", region: "Central | North America", operators: ["AT&T", "Airvoice", "Black Wireless Monthly Unlimited", "Go Smart", "H2O Wireless", "Life Wireless Unlimited", "T-Mobile", "Verizon", "Cricket", "Boost Mobile", "Metro by T-Mobile", "Straight Talk", "TracFone", "Mint Mobile", "US Mobile"] },
  
  // Europe
  { code: "AL", name: "Albania", flag: "https://flagcdn.com/w40/al.png", region: "Europe", operators: ["Eagle Mobile", "Vodafone"] },
  { code: "AI", name: "Anguilla", flag: "https://flagcdn.com/w40/ai.png", region: "The Caribbean", operators: ["Digicel", "FLOW"] },
  { code: "AT", name: "Austria", flag: "https://flagcdn.com/w40/at.png", region: "Europe", operators: ["3", "A1", "T-Mobile"] },
  { code: "BE", name: "Belgium", flag: "https://flagcdn.com/w40/be.png", region: "Europe", operators: ["Base", "Orange", "Proximus"] },
  { code: "BG", name: "Bulgaria", flag: "https://flagcdn.com/w40/bg.png", region: "Europe", operators: ["A1", "Telenor", "Vivacom"] },
  { code: "HR", name: "Croatia", flag: "https://flagcdn.com/w40/hr.png", region: "Europe", operators: ["A1", "HT", "Telemach"] },
  { code: "CZ", name: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png", region: "Europe", operators: ["O2", "T-Mobile", "Vodafone"] },
  { code: "DK", name: "Denmark", flag: "https://flagcdn.com/w40/dk.png", region: "Europe", operators: ["3", "TDC", "Telenor"] },
  { code: "EE", name: "Estonia", flag: "https://flagcdn.com/w40/ee.png", region: "Europe", operators: ["Elisa", "Tele2", "Telia"] },
  { code: "FI", name: "Finland", flag: "https://flagcdn.com/w40/fi.png", region: "Europe", operators: ["DNA", "Elisa", "Telia"] },
  { code: "FR", name: "France", flag: "https://flagcdn.com/w40/fr.png", region: "Europe", operators: ["Bouygues", "Free", "Orange", "SFR"] },
  { code: "DE", name: "Germany", flag: "https://flagcdn.com/w40/de.png", region: "Europe", operators: ["O2", "T-Mobile", "Vodafone"] },
  { code: "GR", name: "Greece", flag: "https://flagcdn.com/w40/gr.png", region: "Europe", operators: ["Cosmote", "Nova", "Vodafone"] },
  { code: "HU", name: "Hungary", flag: "https://flagcdn.com/w40/hu.png", region: "Europe", operators: ["Magyar Telekom", "Telenor", "Vodafone"] },
  { code: "IE", name: "Ireland", flag: "https://flagcdn.com/w40/ie.png", region: "Europe", operators: ["3", "Eir", "Vodafone"] },
  { code: "IT", name: "Italy", flag: "https://flagcdn.com/w40/it.png", region: "Europe", operators: ["3", "TIM", "Vodafone", "WindTre"] },
  { code: "LV", name: "Latvia", flag: "https://flagcdn.com/w40/lv.png", region: "Europe", operators: ["Bite", "LMT", "Tele2"] },
  { code: "LT", name: "Lithuania", flag: "https://flagcdn.com/w40/lt.png", region: "Europe", operators: ["Bite", "Tele2", "Telia"] },
  { code: "NL", name: "Netherlands", flag: "https://flagcdn.com/w40/nl.png", region: "Europe", operators: ["KPN", "T-Mobile", "VodafoneZiggo"] },
  { code: "NO", name: "Norway", flag: "https://flagcdn.com/w40/no.png", region: "Europe", operators: ["Ice", "Telenor", "Telia"] },
  { code: "PL", name: "Poland", flag: "https://flagcdn.com/w40/pl.png", region: "Europe", operators: ["Orange", "Play", "Plus", "T-Mobile"] },
  { code: "PT", name: "Portugal", flag: "https://flagcdn.com/w40/pt.png", region: "Europe", operators: ["MEO", "NOS", "Vodafone"] },
  { code: "RO", name: "Romania", flag: "https://flagcdn.com/w40/ro.png", region: "Europe", operators: ["Digi", "Orange", "Telekom", "Vodafone"] },
  { code: "RU", name: "Russia", flag: "https://flagcdn.com/w40/ru.png", region: "Europe", operators: ["Beeline", "MegaFon", "MTS", "Tele2"] },
  { code: "SK", name: "Slovakia", flag: "https://flagcdn.com/w40/sk.png", region: "Europe", operators: ["O2", "Orange", "Telekom"] },
  { code: "SI", name: "Slovenia", flag: "https://flagcdn.com/w40/si.png", region: "Europe", operators: ["A1", "Telekom", "Telemach"] },
  { code: "ES", name: "Spain", flag: "https://flagcdn.com/w40/es.png", region: "Europe", operators: ["Movistar", "Orange", "Vodafone", "Yoigo"] },
  { code: "SE", name: "Sweden", flag: "https://flagcdn.com/w40/se.png", region: "Europe", operators: ["3", "Tele2", "Telenor", "Telia"] },
  { code: "CH", name: "Switzerland", flag: "https://flagcdn.com/w40/ch.png", region: "Europe", operators: ["Salt", "Sunrise", "Swisscom"] },
  { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png", region: "Europe", operators: ["Turkcell", "Türk Telekom", "Vodafone"] },
  { code: "UA", name: "Ukraine", flag: "https://flagcdn.com/w40/ua.png", region: "Europe", operators: ["Kyivstar", "Lifecell", "Vodafone"] },
  { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png", region: "Europe", operators: ["3", "giffgaff", "Lebara", "Lyca", "Now Mobile", "O2", "Vodafone"] },
  
  // South America
  { code: "AR", name: "Argentina", flag: "https://flagcdn.com/w40/ar.png", region: "South America", operators: ["Claro", "Movistar", "Personal"] },
  { code: "BO", name: "Bolivia", flag: "https://flagcdn.com/w40/bo.png", region: "South America", operators: ["Entel", "Tigo", "Viva"] },
  { code: "BR", name: "Brazil", flag: "https://flagcdn.com/w40/br.png", region: "South America", operators: ["Claro", "TIM", "Vivo"] },
  { code: "CL", name: "Chile", flag: "https://flagcdn.com/w40/cl.png", region: "South America", operators: ["Claro", "Entel", "Movistar", "WOM"] },
  { code: "CO", name: "Colombia", flag: "https://flagcdn.com/w40/co.png", region: "South America", operators: ["Claro", "Movistar", "Tigo"] },
  { code: "EC", name: "Ecuador", flag: "https://flagcdn.com/w40/ec.png", region: "South America", operators: ["Claro", "CNT", "Movistar"] },
  { code: "PY", name: "Paraguay", flag: "https://flagcdn.com/w40/py.png", region: "South America", operators: ["Claro", "Personal", "Tigo"] },
  { code: "PE", name: "Peru", flag: "https://flagcdn.com/w40/pe.png", region: "South America", operators: ["Bitel", "Claro", "Entel", "Movistar"] },
  { code: "UY", name: "Uruguay", flag: "https://flagcdn.com/w40/uy.png", region: "South America", operators: ["Antel", "Claro", "Movistar"] },
  { code: "VE", name: "Venezuela", flag: "https://flagcdn.com/w40/ve.png", region: "South America", operators: ["Digitel", "Movistar", "Movilnet"] },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All Countries");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            {filteredCountries.map((country) => (
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
            ))}
          </div>

          {filteredCountries.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500">
                No countries found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}