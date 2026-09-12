# StrideWear — Complete Learning Guide

## Your Journey to Building a Full-Stack E-Commerce App

---

## How This Guide Works

This is NOT just a task list. This is a **learning-by-building** guide. For each phase:

1. **LEARN** — I explain the concepts, tools, and why we use them
2. **BUILD** — We write the code together, step by step
3. **QA** — You ask questions, I clarify, we make sure you understand
4. **VERIFY** — We test everything works, then move on

**Golden Rule:** We do NOT proceed until you say "I understand, let's continue."

---

## Project Overview

**StrideWear** is a sportswear e-commerce web app where customers can browse products, add to cart, checkout with Cash on Delivery (COD), and track orders. Admins can manage products, inventory, and orders.

### What We're Building (High Level)

```
Customer Flow:    Browse → Filter/Search → Product Detail → Cart → Checkout (COD) → Order Confirmation
Admin Flow:       Dashboard → Manage Products → Manage Orders → Analytics
```

### Tech Stack Summary

| What | Tool | Why |
|------|------|-----|
| Frontend Framework | TanStack Start | Server-side rendering (fast first load, SEO) |
| Routing | TanStack Router | Type-safe URLs, file-based routing |
| Data Fetching | TanStack Query | Caching, auto-refetch, loading states |
| Admin Tables | TanStack Table | Sorting, filtering, pagination |
| Styling | Tailwind CSS | Fast, consistent, no custom CSS files |
| Database | Supabase Postgres | PostgreSQL with built-in auth, storage, RLS |
| Authentication | Supabase Auth | Email/password + Google login |
| File Storage | Supabase Storage | Product images |
| Payments | Cash on Delivery | No online payment (not available in Pakistan) |
| Language | TypeScript | Catch errors before they happen |
| Package Manager | pnpm | Fast, disk-efficient |

---

## PHASE 0: Project Foundation

### What You'll Learn
- How to set up a modern full-stack project from scratch
- What TanStack Start is and why we use it
- How Tailwind CSS works
- What TypeScript strict mode means
- How Supabase connects to your frontend

### Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- VS Code with extensions: ESLint, Prettier, Tailwind IntelliSense
- A Supabase account (free tier is fine)

---

### Task 0.1: Initialize TanStack Start Project

**What is TanStack Start?**
TanStack Start is a full-stack React framework built on top of TanStack Router. It gives us:
- **SSR (Server-Side Rendering)**: Pages render on the server first, then send HTML to the browser. This means faster initial load and better SEO (Google can read your product pages).
- **File-based routing**: Create a file in `app/routes/` and it automatically becomes a URL.
- **Server functions**: Write backend logic that runs on the server, not in the browser.

**Why not Next.js?**
TanStack Start gives us more control and better type safety. The entire TanStack ecosystem (Router, Query, Table) works together seamlessly.

**The Command:**
```bash
pnpm create tanstack@latest
```

This scaffolds the project with all the right defaults. We'll choose:
- Project name: `stride-wear`
- TypeScript: Yes
- Tailwind CSS: Yes

**What gets created:**
```
stride-wear/
├── app/
│   ├── routes/
│   │   ├── __root.tsx      # Root layout (wraps all pages)
│   │   └── index.tsx       # Homepage
│   ├── styles/
│   │   └── globals.css     # Global styles (Tailwind)
│   ├── lib/
│   │   └── ...             # Utilities
│   └── ...
├── public/                 # Static files (images, favicon)
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── vite.config.ts          # Build tool config
```

**QA Session 0.1:**
- Do you understand what SSR is and why it matters?
- Do you understand what file-based routing means?
- Any questions about the project structure?

---

### Task 0.2: Configure TypeScript (Strict Mode)

**What is TypeScript?**
TypeScript is JavaScript with types. Instead of writing `let x = "hello"` and not knowing if `x` is a string or number, you write `let x: string = "hello"`. The compiler catches errors before you run the code.

**What is Strict Mode?**
In `tsconfig.json`, `"strict": true` enables all strict type-checking options:
- `noImplicitAny`: You MUST specify types (no guessing)
- `strictNullChecks`: `null` and `undefined` are their own types
- `strictFunctionTypes`: Functions must have correct parameter types

**Why strict mode?**
It forces you to write better code. You'll catch bugs at compile time instead of in production.

**Path Aliases:**
We configure `@/` to point to `./app/` so imports look clean:
```typescript
// Without alias
import { Button } from '../../../components/ui/Button'

// With alias
import { Button } from '@/components/ui/Button'
```

**QA Session 0.2:**
- Do you understand why TypeScript is important?
- Any questions about strict mode or path aliases?

---

### Task 0.3: Install & Configure Tailwind CSS

**What is Tailwind CSS?**
Tailwind is a utility-first CSS framework. Instead of writing custom CSS classes, you use pre-built utility classes directly in your HTML/JSX:

```html
<!-- Traditional CSS -->
<button class="btn-primary">Click me</button>

<!-- Tailwind -->
<button class="bg-[#C6FF3D] text-black font-bold px-6 py-3 rounded-full">
  Click me
</button>
```

**Why Tailwind?**
- No naming conflicts (no `.button` vs `.btn` vs `.btn-primary`)
- Consistent spacing, colors, typography
- Tiny production CSS (only uses classes you actually use)
- Fast to write once you learn the patterns

**Brand Tokens in Tailwind:**
We extend Tailwind's default config with our brand colors:
```javascript
// tailwind.config.ts
colors: {
  black: '#0D0D0D',
  lime: '#C6FF3D',
  'lime-dark': '#A6E62D',
  // ...
}
```

Now we can use `bg-lime`, `text-black`, etc.

**QA Session 0.3:**
- Do you understand how Tailwind utility classes work?
- Any questions about brand tokens in Tailwind config?

---

### Task 0.4: Set Up ESLint + Prettier

**What is ESLint?**
ESLint catches code quality issues:
- Unused variables
- Missing dependencies in React hooks
- Incorrect TypeScript usage
- Code style violations

**What is Prettier?**
Prettier auto-formats your code so everyone on the team writes the same style:
- Consistent indentation
- Consistent quote styles
- Consistent semicolons

**Why both?**
- ESLint = logic errors and code quality
- Prettier = formatting and style

**QA Session 0.4:**
- Do you understand the difference between ESLint and Prettier?

---

### Task 0.5: Create Folder Structure

**The Structure:**
```
app/
├── routes/          # Pages (file-based routing)
├── components/
│   └── ui/          # Reusable UI components (Button, Card, etc.)
├── lib/             # Utilities (Supabase client, helpers)
├── hooks/           # Custom React hooks (useCart, useProducts)
└── styles/          # Global CSS
```

**Why this structure?**
- **routes/**: Each file = a page/URL. TanStack Router reads this folder.
- **components/ui/**: Reusable pieces. Build once, use everywhere.
- **lib/**: Shared logic that isn't a React component.
- **hooks/**: Custom React functions that start with `use`.

**QA Session 0.5:**
- Do you understand why we organize code this way?

---

### Task 0.6: Set Up Supabase CLI Locally

**What is Supabase?**
Supabase is a backend-as-a-service that gives you:
- **PostgreSQL Database**: Store all your data (products, orders, users)
- **Auth**: User login/signup (email + Google)
- **Storage**: Store product images
- **Edge Functions**: Run backend logic (like sending emails)
- **Row Level Security (RLS)**: Automatic security rules per user

**Why Supabase instead of building your own backend?**
- No need to set up a server, database, auth system from scratch
- Free tier is generous
- Built-in security (RLS)
- Real-time updates (if needed later)

**Local Development:**
```bash
supabase init        # Creates supabase/ folder
supabase start       # Starts local Supabase (Docker required)
supabase db push     # Pushes schema to local DB
```

**QA Session 0.6:**
- Do you understand what Supabase provides?
- Any questions about local vs. cloud Supabase?

---

### Task 0.7: Create .env.example

**What are Environment Variables?**
Secret values that change per environment:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Public key (safe for browser)
- `SUPABASE_SERVICE_ROLE_KEY`: Admin key (NEVER in browser code)

**Why .env.example?**
It's a template. You share it with other developers so they know what variables are needed, but you never commit the actual `.env` file (it's in `.gitignore`).

**QA Session 0.7:**
- Do you understand the difference between anon key and service role key?

---

### Task 0.8-0.9: Git Hooks & GitHub Setup

**What are Git Hooks?**
Automatic scripts that run before/after git commands:
- **pre-commit**: Run linter before committing (catches errors early)
- **commit-msg**: Validate commit message format

**lint-staged**: Only runs linting on files that changed (faster).

**QA Session 0.8-0.9:**
- Any questions about Git hooks or GitHub setup?

---

### Task 0.10: Create Supabase Client Singleton

**What is a Singleton?**
A pattern where you create ONE instance of something and reuse it everywhere:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**Why a singleton?**
- Consistent configuration across the app
- No accidental multiple connections
- Easy to mock for testing

**QA Session 0.10:**
- Do you understand why we use a singleton pattern?
- Do you understand the difference between `import.meta.env` (Vite) and `process.env` (Node)?

---

## Phase 0 Complete! Checkpoint

Before moving to Phase 1, verify:
- [ ] `pnpm dev` runs without errors
- [ ] You can see the app at `localhost:3000`
- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] You understand everything we built
- [ ] All questions answered

### Phase 0 Key Takeaways

| Concept | What You Learned |
|---------|------------------|
| **TanStack Start** | SSR framework that renders pages on the server for faster load and better SEO |
| **File-based routing** | Create a file in `routes/` → it becomes a URL automatically |
| **TypeScript strict mode** | Catches errors at compile time, no `any` types allowed |
| **Tailwind CSS v4** | Utility-first styling with `@theme` for brand tokens |
| **ESLint vs Prettier** | ESLint = logic errors, Prettier = formatting |
| **Supabase CLI** | Local development environment for database, auth, storage |
| **Environment variables** | `VITE_` prefix = public (browser), no prefix = server-only |
| **Singleton pattern** | Create once, import everywhere (Supabase client) |
| **Git hooks** | Auto-run linter before commits to catch errors early |
| **cn() utility** | Merge Tailwind classes safely without conflicts |

**Say "Ready for Phase 1" to continue.**

---

## PHASE 1: Database & Schema

### What You'll Learn
- How to design a database schema
- What SQL migrations are and why we use them
- How Row Level Security (RLS) works
- How to generate TypeScript types from your database

### The Big Picture

Before we build any features, we need to define WHAT data we store and HOW it relates:

```
User → has Profile → has Addresses
User → has Cart Items → link to Product Variants
User → places Orders → contains Order Items → link to Product Variants
Product → belongs to Category
Product → has Variants (size × color)
Product → has Images
Product → has Reviews
User → has Wishlist → links to Products
```

### Task 1.1: Profiles Table

**What is this table?**
When a user signs up with Supabase Auth, their info goes in `auth.users`. But we need MORE info (phone, role, full name). So we create a `profiles` table that extends `auth.users`.

**The Trigger:**
When a new user signs up, a PostgreSQL trigger automatically creates their profile:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

**QA Session 1.1:**
- Do you understand why we separate `profiles` from `auth.users`?
- Do you understand what a database trigger is?

---

### Tasks 1.2-1.6: Core Tables

**Tables we're creating:**
1. **addresses** — Where to ship orders
2. **categories** — Product categories (Running, Football, etc.)
3. **products** — The items for sale
4. **product_variants** — Size × Color combinations (each has its own stock)
5. **product_images** — Multiple images per product

**Key Concepts:**
- **UUID Primary Keys**: Every table has an `id` column that's a unique identifier
- **Foreign Keys**: `product_id` in `product_variants` links back to `products.id`
- **Unique Constraints**: Can't have two identical size+color combos for the same product

**QA Session 1.2-1.6:**
- Do you understand what primary keys and foreign keys are?
- Do you understand why variants are separate from products?

---

### Tasks 1.7-1.12: Commerce Tables

**Tables we're creating:**
1. **cart_items** — What's in a user's shopping cart
2. **coupons** — Discount codes
3. **orders** — A completed purchase
4. **order_items** — Individual items in an order
5. **order_status_history** — Track status changes over time
6. **reviews** — User ratings and comments
7. **wishlist_items** — Saved products for later

**Key Concepts:**
- **JSONB**: `shipping_address` in orders is stored as JSON (snapshot at time of order)
- **Denormalized Data**: `avg_rating` on products is calculated and stored (faster reads)

**QA Session 1.7-1.12:**
- Do you understand why we snapshot the shipping address in orders?
- Do you understand what denormalized data means?

---

### Tasks 1.13-1.23: Indexes & RLS

**What are Indexes?**
Like a book's index — they help the database find data fast:
```sql
CREATE INDEX idx_products_category ON products(category_id);
```
Without this, every product query would scan ALL rows. With it, it jumps straight to the right category.

**What is Row Level Security (RLS)?**
RLS is Supabase's superpower. It means the DATABASE itself enforces who can see/edit what:

```sql
-- Users can only see their own cart items
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);
```

**Why RLS?**
- Even if your frontend code has a bug, the database blocks unauthorized access
- No need to write security logic in every API call
- Default-deny: if no policy matches, access is denied

**QA Session 1.13-1.23:**
- Do you understand why indexes matter for performance?
- Do you understand how RLS protects your data?
- Can you explain RLS in your own words?

---

### Task 1.24: Rating Trigger

**What is this?**
When someone reviews a product, we need to update the product's average rating:
```sql
-- After insert/update/delete on reviews
-- Recalculate: AVG(rating) for that product
-- Update: products.avg_rating
```

**Why a trigger?**
Instead of calculating avg_rating every time someone views a product (slow), we calculate it once when reviews change (fast reads).

**QA Session 1.24:**
- Do you understand why triggers are used for denormalized data?

---

### Task 1.25-1.26: Types & Seed Data

**TypeScript Types from Database:**
Supabase can generate TypeScript types from your schema:
```bash
supabase gen types typescript --local > app/lib/database.types.ts
```

Now every query is fully typed — you know exactly what columns come back.

**Seed Data:**
Sample data to development with:
- 5-6 categories (Running, Training, Football, Basketball, Apparel, Accessories)
- 10-15 products with variants
- Product images

**QA Session 1.25-1.26:**
- Do you understand why generated types are useful?
- Any questions about seed data?

---

## Phase 1 Complete! Checkpoint

Before moving to Phase 2, verify:
- [ ] All migrations run without errors
- [ ] `supabase db reset` works locally
- [ ] You can see tables in Supabase dashboard
- [ ] TypeScript types are generated
- [ ] Seed data is loaded
- [ ] You understand RLS policies
- [ ] All questions answered

**Say "Ready for Phase 2" to continue.**

---

## PHASE 2: Authentication & User Management

### What You'll Learn
- How Supabase Auth works
- Email/password and OAuth flows
- Protected routes and role-based access
- Session management

### Task 2.1: Configure Auth Providers

**Email/Password:**
Supabase handles this out of the box. Users sign up with email + password, verify their email, then log in.

**Google OAuth:**
1. Create a Google Cloud project
2. Enable Google+ API
3. Create OAuth credentials
4. Add Client ID and Secret to Supabase dashboard
5. Users click "Sign in with Google" → Supabase handles the rest

**QA Session 2.1:**
- Do you understand what OAuth is?
- Do you understand the difference between email/password and OAuth?

---

### Tasks 2.2-2.5: Auth Pages

**Sign Up Flow:**
1. User enters email + password
2. Supabase sends verification email
3. User clicks link → email verified
4. Trigger creates their profile in `profiles` table

**Sign In Flow:**
1. User enters email + password
2. Supabase returns a session (access token + refresh token)
3. Session stored in browser (localStorage or cookie)
4. All subsequent Supabase calls include this token

**Password Reset:**
1. User clicks "Forgot Password"
2. Supabase sends reset email
3. User clicks link → enters new password
4. Password updated

**QA Session 2.2-2.5:**
- Do you understand the sign-up → verify → login flow?
- Do you understand what a session token is?

---

### Tasks 2.6-2.8: Auth State & Route Protection

**Auth State Listener:**
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  // Update React state when user logs in/out
})
```

**Protected Routes:**
A wrapper component that checks if user is logged in:
```typescript
function ProtectedRoute({ children }) {
  if (!user) return <Navigate to="/login" />
  return children
}
```

**Role-Based Access:**
```typescript
function AdminRoute({ children }) {
  if (!user) return <Navigate to="/login" />
  if (user.role !== 'admin') return <Navigate to="/" />
  return children
}
```

**QA Session 2.6-2.8:**
- Do you understand how route protection works?
- Do you understand the difference between customer and admin access?

---

### Tasks 2.9-2.11: Profile & Addresses

**Profile Page:**
- View/edit name and phone
- Uses Supabase to update `profiles` table

**Address CRUD:**
- List saved addresses
- Add new address
- Edit/delete address
- Set default address

**QA Session 2.9-2.11:**
- Any questions about profile or address management?

---

## Phase 2 Complete! Checkpoint

- [ ] Sign up works (email + Google)
- [ ] Sign in works
- [ ] Password reset works
- [ ] Protected routes redirect to login
- [ ] Admin routes block non-admins
- [ ] Profile page works
- [ ] Address CRUD works
- [ ] You understand auth flow
- [ ] All questions answered

**Say "Ready for Phase 3" to continue.**

---

## PHASE 3: Product Catalog (Storefront)

### What You'll Learn
- How TanStack Query works (caching, refetching, loading states)
- Building product listing with filters, search, pagination
- Building product detail pages with variant selection

### Task 3.1: TanStack Query Hooks

**What is TanStack Query?**
A library that manages server state (data from your API/Supabase):

```typescript
function useProducts() {
  return useQuery({
    queryKey: ['products'],        // Unique key for this data
    queryFn: () => supabase        // Function that fetches data
      .from('products')
      .select('*')
  })
}
```

**Why TanStack Query?**
- **Caching**: If you visit the same page twice, it uses cached data (instant)
- **Auto-refetch**: Data updates when you come back to the tab
- **Loading states**: Built-in `isLoading`, `isError`, `data` states
- **Optimistic updates**: UI updates immediately while server processes

**QA Session 3.1:**
- Do you understand what caching means and why it matters?
- Do you understand the queryKey concept?

---

### Tasks 3.2-3.7: Product Listing & Filtering

**Product Listing Page:**
- Grid of ProductCard components
- Pagination (load 20 at a time)
- Category sidebar navigation

**Filters:**
- Size (S, M, L, XL)
- Color (with color swatches)
- Price range (slider or inputs)
- Gender (Men, Women, Unisex, Kids)

**Sort:**
- Price: Low to High / High to Low
- Newest first
- Popularity (by rating or sales)

**Search:**
- Debounced input (waits 300ms after typing stops)
- Searches product name and description
- Uses PostgreSQL full-text search

**QA Session 3.2-3.7:**
- Do you understand what debouncing means?
- Do you understand how pagination works?

---

### Tasks 3.8-3.9: Product Detail Page

**Image Gallery:**
- Main image + thumbnail row
- Click thumbnail to change main image
- Swipe on mobile

**Variant Selector:**
- Size selector (buttons or dropdown)
- Color selector (swatches)
- When you pick a combination, show:
  - Price (may differ per variant)
  - Stock status ("In Stock" / "Only 3 left" / "Out of Stock")
  - Add to Cart button

**Stock Logic:**
```typescript
const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor)
const inStock = variant && variant.stock_qty > 0
```

**QA Session 3.8-3.9:**
- Do you understand how variant selection works?
- Do you understand how we check stock availability?

---

### Tasks 3.10-3.12: Reviews, Size Guide, SEO

**Reviews Section:**
- Show star rating + comment
- Show average rating at top
- "Write a Review" button (if logged in and purchased)

**Size Guide:**
- Modal/drawer with size chart
- Common for sportswear

**SEO (Search Engine Optimization):**
- SSR means Google can read your product pages
- Add meta tags (title, description, og:image)
- Generate sitemap.xml

**QA Session 3.10-3.12:**
- Do you understand why SSR helps with SEO?
- Any questions about reviews or size guide?

---

## Phase 3 Complete! Checkpoint

- [ ] Product listing loads with products
- [ ] Filters work (size, color, price, gender)
- [ ] Sort works
- [ ] Search works with debounce
- [ ] Product detail page shows images, variants, stock
- [ ] Reviews display correctly
- [ ] All questions answered

**Say "Ready for Phase 4" to continue.**

---

## PHASE 4: Cart & Checkout

### What You'll Learn
- How to manage cart state (database-backed)
- Checkout flow with COD
- Stock decrement with race condition protection

### Tasks 4.1-4.4: Cart Management

**Cart Hook:**
```typescript
function useCart(userId) {
  return useQuery({
    queryKey: ['cart', userId],
    queryFn: () => supabase.from('cart_items').select('*, product_variants(*)')
  })
}
```

**Cart Operations:**
- Add item (with variant selection)
- Update quantity
- Remove item
- Calculate subtotal

**Guest Cart → Login Sync:**
- Guest: store cart in localStorage
- On login: merge localStorage cart into database cart

**QA Session 4.1-4.4:**
- Do you understand how cart persistence works?
- Do you understand the guest → login sync flow?

---

### Tasks 4.5-4.6: Cart Calculations & Coupons

**Cart Calculations:**
```
Subtotal = sum of (price × quantity) for all items
Tax = subtotal × tax rate (e.g., 0% for COD in Pakistan)
Shipping = flat rate or free above threshold
Discount = coupon value (percent or fixed)
Total = subtotal + shipping - discount
```

**Coupon System:**
- User enters code
- Validate: exists, active, not expired
- Apply discount to total

**QA Session 4.5-4.6:**
- Do you understand how cart totals are calculated?
- Any questions about coupons?

---

### Tasks 4.7-4.12: Checkout Flow

**Checkout Steps:**
1. **Shipping Address** — Select or enter address
2. **Shipping Method** — Standard/Express (optional for v1)
3. **Review & Place Order** — Show summary, click "Place Order"

**COD Order Creation:**
```typescript
// Create order
const { data: order } = await supabase
  .from('orders')
  .insert({
    user_id: userId,
    status: 'pending',        // COD starts as pending
    subtotal, tax, shipping_fee, discount, total,
    shipping_address: address  // JSONB snapshot
  })
  .select()
  .single()

// Create order items
await supabase.from('order_items').insert(orderItems)

// Decrement stock (with race condition protection)
// ... SQL transaction ...

// Clear cart
await supabase.from('cart_items').delete().eq('user_id', userId)
```

**Race Condition Protection:**
Two people buying the last item at the same time? We use a SQL transaction:
```sql
BEGIN;
  -- Check stock
  SELECT stock_qty FROM product_variants WHERE id = $1 FOR UPDATE;
  -- If stock > 0, decrement
  UPDATE product_variants SET stock_qty = stock_qty - 1 WHERE id = $1;
COMMIT;
```

The `FOR UPDATE` locks the row until the transaction completes.

**QA Session 4.7-4.12:**
- Do you understand the checkout flow step by step?
- Do you understand what a race condition is and how we prevent it?
- Do you understand why we snapshot the shipping address?

---

## Phase 4 Complete! Checkpoint

- [ ] Add to cart works
- [ ] Cart page shows items with correct prices
- [ ] Quantity update works
- [ ] Remove from cart works
- [ ] Coupons apply correctly
- [ ] Checkout creates order
- [ ] Stock decrements correctly
- [ ] Cart clears after order
- [ ] Order confirmation page shows
- [ ] All questions answered

**Say "Ready for Phase 5" to continue.**

---

## PHASE 5: Order Management

### What You'll Learn
- Customer order history and tracking
- Admin order management with TanStack Table

### Tasks 5.1-5.3: Customer Orders

**Order History Page:**
- List of past orders
- Status badges (pending, processing, shipped, delivered)
- Click to view details

**Order Detail Page:**
- Order items with images
- Status timeline
- Tracking number (if shipped)
- Shipping address

**QA Session 5.1-5.3:**
- Any questions about order history or tracking?

---

### Tasks 5.4-5.9: Admin Order Management

**TanStack Table:**
A powerful table library for admin dashboards:
- Sorting (click column header)
- Filtering (search, status filter)
- Pagination

**Admin Order List:**
- All orders with status, date, total, customer
- Filter by status
- Search by order ID or customer name

**Admin Order Detail:**
- Update order status
- Add/edit tracking number
- View status history timeline

**Edge Function: `admin-update-order-status`**
Server-side function that:
1. Verifies user is admin
2. Updates order status
3. Records in order_status_history
4. Triggers email notification

**QA Session 5.4-5.9:**
- Do you understand why admin functions run on the server (Edge Functions)?
- Any questions about TanStack Table?

---

## Phase 5 Complete! Checkpoint

- [ ] Customer can view order history
- [ ] Customer can view order details
- [ ] Admin can view all orders
- [ ] Admin can filter/search orders
- [ ] Admin can update order status
- [ ] Status history timeline works
- [ ] All questions answered

**Say "Ready for Phase 6" to continue.**

---

## PHASE 6: Admin Dashboard — Products & Inventory

### What You'll Learn
- Product CRUD (Create, Read, Update, Delete)
- Image upload to Supabase Storage
- Variant management (size × color matrix)
- Stock management

### Tasks 6.1-6.3: Product CRUD

**Admin Product List:**
- Table with all products
- Status badges (active, draft, archived)
- Quick actions (edit, archive)

**Product Form:**
- Name, description, category, gender
- Base price, sale price
- Status (active/draft)

**QA Session 6.1-6.3:**
- Any questions about product management?

---

### Tasks 6.4-6.6: Image Upload & Variants

**Image Upload:**
1. User selects images
2. Upload to Supabase Storage bucket `product-images`
3. Store path in `product_images` table
4. Reorder images by updating `position`

**Variant Manager:**
- Add new size × color combination
- Set stock quantity per variant
- Set SKU (stock keeping unit)
- Optional price override

**Stock Management:**
- View stock levels per variant
- Low stock indicator (e.g., < 5 units)
- Bulk stock update

**QA Session 6.4-6.6:**
- Do you understand how Supabase Storage works?
- Do you understand how variants work (size × color matrix)?

---

### Tasks 6.7-6.9: Alerts, Categories, Coupons

**Low Stock Alerts:**
- Dashboard widget showing variants with stock < threshold
- Email notification (optional, Phase 8)

**Category CRUD:**
- Add/edit/delete categories
- Support sub-categories (parent_id)

**Coupon CRUD:**
- Create discount codes (percent or fixed)
- Set expiry dates
- Activate/deactivate

**QA Session 6.7-6.9:**
- Any questions about categories or coupons?

---

## Phase 6 Complete! Checkpoint

- [ ] Admin can create/edit/delete products
- [ ] Image upload works
- [ ] Variant management works
- [ ] Stock levels display correctly
- [ ] Category CRUD works
- [ ] Coupon CRUD works
- [ ] All questions answered

**Say "Ready for Phase 7" to continue.**

---

## PHASE 7: Reviews & Wishlist

### What You'll Learn
- Review system with purchase verification
- Wishlist functionality

### Tasks 7.1-7.3: Reviews

**Review Form:**
- Star rating (1-5)
- Comment text
- Only shown if user purchased the product

**Reviews List:**
- Display on product detail page
- Average rating at top
- Individual reviews with user name and date

**QA Session 7.1-7.3:**
- Do you understand purchase verification for reviews?

---

### Tasks 7.4-7.6: Wishlist

**Wishlist Hook:**
```typescript
function useWishlist(userId) {
  return useQuery({
    queryKey: ['wishlist', userId],
    queryFn: () => supabase.from('wishlist_items').select('*, products(*)')
  })
}
```

**Wishlist Page:**
- Grid of saved products
- Remove from wishlist
- Add to cart from wishlist

**Add to Wishlist Button:**
- Heart icon on product cards and detail page
- Filled heart if already in wishlist
- Toggle add/remove

**QA Session 7.4-7.6:**
- Any questions about wishlist?

---

## Phase 7 Complete! Checkpoint

- [ ] Users can leave reviews
- [ ] Reviews display on product pages
- [ ] Wishlist add/remove works
- [ ] Wishlist page shows saved products
- [ ] All questions answered

**Say "Ready for Phase 8" to continue.**

---

## PHASE 8: Notifications & Emails

### What You'll Learn
- Edge Functions for sending emails
- Email templates
- Email provider integration (Resend)

### Tasks 8.1-8.2: Edge Function Setup

**What are Edge Functions?**
Server-side code that runs in Supabase's Deno runtime:
```typescript
// supabase/functions/send-order-email/index.ts
import { Resend } from 'resend'

Deno.serve(async (req) => {
  const { orderId } = await req.json()
  // Fetch order details
  // Send email via Resend
  return new Response('OK')
})
```

**Why Edge Functions?**
- Runs close to your database (low latency)
- Can use service role key (admin access)
- Triggered by database webhooks or called from frontend

**QA Session 8.1-8.2:**
- Do you understand what Edge Functions are and when to use them?

---

### Tasks 8.3-8.8: Email Templates

**Order Confirmation Email:**
- Order ID
- Items ordered
- Total amount
- COD instructions
- Estimated delivery

**Order Shipped Email:**
- Tracking number
- Link to track shipment

**Order Delivered Email:**
- Confirmation
- Request for review

**Order Cancelled Email:**
- Cancellation reason
- Refund info (if applicable)

**QA Session 8.3-8.8:**
- Any questions about email templates?

---

## Phase 8 Complete! Checkpoint

- [ ] Order confirmation email sends
- [ ] Email looks correct
- [ ] Other email templates work
- [ ] All questions answered

**Say "Ready for Phase 9" to continue.**

---

## PHASE 9: Analytics & Admin Overview

### What You'll Learn
- Basic sales analytics
- Dashboard widgets
- Chart visualization

### Tasks 9.1-9.5: Analytics

**Admin Dashboard Home:**
- Revenue by day/week chart
- Top products by revenue
- Recent orders summary
- Low stock alerts widget

**Chart Library:**
Using a lightweight chart library (e.g., Recharts or Chart.js) to visualize:
- Daily revenue line chart
- Top 10 products bar chart
- Order status distribution pie chart

**QA Session 9.1-9.5:**
- Any questions about analytics or charts?

---

## Phase 9 Complete! Checkpoint

- [ ] Dashboard shows revenue chart
- [ ] Top products display
- [ ] Recent orders widget works
- [ ] Low stock alerts show
- [ ] All questions answered

**Say "Ready for Phase 10" to continue.**

---

## PHASE 10: Polish, Testing & Deployment

### What You'll Learn
- Writing tests (unit, integration, E2E)
- Accessibility best practices
- Performance optimization
- Deployment to production

### Tasks 10.1-10.5: Testing

**Unit Tests (Vitest):**
Test individual functions:
```typescript
// Example: test cart calculation
test('calculates subtotal correctly', () => {
  expect(calculateSubtotal(items)).toBe(expectedTotal)
})
```

**Component Tests:**
Test React components render correctly:
```typescript
test('ProductCard shows name and price', () => {
  render(<ProductCard product={mockProduct} />)
  expect(screen.getByText('Running Shoes')).toBeInTheDocument()
})
```

**E2E Tests (Playwright):**
Test full user flows:
```typescript
test('user can complete checkout', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="product-card"]')
  await page.click('Add to Cart')
  await page.goto('/checkout')
  // ... fill form, place order
})
```

**QA Session 10.1-10.5:**
- Do you understand the difference between unit, integration, and E2E tests?
- Any questions about testing?

---

### Tasks 10.6-10.10: Quality Assurance

**Accessibility (WCAG 2.1 AA):**
- Semantic HTML (proper headings, landmarks)
- Alt text for images
- Keyboard navigation
- Color contrast ratios

**Performance:**
- Lighthouse score ≥ 80
- Image optimization
- Lazy loading
- Code splitting

**Cross-browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers

**Responsive Testing:**
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

**QA Session 10.6-10.10:**
- Any questions about accessibility or performance?

---

### Tasks 10.11-10.17: Deployment

**Staging Environment:**
1. Create Supabase staging project
2. Deploy Edge Functions
3. Deploy frontend to Vercel
4. Run smoke tests

**Production Environment:**
1. Create Supabase production project
2. Deploy everything
3. Run full smoke test
4. Monitor for errors

**QA Session 10.11-10.17:**
- Any questions about deployment?

---

## Phase 10 Complete! Final Checkpoint

- [ ] All tests pass
- [ ] Accessibility audit passes
- [ ] Performance audit passes (Lighthouse ≥ 80)
- [ ] Cross-browser testing done
- [ ] Responsive testing done
- [ ] Staging deployment works
- [ ] Production deployment works
- [ ] Final README updated
- [ ] All questions answered

---

## Congratulations! Project Complete!

You've built a full-stack e-commerce application with:
- Authentication (email + Google)
- Product catalog with filters, search, pagination
- Shopping cart with persistence
- Cash on Delivery checkout
- Order management (customer + admin)
- Admin dashboard (products, inventory, orders)
- Reviews and wishlist
- Transactional emails
- Analytics dashboard
- Testing and deployment

### Key Takeaways

1. **TanStack Ecosystem**: Start + Router + Query + Table work together seamlessly
2. **Supabase**: Provides auth, database, storage, and edge functions in one platform
3. **TypeScript**: Catches errors before they happen
4. **Tailwind CSS**: Fast, consistent styling with brand tokens
5. **RLS**: Database-level security that protects your data
6. **Testing**: Unit + E2E tests catch bugs before production

### What to Learn Next

- **Stripe Integration**: When available in Pakistan
- **Real-time Updates**: Supabase Realtime for live order status
- **Mobile App**: React Native with shared Supabase backend
- **Internationalization**: Multi-language support
- **Advanced Analytics**: More detailed sales insights

---

*Last Updated: September 12, 2026*
