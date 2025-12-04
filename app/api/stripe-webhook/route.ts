import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";
import type { Order, OrderItem } from "@/types/database";

interface CartItemMeta {
  productId: string;
  name: string;
  price_cents: number;
  quantity: number;
  is_digital: boolean;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session);
  }

  return NextResponse.json({ received: true });
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

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  // Use any to work around Supabase type inference issues with complex queries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  try {
    // Parse metadata
    const userId = session.metadata?.user_id || null;
    const itemsJson = session.metadata?.items;
    const items: CartItemMeta[] = itemsJson ? JSON.parse(itemsJson) : [];

    // Calculate totals
    const subtotalCents = items.reduce(
      (sum, item) => sum + item.price_cents * item.quantity,
      0
    );
    const shippingCents = session.shipping_cost?.amount_total || 0;
    const totalCents = session.amount_total || subtotalCents + shippingCents;

    // Build shipping address from Stripe session
    const shippingDetails = (session as unknown as { shipping_details?: ShippingDetails }).shipping_details;
    let shippingAddress = null;
    if (shippingDetails?.address) {
      shippingAddress = {
        name: shippingDetails.name,
        line1: shippingDetails.address.line1,
        line2: shippingDetails.address.line2,
        city: shippingDetails.address.city,
        state: shippingDetails.address.state,
        postal_code: shippingDetails.address.postal_code,
        country: shippingDetails.address.country,
      };
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        email: session.customer_email || session.customer_details?.email || "",
        shipping_address: shippingAddress,
        subtotal_cents: subtotalCents,
        shipping_cents: shippingCents,
        total_cents: totalCents,
        status: "paid",
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
      })
      .select()
      .single();

    const order = orderData as Order | null;

    if (orderError || !order) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }

    // Create order items
    const orderItemsData = items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      name: item.name,
      quantity: item.quantity,
      price_cents: item.price_cents,
      is_digital: item.is_digital,
    }));

    const { data: createdItemsData, error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsData)
      .select();

    const createdItems = createdItemsData as OrderItem[] | null;

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      throw itemsError;
    }

    // Create digital download tokens for digital items
    const digitalItems = createdItems?.filter((item) => item.is_digital) || [];
    if (digitalItems.length > 0) {
      const downloads = digitalItems.map((item) => ({
        order_item_id: item.id,
        product_id: item.product_id,
        max_downloads: 5,
      }));

      const { error: downloadError } = await supabase
        .from("digital_downloads")
        .insert(downloads);

      if (downloadError) {
        console.error("Error creating digital downloads:", downloadError);
        // Don't throw - order is still valid
      }
    }

    // Decrement stock for physical items
    const physicalItems = items.filter((item) => !item.is_digital);
    for (const item of physicalItems) {
      const { data: product } = await supabase
        .from("products")
        .select("stock")
        .eq("id", item.productId)
        .single();

      if (product && product.stock !== null) {
        await supabase
          .from("products")
          .update({ stock: Math.max(0, product.stock - item.quantity) })
          .eq("id", item.productId);
      }
    }

    console.log(`Order ${order.id} created successfully`);
  } catch (error) {
    console.error("Error processing checkout:", error);
    throw error;
  }
}
