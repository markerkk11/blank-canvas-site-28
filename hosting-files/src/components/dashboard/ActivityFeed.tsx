import { FileText, Star, Settings, Upload } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";


export function ActivityFeed() {
  const { t } = useTranslation();
  
  const activities = [
    {
      id: 1,
      type: "upload",
      title: t('uploadedNewDocument'),
      description: "Project_Requirements.pdf",
      time: "2 " + t('hoursAgo'),
      icon: Upload,
    },
    {
      id: 2,
      type: "favorite",
      title: t('addedToFavorites'),
      description: "Dashboard Template",
      time: "5 " + t('hoursAgo'),
      icon: Star,
    },
    {
      id: 3,
      type: "settings",
      title: t('updatedProfileSettings'),
      description: t('changedNotificationPreferences'),
      time: "1 " + t('dayAgo'),
      icon: Settings,
    },
    {
      id: 4,
      type: "document",
      title: t('createdNewDocument'),
      description: "Meeting Notes - Q1 Planning",
      time: "2 " + t('daysAgo'),
      icon: FileText,
    },
  ];
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">{t('recentActivity')}</h3>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <activity.icon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{activity.title}</p>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 pt-4 border-t border-border text-sm text-primary hover:text-primary-glow transition-smooth">
        {t('viewAllActivities')}
      </button>
    </div>
  );
}