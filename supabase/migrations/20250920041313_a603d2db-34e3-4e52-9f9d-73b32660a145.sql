-- Create table for silent user session tracking
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  page_url TEXT NOT NULL,
  user_agent TEXT,
  screen_resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for detailed user interactions
CREATE TABLE IF NOT EXISTS public.user_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  interaction_type TEXT NOT NULL, -- 'click', 'scroll', 'mousemove', 'keypress', 'focus', 'blur'
  element_selector TEXT,
  element_text TEXT,
  page_url TEXT NOT NULL,
  coordinates JSONB, -- {x: number, y: number}
  metadata JSONB, -- additional data like scroll position, key pressed, etc.
  timestamp_ms BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all access for now since this is silent tracking)
CREATE POLICY "Allow all access to user_sessions" 
ON public.user_sessions 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to user_interactions" 
ON public.user_interactions 
FOR ALL 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_user_sessions_session_id ON public.user_sessions(session_id);
CREATE INDEX idx_user_interactions_session_id ON public.user_interactions(session_id);
CREATE INDEX idx_user_interactions_timestamp ON public.user_interactions(timestamp_ms);

-- Enable real-time updates
ALTER TABLE public.user_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.user_interactions REPLICA IDENTITY FULL;