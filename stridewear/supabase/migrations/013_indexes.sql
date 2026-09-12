-- Create indexes for performance
-- These speed up common queries

-- Products indexes
create index if not exists idx_products_category_id on products(category_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_gender on products(gender);
create index if not exists idx_products_created_at on products(created_at desc);

-- Product variants indexes
create index if not exists idx_product_variants_product_id on product_variants(product_id);

-- Product images indexes
create index if not exists idx_product_images_product_id on product_images(product_id);

-- Cart items indexes
create index if not exists idx_cart_items_user_id on cart_items(user_id);

-- Orders indexes
create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at desc);

-- Order items indexes
create index if not exists idx_order_items_order_id on order_items(order_id);

-- Reviews indexes
create index if not exists idx_reviews_product_id on reviews(product_id);
create index if not exists idx_reviews_user_id on reviews(user_id);

-- Wishlist indexes
create index if not exists idx_wishlist_items_user_id on wishlist_items(user_id);

-- Addresses indexes
create index if not exists idx_addresses_user_id on addresses(user_id);

-- Full-text search index on products
create index if not exists idx_products_search on products
  using gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
