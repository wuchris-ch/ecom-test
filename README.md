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
- Stripe Checkout integration
- User authentication (signup/login)
- Order history
- Secure digital download links
- Guest checkout

## TODO: Production Readiness

### Payments & Fulfillment
- [ ] **Real shipping integration** — Currently using Stripe's shipping options. Need carrier APIs (EasyPost, Shippo) for live rates and label generation
- [ ] **Tax calculation** — Add Stripe Tax or TaxJar for automated sales tax
- [ ] **Inventory sync** — Stock decrements on purchase, low stock alerts

### Features
- [ ] **Email notifications** — Order confirmation, shipping updates, download links (Resend, Postmark)
- [ ] **Admin dashboard** — Product management, order fulfillment (currently via Supabase UI manually running queries but eventually should have a dashboard with UI to make changes to products, upload images, etc)
- [ ] **Search & filtering** — Product search, category filters, price range
- [ ] **Discount codes** — Stripe Coupons integration

### Polish
- [ ] **Product images** — Add sample product photos
- [ ] **UI refresh** — Homepage hero, product cards, mobile nav
- [ ] **SEO** — Meta tags, Open Graph, structured data
- [ ] **Analytics** — Conversion tracking, Stripe Revenue reporting
- [ ] **Error handling** — Better user feedback on failures

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry, any 3-digit CVC.

## License

MIT
