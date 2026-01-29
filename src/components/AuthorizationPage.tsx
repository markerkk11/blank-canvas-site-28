import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, Mail, Search, Check, Loader2, User, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import DingHeader from "@/components/DingHeader";
import { useTranslation } from "@/hooks/useTranslation";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "US", name: "United States", flag: "https://flagcdn.com/w40/us.png", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "https://flagcdn.com/w40/ca.png", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "https://flagcdn.com/w40/au.png", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "https://flagcdn.com/w40/de.png", dialCode: "+49" },
  { code: "FR", name: "France", flag: "https://flagcdn.com/w40/fr.png", dialCode: "+33" },
  { code: "IT", name: "Italy", flag: "https://flagcdn.com/w40/it.png", dialCode: "+39" },
  { code: "ES", name: "Spain", flag: "https://flagcdn.com/w40/es.png", dialCode: "+34" },
  { code: "NL", name: "Netherlands", flag: "https://flagcdn.com/w40/nl.png", dialCode: "+31" },
  { code: "BE", name: "Belgium", flag: "https://flagcdn.com/w40/be.png", dialCode: "+32" },
  { code: "CH", name: "Switzerland", flag: "https://flagcdn.com/w40/ch.png", dialCode: "+41" },
  { code: "AT", name: "Austria", flag: "https://flagcdn.com/w40/at.png", dialCode: "+43" },
  { code: "SE", name: "Sweden", flag: "https://flagcdn.com/w40/se.png", dialCode: "+46" },
  { code: "NO", name: "Norway", flag: "https://flagcdn.com/w40/no.png", dialCode: "+47" },
  { code: "DK", name: "Denmark", flag: "https://flagcdn.com/w40/dk.png", dialCode: "+45" },
  { code: "FI", name: "Finland", flag: "https://flagcdn.com/w40/fi.png", dialCode: "+358" },
  { code: "IE", name: "Ireland", flag: "https://flagcdn.com/w40/ie.png", dialCode: "+353" },
  { code: "PT", name: "Portugal", flag: "https://flagcdn.com/w40/pt.png", dialCode: "+351" },
  { code: "GR", name: "Greece", flag: "https://flagcdn.com/w40/gr.png", dialCode: "+30" },
  { code: "PL", name: "Poland", flag: "https://flagcdn.com/w40/pl.png", dialCode: "+48" },
  { code: "CZ", name: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png", dialCode: "+420" },
  { code: "HU", name: "Hungary", flag: "https://flagcdn.com/w40/hu.png", dialCode: "+36" },
  { code: "RO", name: "Romania", flag: "https://flagcdn.com/w40/ro.png", dialCode: "+40" },
  { code: "BG", name: "Bulgaria", flag: "https://flagcdn.com/w40/bg.png", dialCode: "+359" },
  { code: "HR", name: "Croatia", flag: "https://flagcdn.com/w40/hr.png", dialCode: "+385" },
  { code: "SI", name: "Slovenia", flag: "https://flagcdn.com/w40/si.png", dialCode: "+386" },
  { code: "SK", name: "Slovakia", flag: "https://flagcdn.com/w40/sk.png", dialCode: "+421" },
  { code: "LT", name: "Lithuania", flag: "https://flagcdn.com/w40/lt.png", dialCode: "+370" },
  { code: "LV", name: "Latvia", flag: "https://flagcdn.com/w40/lv.png", dialCode: "+371" },
  { code: "EE", name: "Estonia", flag: "https://flagcdn.com/w40/ee.png", dialCode: "+372" },
  { code: "RU", name: "Russia", flag: "https://flagcdn.com/w40/ru.png", dialCode: "+7" },
  { code: "UA", name: "Ukraine", flag: "https://flagcdn.com/w40/ua.png", dialCode: "+380" },
  { code: "BY", name: "Belarus", flag: "https://flagcdn.com/w40/by.png", dialCode: "+375" },
  { code: "JP", name: "Japan", flag: "https://flagcdn.com/w40/jp.png", dialCode: "+81" },
  { code: "KR", name: "South Korea", flag: "https://flagcdn.com/w40/kr.png", dialCode: "+82" },
  { code: "CN", name: "China", flag: "https://flagcdn.com/w40/cn.png", dialCode: "+86" },
  { code: "IN", name: "India", flag: "https://flagcdn.com/w40/in.png", dialCode: "+91" },
  { code: "ID", name: "Indonesia", flag: "https://flagcdn.com/w40/id.png", dialCode: "+62" },
  { code: "TH", name: "Thailand", flag: "https://flagcdn.com/w40/th.png", dialCode: "+66" },
  { code: "VN", name: "Vietnam", flag: "https://flagcdn.com/w40/vn.png", dialCode: "+84" },
  { code: "MY", name: "Malaysia", flag: "https://flagcdn.com/w40/my.png", dialCode: "+60" },
  { code: "SG", name: "Singapore", flag: "https://flagcdn.com/w40/sg.png", dialCode: "+65" },
  { code: "PH", name: "Philippines", flag: "https://flagcdn.com/w40/ph.png", dialCode: "+63" },
  { code: "HK", name: "Hong Kong", flag: "https://flagcdn.com/w40/hk.png", dialCode: "+852" },
  { code: "TW", name: "Taiwan", flag: "https://flagcdn.com/w40/tw.png", dialCode: "+886" },
  { code: "BR", name: "Brazil", flag: "https://flagcdn.com/w40/br.png", dialCode: "+55" },
  { code: "AR", name: "Argentina", flag: "https://flagcdn.com/w40/ar.png", dialCode: "+54" },
  { code: "MX", name: "Mexico", flag: "https://flagcdn.com/w40/mx.png", dialCode: "+52" },
  { code: "CL", name: "Chile", flag: "https://flagcdn.com/w40/cl.png", dialCode: "+56" },
  { code: "CO", name: "Colombia", flag: "https://flagcdn.com/w40/co.png", dialCode: "+57" },
  { code: "PE", name: "Peru", flag: "https://flagcdn.com/w40/pe.png", dialCode: "+51" },
  { code: "VE", name: "Venezuela", flag: "https://flagcdn.com/w40/ve.png", dialCode: "+58" },
  { code: "UY", name: "Uruguay", flag: "https://flagcdn.com/w40/uy.png", dialCode: "+598" },
  { code: "PY", name: "Paraguay", flag: "https://flagcdn.com/w40/py.png", dialCode: "+595" },
  { code: "BO", name: "Bolivia", flag: "https://flagcdn.com/w40/bo.png", dialCode: "+591" },
  { code: "EC", name: "Ecuador", flag: "https://flagcdn.com/w40/ec.png", dialCode: "+593" },
  { code: "ZA", name: "South Africa", flag: "https://flagcdn.com/w40/za.png", dialCode: "+27" },
  { code: "NG", name: "Nigeria", flag: "https://flagcdn.com/w40/ng.png", dialCode: "+234" },
  { code: "EG", name: "Egypt", flag: "https://flagcdn.com/w40/eg.png", dialCode: "+20" },
  { code: "KE", name: "Kenya", flag: "https://flagcdn.com/w40/ke.png", dialCode: "+254" },
  { code: "GH", name: "Ghana", flag: "https://flagcdn.com/w40/gh.png", dialCode: "+233" },
  { code: "MA", name: "Morocco", flag: "https://flagcdn.com/w40/ma.png", dialCode: "+212" },
  { code: "TN", name: "Tunisia", flag: "https://flagcdn.com/w40/tn.png", dialCode: "+216" },
  { code: "DZ", name: "Algeria", flag: "https://flagcdn.com/w40/dz.png", dialCode: "+213" },
  { code: "ET", name: "Ethiopia", flag: "https://flagcdn.com/w40/et.png", dialCode: "+251" },
  { code: "UG", name: "Uganda", flag: "https://flagcdn.com/w40/ug.png", dialCode: "+256" },
  { code: "TZ", name: "Tanzania", flag: "https://flagcdn.com/w40/tz.png", dialCode: "+255" },
  { code: "ZW", name: "Zimbabwe", flag: "https://flagcdn.com/w40/zw.png", dialCode: "+263" },
  { code: "ZM", name: "Zambia", flag: "https://flagcdn.com/w40/zm.png", dialCode: "+260" },
  { code: "MW", name: "Malawi", flag: "https://flagcdn.com/w40/mw.png", dialCode: "+265" },
  { code: "MZ", name: "Mozambique", flag: "https://flagcdn.com/w40/mz.png", dialCode: "+258" },
  { code: "BW", name: "Botswana", flag: "https://flagcdn.com/w40/bw.png", dialCode: "+267" },
  { code: "NA", name: "Namibia", flag: "https://flagcdn.com/w40/na.png", dialCode: "+264" },
  { code: "TR", name: "Turkey", flag: "https://flagcdn.com/w40/tr.png", dialCode: "+90" },
  { code: "IL", name: "Israel", flag: "https://flagcdn.com/w40/il.png", dialCode: "+972" },
  { code: "SA", name: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png", dialCode: "+966" },
  { code: "AE", name: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png", dialCode: "+971" },
  { code: "QA", name: "Qatar", flag: "https://flagcdn.com/w40/qa.png", dialCode: "+974" },
  { code: "KW", name: "Kuwait", flag: "https://flagcdn.com/w40/kw.png", dialCode: "+965" },
  { code: "BH", name: "Bahrain", flag: "https://flagcdn.com/w40/bh.png", dialCode: "+973" },
  { code: "OM", name: "Oman", flag: "https://flagcdn.com/w40/om.png", dialCode: "+968" },
  { code: "JO", name: "Jordan", flag: "https://flagcdn.com/w40/jo.png", dialCode: "+962" },
  { code: "LB", name: "Lebanon", flag: "https://flagcdn.com/w40/lb.png", dialCode: "+961" },
  { code: "IQ", name: "Iraq", flag: "https://flagcdn.com/w40/iq.png", dialCode: "+964" },
  { code: "IR", name: "Iran", flag: "https://flagcdn.com/w40/ir.png", dialCode: "+98" },
  { code: "AF", name: "Afghanistan", flag: "https://flagcdn.com/w40/af.png", dialCode: "+93" },
  { code: "PK", name: "Pakistan", flag: "https://flagcdn.com/w40/pk.png", dialCode: "+92" },
  { code: "BD", name: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png", dialCode: "+880" },
  { code: "LK", name: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png", dialCode: "+94" },
  { code: "NP", name: "Nepal", flag: "https://flagcdn.com/w40/np.png", dialCode: "+977" },
  { code: "BT", name: "Bhutan", flag: "https://flagcdn.com/w40/bt.png", dialCode: "+975" },
  { code: "MV", name: "Maldives", flag: "https://flagcdn.com/w40/mv.png", dialCode: "+960" },
  { code: "NZ", name: "New Zealand", flag: "https://flagcdn.com/w40/nz.png", dialCode: "+64" },
  { code: "FJ", name: "Fiji", flag: "https://flagcdn.com/w40/fj.png", dialCode: "+679" },
  { code: "PG", name: "Papua New Guinea", flag: "https://flagcdn.com/w40/pg.png", dialCode: "+675" },
  { code: "NC", name: "New Caledonia", flag: "https://flagcdn.com/w40/nc.png", dialCode: "+687" },
  { code: "VU", name: "Vanuatu", flag: "https://flagcdn.com/w40/vu.png", dialCode: "+678" },
  { code: "SB", name: "Solomon Islands", flag: "https://flagcdn.com/w40/sb.png", dialCode: "+677" },
  { code: "TO", name: "Tonga", flag: "https://flagcdn.com/w40/to.png", dialCode: "+676" },
  { code: "WS", name: "Samoa", flag: "https://flagcdn.com/w40/ws.png", dialCode: "+685" },
  { code: "KI", name: "Kiribati", flag: "https://flagcdn.com/w40/ki.png", dialCode: "+686" },
  { code: "PW", name: "Palau", flag: "https://flagcdn.com/w40/pw.png", dialCode: "+680" },
  { code: "FM", name: "Micronesia", flag: "https://flagcdn.com/w40/fm.png", dialCode: "+691" },
  { code: "MH", name: "Marshall Islands", flag: "https://flagcdn.com/w40/mh.png", dialCode: "+692" },
  { code: "NR", name: "Nauru", flag: "https://flagcdn.com/w40/nr.png", dialCode: "+674" },
  { code: "TV", name: "Tuvalu", flag: "https://flagcdn.com/w40/tv.png", dialCode: "+688" }
];

export function AuthorizationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [noMarketing, setNoMarketing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to US
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false); // Toggle between phone and email mode
  const [isLoading, setIsLoading] = useState(false);

  // Get the page user came from
  const from = (location.state as any)?.from || '/topup';

  // Check if user is already authenticated and redirect to original page
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from);
    }
  }, [isAuthenticated, navigate, from]);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setPhoneNumber("");
    setSearchQuery("");
  };

  const handleConfirmPhoneNumber = async () => {
    setIsLoading(true);
    
    // Simulate loading for 0.3 seconds
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (isEmailMode) {
      console.log("Continue with email:", email);
      // Login with email
      login({ email });
    } else {
      console.log("Confirm phone number:", selectedCountry.dialCode + phoneNumber);
      // Login with phone
      login({ 
        phone: selectedCountry.dialCode + phoneNumber,
        country: selectedCountry.name
      });
    }
    
    setIsLoading(false);
    // Navigate back to the original page after successful login
    navigate(from);
  };

  const handleEmailAuth = () => {
    setIsEmailMode(!isEmailMode); // Toggle between email and phone mode
    setEmail(""); // Clear email when switching
    setPhoneNumber(""); // Clear phone when switching
  };

  const handleGoogleAuth = () => {
    console.log("Google authentication");
    // Handle Google authentication logic here
  };

  const handleFacebookAuth = () => {
    console.log("Facebook authentication");
    // Handle Facebook authentication logic here
  };

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-foreground)) 100%)',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>')`,
    }}>
      <DingHeader />

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md space-y-8">
          {/* Card Container */}
          <Card className="p-8 bg-background/95 backdrop-blur-sm border-0 shadow-2xl">
            {/* Title */}
            <div className="text-center space-y-3 mb-8">
              <h1 className="text-3xl font-bold text-foreground">
                {t('letsGetYouSignedIn')}
              </h1>
              <p className="text-muted-foreground text-lg">
                {isEmailMode 
                  ? t('wellSendYouCode')
                  : t('wellTextYouCode')
                }
              </p>
            </div>

            {/* Phone/Email Input */}
            <div className="space-y-6">
              <div className="relative">
                {isEmailMode ? (
                  // Email Input
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      {t('emailAddress')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('enterYourEmail')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                ) : (
                  // Phone Input with Country Selector
                  <div className="space-y-4">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      {t('phoneNumber')}
                    </Label>
                    <div className="flex gap-3">
                      <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={isOpen}
                            className="w-[160px] h-12 justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <img src={selectedCountry.flag} alt={selectedCountry.name} className="w-5 h-5" />
                              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                            </div>
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Input
                              placeholder={t('searchCountry')}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="h-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </div>
                          <div className="max-h-60 overflow-auto">
                            {filteredCountries.map((country) => (
                              <div
                                key={country.code}
                                onClick={() => handleCountrySelect(country)}
                                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent transition-colors"
                              >
                                <img src={country.flag} alt={country.name} className="w-5 h-5" />
                                <span className="flex-1 text-sm font-medium">{country.name}</span>
                                <span className="text-sm text-muted-foreground">{country.dialCode}</span>
                                {selectedCountry.code === country.code && (
                                  <Check className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder={t('enterYourPhoneNumber')}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="flex-1 h-12 text-base"
                      />
                    </div>
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
                <Label htmlFor="no-marketing" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  I don't want to receive marketing communications from ding. I understand that I'll still receive transactional messages.
                </Label>
              </div>

              {/* Confirm Button */}
              <Button
                onClick={handleConfirmPhoneNumber}
                disabled={isLoading || (isEmailMode ? !email.trim() : !phoneNumber.trim())}
                className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-4 text-muted-foreground font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              {/* Toggle between Phone and Email */}
              <div className="flex gap-3">
                <Button
                  variant={isEmailMode ? "outline" : "secondary"}
                  onClick={handleEmailAuth}
                  className="flex-1 h-12"
                  type="button"
                >
                  <Smartphone className="mr-2 h-4 w-4" />
                  Phone
                </Button>
                <Button
                  variant={isEmailMode ? "secondary" : "outline"}
                  onClick={handleEmailAuth}
                  className="flex-1 h-12"
                  type="button"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              </div>

              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleAuth}
                  className="w-full h-12 text-base"
                  type="button"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  onClick={handleFacebookAuth}
                  className="w-full h-12 text-base"
                  type="button"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    />
                  </svg>
                  Continue with Facebook
                </Button>
              </div>

              {/* Legal Links */}
              <div className="text-center text-sm text-muted-foreground space-y-2 pt-4">
                <p>
                  By continuing, you agree to our{" "}
                  <a href="#" className="underline hover:text-foreground transition-colors">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline hover:text-foreground transition-colors">
                    Privacy Notice
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}