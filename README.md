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

## What Works Today

- Product catalog with physical + digital SKUs (Supabase-backed)
- Shopping cart with localStorage persistence and Stripe Checkout handoff
- Auth (Google OAuth + email/password) with guest checkout support
- Checkout session creation (`/api/checkout`) with fixed shipping options and USD pricing
- Webhook (`/api/stripe-webhook`) creates orders, order_items, digital download tokens, and decrements stock
- Order history pages, account downloads, success page, cart drawer, and product pages

## What’s Still Missing for a Production Store

- Taxes: no tax lines are collected; Stripe Checkout is configured without tax/tax IDs.
- Refunds/returns: no UI or automation; handle manually in the Stripe Dashboard today.
- Admin: no product CRUD, price changes, inventory edits, or order fulfillment dashboard.
- Shipping: no carrier rates, labels, tracking numbers, or fulfillment statuses (only static rates).
- Emails: no order confirmation/shipping/refund emails; relies only on Stripe’s receipt emails.
- Compliance: missing Terms, Privacy, Returns/Refunds pages; no cookie/analytics consent.
- Security/ops: no webhook retry/backoff handling beyond Stripe defaults, no audit logs, no monitoring.
- Analytics/SEO: no analytics or structured data; minimal metadata.
- Profile: no saved addresses or profile edits; only basic account overview.

## Refunds (current state)

- Use the Stripe Dashboard to issue refunds and handle returns; the app does not expose a refund endpoint or UI.
- Orders in Supabase are not auto-updated on refund/chargeback; you would need to add webhook handling for `charge.refunded`/`charge.dispute.*` to sync statuses and restock.

## Taxes (current state)

- Stripe Checkout is created without tax settings. All totals are untaxed.
- To add tax quickly:
  - Easiest: enable Stripe Tax, pass `automatic_tax: { enabled: true }` to the Checkout Session, and ensure you collect shipping/billing addresses.
  - Manual (free): maintain a province/state tax table and add a `tax_cents` line in checkout calculations before creating the session. Show tax on cart/receipts and store it on the order.
  - Canada specifics: collect country + province + postal code, register for GST/HST and any required PST/QST, and include your tax ID on receipts.

## Near-Term Checklist

- [ ] Add tax calculation (Stripe Tax or manual table) and store tax breakdown on orders.
- [ ] Add refund/chargeback webhooks to sync order status and restock.
- [ ] Add admin dashboard for products, prices, inventory, and order fulfillment/tracking.
- [ ] Add transactional emails for order confirmed / shipped / refund.
- [ ] Add legal pages (Terms, Privacy, Returns) and basic SEO/OG tags.
- [ ] Add shipping status + tracking link fields and UI.

## Stripe Test Cards

| Card | Result |
|------|--------|
| `4242 4242 4242 4242` | Success |
| `4000 0000 0000 0002` | Declined |

Use any future expiry, any 3-digit CVC, and any random name/address/email/phone. Stripe only validates the card number in test mode.

## License

MIT
