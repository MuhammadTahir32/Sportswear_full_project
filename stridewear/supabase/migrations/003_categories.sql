-- Create categories table
-- Self-referencing for sub-categories (e.g., "Shoes" under "Footwear")

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table categories enable row level security;

-- RLS Policies
-- Anyone can read categories (public)
create policy "Anyone can view categories"
  on categories for select
  using (true);

-- Only admins can insert/update/delete categories
create policy "Admins can insert categories"
  on categories for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update categories"
  on categories for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can delete categories"
  on categories for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
