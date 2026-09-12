-- Create product_images table
-- Multiple images per product, stored in Supabase Storage

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  storage_path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table product_images enable row level security;

-- RLS Policies
-- Anyone can view images (for product display)
create policy "Anyone can view product images"
  on product_images for select
  using (true);

-- Admin can manage images
create policy "Admins can insert product images"
  on product_images for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can update product images"
  on product_images for update
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

create policy "Admins can delete product images"
  on product_images for delete
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
