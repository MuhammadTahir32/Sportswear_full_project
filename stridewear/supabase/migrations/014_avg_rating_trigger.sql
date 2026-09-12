-- Create trigger for avg_rating recalculation
-- When reviews change, update the product's average rating

create or replace function update_product_avg_rating()
returns trigger
language plpgsql
as $$
declare
  target_product_id uuid;
begin
  -- Determine which product to update
  if tg_op = 'DELETE' then
    target_product_id := old.product_id;
  else
    target_product_id := new.product_id;
  end if;

  -- Update the product's average rating
  update products
  set avg_rating = coalesce(
    (
      select round(avg(rating)::numeric, 1)
      from reviews
      where product_id = target_product_id
    ),
    0
  )
  where id = target_product_id;

  return coalesce(new, old);
end;
$$;

-- Trigger on reviews insert
create trigger on_review_insert
  after insert on reviews
  for each row
  execute function update_product_avg_rating();

-- Trigger on reviews update
create trigger on_review_update
  after update on reviews
  for each row
  execute function update_product_avg_rating();

-- Trigger on reviews delete
create trigger on_review_delete
  after delete on reviews
  for each row
  execute function update_product_avg_rating();
