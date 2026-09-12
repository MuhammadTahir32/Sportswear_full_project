-- Seed data for development
-- Sample categories, products, and variants

-- Categories
insert into categories (id, name, slug) values
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e001', 'Running', 'running'),
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e002', 'Training', 'training'),
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e003', 'Football', 'football'),
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e004', 'Basketball', 'basketball'),
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e005', 'Apparel', 'apparel'),
  ('a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e006', 'Accessories', 'accessories');

-- Products
insert into products (id, name, slug, description, category_id, gender, base_price, status) values
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f001', 'Stride Runner Pro', 'stride-runner-pro', 'Premium running shoes with advanced cushioning technology', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e001', 'men', 129.99, 'active'),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f002', 'Stride Training Elite', 'stride-training-elite', 'Versatile training shoes for gym and crossfit', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e002', 'unisex', 99.99, 'active'),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f003', 'Stride Football Boot', 'stride-football-boot', 'Lightweight football boots with superior grip', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e003', 'men', 149.99, 'active'),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f004', 'Stride Basketball High', 'stride-basketball-high', 'High-top basketball shoes with ankle support', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e004', 'men', 139.99, 'active'),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'Stride Performance Tee', 'stride-performance-tee', 'Moisture-wicking performance t-shirt', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e005', 'unisex', 34.99, 'active'),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f006', 'Stride Sport Socks', 'stride-sport-socks', 'Cushioned athletic socks 3-pack', 'a0a0a0a0-b0b0-c0c0-d0d0-e0e0e0e0e006', 'unisex', 19.99, 'active');

-- Product variants (size x color)
insert into product_variants (product_id, sku, size, color, stock_qty) values
  -- Runner Pro
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f001', 'SRP-BLK-10', '10', 'Black', 25),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f001', 'SRP-BLK-11', '11', 'Black', 20),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f001', 'SRP-WHT-10', '10', 'White', 15),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f001', 'SRP-WHT-11', '11', 'White', 10),
  -- Training Elite
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f002', 'STE-GRY-M', 'M', 'Gray', 30),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f002', 'STE-GRY-L', 'L', 'Gray', 25),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f002', 'STE-BLK-M', 'M', 'Black', 20),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f002', 'STE-BLK-L', 'L', 'Black', 15),
  -- Football Boot
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f003', 'SFB-BLK-9', '9', 'Black', 18),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f003', 'SFB-BLK-10', '10', 'Black', 22),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f003', 'SFB-WHT-9', '9', 'White', 12),
  -- Basketball High
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f004', 'SBH-BLK-10', '10', 'Black', 20),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f004', 'SBH-BLK-11', '11', 'Black', 15),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f004', 'SBH-RED-10', '10', 'Red', 10),
  -- Performance Tee
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'SPT-WHT-S', 'S', 'White', 50),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'SPT-WHT-M', 'M', 'White', 45),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'SPT-WHT-L', 'L', 'White', 40),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'SPT-BLK-S', 'S', 'Black', 35),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f005', 'SPT-BLK-M', 'M', 'Black', 30),
  -- Sport Socks
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f006', 'SSS-WHT-S', 'S', 'White', 100),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f006', 'SSS-WHT-M', 'M', 'White', 100),
  ('b0b0b0b0-c0c0-d0d0-e0e0-f0f0f0f0f006', 'SSS-WHT-L', 'L', 'White', 100);

-- Sample coupons
insert into coupons (code, discount_type, discount_value, expires_at, active) values
  ('WELCOME10', 'percent', 10, now() + interval '30 days', true),
  ('FLAT20', 'fixed', 20, now() + interval '60 days', true);
