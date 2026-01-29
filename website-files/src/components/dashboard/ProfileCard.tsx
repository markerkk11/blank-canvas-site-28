import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, MapPin, Mail, Calendar } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export function ProfileCard() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gradient-card border border-border rounded-xl p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-foreground">John Doe</h3>
            <p className="text-muted-foreground">{t('softwareDeveloper')}</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          {t('edit')}
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Mail className="w-4 h-4 mr-2" />
          john.doe@example.com
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2" />
          San Francisco, CA
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2" />
          {t('joinedMarch')}
        </div>
      </div>
    </div>
  );
}