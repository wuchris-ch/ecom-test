"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Download, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/components/providers/cart-provider";
import { formatPrice } from "@/lib/cart";
import type { Product } from "@/types/database";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const isOutOfStock = !product.is_digital && product.stock === 0;

  return (
    <Card className="group overflow-hidden flex flex-col h-full">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {product.is_digital ? (
                <Download className="h-12 w-12 text-muted-foreground" />
              ) : (
                <Package className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="absolute top-2 left-2 flex gap-2">
            {product.is_digital && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                Digital
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>
        </div>
      </Link>
      <CardContent className="flex-1 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
        )}
        {product.description && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {product.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold">{formatPrice(product.price_cents)}</span>
        <Button
          size="sm"
          disabled={isOutOfStock}
          onClick={() => addItem(product)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

