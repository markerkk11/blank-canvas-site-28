-- Allow anonymous (anon) role to read all orders for demo/admin UI
-- Note: This makes orders publicly readable. Suitable only for demo/dev environments.
CREATE POLICY "Anonymous can view all orders"
ON public.orders
FOR SELECT
TO anon
USING (true);
