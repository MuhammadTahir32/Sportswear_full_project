# StrideWear — Progress Tracker

## Quick Stats

| Metric | Value |
|--------|-------|
| **Total Phases** | 11 (Phase 0-10) |
| **Total Tasks** | 129 |
| **Completed** | 85 |
| **In Progress** | 0 |
| **Remaining** | 47 |
| **Overall Progress** | 66% |
| **Current Phase** | Phase 5: Order Management |
| **Last Updated** | September 16, 2026 |

---

## PHASE 0: Project Foundation

**Status:** Complete
**Progress:** 10/10 tasks (100%)
**Goal:** Scaffold project, configure tooling, set up Supabase local dev

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 0.1 | Initialize TanStack Start project | [x] | Scaffolded with `npx @tanstack/cli@latest create stridewear --blank` |
| 0.2 | Configure TypeScript (strict mode, path aliases) | [x] | Strict mode enabled, `@/*` and `#/*` aliases configured |
| 0.3 | Install & configure Tailwind CSS | [x] | Tailwind v4 + brand tokens in styles.css |
| 0.4 | Set up ESLint + Prettier with project rules | [x] | ESLint + Prettier configured, scripts added |
| 0.5 | Create folder structure per README | [x] | Created components/ui/, lib/, hooks/ + cn.ts utility |
| 0.6 | Set up Supabase CLI locally | [x] | `supabase init` done, config.toml + migrations/ created |
| 0.7 | Create .env.example with all required variables | [x] | Created .env.example + .env.local |
| 0.8 | Configure Git hooks (husky + lint-staged) | [x] | Husky + lint-staged configured |
| 0.9 | Set up GitHub repo + branch protection rules | [x] | Git repo exists, .gitignore configured |
| 0.10 | Create Supabase client singleton (lib/supabase.ts) | [x] | Created with Database types |

**Phase 0 Completion Checklist:**
- [x] `pnpm dev` runs without errors
- [x] App loads at localhost:3000
- [x] `pnpm typecheck` passes
- [x] `pnpm lint` passes
- [x] User confirms understanding

---

## PHASE 1: Database & Schema

**Status:** Complete
**Progress:** 29/29 tasks (100%)
**Goal:** All tables, indexes, RLS policies, and types generated

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 1.1 | Create migration: profiles table + trigger | [x] | 001_profiles.sql |
| 1.2 | Create migration: addresses table | [x] | 002_addresses.sql |
| 1.3 | Create migration: categories table | [x] | 003_categories.sql |
| 1.4 | Create migration: products table | [x] | 004_products.sql |
| 1.5 | Create migration: product_variants table + unique constraint | [x] | 005_product_variants.sql |
| 1.6 | Create migration: product_images table | [x] | 006_product_images.sql |
| 1.7 | Create migration: cart_items table | [x] | 007_cart_items.sql |
| 1.8 | Create migration: coupons table | [x] | 008_coupons.sql |
| 1.9 | Create migration: orders + order_items tables | [x] | 009_orders.sql |
| 1.10 | Create migration: order_status_history table | [x] | 010_order_status_history.sql |
| 1.11 | Create migration: reviews table + check constraint | [x] | 011_reviews.sql |
| 1.12 | Create migration: wishlist_items table | [x] | 012_wishlist_items.sql |
| 1.13 | Create all indexes | [x] | 013_indexes.sql |
| 1.14 | Enable RLS on ALL tables | [x] | Included in each migration |
| 1.15 | Write RLS policies for profiles | [x] | Included in 001_profiles.sql |
| 1.16 | Write RLS policies for addresses | [x] | Included in 002_addresses.sql |
| 1.17 | Write RLS policies for cart_items | [x] | Included in 007_cart_items.sql |
| 1.18 | Write RLS policies for orders | [x] | Included in 009_orders.sql |
| 1.19 | Write RLS policies for order_items | [x] | Included in 009_orders.sql |
| 1.20 | Write RLS policies for reviews | [x] | Included in 011_reviews.sql |
| 1.21 | Write RLS policies for wishlist_items | [x] | Included in 012_wishlist_items.sql |
| 1.22 | Write RLS policies for products/categories/variants/images | [x] | Included in respective migrations |
| 1.23 | Write RLS policies for coupons | [x] | Included in 008_coupons.sql |
| 1.24 | Create trigger: avg_rating recalculation | [x] | 014_avg_rating_trigger.sql |
| 1.25 | Generate Supabase TypeScript types | [x] | Generated via `supabase gen types typescript --local` |
| 1.26 | Seed script: sample categories, products, variants, images | [x] | 015_seed_data.sql |
| 1.27 | Fix profiles RLS infinite recursion | [x] | 016_fix_profiles_rls_recursion.sql |
| 1.28 | Reset profiles RLS policies | [x] | 017_reset_profiles_rls.sql |
| 1.29 | Fix profiles trigger + backfill existing users | [x] | 018_fix_profiles_trigger_and_backfill.sql |

**Phase 1 Completion Checklist:**
- [x] All migrations run without errors
- [x] `supabase db reset` works locally
- [x] Tables visible in Supabase dashboard
- [x] TypeScript types generated
- [x] Seed data loaded
- [x] User understands RLS policies

**Bugfix Migrations (post-Phase 1):**
- [x] 016_fix_profiles_rls_recursion.sql — Fixed infinite recursion in admin SELECT policy (was self-referencing profiles table)
- [x] 017_reset_profiles_rls.sql — Complete reset of profiles RLS: dropped all policies, recreated clean set (view own, update own, insert own)
- [x] 018_fix_profiles_trigger_and_backfill.sql — Recreated handle_new_user() trigger + backfilled profiles for existing auth.users

---

## PHASE 2: Authentication & User Management

**Status:** Complete
**Progress:** 11/11 tasks (100%)
**Goal:** Sign up, login, logout, password reset, email verification, role management

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 2.1 | Configure Supabase Auth: email/password + Google OAuth | [x] | Email/password enabled, Google skipped for now |
| 2.2 | Create sign-up page/component with form validation | [x] | Brand-themed split layout, client-side validation |
| 2.3 | Create sign-in page/component | [x] | Brand-themed, remember me, forgot password link |
| 2.4 | Implement email verification flow | [x] | /auth/confirm route handles token callback |
| 2.5 | Create forgot password / reset password flow | [x] | Two pages: forgot-password + reset-password |
| 2.6 | Implement auth state listener + session persistence | [x] | AuthProvider in __root.tsx, useAuth hook |
| 2.7 | Create protected route wrapper / middleware | [x] | ProtectedRoute component wraps auth pages |
| 2.8 | Implement role-based access (customer vs admin) | [x] | AdminRoute component, useProfile hook |
| 2.9 | Create profile page (view/edit name, phone) | [x] | /profile route, uses ProtectedRoute |
| 2.10 | Create addresses CRUD | [x] | /addresses route, full CRUD + set default |
| 2.11 | Implement logout + session cleanup | [x] | signOut function, header with sign out button |

**Phase 2 Completion Checklist:**
- [x] Sign up works (email + Google)
- [x] Sign in works
- [x] Password reset works
- [x] Protected routes redirect to login
- [x] Admin routes block non-admins
- [x] Profile page works
- [x] Address CRUD works
- [x] User understands auth flow

**Known Issues:**
- Profiles RLS had infinite recursion bug (fixed via migrations 016-018)
- Email delivery may be delayed on Supabase free tier (account confirmed successfully)

---

## PHASE 3: Product Catalog (Storefront)

**Status:** Complete
**Progress:** 12/12 tasks (100%)
**Goal:** Browse, filter, search, view product details

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 3.1 | Create TanStack Query hooks: useProducts, useProductBySlug | [x] | Installed @tanstack/react-query, QueryClientProvider, useProducts/useProductBySlug hooks, getImageUrl utility |
| 3.2 | Build product listing page with pagination | [x] | /products route with Zod search schema, responsive grid, sort dropdown, numbered pagination |
| 3.3 | Build ProductCard component | [x] | ProductCard, StarRating, Skeleton components |
| 3.3.1 | Build full storefront navbar (Shop link, category links, search bar, cart icon) | [x] | Custom task: header.tsx with STRIDEWEAR logo, category links from DB, search bar, cart icon, auth links |
| 3.4 | Build category navigation / sidebar | [x] | CategorySidebar fetching from DB, highlights active category |
| 3.5 | Implement filter UI: size, color, price range, gender | [x] | FilterSidebar with gender buttons, price presets, min/max inputs; ActiveFilters removable tags |
| 3.6 | Implement sort: price, newest, popularity | [x] | 4 sort options: Newest, Price Low→High, Price High→Low, Top Rated |
| 3.7 | Implement debounced search with TanStack Query | [x] | Debounced search (300ms) in header, search param in URL, title shows search query |
| 3.8 | Build product detail page: image gallery, variant selector, stock status | [x] | products.$slug.tsx with breadcrumbs, image gallery, product info, loading/error states |
| 3.9 | Build variant selector component (size × color matrix) | [x] | VariantSelector with color/size buttons, stock awareness, dynamic price, Add to Cart button |
| 3.10 | Display reviews section on product detail page | [x] | useReviews hook, ReviewList component with avg rating, individual review cards |
| 3.11 | Implement size guide modal/drawer | [x] | Reusable Modal component, SizeGuide with Men's/Women's measurement tables, gender-based display |
| 3.12 | SEO: SSR meta tags, sitemap.xml generation | [x] | Root meta tags (title, description, OG, Twitter), products page meta, dynamic product detail title, sitemap generator script |

**Bug Fixes (during Phase 3):**
- [x] Fixed price filter NULL sale_price — client-side filtering using effectivePrice = sale_price ?? base_price
- [x] Fixed active filter tags — combined min/max into single "price" tag with preset labels ($150+, Under $50, etc.)
- [x] Fixed products.$slug child route — added Outlet rendering for nested routes
- [x] Fixed hooks order error — moved all hooks before early return in products.tsx
- [x] Fixed variant-selector.tsx typo — newColor → selectedColor

**Phase 3 Completion Checklist:**
- [x] Product listing loads with products
- [x] Filters work correctly
- [x] Sort works correctly
- [x] Search works with debounce
- [x] Product detail page works
- [x] Variant selection works
- [x] Size guide modal works
- [x] SEO meta tags work
- [x] Sitemap generator works
- [ ] User understands TanStack Query

---

## PHASE 4: Cart & Checkout

**Status:** Complete
**Progress:** 12/12 tasks (100%)
**Goal:** Full cart management + Cash on Delivery (COD) checkout flow

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.1 | Create useCart hook (read, add, update, remove) | [x] | useCart hook with addItem, updateQuantity, removeItem, clearCart. Fetches joined variant+product data. TanStack Query with ['cart'] key. |
| 4.2 | Build cart page/drawer UI | [x] | /cart route with CartItem component, quantity controls, subtotal, empty/auth states. Header cart icon links to /cart with live item count badge. |
| 4.3 | Implement cart persistence (DB for logged-in, local state for guest) | [x] | Guest cart in localStorage, logged-in cart in DB. Auto-merge on login. Guest cart fetches variant details for display. |
| 4.4 | Build cart item component | [x] | CartItem component: image, name, size/color, qty controls, line total, remove button |
| 4.5 | Implement subtotal, tax, shipping, discount calculation | [x] | cart-utils.ts: calculateCart with 8% tax, free shipping over $100, coupon discount support. Cart page shows full breakdown. |
| 4.6 | Build coupon/promo code input + validation | [x] | useValidateCoupon hook queries coupons table (active, not expired). CouponInput component with apply/remove. Discount feeds into calculateCart. New migration 019 for public read RLS. Seed: WELCOME10 (10%), FLAT20 ($20). |
| 4.7 | Build checkout page: shipping address step | [x] | Multi-step checkout layout with step indicator, useAddresses hook (TanStack Query), AddressStep component with select/add/delete, inline address form, cart redirect guard |
| 4.8 | Build checkout page: shipping method step | [x] | ShippingStep component with 3 tiers (Standard/Express/Overnight), free standard over $100, radio card selection matching AddressStep pattern |
| 4.9 | Implement COD order creation | [x] | usePlaceOrder hook inserts order + order_items, ReviewStep shows full breakdown, COD payment badge, Place Order button with loading state |
| 4.10 | Implement stock decrement with race condition protection | [x] | PostgreSQL decrement_stock() function with atomic UPDATE + WHERE stock_qty >= quantity check, called via supabase.rpc() before order creation, error shown on insufficient stock |
| 4.11 | Build order confirmation page | [x] | ConfirmationStep with green checkmark, order ID, total, COD badge, "What happens next" steps, Continue Shopping + Back to Home buttons |
| 4.12 | Clear cart after successful checkout | [x] | clearCart.mutateAsync() called in handlePlaceOrder after order creation, before advancing to confirmation step |

**Phase 4 Completion Checklist:**
- [x] Add to cart works
- [x] Cart page shows items correctly
- [x] Quantity update works
- [x] Remove from cart works
- [x] Coupons apply correctly
- [x] Checkout creates order
- [x] Stock decrements correctly
- [x] Cart clears after order
- [x] User understands race condition protection

---

## PHASE 5: Order Management

**Status:** In Progress
**Progress:** 5/9 tasks (56%)
**Goal:** Customer order history + admin order management

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 5.1 | Create useOrders hook (list, detail) | [x] | useOrders() fetches all user orders with order_items + variants + products + status_history. useOrder(orderId) fetches single order detail. Both use TanStack Query. |
| 5.2 | Build order history page (list with status badges) | [x] | /orders route with ProtectedRoute, order cards showing ID, date, status badge (color-coded), item count, total, product names. Empty state with "Browse Products" link. Loading skeletons. |
| 5.3 | Build order detail page (items, tracking, status timeline) | [x] | /orders/$orderId route with ProtectedRoute. Shows: back link, order ID + status badge, date, status timeline (5-step with checkmarks), shipping address, order items with images/colors/sizes, COD payment info + tracking number, price breakdown (subtotal/discount/tax/shipping/total), status history log. Loading skeletons + "Order Not Found" state. |
| 5.4 | Create admin: useAdminOrders hook | [x] | useAdminOrders() fetches all orders (admin scope) with profiles, order_items, variants, products, status_history. Supports filter by status, search by order ID, sort. useAdminOrder(orderId) for single order detail. Admin-only via role check. |
| 5.5 | Build admin order list with TanStack Table | [x] | /admin-orders route with AdminRoute guard. TanStack Table (legacy API) with sortable columns: Order ID, Customer, Date, Items, Total, Status. Status filter dropdown, search by order ID, loading skeletons, empty states. Brand-themed table styling. |
| 5.6 | Create Edge Function: admin-update-order-status | [ ] | |
| 5.7 | Build admin order detail: status update, tracking number input | [ ] | |
| 5.8 | Implement order status history timeline UI | [ ] | |
| 5.9 | Implement order cancellation request flow | [ ] | |

**Phase 5 Completion Checklist:**
- [x] Customer can view order history
- [x] Customer can view order details
- [ ] Admin can view all orders
- [ ] Admin can filter/search orders
- [ ] Admin can update order status
- [x] Status history timeline works
- [ ] User understands Edge Functions

---

## PHASE 6: Admin Dashboard — Products & Inventory

**Status:** Not Started
**Progress:** 0/9 tasks (0%)
**Goal:** Full product/inventory CRUD for admins

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 6.1 | Create useAdminProducts hook | [ ] | |
| 6.2 | Build admin product list with TanStack Table | [ ] | |
| 6.3 | Build product create/edit form (all fields) | [ ] | |
| 6.4 | Implement image upload to Supabase Storage | [ ] | |
| 6.5 | Build variant manager (add/edit/remove size×color combos) | [ ] | |
| 6.6 | Implement stock quantity management per variant | [ ] | |
| 6.7 | Build low-stock alerts / indicator | [ ] | |
| 6.8 | Build category CRUD (name, slug, parent) | [ ] | |
| 6.9 | Build coupon CRUD (code, type, value, expiry, active) | [ ] | |

**Phase 6 Completion Checklist:**
- [ ] Admin can create/edit/delete products
- [ ] Image upload works
- [ ] Variant management works
- [ ] Stock levels display correctly
- [ ] Category CRUD works
- [ ] Coupon CRUD works
- [ ] User understands Supabase Storage

---

## PHASE 7: Reviews & Wishlist

**Status:** Not Started
**Progress:** 0/6 tasks (0%)
**Goal:** Customer reviews and wishlist functionality

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 7.1 | Create useReviews hook | [ ] | |
| 7.2 | Build review form (star rating + comment) with purchase verification | [ ] | |
| 7.3 | Display reviews list on product detail page | [ ] | |
| 7.4 | Create useWishlist hook (add, remove, list) | [ ] | |
| 7.5 | Build wishlist page | [ ] | |
| 7.6 | Add "Add to Wishlist" button on product cards/detail | [ ] | |

**Phase 7 Completion Checklist:**
- [ ] Users can leave reviews
- [ ] Reviews display on product pages
- [ ] Wishlist add/remove works
- [ ] Wishlist page shows saved products
- [ ] User understands purchase verification

---

## PHASE 8: Notifications & Emails

**Status:** Not Started
**Progress:** 0/8 tasks (0%)
**Goal:** Transactional emails for order lifecycle

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 8.1 | Create Edge Function: send-order-email | [ ] | |
| 8.2 | Configure email provider (Resend/SendGrid) + verified domain | [ ] | |
| 8.3 | Build order confirmation email template | [ ] | |
| 8.4 | Build order shipped email template (with tracking) | [ ] | |
| 8.5 | Build order delivered email template | [ ] | |
| 8.6 | Build order cancelled email template | [ ] | |
| 8.7 | Trigger emails from admin status update | [ ] | |
| 8.8 | (Optional) Low stock admin notification | [ ] | |

**Phase 8 Completion Checklist:**
- [ ] Order confirmation email sends
- [ ] Email looks correct
- [ ] Other email templates work
- [ ] User understands Edge Functions

---

## PHASE 9: Analytics & Admin Overview

**Status:** Not Started
**Progress:** 0/5 tasks (0%)
**Goal:** Basic sales analytics for admin dashboard

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 9.1 | Create admin dashboard home page | [ ] | |
| 9.2 | Revenue by day/week chart | [ ] | |
| 9.3 | Top products by revenue/units sold | [ ] | |
| 9.4 | Recent orders summary widget | [ ] | |
| 9.5 | Low stock alerts widget | [ ] | |

**Phase 9 Completion Checklist:**
- [ ] Dashboard shows revenue chart
- [ ] Top products display
- [ ] Recent orders widget works
- [ ] Low stock alerts show
- [ ] User understands chart visualization

---

## PHASE 10: Polish, Testing & Deployment

**Status:** Not Started
**Progress:** 0/18 tasks (0%)
**Goal:** Testing, performance, accessibility, production deployment

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 10.1 | Write unit tests for utility functions (Vitest) | [ ] | |
| 10.2 | Write component tests for Cart, ProductCard, forms | [ ] | |
| 10.3 | Write integration tests for RLS policies | [ ] | |
| 10.4 | Write E2E tests for checkout flow (Playwright) | [ ] | |
| 10.5 | Write E2E tests for auth flow | [ ] | |
| 10.6 | Manual RLS verification on all tables | [ ] | |
| 10.7 | Accessibility audit (semantic HTML, alt text, keyboard nav) | [ ] | |
| 10.8 | Lighthouse performance audit (target ≥80) | [ ] | |
| 10.9 | Cross-browser testing (Chrome, Firefox, Safari, Edge) | [ ] | |
| 10.10 | Responsive testing (mobile, tablet, desktop) | [ ] | |
| 10.11 | Set up staging Supabase project | [ ] | |
| 10.12 | Deploy Edge Functions to staging (emails) | [ ] | |
| 10.13 | Deploy frontend to Vercel (staging) | [ ] | |
| 10.14 | End-to-end smoke test on staging | [ ] | |
| 10.15 | Set up production Supabase project | [ ] | |
| 10.16 | Deploy to production | [ ] | |
| 10.17 | Production smoke test | [ ] | |
| 10.18 | Final README + CHANGELOG update | [ ] | |

**Phase 10 Completion Checklist:**
- [ ] All tests pass
- [ ] Accessibility audit passes
- [ ] Performance audit passes (Lighthouse ≥ 80)
- [ ] Cross-browser testing done
- [ ] Responsive testing done
- [ ] Staging deployment works
- [ ] Production deployment works
- [ ] User understands testing strategies

---

## Phase Summary

| Phase | Tasks | Completed | Progress |
|-------|-------|-----------|----------|
| 0: Foundation | 10 | 10 | 100% |
| 1: Database | 29 | 29 | 100% |
| 2: Auth | 11 | 11 | 100% |
| 3: Catalog | 12 | 12 | 100% |
| 4: Cart/Checkout | 12 | 12 | 100% |
| 5: Orders | 9 | 5 | 56% |
| 6: Admin Products | 9 | 0 | 0% |
| 7: Reviews/Wishlist | 6 | 0 | 0% |
| 8: Notifications | 8 | 0 | 0% |
| 9: Analytics | 5 | 0 | 0% |
| 10: Polish/Deploy | 18 | 0 | 0% |
| **TOTAL** | **129** | **85** | **66%** |

---

## How to Update This Tracker

After completing each task:
1. Change `[ ]` to `[x]` in the task row
2. Add a note in the Notes column (optional)
3. Update the phase progress count
4. Update the Quick Stats at the top
5. Run verification commands (`pnpm dev`, `pnpm typecheck`, `pnpm lint`)
6. Complete the phase completion checklist
7. Get user confirmation before moving to next phase

---

## Learning Milestones

Track your understanding milestones:

- [ ] I understand what TanStack Start, Router, Query, and Table do
- [ ] I understand how Tailwind CSS works with brand tokens
- [ ] I understand how Supabase Auth works (email + OAuth)
- [ ] I understand how PostgreSQL databases work (tables, relationships, indexes)
- [ ] I understand what Row Level Security (RLS) is and why it matters
- [ ] I understand how TanStack Query caching works
- [ ] I understand how variant-based inventory works (size × color)
- [ ] I understand how COD checkout flow works
- [ ] I understand race condition protection in stock decrement
- [ ] I understand Edge Functions and when to use them
- [ ] I understand testing strategies (unit, component, E2E)
- [ ] I understand deployment to staging and production

---

*Last Updated: September 16, 2026*
