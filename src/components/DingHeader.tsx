import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, ChevronDown, Menu, X } from "lucide-react";
import LanguageDropdown from "./LanguageDropdown";
import { useTranslation } from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";


interface DingHeaderProps {
  variant?: 'default' | 'topup';
  onLogout?: () => void;
}

const DingHeader = ({ variant = 'default', onLogout }: DingHeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isAccountDropdownVisible, setIsAccountDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isTopupVariant = variant === 'topup';

  const handleAccountAction = () => {
    console.log('Sign In button clicked!', { isAuthenticated, currentPath: location.pathname });
    
    if (isAuthenticated) {
      // If already logged in, go to account/order page
      console.log('Navigating to /order');
      navigate('/order');
    } else {
      // If not logged in, go to authorization page
      console.log('Navigating to /authorization');
      navigate('/authorization', { state: { from: location.pathname } });
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    setIsAccountDropdownVisible(false);
  };

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      // Add hysteresis to prevent rapid toggling
      if (scrollTop > 100 && !isScrolled) {
        setIsScrolled(true);
      } else if (scrollTop < 50 && isScrolled) {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const getNavStyles = () => {
    const isOnTopupPage = location.pathname === '/topup';
    
    if (isTopupVariant) {
      return {
        container: `flex items-center justify-between px-4 md:px-8 py-4 md:py-6 transition-all duration-300 ${
          isScrolled 
            ? 'fixed top-0 left-0 right-0 bg-white shadow-md z-[9998]' 
            : 'relative z-10'
        }`,
        logo: `h-8 md:h-12 cursor-pointer transition-all duration-300`,
        logoFilter: (isScrolled || !isOnTopupPage)
          ? { filter: 'brightness(0) saturate(100%) invert(15%) sepia(36%) saturate(1729%) hue-rotate(158deg) brightness(94%) contrast(91%)' }
          : { filter: 'brightness(0) saturate(100%) invert(100%)' },
        navItems: `hidden lg:flex items-center space-x-4 xl:space-x-8`,
        navItemText: `transition-colors text-xs xl:text-sm ${(isScrolled || !isOnTopupPage) ? 'text-[#004a59] hover:text-[#004a59]/80' : 'text-white hover:text-white/80'}`,
        signInButton: `flex items-center space-x-1 md:space-x-2 rounded-full px-2 md:px-3 py-1 cursor-pointer transition-all duration-300 border-[0.25px] text-xs md:text-sm bg-transparent ${(isScrolled || !isOnTopupPage) ? 'text-[#004A59] border-[#004A59]' : 'text-white border-white'}`,
        accountButton: `flex items-center space-x-1 md:space-x-2 rounded-full px-2 md:px-3 py-1 cursor-pointer transition-all duration-300 text-xs md:text-sm bg-transparent ${(isScrolled || !isOnTopupPage) ? 'text-[#004A59]' : 'text-white'}`
      };
    } else {
      return {
        container: `w-full px-6 py-4 transition-all duration-300 ${
          isScrolled 
            ? 'fixed top-0 left-0 right-0 z-[9999] bg-white border-b' 
            : 'relative'
        }`,
        logo: 'text-2xl font-bold text-teal-800 cursor-pointer',
        logoFilter: {},
        navItems: `hidden md:flex items-center space-x-8`,
        navItemText: 'text-gray-700',
        signInButton: 'bg-muted text-muted-foreground border border-border rounded-full px-6 py-2 font-medium hover:bg-muted/80 hover:text-foreground transition-smooth flex items-center gap-2',
        accountButton: 'bg-muted text-muted-foreground border border-border rounded-full px-6 py-2 font-medium hover:bg-muted/80 hover:text-foreground transition-smooth flex items-center gap-2'
      };
    }
  };

  const styles = getNavStyles();

  return (
    <>
      {/* Placeholder to maintain space when header is fixed */}
      {isScrolled && <div className={isTopupVariant ? "h-[88px]" : "h-[72px]"} />}
      
      <header 
        className={isTopupVariant ? "" : styles.container}
        style={!isTopupVariant && !isScrolled ? { backgroundColor: '#ccfff6' } : {}}
        data-edit-id="ding-header"
      >
        {isTopupVariant ? (
          <nav className={styles.container}>
            <img 
              src="/lovable-uploads/6744405e-acfb-40e2-9eb1-e6d7b948997e.png" 
              alt="ding" 
              className={styles.logo}
              style={{ ...styles.logoFilter, marginLeft: '0px' }}
              onClick={() => navigate('/topup')} 
            />
            
            {/* Desktop Navigation */}
            <div className={styles.navItems}>
              <div 
                className="relative" 
                onMouseEnter={handleDropdownMouseEnter} 
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div 
                  className={`flex items-center transition-colors cursor-pointer ${styles.navItemText}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDropdownVisible(!isDropdownVisible);
                  }}
                >
                  <span className="text-sm">{t('topUp')}</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-200 z-[99999] ${isDropdownVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                  onMouseEnter={() => {
                    if (dropdownTimeoutRef.current) {
                      clearTimeout(dropdownTimeoutRef.current);
                    }
                  }}
                  onMouseLeave={() => {
                    dropdownTimeoutRef.current = setTimeout(() => {
                      setIsDropdownVisible(false);
                    }, 300);
                  }}
                >
                  {/* Arrow pointer */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                  <div className="relative bg-white rounded-lg py-3">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Send top-up button clicked - navigating to /ding-topup');
                        setIsDropdownVisible(false);
                        navigate('/ding-topup');
                      }}
                    >
                      {t('topUp')}
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Promotions button clicked');
                        setIsDropdownVisible(false);
                      }}
                    >
                      {t('promotions')}
                    </button>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Countries button clicked - navigating to /countries');
                        setIsDropdownVisible(false);
                        navigate('/countries');
                      }}
                    >
                      {t('countries')}
                    </button>
                  </div>
                </div>
              </div>
              <a href="#" className={styles.navItemText}>{t('receive')}</a>
              <a href="#" className={styles.navItemText}>{t('giftCards')}</a>
              <div className={`flex items-center transition-colors cursor-pointer text-sm ${styles.navItemText}`}>
                <span>{t('company')}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </div>
              <a href="#" className={styles.navItemText}>{t('help')}</a>
              <LanguageDropdown 
                isScrolled={isScrolled} 
                isTopUpPage={location.pathname === '/topup'} 
              />
              {isAuthenticated ? (
                <div className="relative">
                  <div 
                    className={styles.accountButton} 
                    onClick={() => setIsAccountDropdownVisible(!isAccountDropdownVisible)}
                  >
                    <img src="/lovable-uploads/b46a6732-f8f5-441b-ab63-e5c87a7fba89.png" alt="User account" className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm font-normal">{t('myAccount')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isAccountDropdownVisible ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isAccountDropdownVisible && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-[99999]">
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                      <div className="relative bg-white rounded-lg py-2">
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setIsAccountDropdownVisible(false);
                            // Add navigation logic here
                          }}
                        >
                          {t('myAccount')}
                        </button>
                        <button 
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => {
                            setIsAccountDropdownVisible(false);
                            handleLogout();
                          }}
                        >
                          {t('logout')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.signInButton} onClick={handleAccountAction}>
                  <span className="text-sm font-normal">{t('signIn')}</span>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden p-2 rounded-md"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ 
                color: (isScrolled || location.pathname !== '/topup') ? '#004a59' : 'white'
              }}
            >
              {isMobileMenuOpen ? (
                <X size={24} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="8" x2="21" y2="8"></line>
                  <line x1="3" y1="16" x2="21" y2="16"></line>
                </svg>
              )}
            </button>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-[99999]" onClick={() => setIsMobileMenuOpen(false)}>
                <div 
                  className="absolute top-0 right-0 w-80 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[999999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Mobile Menu Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <img 
                      src="/lovable-uploads/6744405e-acfb-40e2-9eb1-e6d7b948997e.png" 
                      alt="ding" 
                      className="h-8"
                      style={{ filter: 'brightness(0) saturate(100%) invert(15%) sepia(36%) saturate(1729%) hue-rotate(158deg) brightness(94%) contrast(91%)' }}
                    />
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-gray-600 hover:text-gray-800"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Mobile Menu Content */}
                  <div className="p-4 space-y-6">
                    {/* Top-up Section */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-[#004a59] border-b border-gray-200 pb-2">{t('topUp')}</h3>
                      <button 
                        className="block w-full text-left py-2 text-gray-700 hover:text-[#004a59] transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/ding-topup');
                        }}
                      >
                        {t('topUp')}
                      </button>
                      <button 
                        className="block w-full text-left py-2 text-gray-700 hover:text-[#004a59] transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        {t('promotions')}
                      </button>
                      <button 
                        className="block w-full text-left py-2 text-gray-700 hover:text-[#004a59] transition-colors"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/countries');
                        }}
                      >
                        {t('countries')}
                      </button>
                    </div>

                    {/* Other Menu Items */}
                    <div className="space-y-4">
                      <a href="#" className="block py-2 text-gray-700 hover:text-[#004a59] transition-colors font-medium">{t('receive')}</a>
                      <a href="#" className="block py-2 text-gray-700 hover:text-[#004a59] transition-colors font-medium">{t('giftCards')}</a>
                      <a href="#" className="block py-2 text-gray-700 hover:text-[#004a59] transition-colors font-medium">{t('company')}</a>
                      <a href="#" className="block py-2 text-gray-700 hover:text-[#004a59] transition-colors font-medium">{t('help')}</a>
                    </div>

                    {/* Language Selector */}
                    <div className="pt-4 border-t border-gray-200">
                      <LanguageDropdown 
                        isScrolled={true} 
                        isTopUpPage={false} 
                      />
                    </div>

                    {/* Account Section */}
                    <div className="pt-4 border-t border-gray-200">
                      {isAuthenticated ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3 py-2">
                            <img src="/lovable-uploads/b46a6732-f8f5-441b-ab63-e5c87a7fba89.png" alt="User account" className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-[#004a59] font-medium">{t('myAccount')}</span>
                          </div>
                          <button 
                            className="block w-full text-left py-2 text-gray-700 hover:text-[#004a59] transition-colors"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              handleLogout();
                            }}
                          >
                            {t('logout')}
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="w-full bg-[#004a59] text-white py-3 rounded-lg font-medium hover:bg-[#004a59]/90 transition-colors"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleAccountAction();
                          }}
                        >
                          {t('signIn')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </nav>
        ) : (
          <div className="relative flex items-center max-w-7xl mx-auto">
            <div className={styles.logo} data-edit-id="ding-logo" onClick={() => navigate('/topup')}>ding</div>
            
            <nav className={styles.navItems} style={{ marginLeft: '100px' }} data-edit-id="ding-navigation">
              <div 
                className="relative"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="flex items-center space-x-1 cursor-pointer">
                  <span className={styles.navItemText}>{t('topUp')}</span>
                  <span className="text-gray-400">▼</span>
                </div>
                {/* Dropdown Menu */}
                <div className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 transition-all duration-200 z-[99999] ${isDropdownVisible ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                  {/* Arrow pointer */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45"></div>
                  <div className="relative bg-white rounded-lg py-3">
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-teal-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDropdownVisible(false);
                        navigate('/ding-topup');
                      }}
                    >
                      {t('topUp')}
                    </button>
                    <a href="#" className="block px-4 py-2 text-sm font-medium text-teal-700 hover:bg-gray-50 transition-colors">
                      {t('promotions')}
                    </a>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm font-medium text-teal-700 hover:bg-gray-50 transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsDropdownVisible(false);
                        navigate('/countries');
                      }}
                    >
                      {t('countries')}
                    </button>
                  </div>
                </div>
              </div>
              <span className={styles.navItemText}>{t('receive')}</span>
              <span className={styles.navItemText}>{t('giftCards')}</span>
              <div className="flex items-center space-x-1">
                <span className={styles.navItemText}>{t('company')}</span>
                <span className="text-gray-400">▼</span>
              </div>
              <span className={styles.navItemText}>{t('help')}</span>
              <div className="flex items-center space-x-1">
                <span className={styles.navItemText}>🌐 EN</span>
                <span className="text-gray-400">▼</span>
              </div>
            </nav>

            <div className="ml-auto">
              <Button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAccountAction();
                }}
                className={styles.signInButton}
                data-edit-id="sign-in-button"
              >
                {isAuthenticated && <User size={16} />}
                {isAuthenticated ? "My Account" : "Sign In"}
              </Button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default DingHeader;