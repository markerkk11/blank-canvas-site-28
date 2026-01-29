import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, Phone, Loader2 } from "lucide-react";
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
  amount: number;
}

export function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [country, setCountry] = useState<Country | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [provider, setProvider] = useState<Provider | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [verificationNumber, setVerificationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [noMarketing, setNoMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [processedSpinnerUrl, setProcessedSpinnerUrl] = useState<string | null>(null);

  useEffect(() => {
    const state = location.state as LocationState;
    
    // Check if we're coming from authorization page with email mode
    if (location.state?.emailMode) {
      setIsEmailMode(true);
      return;
    }
    
    if (state) {
      setCountry(state.country);
      setPhoneNumber(state.phoneNumber);
      setProvider(state.provider);
      setAmount(state.amount);
      setVerificationNumber(state.phoneNumber);
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

  const handleConfirmPhoneNumber = async () => {
    setIsLoading(true);
    
    // Show loading animation for 2-5 seconds
    const loadingTime = Math.random() * 3000 + 2000;
    await new Promise(resolve => setTimeout(resolve, loadingTime));
    
    if (isEmailMode) {
      console.log("Confirming with email:", email);
      // Login with email
      login({ email });
    } else {
      console.log("Confirming phone number:", verificationNumber);
      // Login with phone
      login({ 
        phone: country?.dialCode + phoneNumber,
        country: country?.name
      });
    }
    
    setIsLoading(false);
    
    // Navigate to order page with all the data
    navigate("/order", {
      state: {
        country,
        phoneNumber,
        provider,
        amount,
        email: isEmailMode ? email : undefined,
        isEmailMode
      }
    });
  };

  const handleEmailModeToggle = () => {
    setIsEmailMode(!isEmailMode);
  };

  const handleSocialLogin = (provider: string) => {
    console.log("Social login with:", provider);
    // Here you would implement social login logic
  };

  if (!country || !provider || !amount) {
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
          <h1 className="text-lg font-semibold text-foreground">{t('signIn')}</h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Summary Card */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            {t('whoWouldYouLikeToTopUp')}
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('country')}:</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img src={country.flag} alt={`${country.name} flag`} className="w-5 h-5 rounded object-cover" />
                  <span className="font-medium text-foreground">{country.name} ({country.code})</span>
                </div>
                <Button variant="ghost" className="text-primary text-sm p-0 h-auto font-medium">
                  {t('edit')}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('operator')}:</span>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <img 
                    src={provider.logo} 
                    alt={`${provider.name} logo`} 
                    className="h-5 w-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='20' height='20' fill='%23e5e7eb' rx='2'/%3E%3Ctext x='10' y='10' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='8' fill='%236b7280'%3ELogo%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <span className="font-medium text-foreground">{provider.name}</span>
                </div>
                <Button variant="ghost" className="text-primary text-sm p-0 h-auto font-medium">
                  {t('edit')}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('pinTopUpAmount')}:</span>
              <div className="flex items-center space-x-3">
                <span className="font-medium text-foreground">${amount}.00 USD</span>
                <Button variant="ghost" className="text-primary text-sm p-0 h-auto font-medium">
                  {t('edit')}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Sign In Form */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h2 className="text-xl font-semibold text-center text-foreground mb-2">
            {t('letGetYouSignedIn')}
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            {isEmailMode 
              ? t('wellSendVerificationLink')
              : t('wellTextYouCodeToVerify')
            }
          </p>

          <div className="space-y-4">
            {/* Phone Number or Email Input */}
            <div className="relative">
              {isEmailMode ? (
                <Input
                  type="email"
                  placeholder={t('enterYourEmailAddress')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-border rounded-xl px-4 py-3 text-base"
                />
              ) : (
                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center px-3 py-3 bg-muted/50">
                    <img src={country.flag} alt={`${country.name} flag`} className="w-5 h-5 rounded object-cover mr-2" />
                    <span className="text-sm text-foreground">{country.dialCode}</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder={t('enterNumber')}
                    value={verificationNumber}
                    onChange={(e) => setVerificationNumber(e.target.value)}
                    className="border-0 bg-transparent px-3 py-3 text-base focus-visible:ring-0"
                  />
                </div>
              )}
            </div>

            {/* Marketing Checkbox */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="no-marketing"
                checked={noMarketing}
                onCheckedChange={(checked) => setNoMarketing(checked as boolean)}
                className="mt-1"
              />
              <label
                htmlFor="no-marketing"
                className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
              >
                {t('iDoNotWishToReceive')}
              </label>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={handleConfirmPhoneNumber}
              disabled={isLoading || (isEmailMode ? !email.trim() : !verificationNumber.trim())}
              className="w-full py-3 text-base font-semibold rounded-xl bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('loading')}</span>
                </div>
              ) : (
                t('continueBtn')
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-4 text-muted-foreground">{t('continueWith')}</span>
              </div>
            </div>

            {/* Phone/Email Toggle */}
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${!isEmailMode ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setIsEmailMode(false)}
              >
                <Phone className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 rounded-full ${isEmailMode ? 'bg-primary text-primary-foreground' : ''}`}
                onClick={() => setIsEmailMode(true)}
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>

            {/* Terms and Privacy */}
            <div className="text-center text-sm text-muted-foreground mt-6">
              {t('readFullTerms')}{" "}
              <button className="text-primary underline">{t('terms')}</button>
              {" "}{t('and')}{" "}
              <button className="text-primary underline">{t('authPrivacyNotice')}</button>.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}