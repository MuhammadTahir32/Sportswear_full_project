-- Create addresses table
-- Users can have multiple shipping addresses

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  label text not null default 'Home',
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'Pakistan',
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table addresses enable row level security;

-- RLS Policies
-- Users can view their own addresses
create policy "Users can view own addresses"
  on addresses for select
  using (auth.uid() = user_id);

-- Users can insert their own addresses
create policy "Users can insert own addresses"
  on addresses for insert
  with check (auth.uid() = user_id);

-- Users can update their own addresses
create policy "Users can update own addresses"
  on addresses for update
  using (auth.uid() = user_id);

-- Users can delete their own addresses
create policy "Users can delete own addresses"
  on addresses for delete
  using (auth.uid() = user_id);
