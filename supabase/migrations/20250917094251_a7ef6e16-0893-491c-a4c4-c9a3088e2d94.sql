-- Allow anonymous users to update orders so clients can submit OTP and status changes
CREATE POLICY IF NOT EXISTS "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Optional: ensure real-time updates deliver full row on updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;