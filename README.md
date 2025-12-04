# E-commerce MVP

A modern e-commerce application built with Next.js 14, Supabase, Stripe, and shadcn/ui.

## Features

- **Product Catalog**: Browse physical and digital products
- **Shopping Cart**: Persistent cart with localStorage
- **Checkout**: Secure payments via Stripe Checkout
- **User Authentication**: Email/password auth with Supabase
- **Order History**: View past orders and track status
- **Digital Downloads**: Secure download links for digital products
- **Guest Checkout**: Purchase without creating an account

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout
- **UI Components**: shadcn/ui + Tailwind CSS
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### 1. Clone and Install

```bash
cd ecom-mvp
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema:

```bash
# Copy contents of supabase/schema.sql and run in Supabase SQL Editor
```

3. (Optional) Add sample products:

```bash
# Copy contents of supabase/seed.sql and run in Supabase SQL Editor
```

4. Enable Email Auth in Authentication > Providers

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up a webhook endpoint (after deploying):
   - Endpoint: `https://your-domain.com/api/stripe-webhook`
   - Events: `checkout.session.completed`

### 4. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Test Stripe Payments

Use Stripe's test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`

For local webhook testing, use [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Project Settings
4. Deploy!

### Post-Deployment

1. Update `NEXT_PUBLIC_BASE_URL` to your production domain
2. Add Stripe webhook endpoint in Stripe Dashboard
3. Update `STRIPE_WEBHOOK_SECRET` with the new webhook secret

## Project Structure

```
├── app/
│   ├── (pages)
│   │   ├── page.tsx              # Home page
│   │   ├── products/             # Product listing & detail
│   │   ├── cart/                 # Shopping cart
│   │   ├── success/              # Order confirmation
│   │   ├── auth/                 # Login & signup
│   │   └── account/              # User dashboard
│   ├── api/
│   │   ├── checkout/             # Stripe checkout
│   │   └── stripe-webhook/       # Payment webhooks
│   └── download/[token]/         # Digital downloads
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── providers/                # Context providers
│   └── (custom components)
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── stripe.ts                 # Stripe instance
│   └── cart.ts                   # Cart utilities
├── types/
│   ├── database.ts               # Supabase types
│   └── cart.ts                   # Cart types
└── supabase/
    ├── schema.sql                # Database schema
    └── seed.sql                  # Sample data
```

## Customization

### Adding Shipping Rates

Edit `app/api/checkout/route.ts` to add more shipping options or integrate with shipping APIs.

### Styling

Modify `app/globals.css` to change the color scheme. The theme uses CSS variables for easy customization.

### Digital Product Delivery

Update `app/download/[token]/route.ts` to serve actual files from Supabase Storage or another file storage service.

## License

MIT
