import { Suspense } from "react";
import { ProductGrid } from "@/components/product-grid";
import { ProductGridSkeleton } from "@/components/product-skeleton";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Product } from "@/types/database";

export const revalidate = 60;

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; digital?: string }>;
}

async function getProducts(category?: string, digital?: string): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (digital === "true") {
    query = query.eq("is_digital", true);
  } else if (digital === "false") {
    query = query.eq("is_digital", false);
  }

  const { data } = await query.order("created_at", { ascending: false });
  return (data as Product[]) || [];
}

async function getCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

  const rows = data as { category: string | null }[] | null;
  const categories = [...new Set(rows?.map((p) => p.category).filter(Boolean))];
  return categories as string[];
}

async function ProductList({
  category,
  digital,
}: {
  category?: string;
  digital?: string;
}) {
  const products = await getProducts(category, digital);
  return <ProductGrid products={products} />;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const categories = await getCategories();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground mt-1">
          Browse our collection of physical and digital products
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          asChild
          variant={!params.category && !params.digital ? "default" : "outline"}
          size="sm"
        >
          <Link href="/products">All</Link>
        </Button>
        <Button
          asChild
          variant={params.digital === "false" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/products?digital=false">Physical</Link>
        </Button>
        <Button
          asChild
          variant={params.digital === "true" ? "default" : "outline"}
          size="sm"
        >
          <Link href="/products?digital=true">Digital</Link>
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            asChild
            variant={params.category === cat ? "default" : "outline"}
            size="sm"
          >
            <Link href={`/products?category=${encodeURIComponent(cat)}`}>
              {cat}
            </Link>
          </Button>
        ))}
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductList category={params.category} digital={params.digital} />
      </Suspense>
    </div>
  );
}
