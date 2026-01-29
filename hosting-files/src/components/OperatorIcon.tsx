import { getOperatorIconSync } from '@/utils/operatorIcons';
import { Smartphone } from 'lucide-react';

interface OperatorIconProps {
  operatorName: string;
  countryCode?: string;
  className?: string;
  fallbackClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OperatorIcon = ({ 
  operatorName, 
  className = "", 
  fallbackClassName = "w-8 h-8 text-gray-600",
  size = 'md'
}: OperatorIconProps) => {
  // Get local icon
  const localIcon = getOperatorIconSync(operatorName);
  
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };
  
  if (localIcon) {
    return (
      <img
        src={localIcon}
        alt={`${operatorName} logo`}
        className={`${sizeClasses[size]} object-contain ${className}`}
      />
    );
  }
  
  // Fallback to generic smartphone icon
  return (
    <div className={`${sizeClasses[size]} bg-gray-100 rounded-2xl flex items-center justify-center ${fallbackClassName}`}>
      <Smartphone className="w-4 h-4 text-gray-600" />
    </div>
  );
};