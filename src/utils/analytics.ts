import { getSupabase } from '@/integrations/supabase/client';

let sessionId: string | null = null;

// Generate or get session ID
function getSessionId(): string {
  if (!sessionId) {
    sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }
  }
  return sessionId;
}

// Get user ID if authenticated
function getUserId(): string | null {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.phone || userData.email || null;
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return null;
}

export interface AnalyticsEvent {
  event_type: string;
  event_name: string;
  page_url?: string;
  page_title?: string;
  metadata?: Record<string, any>;
}

// Main function to track events
export async function trackEvent(event: AnalyticsEvent) {
  try {
    const supabase = await getSupabase();
    
    const eventData = {
      event_type: event.event_type,
      event_name: event.event_name,
      user_session_id: getSessionId(),
      user_id: getUserId(),
      page_url: event.page_url || window.location.href,
      page_title: event.page_title || document.title,
      metadata: event.metadata || {},
    };

    const { error } = await supabase
      .from('analytics_events')
      .insert([eventData]);

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

// Specific tracking functions
export function trackPageView(pageName?: string) {
  trackEvent({
    event_type: 'page_view',
    event_name: pageName || window.location.pathname,
    metadata: {
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    }
  });
}

export function trackButtonClick(buttonName: string, metadata?: Record<string, any>) {
  trackEvent({
    event_type: 'button_click',
    event_name: buttonName,
    metadata: {
      ...metadata,
      timestamp_click: Date.now(),
    }
  });
}

export function trackFormSubmit(formName: string, metadata?: Record<string, any>) {
  trackEvent({
    event_type: 'form_submit',
    event_name: formName,
    metadata
  });
}

export function trackUserAction(actionName: string, metadata?: Record<string, any>) {
  trackEvent({
    event_type: 'user_action',
    event_name: actionName,
    metadata
  });
}