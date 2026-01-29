import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Star, Users, TrendingUp } from "lucide-react";
import DingHeader from "@/components/DingHeader";

const Index = () => {
  const navigate = useNavigate();

  const handleSendTopup = () => {
    navigate("/ding-topup");
  };

  return (
    <div className="min-h-screen">
      <DingHeader />
      <div className="text-center py-12 bg-red-100 border-4 border-red-500">
        <h1 className="text-5xl font-bold text-black bg-yellow-200 p-4">Send top-up worldwide</h1>
        <p className="text-black mt-2">Debug: This section should be visible with red background</p>
      </div>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto pt-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John!</h1>
          <p className="text-muted-foreground">Here's what's happening in your personal cabinet.</p>
          
          <div className="mt-6">
            <Button 
              onClick={handleSendTopup}
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-8 py-3 text-lg"
            >
              Send top-up
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatsCard
            title="Total Documents"
            value="24"
            change="+3 this week"
            icon={FileText}
            trend="up"
          />
          <StatsCard
            title="Connections"
            value="156"
            change="+12 this month"
            icon={Users}
            trend="up"
          />
        </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default Index;
