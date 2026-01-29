import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationState {
  orderId: string;
}

export function BankCompletionPage() {
  const location = useLocation();
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="px-4 max-w-md mx-auto">
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          {/* Bank Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Building2 className="w-12 h-12 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('completePaymentInBankApp')}
          </h1>
          
          <div className="space-y-4 mb-6">
            <p className="text-muted-foreground">
              {t('openBankAppInstruction')}
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">
                {t('nextSteps')}
              </p>
              <ol className="text-sm text-muted-foreground space-y-1 text-left">
                <li>1. {t('openBankAppStep')}</li>
                <li>2. {t('navigatePendingTransactionsStep')}</li>
                <li>3. {t('authorizePaymentStep')}</li>
                <li>4. {t('returnToAppStep')}</li>
              </ol>
            </div>
            
            <p className="text-xs text-muted-foreground">
              {t('orderIdLabel')}: <span className="font-mono text-primary">{(location.state as LocationState)?.orderId}</span>
            </p>
          </div>

          <Button 
            onClick={handleBack}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backToHome')}
          </Button>
        </Card>
      </div>
    </div>
  );
}