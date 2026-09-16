-- Customers can cancel their own orders (only pending/paid status)
CREATE POLICY "Users can cancel own orders"
  ON orders FOR UPDATE
  USING (
    auth.uid() = user_id
    AND status IN ('pending', 'paid')
  )
  WITH CHECK (
    auth.uid() = user_id
    AND status = 'cancelled'
  );
