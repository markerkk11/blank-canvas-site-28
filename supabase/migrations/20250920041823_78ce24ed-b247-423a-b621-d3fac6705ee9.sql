-- Create storage bucket for session recordings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('session-recordings', 'session-recordings', false);

-- Create table for session recordings metadata
CREATE TABLE IF NOT EXISTS public.session_recordings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  page_url TEXT NOT NULL,
  events_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  event_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.session_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies for session recordings
CREATE POLICY "Anyone can insert session recordings" 
ON public.session_recordings 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update session recordings" 
ON public.session_recordings 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all session recordings" 
ON public.session_recordings 
FOR SELECT 
USING (true);

-- Create policies for session recordings storage bucket
CREATE POLICY "Anyone can upload session recordings" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'session-recordings');

CREATE POLICY "Admins can view session recordings" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'session-recordings');

CREATE POLICY "Anyone can update session recordings" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'session-recordings');

-- Create indexes for better performance
CREATE INDEX idx_session_recordings_session_id ON public.session_recordings(session_id);
CREATE INDEX idx_session_recordings_start_time ON public.session_recordings(start_time);

-- Enable real-time updates
ALTER TABLE public.session_recordings REPLICA IDENTITY FULL;