import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/utils/analytics';

// Hook to automatically track page views
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    trackPageView(location.pathname);
  }, [location.pathname]);
}

// Hook to track button clicks automatically
export function useButtonTracking() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Track clicks on buttons and interactive elements
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.closest('button') || target;
        const buttonText = button.textContent?.trim() || '';
        const buttonId = button.id || '';
        const className = button.className || '';
        
        // Import trackButtonClick dynamically to avoid circular dependencies
        import('@/utils/analytics').then(({ trackButtonClick }) => {
          trackButtonClick(buttonText || buttonId || 'unknown_button', {
            button_id: buttonId,
            button_text: buttonText,
            button_class: className,
            element_tag: button.tagName,
          });
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}