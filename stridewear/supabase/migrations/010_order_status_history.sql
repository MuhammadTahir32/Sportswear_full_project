-- Create order_status_history table
-- Audit trail for order status changes

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status text not null,
  changed_at timestamptz not null default now()
);

-- Enable RLS
alter table order_status_history enable row level security;

-- RLS Policies
-- Users can view status history for their own orders
create policy "Users can view own order status history"
  on order_status_history for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_status_history.order_id and orders.user_id = auth.uid()
    )
  );

-- Admin can view all status history
create policy "Admins can view all order status history"
  on order_status_history for select
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );

-- Admin can insert status history
create policy "Admins can insert order status history"
  on order_status_history for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and role in ('admin', 'super_admin')
    )
  );
