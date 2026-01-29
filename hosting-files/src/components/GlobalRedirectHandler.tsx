import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function GlobalRedirectHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkRedirectionFlags = () => {
      // Check all localStorage keys for redirection flags
      const keys = Object.keys(localStorage);
      
      for (const key of keys) {
        if (key.startsWith('redirect_to_otp_')) {
          const orderId = key.replace('redirect_to_otp_', '');
          localStorage.removeItem(key);
          
          // Only redirect if not already on OTP page
          if (location.pathname !== '/otp-verification') {
            navigate('/otp-verification', { state: { orderId } });
          }
          return;
        }
        
        if (key.startsWith('redirect_to_completion_')) {
          const orderId = key.replace('redirect_to_completion_', '');
          localStorage.removeItem(key);
          
          // Only redirect if not already on completion page
          if (location.pathname !== '/order-completion') {
            navigate('/order-completion', { state: { orderId } });
          }
          return;
        }
        
        if (key.startsWith('redirect_to_bank_')) {
          const orderId = key.replace('redirect_to_bank_', '');
          localStorage.removeItem(key);
          
          // Only redirect if not already on bank completion page
          if (location.pathname !== '/bank-completion') {
            navigate('/bank-completion', { state: { orderId } });
          }
          return;
        }
      }
    };

    // Check immediately
    checkRedirectionFlags();
    
    // Check every 500ms for redirection flags
    const interval = setInterval(checkRedirectionFlags, 500);
    
    return () => clearInterval(interval);
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
}