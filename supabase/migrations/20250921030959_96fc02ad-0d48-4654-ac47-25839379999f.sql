-- Create storage bucket for session recordings
INSERT INTO storage.buckets (id, name, public) VALUES ('session-recordings', 'session-recordings', false);

-- Create storage policies for session recordings
CREATE POLICY "Anyone can upload session screenshots" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'session-recordings');

CREATE POLICY "Anyone can view session screenshots" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'session-recordings');

CREATE POLICY "Anyone can update session screenshots" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'session-recordings');