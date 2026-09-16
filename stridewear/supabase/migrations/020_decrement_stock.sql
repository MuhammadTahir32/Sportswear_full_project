-- Atomic stock decrement function with race condition protection
-- Uses PostgreSQL's atomic UPDATE with WHERE clause to prevent overselling

create or replace function decrement_stock(
  p_variant_id uuid,
  p_quantity integer
) returns boolean
language plpgsql
security definer
as $$
declare
  v_updated integer;
begin
  update product_variants
  set stock_qty = stock_qty - p_quantity
  where id = p_variant_id
    and stock_qty >= p_quantity;

  get diagnostics v_updated = row_count;
  return v_updated > 0;
end;
$$;

-- Allow authenticated users to call this function
grant execute on function decrement_stock(uuid, integer) to authenticated;
