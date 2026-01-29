-- Create video_sessions table for screenshot-based videos
CREATE TABLE public.video_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  page_url TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  frame_rate INTEGER NOT NULL DEFAULT 5,
  frame_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'recording',
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.video_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for video sessions (open access for analytics)
CREATE POLICY "Anyone can view video sessions" 
ON public.video_sessions 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert video sessions" 
ON public.video_sessions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update video sessions" 
ON public.video_sessions 
FOR UPDATE 
USING (true);

-- Create storage bucket for video frames
INSERT INTO storage.buckets (id, name, public) VALUES ('video-frames', 'video-frames', false);

-- Create storage policies for video frames
CREATE POLICY "Anyone can view video frames" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'video-frames');

CREATE POLICY "Anyone can upload video frames" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'video-frames');

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_video_sessions_updated_at
BEFORE UPDATE ON public.video_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();