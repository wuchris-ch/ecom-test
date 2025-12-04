# 🛒 E-commerce MVP

A modern e-commerce application built with Next.js 14, Supabase, Stripe, and shadcn/ui.

**Live Demo**: [ecom-test-nu.vercel.app](https://ecom-test-nu.vercel.app)

> 📖 **New here?** Check out the [Complete Setup Guide](SETUP.md) for step-by-step instructions on setting up Supabase, Stripe, and Vercel from scratch.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🛍️ **Product Catalog** | Browse physical and digital products with filtering |
| 🛒 **Shopping Cart** | Add/remove items, adjust quantities, persistent storage |
| 💳 **Stripe Checkout** | Secure payments with test mode support |
| 👤 **User Authentication** | Sign up, log in, and manage your account |
| 📦 **Order History** | View all past orders with status tracking |
| ⬇️ **Digital Downloads** | Secure, time-limited download links for digital products |
| 🚀 **Guest Checkout** | Purchase without creating an account |

---

## 🧪 Testing Guide for Beginners

This guide walks you through testing every feature of the e-commerce store.

### 📋 Test Checklist

- [ ] Browse products
- [ ] View product details
- [ ] Add items to cart
- [ ] Adjust cart quantities
- [ ] Create an account
- [ ] Complete a purchase (physical product)
- [ ] Complete a purchase (digital product)
- [ ] View order history
- [ ] Download digital products
- [ ] Test guest checkout

---

### 🏠 1. Browse the Homepage

1. Visit the site homepage
2. You should see:
   - Navigation bar with "Store" logo, Home, Products links
   - "Sign In" button (top right)
   - Hero section with "Discover Products You'll Love"
   - Feature highlights: Physical Products, Digital Downloads, Secure Checkout

**✅ Expected**: Clean, modern homepage with navigation

---

### 🛍️ 2. Browse Products

1. Click **"Products"** in the navigation (or "Browse Products" button)
2. You should see a grid of products including:

**Physical Products:**
| Product | Price |
|---------|-------|
| Wireless Bluetooth Headphones | $129.99 |
| Minimalist Leather Wallet | $49.99 |
| Organic Cotton T-Shirt | $29.99 |
| Ceramic Pour-Over Coffee Dripper | $34.99 |
| Bamboo Wireless Charging Pad | $24.99 |
| Stainless Steel Water Bottle | $27.99 |

**Digital Products:**
| Product | Price |
|---------|-------|
| UI Design Kit - Complete Bundle | $79.99 |
| Productivity Notion Template Pack | $19.99 |
| Stock Photo Collection - Nature | $49.99 |
| E-Book: Modern Web Development | $24.99 |
| Icon Pack - 1000+ SVG Icons | $34.99 |
| Audio Course: Meditation Basics | $39.99 |

3. Notice the **"Digital"** badge on digital products

**✅ Expected**: 12 products displayed in a responsive grid

---

### 🔍 3. View Product Details

1. Click on any product card
2. You should see:
   - Large product image
   - Product name and price
   - Full description
   - "Add to Cart" button
   - Stock status (for physical products)

**✅ Expected**: Detailed product page with add to cart functionality

---

### 🛒 4. Test the Shopping Cart

#### Add Items to Cart

1. On any product page, click **"Add to Cart"**
2. A notification should appear confirming the item was added
3. The cart icon in the navbar should show a number badge

#### View Cart

1. Click the **cart icon** in the navigation
2. A drawer should slide open showing:
   - Product thumbnail, name, price
   - Quantity controls (+ and - buttons)
   - Remove button
   - Subtotal calculation
   - "Checkout" button

#### Adjust Quantities

1. Click **"+"** to increase quantity
2. Click **"-"** to decrease quantity
3. Click the **trash icon** to remove an item completely

#### Test Cart Persistence

1. Add a few items to cart
2. Close the browser tab
3. Reopen the site
4. Cart items should still be there!

**✅ Expected**: Fully functional cart with localStorage persistence

---

### 👤 5. Create an Account

1. Click **"Sign In"** in the navigation
2. Click **"Sign up"** link on the login page
3. Enter:
   - Email: `your-email@example.com`
   - Password: `your-password` (min 6 characters)
4. Click **"Sign up"**
5. Check your email for a confirmation link (if email confirmation is enabled)
6. Click the confirmation link

**✅ Expected**: Account created and logged in

---

### 💳 6. Test Checkout (The Fun Part!)

#### Stripe Test Card Numbers

Use these test cards - no real money is charged!

| Card Number | Result |
|-------------|--------|
| `4242 4242 4242 4242` | ✅ Success |
| `4000 0000 0000 0002` | ❌ Declined |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

**For all test cards use:**
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

#### Checkout a Physical Product

1. Add a physical product (e.g., "Wireless Bluetooth Headphones") to cart
2. Click **"Checkout"** in the cart drawer
3. You'll be redirected to Stripe Checkout
4. Fill in test details:
   - Email: `test@example.com`
   - Card: `4242 4242 4242 4242`
   - Expiry: `12/34`
   - CVC: `123`
   - Name: `Test User`
   - Address: Any address
5. Select a shipping option
6. Click **"Pay"**

**✅ Expected**: Payment succeeds, redirected to success page

#### Checkout a Digital Product

1. Add a digital product (e.g., "E-Book: Modern Web Development") to cart
2. Complete checkout (same as above)
3. Notice: **No shipping required** for digital products!

**✅ Expected**: Payment succeeds, no shipping options shown

---

### 📦 7. View Order History

1. Make sure you're logged in
2. Click your **avatar/email** in the top right
3. Click **"Orders"** from the dropdown
4. You should see all your orders with:
   - Order ID
   - Date
   - Total amount
   - Status (Processing, Shipped, Delivered)
   - Products purchased

5. Click on an order to see details

**✅ Expected**: Complete order history with details

---

### ⬇️ 8. Download Digital Products

After purchasing a digital product:

1. Go to **Account** → **Downloads**
2. You'll see all your digital purchases
3. Click **"Download"** on any item
4. The file will download (or show a placeholder in this demo)

**Note**: Download links expire after a set time for security!

**✅ Expected**: Download links available for purchased digital products

---

### 🚶 9. Test Guest Checkout

1. **Log out** if you're logged in
2. Add items to cart
3. Click **"Checkout"**
4. Complete the Stripe checkout without logging in
5. Your order still processes, but:
   - No order history saved to account
   - Digital downloads sent via email

**✅ Expected**: Guests can complete purchases

---

### 🔄 10. Test Edge Cases

Try these scenarios to test robustness:

| Scenario | Expected Behavior |
|----------|-------------------|
| Add same item twice | Quantity increases, not duplicate entry |
| Set quantity to 0 | Item removed from cart |
| Empty cart checkout | Checkout button disabled |
| Invalid card number | Stripe shows error |
| Refresh during checkout | Can continue or restart |
| Back button after success | Success page still shows |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org) | React framework (App Router) |
| [Supabase](https://supabase.com) | Database & Authentication |
| [Stripe](https://stripe.com) | Payment processing |
| [shadcn/ui](https://ui.shadcn.com) | UI component library |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Vercel](https://vercel.com) | Hosting |

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)
- Stripe account (test mode)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ecom-mvp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the schema:
   - Copy contents of `supabase/schema.sql` and execute
3. Add sample products:
   - Copy contents of `supabase/seed.sql` and execute
4. Enable Email Auth in **Authentication** → **Providers**
5. Get your keys from **Settings** → **API**

### 3. Set Up Stripe

1. Create account at [stripe.com](https://stripe.com)
2. Make sure you're in **Test Mode** (toggle in dashboard)
3. Get API keys from **Developers** → **API Keys**

### 4. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in your values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Set Up Stripe Webhook (Local Testing)

Install [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Copy the webhook signing secret and add to `.env.local`

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
ecom-mvp/
├── app/
│   ├── page.tsx              # Homepage
│   ├── products/             # Product listing & details
│   ├── cart/                 # Cart page
│   ├── success/              # Order confirmation
│   ├── auth/                 # Login & signup
│   ├── account/              # User dashboard, orders, downloads
│   ├── api/
│   │   ├── checkout/         # Creates Stripe session
│   │   └── stripe-webhook/   # Handles payment events
│   └── download/[token]/     # Secure file downloads
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── providers/            # Auth & Cart context
│   ├── navbar.tsx            # Navigation
│   ├── cart-drawer.tsx       # Slide-out cart
│   └── product-card.tsx      # Product grid items
├── lib/
│   ├── supabase/             # Database clients
│   ├── stripe.ts             # Stripe instance
│   └── cart.ts               # Cart utilities
├── types/                    # TypeScript definitions
└── supabase/
    ├── schema.sql            # Database tables
    └── seed.sql              # Sample products
```

---

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add all environment variables
4. Deploy!

### Post-Deployment Checklist

- [ ] Update `NEXT_PUBLIC_BASE_URL` to production URL
- [ ] Create Stripe webhook: `https://your-domain.com/api/stripe-webhook`
- [ ] Add `STRIPE_WEBHOOK_SECRET` from new webhook
- [ ] Redeploy to apply new env vars
- [ ] Test a purchase end-to-end!

---

## 🤔 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cart not persisting | Check browser localStorage is enabled |
| Checkout fails | Verify Stripe keys are correct (test vs live) |
| No products showing | Run `seed.sql` in Supabase |
| Auth not working | Check Supabase URL and anon key |
| Downloads not working | Verify `NEXT_PUBLIC_BASE_URL` is set |
| Webhook errors | Check `STRIPE_WEBHOOK_SECRET` matches |

---

## 📄 License

MIT

---

Built with ❤️ using Next.js, Supabase, and Stripe
