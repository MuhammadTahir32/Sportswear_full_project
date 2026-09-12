-- Create coupons table
-- Discount codes for checkout

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null check (discount_value > 0),
  expires_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table coupons enable row level security;

-- RLS Policies
-- Admin can manage coupons
create policy "Admins can view coupons"
  on coupons for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can insert coupons"
  on coupons for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update coupons"
  on coupons for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can delete coupons"
  on coupons for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
