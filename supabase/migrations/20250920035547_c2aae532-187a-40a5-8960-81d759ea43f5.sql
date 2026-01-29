-- Create analytics events table for real-time tracking
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL, -- 'page_view', 'button_click', etc.
  event_name TEXT NOT NULL, -- specific page name, button name, etc.
  user_session_id TEXT NOT NULL,
  user_id TEXT, -- optional if user is authenticated
  page_url TEXT NOT NULL,
  page_title TEXT,
  metadata JSONB DEFAULT '{}', -- additional event data
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics events
CREATE POLICY "Anyone can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (true);

-- Create index for better performance on common queries
CREATE INDEX idx_analytics_events_timestamp ON public.analytics_events(timestamp DESC);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_session ON public.analytics_events(user_session_id);

-- Enable real-time for analytics events
ALTER TABLE public.analytics_events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;