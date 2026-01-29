import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Edit, Plus } from "lucide-react";
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
  amount: number;
  email?: string;
  isEmailMode?: boolean;
}

export function OrderPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState<LocationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setOrderData(state);
    } else {
      navigate("/");
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

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinueToPayment = async () => {
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    setIsLoading(false);
    
    navigate("/payment", { state: orderData });
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const fees = (orderData.amount * 0.175).toFixed(2); // 17.5% fee
  const total = (orderData.amount + parseFloat(fees)).toFixed(2);

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
          <h1 className="text-lg font-semibold text-foreground">{t('yourOrderTitle')}</h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Hero Section with Illustration */}
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Simple illustration placeholder */}
              <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 bg-white/30 rounded-lg"></div>
              </div>
              {/* Character illustration */}
              <div className="absolute -right-2 -bottom-2 w-16 h-20 bg-gradient-to-b from-yellow-400 to-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          {/* Phone Number Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-foreground">
                {orderData.country.dialCode} {orderData.phoneNumber}
              </span>
              <div className="flex items-center space-x-2">
                <img 
                  src={orderData.provider.logo} 
                  alt={`${orderData.provider.name} logo`} 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='24' fill='%23e5e7eb' rx='2'/%3E%3Ctext x='12' y='12' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='10' fill='%236b7280'%3E{orderData.provider.name.charAt(0)%3C/text%3E%3C/svg%3E";
                  }}
                />
                <span className="text-sm text-muted-foreground">{orderData.provider.name}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          {/* Amount Section */}
          <div className="mb-6">
            <p className="text-muted-foreground text-sm mb-1">{t('receivesLabel')}</p>
            <p className="text-3xl font-bold text-foreground">{orderData.amount}.00 USD</p>
          </div>

          {/* Promo Code Section */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              className="text-primary p-0 h-auto font-medium flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>{t('addPromoCode')}</span>
            </Button>
          </div>

          {/* Total Section */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-foreground">{t('yourTotal')}</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-foreground">{total} USD</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ArrowLeft className="h-3 w-3 rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Continue Button */}
        <Button
          onClick={handleContinueToPayment}
          className="w-full py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white shadow-lg"
          size="lg"
        >
          {t('continueToPayment')}
        </Button>
      </div>
    </div>
  );
}