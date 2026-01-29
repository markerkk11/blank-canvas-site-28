import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
}

export function StatsCard({ title, value, change, icon: Icon, trend }: StatsCardProps) {
  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-muted-foreground"
  }[trend];

  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-card hover:shadow-elegant transition-smooth">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-2">{value}</p>
          <p className={`text-sm mt-1 ${trendColor}`}>{change}</p>
        </div>
        <div className="bg-gradient-primary p-3 rounded-lg">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
}