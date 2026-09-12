-- Create orders table
-- Stores completed purchases with COD payment

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete restrict,
  status text not null default 'pending' check (status in (
    'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  subtotal numeric(10,2) not null,
  tax numeric(10,2) not null default 0,
  shipping_fee numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  applied_coupon_id uuid references coupons(id) on delete set null,
  shipping_address jsonb not null,
  tracking_number text,
  created_at timestamptz not null default now()
);

-- Create order_items table
-- Individual items in an order

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table orders enable row level security;
alter table order_items enable row level security;

-- RLS Policies for orders
-- Users can view their own orders
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

-- Users can insert their own orders (checkout)
create policy "Users can insert own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Admin can view all orders
create policy "Admins can view all orders"
  on orders for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Admin can update all orders
create policy "Admins can update all orders"
  on orders for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- RLS Policies for order_items
-- Users can view their own order items (via parent order)
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- Users can insert their own order items
create policy "Users can insert own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- Admin can view all order items
create policy "Admins can view all order items"
  on order_items for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
