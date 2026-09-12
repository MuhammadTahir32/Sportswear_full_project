-- Create cart_items table
-- Shopping cart per user, links to product variants

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  variant_id uuid not null references product_variants(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table cart_items enable row level security;

-- RLS Policies
-- Users can view their own cart items
create policy "Users can view own cart items"
  on cart_items for select
  using (auth.uid() = user_id);

-- Users can insert their own cart items
create policy "Users can insert own cart items"
  on cart_items for insert
  with check (auth.uid() = user_id);

-- Users can update their own cart items
create policy "Users can update own cart items"
  on cart_items for update
  using (auth.uid() = user_id);

-- Users can delete their own cart items
create policy "Users can delete own cart items"
  on cart_items for delete
  using (auth.uid() = user_id);
