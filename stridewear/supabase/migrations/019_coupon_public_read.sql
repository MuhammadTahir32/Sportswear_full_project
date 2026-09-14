-- Add public read policy for active coupons
-- Allows anyone to validate a coupon code during checkout

create policy "Anyone can validate active coupons"
  on coupons for select
  using (
    active = true
    and (expires_at is null or expires_at > now())
  );
