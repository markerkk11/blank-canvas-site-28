import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Index from "./pages/Index";
import TopUp from "./pages/TopUp";
import ProviderSelection from "./pages/ProviderSelection";
import TopUpAmount from "./pages/TopUpAmount";
import SignIn from "./pages/SignIn";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";
import ProcessingPayment from "./pages/ProcessingPayment";
import PaymentSuccess from "./pages/PaymentSuccess";
import BankCompletion from "./pages/BankCompletion";
import OTPVerification from "./pages/OTPVerification";
import OrderCompletion from "./pages/OrderCompletion";
import Authorization from "./pages/Authorization";
import Countries from "./pages/Countries";
import DingTopup from "./pages/DingTopup";
import NotFound from "./pages/NotFound";
import { GlobalRedirectHandler } from "./components/GlobalRedirectHandler";
import { TabletMobileViewport } from "./components/TabletMobileViewport";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <TabletMobileViewport />
        <BrowserRouter>
        <GlobalRedirectHandler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/topup" element={<TopUp />} />
          <Route path="/topup/:countryCode" element={<ProviderSelection />} />
          <Route path="/topup-amount" element={<TopUpAmount />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin-panel" element={<Admin />} />
          <Route path="/processing-payment" element={<ProcessingPayment />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/bank-completion" element={<BankCompletion />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/order-completion" element={<OrderCompletion />} />
          <Route path="/authorization" element={<Authorization />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/ding-topup" element={<DingTopup />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
