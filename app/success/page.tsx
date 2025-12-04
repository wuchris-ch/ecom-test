import { redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Download, ArrowRight } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ClearCartOnSuccess } from "./clear-cart";

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

interface ShippingDetails {
  name?: string | null;
  address?: {
    line1?: string | null;
    line2?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
    country?: string | null;
  } | null;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "shipping_cost"],
    });
  } catch {
    redirect("/");
  }

  if (session.payment_status !== "paid") {
    redirect("/cart");
  }

  const lineItems = session.line_items?.data || [];
  // Cast to access shipping_details which may be present after checkout
  const shippingDetails = (session as unknown as { shipping_details?: ShippingDetails }).shipping_details;
  const hasPhysicalItems = !!shippingDetails;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(amount / 100);
  };

  return (
    <div className="container py-16">
      <ClearCartOnSuccess />

      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We&apos;ve sent a confirmation to{" "}
            <span className="font-medium text-foreground">
              {session.customer_details?.email}
            </span>
          </p>
        </div>

        {/* Order Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lineItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  {formatPrice(item.amount_total)}
                </p>
              </div>
            ))}

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(session.amount_subtotal || 0)}</span>
              </div>
              {session.shipping_cost && (
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(session.shipping_cost.amount_total)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatPrice(session.amount_total || 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">What&apos;s Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hasPhysicalItems && shippingDetails && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Shipping</p>
                  <p className="text-sm text-muted-foreground">
                    Your physical items will be shipped to:
                  </p>
                  <p className="text-sm mt-1">
                    {shippingDetails.name}
                    <br />
                    {shippingDetails.address?.line1}
                    {shippingDetails.address?.line2 && (
                      <>
                        <br />
                        {shippingDetails.address.line2}
                      </>
                    )}
                    <br />
                    {shippingDetails.address?.city},{" "}
                    {shippingDetails.address?.state}{" "}
                    {shippingDetails.address?.postal_code}
                    <br />
                    {shippingDetails.address?.country}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Digital Downloads</p>
                <p className="text-sm text-muted-foreground">
                  If you purchased digital products, access them in your account
                  under Downloads.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/account/orders">View Order History</Link>
          </Button>
          <Button asChild>
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
