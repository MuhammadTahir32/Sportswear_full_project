-- Create products table
-- Core product catalog

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid not null references categories(id) on delete restrict,
  gender text not null check (gender in ('men', 'women', 'unisex', 'kids')),
  base_price numeric(10,2) not null check (base_price >= 0),
  sale_price numeric(10,2) check (sale_price is null or sale_price >= 0),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  avg_rating numeric(2,1) not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table products enable row level security;

-- RLS Policies
-- Anyone can view active products (public storefront)
create policy "Anyone can view active products"
  on products for select
  using (status = 'active');

-- Admin can view all products (including drafts)
create policy "Admins can view all products"
  on products for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Admin can insert products
create policy "Admins can insert products"
  on products for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Admin can update products
create policy "Admins can update products"
  on products for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Admin can delete products
create policy "Admins can delete products"
  on products for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
