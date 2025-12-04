import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Package, Truck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/cart";
import { AddToCartButton } from "./add-to-cart-button";
import type { Product } from "@/types/database";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  return data as Product | null;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Store`,
    description: product.description || `Buy ${product.name}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const isOutOfStock = !product.is_digital && product.stock === 0;

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {product.is_digital ? (
                <Download className="h-24 w-24 text-muted-foreground" />
              ) : (
                <Package className="h-24 w-24 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="flex items-start gap-3 mb-4">
            {product.is_digital && (
              <Badge variant="secondary">Digital Product</Badge>
            )}
            {product.category && (
              <Badge variant="outline">{product.category}</Badge>
            )}
            {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

          <p className="text-3xl font-bold text-primary mt-4">
            {formatPrice(product.price_cents)}
          </p>

          <Separator className="my-6" />

          {product.description && (
            <div className="prose prose-sm max-w-none mb-6">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Info */}
          <div className="space-y-4 mb-8">
            {product.is_digital ? (
              <div className="flex items-center gap-3 text-sm">
                <Download className="h-5 w-5 text-muted-foreground" />
                <span>Instant digital download after purchase</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <span>Shipping calculated at checkout</span>
                </div>
                {product.stock !== null && product.stock > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {product.stock < 10
                        ? `Only ${product.stock} left in stock`
                        : "In stock"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          <AddToCartButton product={product} disabled={isOutOfStock} />
        </div>
      </div>
    </div>
  );
}
