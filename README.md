# E-commerce MVP

A modern e-commerce storefront with physical and digital product support.

**Live Demo**: [ecom-test-nu.vercel.app](https://ecom-test-nu.vercel.app)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 15](https://nextjs.org) | React framework (App Router) |
| [Supabase](https://supabase.com) | PostgreSQL database & auth |
| [Stripe](https://stripe.com) | Payments & checkout |
| [shadcn/ui](https://ui.shadcn.com) | UI components |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Vercel](https://vercel.com) | Hosting |

## Getting Started

See the **[Setup Guide](SETUP.md)** for complete instructions on configuring Supabase, Stripe, and deployment.

```bash
npm install
cp .env.local.example .env.local
# Fill in your API keys
npm run dev
```

## What's Built

- Product catalog (physical + digital)
- Shopping cart with localStorage persistence
- **Stripe Payments** (Complete integration)
- **User Authentication** (Google OAuth + Email/Password)
- Order history
- Secure digital download links
- Guest checkout

## TODO: Roadmap to Professional

### Fundamentals (Critical for Launch)
- [ ] **Admin Dashboard** — Product management (CRUD), order fulfillment status, customer view
- [ ] **Search & Discovery** — Search bar, sorting (price/date), advanced filtering
- [ ] **Legal & Trust** — Terms of Service, Privacy Policy, Return Policy pages (required for payments)
- [ ] **User Profile** — Edit profile details, change password, manage saved addresses
- [ ] **Transactional Emails** — "Order Confirmed" and "Shipped" emails (Resend/Postmark)
- [ ] **Inventory Management** — Real-time stock checks, low stock alerts

### Polish (Growth & UX)
- [ ] **Reviews & Ratings** — Customer feedback and social proof
- [ ] **Wishlist** — Save items for later
- [ ] **Analytics** — Google Analytics/PostHog, conversion tracking
- [ ] **SEO** — Open Graph tags, structured data (JSON-LD) for Google Shopping
- [ ] **Newsletter** — Email capture for marketing
- [ ] **UI Refinements** — Better empty states, loading skeletons, mobile nav polish

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry, any 3-digit CVC.

## License

MIT
