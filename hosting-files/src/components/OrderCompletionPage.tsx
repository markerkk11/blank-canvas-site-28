import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationState {
  orderId: string;
}

export function OrderCompletionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const state = location.state as LocationState;
    if (!state?.orderId) {
      navigate("/");
    }
  }, [location, navigate]);

  useEffect(() => {
    // Check for order completion flag
    const checkOrderCompletion = () => {
      const state = location.state as LocationState;
      if (state?.orderId) {
        const orderCompletedFlag = localStorage.getItem(`order_completed_${state.orderId}`);
        if (!orderCompletedFlag) {
          // If no completion flag, redirect to home
          navigate("/");
        }
      }
    };

    checkOrderCompletion();
  }, [location, navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="px-4 max-w-md mx-auto">
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-green-100 rounded-full animate-ping opacity-75"></div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('orderCompleted')}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {t('orderCompletedDesc')}
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">{t('orderIdLabel')}</p>
              <p className="font-mono text-primary font-semibold">
                {(location.state as LocationState)?.orderId}
              </p>
            </div>

            <Button 
              onClick={handleBackToHome}
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}