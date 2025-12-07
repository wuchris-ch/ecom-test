import { ExternalLink, CheckCircle2, Circle, AlertCircle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const techStack = [
  { name: "Next.js 15", url: "https://nextjs.org", purpose: "React framework (App Router)" },
  { name: "Supabase", url: "https://supabase.com", purpose: "PostgreSQL database & auth" },
  { name: "Stripe", url: "https://stripe.com", purpose: "Payments & checkout" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com", purpose: "UI components" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com", purpose: "Styling" },
  { name: "Vercel", url: "https://vercel.com", purpose: "Hosting" },
];

const whatWorks = [
  "Product catalog with physical + digital SKUs (Supabase-backed)",
  "Shopping cart with localStorage persistence and Stripe Checkout handoff",
  "Auth (Google OAuth + email/password) with guest checkout support",
  "Checkout session creation with fixed shipping options and USD pricing",
  "Webhook creates orders, order_items, digital download tokens, and decrements stock",
  "Order history pages, account downloads, success page, cart drawer, and product pages",
];

const whatsNissing = [
  { area: "Taxes", detail: "No tax lines collected; Stripe Checkout configured without tax/tax IDs" },
  { area: "Refunds", detail: "No UI or automation; handle manually in Stripe Dashboard" },
  { area: "Admin", detail: "No product CRUD, price changes, inventory edits, or fulfillment dashboard" },
  { area: "Shipping", detail: "No carrier rates, labels, tracking numbers, or fulfillment statuses" },
  { area: "Emails", detail: "No order confirmation/shipping/refund emails; relies on Stripe receipts" },
  { area: "Compliance", detail: "Missing Terms, Privacy, Returns pages; no cookie/analytics consent" },
  { area: "Security", detail: "No webhook retry handling beyond Stripe defaults, no audit logs" },
  { area: "Analytics", detail: "No analytics or structured data; minimal metadata" },
  { area: "Profile", detail: "No saved addresses or profile edits; only basic account overview" },
];

const checklist = [
  "Add tax calculation (Stripe Tax or manual table) and store tax breakdown on orders",
  "Add refund/chargeback webhooks to sync order status and restock",
  "Add admin dashboard for products, prices, inventory, and order fulfillment/tracking",
  "Add transactional emails for order confirmed / shipped / refund",
  "Add legal pages (Terms, Privacy, Returns) and basic SEO/OG tags",
  "Add shipping status + tracking link fields and UI",
];

export default function AboutPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">About This Store</h1>
        <p className="text-muted-foreground">
          A modern e-commerce MVP with physical and digital product support.
        </p>
        <div className="mt-4">
          <Badge variant="secondary" className="mr-2">Open Source</Badge>
          <Badge variant="outline">MIT License</Badge>
        </div>
      </div>

      {/* Tech Stack */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {techStack.map((tech) => (
              <a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="font-medium group-hover:text-primary transition-colors">
                    {tech.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{tech.purpose}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* What Works */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            What Works Today
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {whatWorks.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* What's Missing */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            What&apos;s Still Missing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {whatsNissing.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <Badge variant="outline" className="flex-shrink-0 mt-0.5">
                  {item.area}
                </Badge>
                <span className="text-sm text-muted-foreground">{item.detail}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refunds & Taxes Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Refunds
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Use the Stripe Dashboard to issue refunds and handle returns.</p>
            <p>Orders in Supabase are not auto-updated on refund/chargeback—would need webhook handling for <code className="text-xs bg-muted px-1 py-0.5 rounded">charge.refunded</code> events.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Taxes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>Currently no tax settings—all totals are untaxed.</p>
            <p><strong>Easiest fix:</strong> Enable Stripe Tax with <code className="text-xs bg-muted px-1 py-0.5 rounded">automatic_tax: {`{ enabled: true }`}</code></p>
            <p><strong>Free option:</strong> Manual province/state tax table.</p>
          </CardContent>
        </Card>
      </div>

      {/* Near-Term Checklist */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Near-Term Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Test Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stripe Test Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-4">
              <code className="bg-muted px-2 py-1 rounded font-mono">4242 4242 4242 4242</code>
              <Badge variant="default" className="bg-green-600">Success</Badge>
            </div>
            <div className="flex items-center gap-4">
              <code className="bg-muted px-2 py-1 rounded font-mono">4000 0000 0000 0002</code>
              <Badge variant="destructive">Declined</Badge>
            </div>
            <p className="text-muted-foreground mt-3">
              Use any future expiry date, any 3-digit CVC.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

