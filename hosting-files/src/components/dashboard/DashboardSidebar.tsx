import { User, Settings, BarChart3, FileText, Heart, LogOut, Smartphone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";


export function DashboardSidebar() {
  const { t } = useTranslation();
  
  const sidebarItems = [
    { title: t('profile'), url: "/", icon: User },
    { title: t('topUp'), url: "/topup", icon: Smartphone },
    { title: t('analytics'), url: "/analytics", icon: BarChart3 },
    { title: t('documents'), url: "/documents", icon: FileText },
    { title: t('favorites'), url: "/favorites", icon: Heart },
    { title: t('settings'), url: "/settings", icon: Settings },
  ];
  return (
    <div className="w-64 h-screen bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground">{t('personalCabinet')}</h2>
      </div>
      
      <nav className="px-4 space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth hover:bg-accent/50",
                isActive
                  ? "bg-gradient-primary text-primary-foreground shadow-elegant"
                  : "text-muted-foreground hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.title}
          </NavLink>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4">
        <button className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-smooth">
          <LogOut className="w-5 h-5 mr-3" />
          {t('dashboardSignOut')}
        </button>
      </div>
    </div>
  );
}