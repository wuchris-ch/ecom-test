import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

interface CartItem {
  productId: string;
  name: string;
  price_cents: number;
  quantity: number;
  is_digital: boolean;
  image_url?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Get current user (optional - supports guest checkout)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Check if there are any physical items (need shipping)
    const hasPhysicalItems = items.some((item) => !item.is_digital);

    // Build Stripe line items
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => {
        // Stripe requires full absolute URLs for images
        let imageUrl: string | undefined;
        if (item.image_url) {
          imageUrl = item.image_url.startsWith("http")
            ? item.image_url
            : `${baseUrl}${item.image_url}`;
        }

        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              ...(imageUrl && { images: [imageUrl] }),
            },
            unit_amount: item.price_cents,
          },
          quantity: item.quantity,
        };
      }
    );

    // Build session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "payment",
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: user?.email,
      metadata: {
        user_id: user?.id || "",
        items: JSON.stringify(
          items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price_cents: item.price_cents,
            quantity: item.quantity,
            is_digital: item.is_digital,
          }))
        ),
      },
    };

    // Add shipping options if there are physical items
    if (hasPhysicalItems) {
      // Use Stripe's shipping rate collection - configure rates in Stripe Dashboard
      sessionParams.shipping_address_collection = {
        allowed_countries: ["US", "CA", "GB", "AU"],
      };
      // You can either use preset shipping rates from Stripe Dashboard:
      // sessionParams.shipping_options = [
      //   { shipping_rate: "shr_xxx" }, // Standard shipping
      //   { shipping_rate: "shr_yyy" }, // Express shipping
      // ];
      // Or create them dynamically:
      sessionParams.shipping_options = [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 500, currency: "usd" },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "usd" },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 1 },
              maximum: { unit: "business_day", value: 3 },
            },
          },
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

