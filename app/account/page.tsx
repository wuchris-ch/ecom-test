import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Download, User, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface OrderItemWithDownloads {
  is_digital: boolean;
  digital_downloads: { id: string }[];
}

interface OrderWithItems {
  order_items: OrderItemWithDownloads[];
}

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account");
  }

  // Get order count
  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Get digital downloads count
  const { data } = await supabase
    .from("orders")
    .select(`
      order_items!inner (
        is_digital,
        digital_downloads (id)
      )
    `)
    .eq("user_id", user.id)
    .eq("order_items.is_digital", true);

  const downloads = data as unknown as OrderWithItems[] | null;

  const downloadCount = downloads?.reduce(
    (acc, order) =>
      acc +
      order.order_items.reduce(
        (itemAcc, item) => itemAcc + (item.digital_downloads?.length || 0),
        0
      ),
    0
  ) || 0;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and view your orders
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Profile</CardTitle>
              <CardDescription className="truncate max-w-[200px]">
                {user.email}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Member since{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <Link href="/account/orders">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center justify-between">
                  Orders
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>View your order history</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{orderCount || 0}</p>
              <p className="text-sm text-muted-foreground">Total orders</p>
            </CardContent>
          </Link>
        </Card>

        {/* Downloads Card */}
        <Card className="group hover:border-primary/50 transition-colors">
          <Link href="/account/downloads">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center justify-between">
                  Downloads
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardTitle>
                <CardDescription>Access digital purchases</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{downloadCount}</p>
              <p className="text-sm text-muted-foreground">Digital products</p>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Separator className="my-8" />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href="/products">Browse Products</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/cart">View Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
