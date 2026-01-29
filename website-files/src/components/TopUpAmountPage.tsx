import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { removeBackground } from "@/utils/backgroundRemoval";
import DingHeader from "@/components/DingHeader";
import { useTranslation } from "@/hooks/useTranslation";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface Provider {
  id: string;
  name: string;
  logo: string;
  type: string;
}

interface LocationState {
  country: Country;
  phoneNumber: string;
  provider: Provider;
}

// Top-up amounts in USD
const topUpAmounts = [
  { value: 5, label: "$5.00" },
  { value: 10, label: "$10.00" },
  { value: 15, label: "$15.00" },
  { value: 20, label: "$20.00" },
  { value: 25, label: "$25.00" },
  { value: 30, label: "$30.00" },
  { value: 50, label: "$50.00" },
  { value: 100, label: "$100.00" }
];

export function TopUpAmountPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setCountry(state.country);
      setPhoneNumber(state.phoneNumber);
      setProvider(state.provider);
    } else {
      // Redirect back if no data
      navigate("/provider-selection");
    }
  }, [location, navigate]);

  useEffect(() => {
    const processSpinnerImage = async () => {
      try {
        const img = new Image();
        img.src = '/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png';
        const processedBlob = await removeBackground(img);
        const processedUrl = URL.createObjectURL(processedBlob);
        setProcessedSpinnerUrl(processedUrl);
      } catch (error) {
        console.error('Failed to process spinner image:', error);
      }
    };

    processSpinnerImage();
  }, []);

  const handleAmountSelect = async (amount: number) => {
    setSelectedAmount(amount);
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setIsLoading(false);
    
    if (isAuthenticated) {
      // If user is already authenticated, skip sign-in and go directly to order
      navigate("/order", {
        state: {
          country,
          phoneNumber,
          provider,
          amount
        }
      });
    } else {
      // If not authenticated, navigate to sign-in page with all the data
      navigate("/signin", {
        state: {
          country,
          phoneNumber,
          provider,
          amount
        }
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!country || !provider) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/90 z-[9999] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <img 
              src={processedSpinnerUrl || '/lovable-uploads/9917a2e4-d2bb-4578-bafe-09978072bfcf.png'} 
              alt="Loading..." 
              className="w-32 h-32"
              style={{
                animation: 'spin-bounce 2s linear infinite'
              }}
            />
          </div>
        </div>
      )}
      <DingHeader variant="topup" />
      
      {/* Back button and title */}
      <div className="px-4 py-3 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            className="text-muted-foreground hover:text-foreground p-2 h-auto"
            onClick={handleBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{t('topUp')}</h1>
          <div className="w-9"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Phone Number Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-card px-4 py-3 rounded-2xl shadow-sm border border-border/50">
            <img src={country.flag} alt={`${country.name} flag`} className="w-6 h-6 rounded object-cover" />
            <span className="text-lg font-semibold text-foreground">
              {country.dialCode} {phoneNumber}
            </span>
          </div>
        </div>

        {/* Provider Card */}
        <div className="mb-8">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center space-x-3">
              <img 
                src={provider.logo} 
                alt={`${provider.name} logo`} 
                className="h-8 w-8 object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23e5e7eb' rx='4'/%3E%3Ctext x='16' y='16' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='10' fill='%236b7280'%3ELogo%3C/text%3E%3C/svg%3E";
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{provider.name}</h3>
                {provider.type && (
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mt-1">
                    {provider.type}
                  </span>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Amount Selection */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-6 text-foreground text-center">
            {t('chooseAmount')}
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {topUpAmounts.map((amount) => (
              <Card 
                key={amount.value}
                className={`relative overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedAmount === amount.value 
                    ? "border-primary bg-primary/5 shadow-lg" 
                    : "border-border/50 hover:border-primary/30"
                }`}
                onClick={() => handleAmountSelect(amount.value)}
              >
                <div className="p-6 text-center">
                  <div className="text-2xl font-bold text-foreground mb-1">{amount.label}</div>
                  <div className="text-sm text-muted-foreground">{t('topUp')}</div>
                </div>
                {selectedAmount === amount.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}