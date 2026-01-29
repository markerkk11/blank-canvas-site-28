import { getSupabase } from '@/integrations/supabase/client';
import { startVisualSessionRecording } from './visualSessionRecorder';

let sessionId: string | null = null;
let isTracking = false;

// Generate unique session ID
function generateSessionId(): string {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
}

// Get screen resolution
function getScreenResolution(): string {
  return `${window.screen.width}x${window.screen.height}`;
}

// Get element selector path
function getElementSelector(element: Element): string {
  if (element.id) return `#${element.id}`;
  
  let selector = element.tagName.toLowerCase();
  if (element.className) {
    const classes = element.className.split(' ').filter(cls => cls.trim());
    if (classes.length > 0) {
      selector += '.' + classes.join('.');
    }
  }
  
  // Add position if no unique identifier
  const parent = element.parentElement;
  if (parent) {
    const siblings = Array.from(parent.children).filter(child => 
      child.tagName === element.tagName
    );
    if (siblings.length > 1) {
      const index = siblings.indexOf(element);
      selector += `:nth-of-type(${index + 1})`;
    }
  }
  
  return selector;
}

// Track interaction in database
async function trackInteraction(
  type: string,
  element?: Element,
  coordinates?: { x: number; y: number },
  metadata?: Record<string, any>
) {
  try {
    const supabase = await getSupabase();
    
    const interactionData = {
      session_id: generateSessionId(),
      interaction_type: type,
      element_selector: element ? getElementSelector(element) : null,
      element_text: element?.textContent?.trim().substring(0, 100) || null,
      page_url: window.location.href,
      coordinates: coordinates || null,
      metadata: metadata || {},
      timestamp_ms: Date.now(),
    };

    await supabase
      .from('user_interactions')
      .insert([interactionData]);
  } catch (error) {
    // Silent fail - don't log errors to avoid console noise
  }
}

// Track session start
async function trackSessionStart() {
  try {
    const supabase = await getSupabase();
    
    const sessionData = {
      session_id: generateSessionId(),
      user_id: null, // Could be enhanced to track authenticated users
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      screen_resolution: getScreenResolution(),
    };

    await supabase
      .from('user_sessions')
      .insert([sessionData]);
  } catch (error) {
    // Silent fail
  }
}

// Track session end
async function trackSessionEnd() {
  try {
    const supabase = await getSupabase();
    
    await supabase
      .from('user_sessions')
      .update({ end_time: new Date().toISOString() })
      .eq('session_id', generateSessionId());
  } catch (error) {
    // Silent fail
  }
}

// Initialize silent tracking
export function initializeSilentTracking() {
  if (isTracking) return;
  
  isTracking = true;
  
  // Track session start
  trackSessionStart();
  
  // Start visual recording
  startVisualSessionRecording(generateSessionId());
  
  // Track mouse movements (throttled)
  let mouseTimeout: NodeJS.Timeout;
  document.addEventListener('mousemove', (event) => {
    clearTimeout(mouseTimeout);
    mouseTimeout = setTimeout(() => {
      trackInteraction('mousemove', undefined, {
        x: event.clientX,
        y: event.clientY
      });
    }, 100); // Throttle to every 100ms
  });
  
  // Track clicks
  document.addEventListener('click', (event) => {
    const target = event.target as Element;
    trackInteraction('click', target, {
      x: event.clientX,
      y: event.clientY
    }, {
      button: event.button,
      ctrl_key: event.ctrlKey,
      shift_key: event.shiftKey,
      alt_key: event.altKey
    });
  });
  
  // Track scroll
  let scrollTimeout: NodeJS.Timeout;
  document.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      trackInteraction('scroll', undefined, undefined, {
        scroll_x: window.scrollX,
        scroll_y: window.scrollY,
        page_height: document.documentElement.scrollHeight,
        viewport_height: window.innerHeight
      });
    }, 100);
  });
  
  // Track key presses (without recording actual keys for privacy)
  document.addEventListener('keydown', (event) => {
    const target = event.target as Element;
    trackInteraction('keypress', target, undefined, {
      key_code: event.keyCode,
      ctrl_key: event.ctrlKey,
      shift_key: event.shiftKey,
      alt_key: event.altKey,
      is_input: target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
    });
  });
  
  // Track focus/blur events
  document.addEventListener('focus', (event) => {
    const target = event.target as Element;
    trackInteraction('focus', target);
  }, true);
  
  document.addEventListener('blur', (event) => {
    const target = event.target as Element;
    trackInteraction('blur', target);
  }, true);
  
  // Track form submissions
  document.addEventListener('submit', (event) => {
    const target = event.target as Element;
    trackInteraction('form_submit', target);
  });
  
  // Track page visibility changes
  document.addEventListener('visibilitychange', () => {
    trackInteraction('visibility_change', undefined, undefined, {
      hidden: document.hidden
    });
  });
  
  // Track window resize
  window.addEventListener('resize', () => {
    trackInteraction('window_resize', undefined, undefined, {
      width: window.innerWidth,
      height: window.innerHeight
    });
  });
  
  // Track page unload
  window.addEventListener('beforeunload', () => {
    trackSessionEnd();
  });
  
  // Track page load completion
  if (document.readyState === 'complete') {
    trackInteraction('page_load_complete');
  } else {
    window.addEventListener('load', () => {
      trackInteraction('page_load_complete');
    });
  }
}