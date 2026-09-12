# StrideWear — Progress Tracker

## Quick Stats

| Metric | Value |
|--------|-------|
| **Total Phases** | 11 (Phase 0-10) |
| **Total Tasks** | 126 |
| **Completed** | 5 |
| **In Progress** | 0 |
| **Remaining** | 121 |
| **Overall Progress** | 4.0% |
| **Current Phase** | Phase 0: Project Foundation |
| **Last Updated** | September 12, 2026 |

---

## PHASE 0: Project Foundation

**Status:** In Progress
**Progress:** 5/10 tasks (50%)
**Goal:** Scaffold project, configure tooling, set up Supabase local dev

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 0.1 | Initialize TanStack Start project | [x] | Scaffolded with `npx @tanstack/cli@latest create stridewear --blank` |
| 0.2 | Configure TypeScript (strict mode, path aliases) | [x] | Strict mode enabled, `@/*` and `#/*` aliases configured |
| 0.3 | Install & configure Tailwind CSS | [x] | Tailwind v4 + brand tokens in styles.css |
| 0.4 | Set up ESLint + Prettier with project rules | [x] | ESLint + Prettier configured, scripts added |
| 0.5 | Create folder structure per README | [x] | Created components/ui/, lib/, hooks/ + cn.ts utility |
| 0.6 | Set up Supabase CLI locally | [ ] | |
| 0.7 | Create .env.example with all required variables | [ ] | |
| 0.8 | Configure Git hooks (husky + lint-staged) | [ ] | |
| 0.9 | Set up GitHub repo + branch protection rules | [ ] | |
| 0.10 | Create Supabase client singleton (lib/supabase.ts) | [ ] | |

**Phase 0 Completion Checklist:**
- [ ] `pnpm dev` runs without errors
- [ ] App loads at localhost:3000
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] User confirms understanding

---

## PHASE 1: Database & Schema

**Status:** Not Started
**Progress:** 0/26 tasks (0%)
**Goal:** All tables, indexes, RLS policies, and types generated

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 1.1 | Create migration: profiles table + trigger | [ ] | |
| 1.2 | Create migration: addresses table | [ ] | |
| 1.3 | Create migration: categories table | [ ] | |
| 1.4 | Create migration: products table | [ ] | |
| 1.5 | Create migration: product_variants table + unique constraint | [ ] | |
| 1.6 | Create migration: product_images table | [ ] | |
| 1.7 | Create migration: cart_items table | [ ] | |
| 1.8 | Create migration: coupons table | [ ] | |
| 1.9 | Create migration: orders + order_items tables | [ ] | |
| 1.10 | Create migration: order_status_history table | [ ] | |
| 1.11 | Create migration: reviews table + check constraint | [ ] | |
| 1.12 | Create migration: wishlist_items table | [ ] | |
| 1.13 | Create all indexes | [ ] | |
| 1.14 | Enable RLS on ALL tables | [ ] | |
| 1.15 | Write RLS policies for profiles | [ ] | |
| 1.16 | Write RLS policies for addresses | [ ] | |
| 1.17 | Write RLS policies for cart_items | [ ] | |
| 1.18 | Write RLS policies for orders | [ ] | |
| 1.19 | Write RLS policies for order_items | [ ] | |
| 1.20 | Write RLS policies for reviews | [ ] | |
| 1.21 | Write RLS policies for wishlist_items | [ ] | |
| 1.22 | Write RLS policies for products/categories/variants/images | [ ] | |
| 1.23 | Write RLS policies for coupons | [ ] | |
| 1.24 | Create trigger: avg_rating recalculation | [ ] | |
| 1.25 | Generate Supabase TypeScript types | [ ] | |
| 1.26 | Seed script: sample categories, products, variants, images | [ ] | |

**Phase 1 Completion Checklist:**
- [ ] All migrations run without errors
- [ ] `supabase db reset` works locally
- [ ] Tables visible in Supabase dashboard
- [ ] TypeScript types generated
- [ ] Seed data loaded
- [ ] User understands RLS policies

---

## PHASE 2: Authentication & User Management

**Status:** Not Started
**Progress:** 0/11 tasks (0%)
**Goal:** Sign up, login, logout, password reset, email verification, role management

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 2.1 | Configure Supabase Auth: email/password + Google OAuth | [ ] | |
| 2.2 | Create sign-up page/component with form validation | [ ] | |
| 2.3 | Create sign-in page/component | [ ] | |
| 2.4 | Implement email verification flow | [ ] | |
| 2.5 | Create forgot password / reset password flow | [ ] | |
| 2.6 | Implement auth state listener + session persistence | [ ] | |
| 2.7 | Create protected route wrapper / middleware | [ ] | |
| 2.8 | Implement role-based access (customer vs admin) | [ ] | |
| 2.9 | Create profile page (view/edit name, phone) | [ ] | |
| 2.10 | Create addresses CRUD | [ ] | |
| 2.11 | Implement logout + session cleanup | [ ] | |

**Phase 2 Completion Checklist:**
- [ ] Sign up works (email + Google)
- [ ] Sign in works
- [ ] Password reset works
- [ ] Protected routes redirect to login
- [ ] Admin routes block non-admins
- [ ] Profile page works
- [ ] Address CRUD works
- [ ] User understands auth flow

---

## PHASE 3: Product Catalog (Storefront)

**Status:** Not Started
**Progress:** 0/12 tasks (0%)
**Goal:** Browse, filter, search, view product details

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 3.1 | Create TanStack Query hooks: useProducts, useProductBySlug | [ ] | |
| 3.2 | Build product listing page with pagination | [ ] | |
| 3.3 | Build ProductCard component | [ ] | |
| 3.4 | Build category navigation / sidebar | [ ] | |
| 3.5 | Implement filter UI: size, color, price range, gender | [ ] | |
| 3.6 | Implement sort: price, newest, popularity | [ ] | |
| 3.7 | Implement debounced search with TanStack Query | [ ] | |
| 3.8 | Build product detail page: image gallery, variant selector, stock status | [ ] | |
| 3.9 | Build variant selector component (size × color matrix) | [ ] | |
| 3.10 | Display reviews section on product detail page | [ ] | |
| 3.11 | Implement size guide modal/drawer | [ ] | |
| 3.12 | SEO: SSR meta tags, sitemap.xml generation | [ ] | |

**Phase 3 Completion Checklist:**
- [ ] Product listing loads with products
- [ ] Filters work correctly
- [ ] Sort works correctly
- [ ] Search works with debounce
- [ ] Product detail page works
- [ ] Variant selection works
- [ ] User understands TanStack Query

---

## PHASE 4: Cart & Checkout

**Status:** Not Started
**Progress:** 0/12 tasks (0%)
**Goal:** Full cart management + Cash on Delivery (COD) checkout flow

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 4.1 | Create useCart hook (read, add, update, remove) | [ ] | |
| 4.2 | Build cart page/drawer UI | [ ] | |
| 4.3 | Implement cart persistence (DB for logged-in, local state for guest) | [ ] | |
| 4.4 | Build cart item component | [ ] | |
| 4.5 | Implement subtotal, tax, shipping, discount calculation | [ ] | |
| 4.6 | Build coupon/promo code input + validation | [ ] | |
| 4.7 | Build checkout page: shipping address step | [ ] | |
| 4.8 | Build checkout page: shipping method step | [ ] | |
| 4.9 | Implement COD order creation | [ ] | |
| 4.10 | Implement stock decrement with race condition protection | [ ] | |
| 4.11 | Build order confirmation page | [ ] | |
| 4.12 | Clear cart after successful checkout | [ ] | |

**Phase 4 Completion Checklist:**
- [ ] Add to cart works
- [ ] Cart page shows items correctly
- [ ] Quantity update works
- [ ] Remove from cart works
- [ ] Coupons apply correctly
- [ ] Checkout creates order
- [ ] Stock decrements correctly
- [ ] Cart clears after order
- [ ] User understands race condition protection

---

## PHASE 5: Order Management

**Status:** Not Started
**Progress:** 0/9 tasks (0%)
**Goal:** Customer order history + admin order management

| ID | Task | Status | Notes |
|----|------|--------|-------|
| 5.1 | Create useOrders hook (list, detail) | [ ] | |
| 5.2 | Build order history page (list with status badges) | [ ] | |
| 5.3 | Build order detail page (items, tracking, status timeline) | [ ] | |
| 5.4 | Create admin: useAdminOrders hook | [ ] | |
| 5.5 | Build admin order list with TanStack Table | [ ] | |
| 5.6 | Create Edge Function: admin-update-order-status | [ ] | |
| 5.7 | Build admin order detail: status update, tracking number input | [ ] | |
| 5.8 | Implement order status history timeline UI | [ ] | |
| 5.9 | Implement order cancellation request flow | [ ] | |

**Phase 5 Completion Checklist:**
- [ ] Customer can view order history
- [ ] Customer can view order details
- [ ] Admin can view all orders
- [ ] Admin can filter/search orders
- [ ] Admin can update order status
- [ ] Status history timeline works
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
| 0: Foundation | 10 | 0 | 0% |
| 1: Database | 26 | 0 | 0% |
| 2: Auth | 11 | 0 | 0% |
| 3: Catalog | 12 | 0 | 0% |
| 4: Cart/Checkout | 12 | 0 | 0% |
| 5: Orders | 9 | 0 | 0% |
| 6: Admin Products | 9 | 0 | 0% |
| 7: Reviews/Wishlist | 6 | 0 | 0% |
| 8: Notifications | 8 | 0 | 0% |
| 9: Analytics | 5 | 0 | 0% |
| 10: Polish/Deploy | 18 | 0 | 0% |
| **TOTAL** | **126** | **0** | **0%** |

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

*Last Updated: September 12, 2026*
