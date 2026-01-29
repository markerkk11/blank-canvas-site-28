import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Star, ChevronDown, Check, User, Sparkles, Globe, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import mainBackground from "/lovable-uploads/52102e75-a9d7-46b6-af98-da3785ca3332.png";
import phoneMockup from "@/assets/phone-mockup.png";
import { removeBackground, loadImageFromUrl } from "@/utils/backgroundRemoval";
import dingLogoFooter from "@/assets/ding-logo-footer.png";
import DingHeader from "@/components/DingHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { DingApiService } from "@/services/dingApiService";
import { MobileOperatorsService } from "@/services/mobileOperatorsService";
import { useToast } from "@/hooks/use-toast";
import { PopularCountriesList } from "@/components/CountriesStats";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
  region: string;
  operators: string[];
}
// Initial empty array - will be populated with live API data from Ding API
const initialCountries: Country[] = [];
export function TopUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { toast } = useToast();
  const {
    isAuthenticated,
    logout
  } = useAuth();
  const isMobile = useIsMobile();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Africa");
  const [isLoading, setIsLoading] = useState(false);
  const [bgRatio, setBgRatio] = useState<number | null>(null);
  
  // Live API data state
  const [countries, setCountries] = useState<Country[]>(initialCountries);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [countriesError, setCountriesError] = useState<string | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = mainBackground;
    const handleLoad = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setBgRatio(img.naturalHeight / img.naturalWidth);
      }
    };
    if (img.complete) handleLoad(); else img.addEventListener('load', handleLoad);
    return () => img.removeEventListener('load', handleLoad);
  }, []);
  const [mobileHeaderHeight, setMobileHeaderHeight] = useState<string | undefined>(undefined);
  useEffect(() => {
    const recalc = () => {
      if (isMobile && bgRatio) {
        setMobileHeaderHeight(`${Math.round(window.innerWidth * bgRatio)}px`);
      } else {
        setMobileHeaderHeight(undefined);
      }
    };
    recalc();
    window.addEventListener('resize', recalc);
    return () => window.removeEventListener('resize', recalc);
  }, [isMobile, bgRatio]);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);

  // Load countries from Ding API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setIsLoadingCountries(true);
        console.log('🌍 Loading countries from comprehensive mobile operators data...');
        
        const data = await MobileOperatorsService.fetchCountriesWithOperators();
        
        // Convert API data to our Country interface format
        const convertedCountries: Country[] = data.countries.map(country => ({
          code: country.code,
          name: country.name,
          flag: `https://flagcdn.com/w40/${country.code.toLowerCase()}.png`,
          dialCode: country.dialCode,
          region: country.region,
          operators: country.operators
        }));

        setCountries(convertedCountries);
        setCountriesError(null);
        
        console.log(`✅ Loaded ${convertedCountries.length} countries with ${data.stats.totalOperators} operators`);

      } catch (error) {
        console.error('❌ Failed to load countries:', error);
        setCountriesError('Failed to load countries. Please try again.');
        
        toast({
          title: "Error Loading Countries",
          description: "Using fallback data. Please refresh to try again.",
          variant: "destructive",
          duration: 5000,
        });
        
        // This should not happen since the service provides fallback data
        // But just in case, we'll set an empty array and show error message
        setCountries([]);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    loadCountries();
  }, [toast]);

  // Testimonials data
  const testimonials = {
    "Africa": {
      name: "Joseph",
      description: "feels secure when buying top-up with Ding",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/7h3L0EYVEHT3N4aqj3a1ub/313b57337842b1e59c7a6b54f5cd0860/Africa.png?w=80&h=80&q=80&fm=png",
      quote: "I worry about scammers when shopping online but with Ding I feel completely safe. The transaction is lightning fast, you'll receive the top-up in less than a minute - I'm not exaggerating!",
      operators: ["mtn", "orange", "vodafone"]
    },
    "Asia | The Pacific": {
      name: "Muhannad",
      description: "sends top-up to friends & family back home",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/H7erxmky4tTlEVbM7cuzf/b322cdd84ca48e93d113e7177117dc69/Asia-thepacific.png?w=80&h=80&q=80&fm=webps",
      quote: "It's an absolutely incredible service where we can top up our families and friends' mobile phones, when they live in remote parts of the world.",
      operators: ["att", "tmobile", "verizon"]
    },
    "The Caribbean": {
      name: "Tania",
      description: "finds it easy to recharge her family in Cuba",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/zyICOL0dYx24goKYjX9n8/143afed9d7fd746bdadcaff7eaa6b48b/The_Caribbean.png?w=80&h=80&q=80&fm=png",
      quote: "Ding makes it so easy and convenient for me to send mobile recharge to my relatives in Cuba. It's easy to set-up a credit card payment and recharging is done almost immediately.",
      operators: ["claro", "movistar"]
    },
    "Central | North America": {
      name: "María",
      description: "finds it easy to recharge her mother's number",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/195IueeyV3ojdTN7w7UoP3/6677cf767400b23e13481446610e4f55/Central-North_America.png?w=80&h=80&q=80&fm=png",
      quote: "My mother is in Mexico and I recharge her number every month. I can rely on Ding to make sure the credit is received, so she doesn't need to go the store to refill her balance.",
      operators: ["tmobile", "att", "verizon"]
    },
    "Europe": {
      name: "Sofia",
      description: "has been using Ding for years to top-up her friends and family",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/3BbpA9yb7tWTqowSPdoqXu/688ab4fa96dfaec15ea5582f67b5cc65/Europe.png?w=80&h=80&q=80&fm=png",
      quote: "I've been using Ding for several years now. It's an awesome service and it's great that I can provide some relief by sending top-up to my friends and family. I'll honestly recommend it to everyone I know.",
      operators: ["vodafone", "orange", "tmobile"]
    },
    "South America": {
      name: "Isabella",
      description: "uses Ding to stay in touch with her children",
      image: "https://images.ctfassets.net/vm4sgchw7ymt/26T2Ws0ZrFeY8XNPM0TzGq/ace592d5cb08eacccb1154922a4672a3/South-america.png?w=80&h=80&q=80&fm=png",
      quote: "I need to stay in touch with my two boys. Ding is an easy and instant way to top-up their phones, so I don't need to go out to buy vouchers anymore. I'm so happy with the service. Please never change!",
      operators: ["claro", "movistar"]
    }
  };

  const regions = Object.keys(testimonials);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Process spinner image to remove background on component mount
  useEffect(() => {
    const processSpinnerImage = async () => {
      try {
        const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
        if (!hasWebGPU) {
          // Skip background removal when WebGPU isn't available
          setProcessedSpinnerUrl('/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png');
          return;
        }

        const image = await loadImageFromUrl('/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png');
        const processedBlob = await removeBackground(image);
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedSpinnerUrl(processedUrl);
      } catch (error) {
        console.error('Error processing spinner image:', error);
        // Fallback to original image
        setProcessedSpinnerUrl('/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png');
      }
    };

    processSpinnerImage();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Filter countries based on phone number input or show all countries
  const filteredCountries = phoneNumber.startsWith('+') 
    ? countries.filter(country => phoneNumber.startsWith(country.dialCode))
    : phoneNumber.length > 0 && /[a-zA-Z]/.test(phoneNumber)
    ? countries.filter(country => 
        country.name.toLowerCase().startsWith(phoneNumber.toLowerCase()) ||
        country.name.toLowerCase().includes(phoneNumber.toLowerCase())
      ).sort((a, b) => {
        // Prioritize countries that start with the typed letters
        const aStartsWith = a.name.toLowerCase().startsWith(phoneNumber.toLowerCase());
        const bStartsWith = b.name.toLowerCase().startsWith(phoneNumber.toLowerCase());
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        return a.name.localeCompare(b.name);
      })
    : countries;

  // Debug log to see what's in the dropdown
  console.log('🔍 [TopUpPage] Dropdown countries:', {
    totalCountries: countries.length,
    filteredCountries: filteredCountries.length,
    isOpen,
    isLoadingCountries,
    countriesError,
    firstFewCountries: filteredCountries.slice(0, 5).map(c => c.name)
  });
  const handlePhoneNumberChange = (value: string) => {
    setPhoneNumber(value);
    
    // Handle empty input
    if (value.length === 0) {
      if (selectedCountry) {
        // If user deletes all text after selecting a country, show dropdown
        setIsOpen(true);
      }
      setSelectedCountry(null);
      return;
    }
    
    // Only show dropdown logic if no country is selected yet
    if (!selectedCountry) {
      // Show matching countries when user enters a dial code, but don't auto-select
      if (value.startsWith('+')) {
        const matchingCountries = countries.filter(country => 
          value.startsWith(country.dialCode)
        );
        if (matchingCountries.length > 0) {
          setIsOpen(true); // Show dropdown with matching countries
        }
      } else if (value.length > 0 && /[a-zA-Z]/.test(value)) {
        // Show dropdown when user types letters (country names)
        setIsOpen(true);
      }
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    // Add the dial code to the input field without space
    setPhoneNumber(country.dialCode);
  };

  const handleStartTopUp = () => {
    console.log('Start Top-up button clicked!', { selectedCountry, phoneNumber });
    
    let finalPhoneNumber = phoneNumber.trim();
    
    // If country is selected and number doesn't start with +, prepend the dial code
    if (selectedCountry && !finalPhoneNumber.startsWith('+')) {
      finalPhoneNumber = selectedCountry.dialCode + finalPhoneNumber;
    }
    
    if (!selectedCountry || !finalPhoneNumber.replace(/\D/g, '').length) {
      console.log('Validation failed:', { selectedCountry, finalPhoneNumber });
      return;
    }
    
    // Show loading animation
    setIsLoading(true);
    
    // Show loading for 2-5 seconds (random between 2000-5000ms)
    const loadingDuration = Math.floor(Math.random() * 3000) + 2000;
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/ding-topup', {
        state: {
          country: selectedCountry,
          phoneNumber: finalPhoneNumber,
          startStep: 2 // Start at provider selection step
        }
      });
    }, loadingDuration);
  };
  return <div className="min-h-screen bg-white">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img 
              src={processedSpinnerUrl || '/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png'} 
              alt="Loading..." 
              className="w-24 md:w-32 h-24 md:h-32"
              style={{
                animation: 'spin-bounce 2s linear infinite'
              }}
            />
          </div>
        </div>
      )}
      
      {/* Header */}
      <header className="relative bg-white overflow-hidden min-h-[250px] md:min-h-[400px] h-auto md:h-[50vh]" style={isMobile && mobileHeaderHeight ? { height: mobileHeaderHeight } : undefined}>
        <div className="absolute inset-0">
          <div 
            className="w-full h-full transition-all duration-300" 
            style={{
              backgroundImage: `url(${mainBackground})`,
              backgroundSize: isMobile ? "250% auto" : "cover",
              backgroundPosition: isMobile ? 'calc(50% + 250px) top' : 'center center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
        </div>
        
        <DingHeader variant="topup" onLogout={logout} />
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-4 md:py-7 mt-16 md:mt-24" style={{ marginTop: '35px' }}>
          <h1 className="font-bold text-white mb-4 md:mb-8 w-full text-sm md:text-4xl lg:text-5xl xl:text-6xl leading-tight md:leading-normal" style={{ marginTop: isMobile ? '0' : '5px', transform: isMobile ? 'translateY(-3px)' : 'none' }} dangerouslySetInnerHTML={{ __html: t('sendMobileTopUp') }}></h1>
          <p className="md:text-xl lg:text-2xl xl:text-3xl text-white mb-8 md:mb-16 opacity-95 max-w-3xl mx-auto" style={{ marginTop: isMobile ? '7px' : '-16px', fontSize: isMobile ? '0.65rem' : undefined, transform: isMobile ? 'translateY(-26px)' : 'none', lineHeight: isMobile ? 'normal' : '1.2' }} dangerouslySetInnerHTML={{ __html: t('heroSubtext') }}></p>
        </div>
      </header>

      {/* Top-up Form */}
      <div className="w-full pb-2 bg-white -mt-[3rem] md:-mt-[4.25rem] relative z-50 rounded-t-[40px]">
        
        <div className="w-full px-4 md:max-w-md md:mx-auto" style={{ transform: window.innerWidth < 768 ? 'translateX(5px)' : 'none' }}>
          <Card className="bg-white p-7 md:p-8 rounded-3xl md:rounded-3xl shadow-card border text-xs md:text-base relative z-[1000]" style={{borderColor: '#b9cbd3', transform: 'translateY(60px) scale(0.9)', transformOrigin: 'center'}}>
            <h2 className="text-base md:text-lg font-bold text-center mb-4 md:mb-8 text-foreground">
              {t('readyToSendTopUp')}
            </h2>
            
            <div className="space-y-3 md:space-y-6">
              <div className="relative" ref={dropdownRef}>
                <div className="relative">
                  {selectedCountry && phoneNumber ? (
                    <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-6 md:h-6 z-10 object-cover rounded-full" />
                  ) : selectedCountry && !phoneNumber ? (
                    <Globe className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 z-10" color="#617b7b" />
                  ) : (
                    <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 z-10" color="#617b7b" />
                  )}
                   
                   
                    {/* Floating Label */}
                    <label 
                       className={`absolute transition-all duration-300 ease-out pointer-events-none z-20 ${
                         selectedCountry 
                           ? 'left-[68px]' // Move right when country is selected (64px + 4px)
                           : 'left-12' // Default position with search icon
                       } ${
                         isOpen || phoneNumber || selectedCountry || isFocused
                           ? 'top-1 text-xs bg-white px-1' 
                           : 'top-1/2 -translate-y-1/2 text-base'
                       }`}
                       style={{color: '#617b7b'}}
                    >
                      {t('enterNumber')}
                    </label>
                   
                      <div 
                      className="h-10 md:h-14 flex items-center pl-10 md:pl-12 pr-3 md:pr-4 border rounded-full bg-white hover:outline hover:outline-[3px] hover:outline-[#befa4c78] transition-all cursor-pointer" style={{borderColor: '#b9cbd3'}}
                      onClick={() => {
                        console.log('Dropdown clicked, current isOpen:', isOpen);
                        setIsOpen(!isOpen);
                      }}
                    >
                       <div className="flex items-center w-full">
                          {selectedCountry && (
                            <ChevronDown 
                              className={`w-3 h-3 mr-3 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                              color="#617b7b" 
                            />
                          )}
                          <input 
                            type="tel" 
                            value={phoneNumber} 
                            onChange={e => handlePhoneNumberChange(e.target.value)}
                            onFocus={() => {
                              setIsFocused(true);
                              setIsOpen(false);
                            }}
                            onBlur={() => setIsFocused(false)}
                             className="border-0 bg-transparent text-xs md:text-sm p-0 focus:ring-0 focus:outline-none flex-1 font-sans leading-none py-1"
                             style={{ marginTop: '14px' }}
                            onClick={e => e.stopPropagation()}
                            placeholder={selectedCountry ? "Enter phone number" : ""}
                          />
                       </div>
                  </div>
                  
                  {/* Dropdown */}
                  {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 shadow-lg z-[9999999] rounded-2xl">
                      <div className="max-h-80 overflow-auto bg-white rounded-2xl">
                        {isLoadingCountries ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-sm text-gray-600">Loading countries from Ding API...</span>
                          </div>
                        ) : countriesError ? (
                          <div className="flex items-center justify-center py-8 text-red-600">
                            <span className="text-sm">{countriesError}</span>
                          </div>
                        ) : filteredCountries.length === 0 ? (
                          <div className="flex items-center justify-center py-8">
                            <span className="text-sm text-gray-500">No countries found</span>
                          </div>
                        ) : (
                          filteredCountries.map(country => (
                          <div 
                            key={country.code} 
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCountrySelect(country);
                            }} 
                            className={cn(
                              "flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors", 
                              selectedCountry?.code === country.code && "bg-lime-50"
                            )}
                          >
                            <img src={country.flag} alt={`${country.name} flag`} className="w-8 h-8 mr-3 object-cover rounded-full" />
                            <div className="flex-1 flex items-center justify-between">
                              <div className="font-medium text-foreground">{country.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">{country.dialCode}</div>
                             </div>
                             {selectedCountry?.code === country.code && <Check className="w-5 h-5 text-lime-600" />}
                           </div>
                         )))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <Button onClick={handleStartTopUp} disabled={!selectedCountry || !phoneNumber.trim()} className="w-full h-10 md:h-14 text-sm md:text-lg font-bold bg-lime-400 hover:bg-lime-400 text-foreground border-0 rounded-full shadow-sm disabled:bg-lime-400 disabled:text-foreground disabled:opacity-100 transition-transform duration-200 hover:scale-95" size="lg">
                {t('startTopUp')}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="text-center pt-1 pb-2 px-8 relative z-0 pointer-events-none">
        <img 
          src="/lovable-uploads/d0c65de3-8c0c-4e1d-9e0a-1609531d3f75.png" 
          alt="Trustpilot 4.6 Rated Excellent based on 13,805 reviews" 
          className="hidden md:block mx-auto h-20 transition-opacity mt-16 md:mt-20 pointer-events-none select-none"
        />
      </div>

      {/* App Download Section */}
      <div className="px-8 pb-8 pointer-events-none">
        <img 
          src="/lovable-uploads/de72478a-42b3-4e3a-b975-e622b04f8196.png" 
          alt="Top-up wherever, whenever - Get the Ding App" 
          className="w-full max-w-2xl mx-auto"
          style={{ transform: 'translateY(60px)' }}
        />
      </div>

      {/* Customer Testimonials Section */}
      <div className="bg-white pt-8 pb-16 px-8 hidden md:block">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold text-foreground">
              {selectedRegion === "Africa" ? "Send love" : 
               selectedRegion === "Asia | The Pacific" ? "Send a little joy" : 
               selectedRegion === "The Caribbean" ? "Send a little happiness" :
               selectedRegion === "Central | North America" ? "Send a little smile" :
               selectedRegion === "Europe" ? "Send a little cheer" :
               selectedRegion === "South America" ? "Send a big hug" :
               "Send a little smile"}
            </h2>
            <p className="text-4xl font-bold text-foreground">
              {selectedRegion === "Africa" ? "from Los Angeles to Accra" : 
               selectedRegion === "Asia | The Pacific" ? "from Amman to Manila" :
               selectedRegion === "The Caribbean" ? "from Miami to Havana" :
               selectedRegion === "Central | North America" ? "from Dallas to San Salvador" :
               selectedRegion === "Europe" ? "from London to Rome" :
               selectedRegion === "South America" ? "from Chicago to Bogota" :
               "from Dallas to San Salvador"}
            </p>
          </div>
          
          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {regions.map((region) => (
              <button 
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setTimeout(() => {
                    const element = document.getElementById('testimonial-section');
                    if (element) {
                      element.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center',
                        inline: 'nearest'
                      });
                    }
                  }, 150);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  selectedRegion === region 
                    ? 'bg-lime-400 text-foreground border-lime-400' 
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
          
          {/* Single Testimonial Display */}
          <div id="testimonial-section" ref={testimonialRef} className="flex justify-center scroll-mt-20">
            <div className="bg-white p-8 rounded-lg max-w-2xl animate-fade-in">
              {/* Quote at the top */}
              <p className="text-foreground text-lg leading-relaxed mb-8 text-center">
                "{testimonials[selectedRegion].quote}"
              </p>
              
              {/* Profile section */}
              <div className="text-center">
                <img 
                  src={testimonials[selectedRegion].image} 
                  alt={`${selectedRegion} customer`} 
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h4 className="text-foreground text-lg mb-1">
                  <span className="font-semibold">{testimonials[selectedRegion].name}</span> - <span className="font-normal">{testimonials[selectedRegion].description}</span>
                </h4>
                
                {/* Star Rating */}
                <div className="flex justify-center items-center space-x-1">
                  {[...Array(4)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <defs>
                      <linearGradient id="halfStar">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="#e5e7eb" />
                      </linearGradient>
                    </defs>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="url(#halfStar)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Images below testimonial - region specific */}
          {selectedRegion === "Africa" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/dffc2429-e402-4bb3-af85-0234e2f2e5dd.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          {selectedRegion === "Asia | The Pacific" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/037c5e20-c214-4ed5-ae7d-1ef1f92b65f9.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          {selectedRegion === "The Caribbean" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/bc252ea7-1cb5-4a65-a8a3-139547929d59.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          {selectedRegion === "Central | North America" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/87e5f6e7-6ec5-4a38-9817-e36f83023448.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}
          {selectedRegion === "Europe" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/2a334ab1-fc94-4af5-b43c-2177e9db48e5.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}

          {selectedRegion === "South America" && (
            <div className="flex justify-center mt-8">
              <img 
                src="/lovable-uploads/31cc8d1e-b010-4bc4-a782-ae68ed37d773.png" 
                alt="Partner logos" 
                className="max-w-full h-auto"
              />
            </div>
          )}

          {/* Supported payment methods section */}
          <div className="text-center mt-12 mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6">{t('supportedPaymentMethods')}</h3>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/1fb8e88a-d4b0-4042-a2fa-df8646ac3e87.png" 
                alt="Supported payment methods: Visa, Mastercard, PayPal, Apple Pay, Google Pay, JCB, Union Pay" 
                className="max-w-full h-auto"
              />
            </div>
          </div>

          <div className="w-full py-16 px-8 mt-16" style={{backgroundColor: '#004a59'}}>
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-4xl font-bold mb-6 uppercase tracking-wide" style={{color: '#ccfff6'}}>
                {t('trustedByOverTitle')}
              </h3>
              <p className="text-xl max-w-4xl mx-auto leading-relaxed" style={{color: '#ccfff6'}}>
                {t('trustedByOverDesc')}
              </p>
            </div>
          </div>
        </div>
          </div>

          {/* FAQ Section - Clean design matching ding.com */}
          <div className="bg-white py-16 px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12" style={{color: '#004a59'}}>{t('frequentlyAsked')}</h2>
              
              <div className="space-y-0">
                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('whatIsDing')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p className="mb-3">{t('whatIsDingAnswer1')}</p>
                    <p>{t('whatIsDingAnswer2')}</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('whatIsMobileTopUp')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p>{t('whatIsMobileTopUpAnswer')}</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('canSendFromAbroad')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p>{t('canSendFromAbroadAnswer')}</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('howToSendTopUp')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p>{t('howToSendTopUpAnswer')}</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('canISendData')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p className="mb-4">{t('canISendDataAnswer1')}</p>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>{t('canISendDataPoint1')}</li>
                      <li>{t('canISendDataPoint2')}</li>
                    </ul>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('popularCountriesQuestion')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <PopularCountriesList />
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('popularOperatorsQuestion')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p>We support all major mobile operators worldwide including MTN, Vodafone, Orange, Airtel, T-Mobile, Claro, and many more.</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('payWithCreditCardQuestion')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p>{t('payWithCreditCardAnswer')}</p>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('getPromotionsQuestion')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p className="mb-4">{t('getPromotionsAnswer1')}</p>
                    <p className="mb-4">{t('getPromotionsAnswer2')}</p>
                    <ol className="list-decimal ml-6 space-y-1">
                      <li>{t('getPromotionsStep1')}</li>
                      <li>{t('getPromotionsStep2')}</li>
                      <li>{t('getPromotionsStep3')}</li>
                      <li>{t('getPromotionsStep4')}</li>
                      <li>{t('getPromotionsStep5')}</li>
                    </ol>
                  </div>
                </details>

                <details className="group border-b border-gray-200">
                  <summary className="py-6 px-0 text-lg font-medium cursor-pointer flex justify-between items-center list-none" style={{color: '#004a59'}}>
                    <span>{t('buyGiftCardsQuestion')}</span>
                    <ChevronDown className="w-5 h-5 transform transition-transform duration-200 group-open:rotate-180" style={{color: '#004a59'}} />
                  </summary>
                  <div className="pb-6 leading-relaxed" style={{color: '#004a59'}}>
                    <p className="mb-3">{t('buyGiftCardsAnswer1')}</p>
                    <p>{t('buyGiftCardsAnswer2')}</p>
                  </div>
                </details>
              </div>
            </div>
          </div>


      {/* Footer */}
      <footer className="bg-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left side - Logo, tagline and social icons */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <img 
                  src="/lovable-uploads/6744405e-acfb-40e2-9eb1-e6d7b948997e.png" 
                  alt="ding" 
                  className="h-8 cursor-pointer mb-4" 
                  style={{filter: 'brightness(0) saturate(100%) invert(19%) sepia(48%) saturate(1158%) hue-rotate(164deg) brightness(95%) contrast(101%)'}}
                  onClick={() => navigate('/topup')} 
                />
                <p className="text-sm font-normal flex items-center gap-1" style={{color: '#004a59'}}>
                  A little goes a long way <img src="/lovable-uploads/b4477753-e645-44d7-ba20-462403dd55ce.png" alt="star" className="w-8 h-8" />
                </p>
              </div>
              
              {/* Social Icons */}
              <div className="flex space-x-4">
                <a href="#" className="hover:opacity-80 transition-opacity" style={{color: '#004a59'}}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" style={{color: '#004a59'}}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" style={{color: '#004a59'}}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity" style={{color: '#004a59'}}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Right side - Link columns */}
            <div>
              <h3 className="font-medium mb-4 text-xs" style={{color: '#004a59'}}>{t('company')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('aboutUs')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('press')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('careers')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-xs" style={{color: '#004a59'}}>{t('legal')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('privacyNotice')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('friendsFamilyPrivacyNotice')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('termsAndConditions')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('cookies')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4 text-xs" style={{color: '#004a59'}}>{t('help')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('supportCentre')}</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-800 transition-colors text-xs">{t('sitemap')}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
      </div>;
}