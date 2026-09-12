-- Create product_variants table
-- Each variant = specific size + color combination with its own stock

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text not null unique,
  size text not null,
  color text not null,
  stock_qty integer not null default 0 check (stock_qty >= 0),
  price_override numeric(10,2) check (price_override is null or price_override >= 0),
  created_at timestamptz not null default now()
);

-- Unique constraint: no duplicate size+color for same product
alter table product_variants
  add constraint unique_product_size_color
  unique (product_id, size, color);

-- Enable RLS
alter table product_variants enable row level security;

-- RLS Policies
-- Anyone can view variants (for product display)
create policy "Anyone can view variants"
  on product_variants for select
  using (true);

-- Admin can manage variants
create policy "Admins can insert variants"
  on product_variants for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update variants"
  on product_variants for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can delete variants"
  on product_variants for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
