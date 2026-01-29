-- Create policy for anonymous users to update orders (for OTP submission)
DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;

CREATE POLICY "Anyone can update orders"
ON public.orders
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Ensure real-time updates deliver full row on updates
ALTER TABLE public.orders REPLICA IDENTITY FULL;