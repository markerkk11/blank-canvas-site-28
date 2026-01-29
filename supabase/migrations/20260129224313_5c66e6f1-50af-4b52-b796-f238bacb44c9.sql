-- Enable replica identity full for realtime updates to include all columns
ALTER TABLE public.orders REPLICA IDENTITY FULL;