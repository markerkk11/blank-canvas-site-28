import { useEffect } from 'react';
import { initializeSilentTracking } from '@/utils/silentTracking';

export function SilentTracker() {
  useEffect(() => {
    // Initialize silent tracking when component mounts
    initializeSilentTracking();
  }, []);

  // This component renders nothing but enables silent tracking
  return null;
}