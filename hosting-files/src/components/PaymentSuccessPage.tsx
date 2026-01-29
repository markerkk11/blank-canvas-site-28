import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface LocationState {
  orderId: string;
}

export function PaymentSuccessPage() {
  const location = useLocation();
  const orderId = (location.state as LocationState)?.orderId || "Unknown";
  const { t } = useTranslation();

  const handleDownloadReceipt = () => {
    // Get order details from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    
    if (order) {
      const receiptData = {
        orderId: order.id,
        timestamp: order.timestamp,
        phone: order.phone,
        provider: order.provider,
        amount: `$${order.amount}.00`,
        fees: `$${order.fees}`,
        total: `$${order.total}`,
        status: "Completed"
      };
      
      const dataStr = JSON.stringify(receiptData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', `receipt_${orderId}.json`);
      linkElement.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <div className="px-4 max-w-md mx-auto">
        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 text-center">
          {/* Success Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('paymentSuccessful')}
          </h1>
          
          <div className="space-y-4 mb-6">
            <p className="text-muted-foreground">
              {t('yourPaymentProcessed')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('orderIdLabel')}: <span className="font-mono text-primary">{orderId}</span>
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleDownloadReceipt}
              variant="outline"
              className="w-full flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{t('downloadReceipt')}</span>
            </Button>
            
            <Button
              onClick={() => window.location.href = "/"}
              className="w-full bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white"
            >
              {t('createNewOrder')}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}