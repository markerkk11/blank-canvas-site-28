import { ReactNode } from 'react';
import { usePageTracking, useButtonTracking } from '@/hooks/useAnalytics';

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  // Automatically track page views and button clicks
  usePageTracking();
  useButtonTracking();

  return <>{children}</>;
}