import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationState {
  orderId: string;
}

export function ProcessingPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.orderId) {
      setOrderId(state.orderId);
    } else {
      navigate("/");
      return;
    }

    // Check processing status every second
    const interval = setInterval(() => {
      const processedOrders = JSON.parse(localStorage.getItem('processedOrders') || '[]');
      if (processedOrders.includes(state.orderId)) {
        setIsProcessing(false);
        
        // Get the processing type from the order
        const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = storedOrders.find((o: any) => o.id === state.orderId);
        const processingType = order?.processingType || 'otp';
        
        setTimeout(() => {
          if (processingType === 'bank') {
            navigate("/bank-completion", { state: { orderId: state.orderId } });
          } else {
            navigate("/otp-verification", { state: { orderId: state.orderId } });
          }
        }, 2000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="px-4 max-w-md mx-auto">
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          {isProcessing ? (
            <>
              {/* Loading Animation */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto">
                  {/* Outer spinning ring */}
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
                  
                  {/* Inner pulsing circle */}
                  <div className="absolute inset-3 bg-primary/10 rounded-full animate-pulse"></div>
                  
                  {/* Center dot */}
                  <div className="absolute inset-8 bg-primary rounded-full animate-bounce"></div>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
                {t('processingPayment')}
              </h1>
              
              <div className="space-y-2 animate-fade-in">
                <p className="text-muted-foreground">
                  {t('pleaseWaitProcessing')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('orderIdLabel')}: <span className="font-mono text-primary">{orderId}</span>
                </p>
              </div>

              {/* Animated dots */}
              <div className="flex justify-center space-x-1 mt-6">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </>
          ) : (
            <>
              {/* Success Animation */}
              <div className="relative mb-6">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-12 h-12 text-green-600 animate-fade-in" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-4 animate-fade-in">
                {t('paymentProcessed')}
              </h1>
              
              <p className="text-muted-foreground animate-fade-in">
                {t('redirectingToConfirmation')}
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}