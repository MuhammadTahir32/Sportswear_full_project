-- Create wishlist_items table
-- Save products for later

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- One wishlist entry per user per product
alter table wishlist_items
  add constraint unique_user_product_wishlist
  unique (user_id, product_id);

-- Enable RLS
alter table wishlist_items enable row level security;

-- RLS Policies
-- Users can view their own wishlist
create policy "Users can view own wishlist"
  on wishlist_items for select
  using (auth.uid() = user_id);

-- Users can insert their own wishlist items
create policy "Users can insert own wishlist items"
  on wishlist_items for insert
  with check (auth.uid() = user_id);

-- Users can delete their own wishlist items
create policy "Users can delete own wishlist items"
  on wishlist_items for delete
  using (auth.uid() = user_id);
