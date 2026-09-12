-- Create reviews table
-- Verified purchasers can leave ratings and comments

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- One review per user per product
alter table reviews
  add constraint unique_user_product_review
  unique (product_id, user_id);

-- Enable RLS
alter table reviews enable row level security;

-- RLS Policies
-- Anyone can view reviews (public)
create policy "Anyone can view reviews"
  on reviews for select
  using (true);

-- Users can insert their own reviews
create policy "Users can insert own reviews"
  on reviews for insert
  with check (auth.uid() = user_id);

-- Users can update their own reviews
create policy "Users can update own reviews"
  on reviews for update
  using (auth.uid() = user_id);

-- Users can delete their own reviews
create policy "Users can delete own reviews"
  on reviews for delete
  using (auth.uid() = user_id);
