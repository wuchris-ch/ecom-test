import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Download, Truck, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/cart";
import type { Order, Json } from "@/types/database";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

interface OrderItemWithDownloads {
  id: string;
  name: string;
  quantity: number;
  price_cents: number;
  is_digital: boolean;
  digital_downloads?: Array<{ id: string; download_token: string }>;
}

interface OrderWithItems extends Omit<Order, "order_items"> {
  order_items: OrderItemWithDownloads[];
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  paid: "default",
  shipped: "default",
  delivered: "default",
  cancelled: "destructive",
};

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/orders");
  }

  const { data } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        digital_downloads (*)
      )
    `)
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  const order = data as unknown as OrderWithItems | null;

  if (!order) {
    notFound();
  }

  const shippingAddress = order.shipping_address as ShippingAddress | null;

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/account/orders">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
      </Button>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground mt-1 font-mono">
            {order.id}
          </p>
        </div>
        <Badge
          variant={statusColors[order.status] || "secondary"}
          className="w-fit text-sm px-3 py-1"
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Items
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      {item.is_digital && (
                        <Badge variant="secondary" className="text-xs">
                          Digital
                        </Badge>
                      )}
                    </div>
                    {item.is_digital && item.digital_downloads?.[0] && (
                      <Button asChild size="sm" variant="link" className="px-0 mt-2">
                        <Link href={`/download/${item.digital_downloads[0].download_token}`}>
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Link>
                      </Button>
                    )}
                  </div>
                  <p className="font-semibold">
                    {formatPrice(item.price_cents * item.quantity)}
                  </p>
                </div>
              ))}

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal_cents)}</span>
                </div>
                {order.shipping_cents > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(order.shipping_cents)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(order.total_cents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Info */}
        <div className="space-y-6">
          {/* Order Date */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{order.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          {shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p className="font-medium">{shippingAddress.name}</p>
                <p>{shippingAddress.line1}</p>
                {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postal_code}
                </p>
                <p>{shippingAddress.country}</p>
              </CardContent>
            </Card>
          )}

          {/* Shipping Status */}
          {shippingAddress && order.status !== "cancelled" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Shipping Status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                {order.status === "paid" && (
                  <p className="text-muted-foreground">
                    Your order is being processed and will ship soon.
                  </p>
                )}
                {order.status === "shipped" && (
                  <p className="text-muted-foreground">
                    Your order has been shipped and is on its way!
                  </p>
                )}
                {order.status === "delivered" && (
                  <p className="text-green-600">
                    Your order has been delivered.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
