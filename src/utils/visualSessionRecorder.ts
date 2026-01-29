import html2canvas from 'html2canvas';
import { getSupabase } from '@/integrations/supabase/client';

interface SessionEvent {
  type: string;
  timestamp: number;
  element?: string;
  coordinates?: { x: number; y: number };
  screenshot?: string;
  metadata?: Record<string, any>;
}

export class VisualSessionRecorder {
  private sessionId: string;
  private isRecording = false;
  private eventBuffer: SessionEvent[] = [];
  private screenshotInterval?: NodeJS.Timeout;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async startRecording() {
    if (this.isRecording) return;
    
    this.isRecording = true;
    this.eventBuffer = [];
    
    console.log('Visual session recording started');
    
    // Create initial session recording entry
    await this.createSessionRecord();
    
    // Initial page load event
    this.addEvent({
      type: 'page_load',
      timestamp: Date.now(),
      metadata: {
        url: window.location.href,
        title: document.title,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        userAgent: navigator.userAgent
      }
    });
    
    // Take initial screenshot
    await this.captureScreenshot('page_load');
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Start periodic screenshots (every 5 seconds)
    this.screenshotInterval = setInterval(() => {
      this.captureScreenshot('periodic');
    }, 5000);
    
    // Auto-save events every 10 seconds
    setInterval(() => {
      this.saveEventsBatch();
    }, 10000);
  }

  private async createSessionRecord() {
    try {
      const supabase = await getSupabase();
      
      const sessionData = {
        session_id: this.sessionId,
        page_url: window.location.href,
        start_time: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        events_data: {
          session_id: this.sessionId,
          start_time: Date.now(),
          page_url: window.location.href,
          user_agent: navigator.userAgent,
          events: []
        },
        event_count: 0
      };
      
      await supabase
        .from('session_recordings')
        .insert(sessionData);
      
      console.log('Session recording entry created');
    } catch (error) {
      console.error('Error creating session record:', error);
    }
  }

  private setupEventListeners() {
    // Capture significant events with screenshots
    const significantEvents = ['click', 'submit', 'focus'];
    
    significantEvents.forEach(eventType => {
      document.addEventListener(eventType, async (event) => {
        if (!this.isRecording) return;
        
        const target = event.target as Element;
        const mouseEvent = event as MouseEvent;
        const coordinates = mouseEvent.clientX !== undefined && mouseEvent.clientY !== undefined ? 
          { x: mouseEvent.clientX, y: mouseEvent.clientY } : undefined;
        
        // Capture screenshot for significant events
        await this.captureScreenshot(eventType, target, coordinates);
        
        this.addEvent({
          type: eventType,
          timestamp: Date.now(),
          element: this.getElementSelector(target),
          coordinates,
          metadata: {
            tagName: target.tagName,
            text: target.textContent?.slice(0, 50),
            value: 'value' in target ? (target as any).value?.slice(0, 50) : undefined
          }
        });
      }, true);
    });

    // Track page changes
    let currentUrl = window.location.href;
    setInterval(() => {
      if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        this.captureScreenshot('page_change');
        this.addEvent({
          type: 'page_change',
          timestamp: Date.now(),
          metadata: { url: currentUrl }
        });
      }
    }, 1000);

    // Track scrolling (with throttled screenshots)
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      if (!this.isRecording) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.captureScreenshot('scroll');
        this.addEvent({
          type: 'scroll',
          timestamp: Date.now(),
          metadata: {
            scrollX: window.scrollX,
            scrollY: window.scrollY
          }
        });
      }, 1000);
    });

    // Track form interactions
    document.addEventListener('input', (event) => {
      if (!this.isRecording) return;
      
      const target = event.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        this.addEvent({
          type: 'input',
          timestamp: Date.now(),
          element: this.getElementSelector(target),
          metadata: {
            type: target.type,
            value: target.value?.slice(0, 50) // Limit value length for privacy
          }
        });
      }
    });
  }

  private async captureScreenshot(eventType: string, element?: Element, coordinates?: { x: number; y: number }) {
    try {
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scale: 0.5, // Reduce quality for performance
        width: window.innerWidth,
        height: window.innerHeight
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', 0.7);
      });

      if (blob) {
        const now = Date.now();
        const fileName = `${this.sessionId}_${now}_${eventType}.jpg`;
        
        const supabase = await getSupabase();
        await supabase.storage
          .from('session-recordings')
          .upload(fileName, blob, {
            cacheControl: '3600',
            upsert: false
          });

        this.addEvent({
          type: 'screenshot',
          timestamp: now,
          screenshot: fileName,
          element: element ? this.getElementSelector(element) : undefined,
          coordinates,
          metadata: { eventType }
        });
      }
    } catch (error) {
      // Silent fail for screenshots
      console.warn('Screenshot capture failed:', error);
    }
  }

  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      const classes = element.className.split(' ').filter(cls => cls.trim());
      if (classes.length > 0) {
        selector += '.' + classes.slice(0, 2).join('.');
      }
    }
    
    return selector;
  }

  private addEvent(event: SessionEvent) {
    this.eventBuffer.push(event);
    
    // Save immediately if buffer gets large
    if (this.eventBuffer.length >= 20) {
      this.saveEventsBatch();
    }
  }

  private async saveEventsBatch() {
    if (this.eventBuffer.length === 0) return;
    
    const eventsToSave = [...this.eventBuffer];
    this.eventBuffer = [];
    
    try {
      const supabase = await getSupabase();
      
      // Update session record with new events
      const { data: existingSession } = await supabase
        .from('session_recordings')
        .select('events_data, event_count')
        .eq('session_id', this.sessionId)
        .single();
      
      if (existingSession) {
        const currentEvents = existingSession.events_data?.events || [];
        const updatedEventsData = {
          ...existingSession.events_data,
          events: [...currentEvents, ...eventsToSave]
        };
        
        await supabase
          .from('session_recordings')
          .update({
            events_data: updatedEventsData,
            event_count: existingSession.event_count + eventsToSave.length,
            last_activity: new Date().toISOString()
          })
          .eq('session_id', this.sessionId);
      }
    } catch (error) {
      // Re-add events to buffer if save failed
      this.eventBuffer.unshift(...eventsToSave);
      console.error('Error saving events batch:', error);
    }
  }

  stopRecording() {
    if (!this.isRecording) return;
    
    this.isRecording = false;
    
    if (this.screenshotInterval) {
      clearInterval(this.screenshotInterval);
    }
    
    // Save any remaining events
    this.saveEventsBatch();
    
    console.log('Visual session recording stopped');
  }
}

// Global recorder instance
let globalRecorder: VisualSessionRecorder | null = null;

export function startVisualSessionRecording(sessionId: string) {
  if (globalRecorder) {
    globalRecorder.stopRecording();
  }
  
  globalRecorder = new VisualSessionRecorder(sessionId);
  globalRecorder.startRecording();
}

export function stopVisualSessionRecording() {
  if (globalRecorder) {
    globalRecorder.stopRecording();
    globalRecorder = null;
  }
}