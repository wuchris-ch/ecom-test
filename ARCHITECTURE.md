# E-Commerce MVP Architecture Deep Dive

A comprehensive technical breakdown of the technologies, patterns, and architecture decisions in this project. This document is designed to help you understand not just *what* the code does, but *why* it works the way it does.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Next.js App Router Architecture](#nextjs-app-router-architecture)
3. [Supabase & Database Design](#supabase--database-design)
4. [Authentication System](#authentication-system)
5. [State Management: The Cart System](#state-management-the-cart-system)
6. [Payment Processing with Stripe](#payment-processing-with-stripe)
7. [Webhooks: The Glue That Holds It Together](#webhooks-the-glue-that-holds-it-together)
8. [Digital Downloads System](#digital-downloads-system)
9. [TypeScript Patterns](#typescript-patterns)
10. [UI Component Architecture](#ui-component-architecture)
11. [Key Learnings & Gotchas](#key-learnings--gotchas)

---

## Tech Stack Overview

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Next.js 16** | React framework | Server components, file-based routing, API routes |
| **React 19** | UI library | Component model, hooks, server/client architecture |
| **Supabase** | Backend-as-a-Service | PostgreSQL, Auth, Row Level Security, real-time |
| **Stripe** | Payments | Industry standard, hosted checkout, webhooks |
| **TypeScript** | Type safety | Catch errors at compile time, better DX |
| **Tailwind CSS 4** | Styling | Utility-first, fast iteration, no CSS files |
| **shadcn/ui** | Component library | Accessible, customizable, copy-paste components |
| **Zod** | Validation | Runtime type validation, form validation |
| **React Hook Form** | Form handling | Performant forms with validation integration |

### Pros & Cons Summary

**Next.js Pros:**
- Server-side rendering (SEO, performance)
- API routes in the same project (no separate backend)
- File-based routing (intuitive structure)
- Built-in optimization (images, fonts, bundling)

**Next.js Cons:**
- Learning curve (server vs client components)
- Deployment typically requires Node.js server (or Vercel)
- Breaking changes between major versions

**Supabase Pros:**
- Full PostgreSQL database (powerful, relational)
- Built-in authentication with OAuth providers
- Row Level Security (security at database level)
- Generous free tier

**Supabase Cons:**
- Vendor lock-in concerns
- RLS policies can be complex
- Limited compute on free tier

---

## Next.js App Router Architecture

### Server Components vs Client Components

This is the **most important concept** to understand in modern Next.js.

```
┌─────────────────────────────────────────────────────────────┐
│                    Server Components                         │
│  • Run on the server only                                   │
│  • Can access database directly                             │
│  • Can use async/await at component level                   │
│  • Cannot use hooks (useState, useEffect)                   │
│  • Cannot use browser APIs                                  │
│  • Default in App Router                                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Client Components                         │
│  • Run in the browser                                       │
│  • Use "use client" directive at top                        │
│  • Can use hooks and interactivity                          │
│  • Can't access server resources directly                   │
│  • Must fetch data via API routes or props                  │
└─────────────────────────────────────────────────────────────┘
```

**Example from this codebase:**

```tsx
// app/products/page.tsx - SERVER COMPONENT (no directive)
async function getProducts() {
  const supabase = await createClient();  // Direct DB access!
  const { data } = await supabase.from("products").select("*");
  return data;
}

export default async function ProductsPage() {
  const products = await getProducts();  // Await at component level!
  return <ProductGrid products={products} />;
}
```

```tsx
// components/providers/cart-provider.tsx - CLIENT COMPONENT
"use client";  // This directive is required!

import { useState, useReducer } from "react";  // Now we can use hooks

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  // ...
}
```

### File-Based Routing

The `app/` directory structure directly maps to URL routes:

```
app/
├── page.tsx              → /
├── products/
│   ├── page.tsx          → /products
│   └── [id]/
│       └── page.tsx      → /products/:id (dynamic route)
├── auth/
│   ├── login/
│   │   └── page.tsx      → /auth/login
│   └── callback/
│       └── route.ts      → /auth/callback (API route)
└── api/
    ├── checkout/
    │   └── route.ts      → /api/checkout
    └── stripe-webhook/
        └── route.ts      → /api/stripe-webhook
```

**Key insight:** Files named `page.tsx` render UI, files named `route.ts` handle HTTP requests.

### Dynamic Routes and Parameters

```tsx
// app/products/[id]/page.tsx
interface ProductPageProps {
  params: Promise<{ id: string }>;  // Next.js 15+ uses Promise
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;  // Must await in Next.js 15+
  const product = await getProduct(id);
  // ...
}
```

**Why Promise?** Next.js 15 made params async to support streaming and partial rendering.

### Data Fetching Patterns

```tsx
// Static revalidation - page regenerates every 60 seconds
export const revalidate = 60;

async function getProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}
```

---

## Supabase & Database Design

### Three Types of Supabase Clients

This is crucial to understand—there are **three different clients** for different contexts:

#### 1. Browser Client (`lib/supabase/client.ts`)
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Safe to expose
  );
}
```
- Used in client components
- Runs in the user's browser
- Respects Row Level Security
- Uses cookies for session management

#### 2. Server Client (`lib/supabase/server.ts`)
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          // Handle cookie setting...
        },
      },
    }
  );
}
```
- Used in server components and API routes
- Still respects RLS (user context via cookies)
- Can read/write cookies for sessions

#### 3. Admin Client (`lib/supabase/admin.ts`)
```typescript
import { createClient } from "@supabase/supabase-js";

export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // NEVER expose this!
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
```
- **Bypasses Row Level Security entirely**
- Uses service role key (keep secret!)
- Used only in webhooks and trusted server code

### Database Schema Design

```sql
-- Products: The items we sell
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),  -- Store as cents!
  is_digital BOOLEAN NOT NULL DEFAULT FALSE,
  stock INTEGER,  -- NULL = unlimited (digital products)
  -- ...
);

-- Orders: Purchase records
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),  -- NULL = guest checkout
  email TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id TEXT,  -- Links to Stripe
  -- ...
);

-- Order Items: What was in each order
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  name TEXT NOT NULL,  -- Snapshot! Product name at purchase time
  price_cents INTEGER NOT NULL,  -- Snapshot! Price at purchase time
  -- ...
);
```

**Key Design Decisions:**

1. **Store prices in cents** - Avoid floating-point rounding errors. `$19.99` = `1999`

2. **Snapshot product data** - `order_items` stores the name and price at purchase time. If you change a product's price later, historical orders remain accurate.

3. **UUID primary keys** - More secure than sequential integers, works with Supabase defaults.

4. **Foreign key constraints** - `ON DELETE CASCADE` removes order items when order is deleted. `ON DELETE SET NULL` keeps the record but nullifies the reference.

### Row Level Security (RLS)

RLS is Supabase's killer feature—security rules that run **inside the database**.

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can view products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

-- Users can only see their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

**How it works:**
1. Every query is filtered by RLS policies
2. `auth.uid()` returns the current user's ID (from their session)
3. Even if someone tries to access another user's orders, the database returns nothing

**Why this matters:** Security is enforced at the database level, not in your application code. Even if you have a bug in your API, RLS prevents data leaks.

---

## Authentication System

### The Auth Flow

```
┌──────────┐    1. Click Login    ┌───────────┐
│  User    │ ──────────────────▶  │  Supabase │
│ Browser  │                      │   Auth    │
└──────────┘                      └───────────┘
     ▲                                  │
     │                                  │ 2. Redirect to Google
     │                                  ▼
     │                            ┌───────────┐
     │                            │  Google   │
     │                            │   OAuth   │
     │                            └───────────┘
     │                                  │
     │    4. Redirect with code         │ 3. User authenticates
     │ ◀────────────────────────────────┘
     │
     ▼
┌────────────────┐    5. Exchange code    ┌───────────┐
│ /auth/callback │ ─────────────────────▶ │  Supabase │
│    route.ts    │ ◀───────────────────── │   Auth    │
└────────────────┘    6. Session cookie    └───────────┘
```

### Auth Provider (Client-Side State)

```tsx
// components/providers/auth-provider.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Middleware: Protecting Routes

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* ... */);
  
  // This refreshes the session if expired
  const { data: { user } } = await supabase.auth.getUser();

  // Protect /account routes
  if (!user && request.nextUrl.pathname.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
```

**Key insight:** Middleware runs on **every request** (matching the config pattern). It's the gatekeeper.

---

## State Management: The Cart System

### Why useReducer Instead of useState?

The cart has complex state logic with multiple actions. `useReducer` is better than `useState` when:

1. State has multiple sub-values
2. Next state depends on previous state
3. You need to handle many different actions

```typescript
// types/cart.ts
type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "LOAD_CART"; items: CartItem[] };
```

### The Reducer Pattern

```typescript
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      // Check if item already in cart
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === action.product.id
      );
      
      if (existingIndex > -1) {
        // Update quantity of existing item
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + (action.quantity || 1),
        };
        return { ...state, items: newItems, isOpen: true };
      }
      
      // Add new item
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: 1 }],
        isOpen: true,
      };
    }
    
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== action.productId),
      };
    
    // ... other cases
  }
}
```

### localStorage Persistence

```typescript
// Load cart on mount
useEffect(() => {
  const storedItems = loadCartFromStorage();
  if (storedItems.length > 0) {
    dispatch({ type: "LOAD_CART", items: storedItems });
  }
}, []);  // Empty deps = run once on mount

// Save cart whenever items change
useEffect(() => {
  saveCartToStorage(state.items);
}, [state.items]);  // Run whenever items change
```

**Important:** The `typeof window === "undefined"` check in `lib/cart.ts` prevents errors during server-side rendering.

---

## Payment Processing with Stripe

### The Checkout Flow

```
┌─────────┐     1. Click Checkout     ┌─────────────┐
│  User   │ ─────────────────────────▶│ /api/checkout│
│ Browser │                           │   route.ts   │
└─────────┘                           └──────┬───────┘
                                             │
                                   2. Create Checkout Session
                                             │
                                             ▼
                                      ┌───────────┐
                                      │  Stripe   │
                                      │   API     │
                                      └─────┬─────┘
                                            │
                      3. Return checkout URL │
┌─────────┐                                 │
│  User   │ ◀───────────────────────────────┘
│ Browser │
└────┬────┘
     │ 4. Redirect to Stripe Checkout
     ▼
┌───────────────┐
│ Stripe Hosted │    User enters payment info
│   Checkout    │
└───────┬───────┘
        │ 5. Payment successful
        │
        ├───────────────────────────────────┐
        │                                   │
        ▼                                   ▼
┌─────────────┐                    ┌─────────────────┐
│  /success   │                    │ /api/webhook    │
│   page      │                    │ (async event)   │
└─────────────┘                    └────────┬────────┘
                                            │
                                   6. Create order in DB
                                            │
                                            ▼
                                      ┌───────────┐
                                      │ Supabase  │
                                      │  Database │
                                      └───────────┘
```

### Creating a Checkout Session

```typescript
// app/api/checkout/route.ts
export async function POST(request: NextRequest) {
  const { items } = await request.json();
  
  // Build line items for Stripe
  const line_items = items.map(item => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name },
      unit_amount: item.price_cents,  // In cents!
    },
    quantity: item.quantity,
  }));

  // Store cart data in metadata (retrieved later by webhook)
  const sessionParams = {
    mode: "payment",
    line_items,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cart`,
    metadata: {
      user_id: user?.id || "",
      items: JSON.stringify(items),  // Important! Webhook needs this
    },
  };

  // Add shipping if physical items
  if (hasPhysicalItems) {
    sessionParams.shipping_address_collection = {
      allowed_countries: ["US", "CA", "GB", "AU"],
    };
    sessionParams.shipping_options = [/* ... */];
  }

  const session = await stripe.checkout.sessions.create(sessionParams);
  return NextResponse.json({ url: session.url });
}
```

**Why Stripe Hosted Checkout?**
- PCI compliance handled by Stripe
- Professional, trusted UI
- Supports multiple payment methods
- Less code to maintain

---

## Webhooks: The Glue That Holds It Together

### Why Webhooks?

The success page redirect isn't reliable for creating orders:
- User might close browser before redirect
- Network issues could prevent the redirect
- You can't trust client-side data

Webhooks are **server-to-server** communication—Stripe calls your server directly.

### Webhook Signature Verification

```typescript
// app/api/stripe-webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.text();  // Raw body needed for verification
  const signature = headersList.get("stripe-signature");

  let event: Stripe.Event;
  
  try {
    // Verify the webhook came from Stripe
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    // Invalid signature = not from Stripe
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutComplete(event.data.object);
  }

  return NextResponse.json({ received: true });
}
```

**Security:** The `STRIPE_WEBHOOK_SECRET` is used to verify that webhooks actually came from Stripe. Without this, anyone could call your webhook endpoint.

### Processing the Order

```typescript
async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient();  // Bypass RLS!
  
  // Parse metadata we stored during checkout
  const userId = session.metadata?.user_id || null;
  const items = JSON.parse(session.metadata?.items || "[]");

  // 1. Create the order
  const { data: order } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      email: session.customer_email,
      status: "paid",
      stripe_session_id: session.id,
      // ...
    })
    .select()
    .single();

  // 2. Create order items
  await supabase
    .from("order_items")
    .insert(items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      price_cents: item.price_cents,
      // ...
    })));

  // 3. Create download tokens for digital items
  // 4. Decrement stock for physical items
}
```

---

## Digital Downloads System

### Token-Based Access

```sql
CREATE TABLE digital_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_item_id UUID REFERENCES order_items(id),
  download_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  download_count INTEGER NOT NULL DEFAULT 0,
  max_downloads INTEGER NOT NULL DEFAULT 5,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);
```

**How it works:**
1. When payment succeeds, webhook creates download tokens
2. Each token is a random 32-byte hex string (unguessable)
3. Downloads are limited (5) and expire (30 days)

### Download Route

```typescript
// app/download/[token]/route.ts
export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;
  
  // Get download record with related data
  const { data: download } = await supabase
    .from("digital_downloads")
    .select(`
      *,
      order_items!inner (
        orders!inner ( status )
      )
    `)
    .eq("download_token", token)
    .single();

  // Validate
  if (download.order_items.orders.status !== "paid") {
    return NextResponse.json({ error: "Order not paid" }, { status: 403 });
  }
  
  if (new Date(download.expires_at) < new Date()) {
    return NextResponse.json({ error: "Download expired" }, { status: 403 });
  }
  
  if (download.download_count >= download.max_downloads) {
    return NextResponse.json({ error: "Limit reached" }, { status: 403 });
  }

  // Increment counter
  await supabase
    .from("digital_downloads")
    .update({ download_count: download.download_count + 1 })
    .eq("id", download.id);

  // Serve file...
}
```

---

## TypeScript Patterns

### Database Types

```typescript
// types/database.ts
export type Database = {
  public: {
    Tables: {
      products: {
        Row: { /* select result */ };
        Insert: { /* insert input */ };
        Update: { /* update input */ };
      };
      // ...
    };
  };
};

// Convenience types
export type Product = Database["public"]["Tables"]["products"]["Row"];
```

**Why this structure?** Supabase can generate these types from your database schema. The distinction between `Row`, `Insert`, and `Update` handles optional fields correctly.

### Discriminated Unions for Actions

```typescript
type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" };
```

This pattern gives you exhaustive checking in switch statements—TypeScript knows exactly which properties exist based on the `type`.

### Non-null Assertions

```typescript
process.env.NEXT_PUBLIC_SUPABASE_URL!  // The ! tells TS "trust me, it exists"
```

Use sparingly—only when you're certain the value will exist (like env vars that are required for the app to run).

---

## UI Component Architecture

### shadcn/ui Philosophy

Unlike traditional component libraries, shadcn/ui components are **copied into your project**:

```
components/
└── ui/
    ├── button.tsx      # You own this code
    ├── card.tsx        # Customize freely
    ├── input.tsx       # No npm updates to break things
    └── ...
```

**Pros:**
- Full control over components
- No dependency on external package versions
- Easy to customize

**Cons:**
- Manual updates if you want new features
- Larger codebase

### Composition Pattern

```tsx
// Using Card components
<Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
  </CardHeader>
  <CardContent>
    {/* content */}
  </CardContent>
</Card>
```

Components are designed to compose together. Each piece handles one concern.

### The `cn` Utility

```typescript
// lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This merges Tailwind classes intelligently:
- `cn("px-4", "px-2")` → `"px-2"` (last wins)
- `cn("text-red-500", condition && "text-blue-500")` → conditional classes

---

## Key Learnings & Gotchas

### 1. Server vs Client Component Confusion

**Problem:** Using hooks in server components, or trying to access database in client components.

**Solution:** Think about where code runs. If it needs interactivity, use `"use client"`. If it needs database access, keep it as a server component or use an API route.

### 2. Environment Variables

```bash
# Public (exposed to browser) - prefix with NEXT_PUBLIC_
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Private (server-only) - no prefix
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

**Never expose private keys.** If it doesn't have `NEXT_PUBLIC_`, it won't be available in client code.

### 3. Webhook Idempotency

Webhooks can be sent multiple times. The `stripe_session_id` check prevents duplicate orders:

```typescript
// Check if order already exists
const existing = await supabase
  .from("orders")
  .select()
  .eq("stripe_session_id", session.id)
  .single();

if (existing.data) return;  // Already processed
```

### 4. Price Display vs Storage

```typescript
// Storage: always in cents (integers)
product.price_cents = 1999;  // $19.99

// Display: format for humans
formatPrice(1999);  // "$19.99"
```

Never store prices as floats—`0.1 + 0.2 !== 0.3` in JavaScript.

### 5. Async Params in Next.js 15+

```typescript
// Old way (Next.js 14)
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
}

// New way (Next.js 15+)
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### 6. RLS Bypass for Webhooks

Webhooks run without a user session, so RLS policies like `auth.uid() = user_id` fail. Use the admin client:

```typescript
// In webhook
const supabase = createAdminClient();  // Bypasses RLS
```

### 7. Loading States

Always handle loading states to avoid layout shift:

```tsx
<Suspense fallback={<ProductGridSkeleton />}>
  <ProductList />
</Suspense>
```

### 8. Metadata in Stripe

Stripe metadata is limited to 500 characters per value. For complex data, stringify JSON:

```typescript
metadata: {
  items: JSON.stringify(items.map(i => ({
    productId: i.productId,
    quantity: i.quantity,
    // Only essential fields
  })))
}
```

---

## Further Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

*This architecture represents a production-ready foundation that can scale. The patterns used here—server components for data fetching, webhooks for reliable payment processing, RLS for security—are battle-tested approaches used by companies at scale.*

