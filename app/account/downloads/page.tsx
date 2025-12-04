import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileDown, Clock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DigitalDownload {
  id: string;
  download_token: string;
  download_count: number;
  max_downloads: number;
  expires_at: string;
}

interface OrderItemWithDownloads {
  id: string;
  name: string;
  is_digital: boolean;
  digital_downloads: DigitalDownload[];
}

interface OrderWithDownloads {
  id: string;
  created_at: string;
  order_items: OrderItemWithDownloads[];
}

export default async function DownloadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/account/downloads");
  }

  // Get all digital downloads for the user
  const { data } = await supabase
    .from("orders")
    .select(`
      id,
      created_at,
      order_items!inner (
        id,
        name,
        is_digital,
        digital_downloads (
          id,
          download_token,
          download_count,
          max_downloads,
          expires_at
        )
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "paid")
    .eq("order_items.is_digital", true);

  const downloads = data as unknown as OrderWithDownloads[] | null;

  // Flatten the downloads
  const allDownloads = downloads?.flatMap((order) =>
    order.order_items
      .filter((item) => item.is_digital && item.digital_downloads?.length > 0)
      .flatMap((item) =>
        item.digital_downloads.map((download) => ({
          ...download,
          name: item.name,
          order_id: order.id,
          purchased_at: order.created_at,
        }))
      )
  ) || [];

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/account">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Account
        </Link>
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Digital Downloads</h1>
        <p className="text-muted-foreground mt-1">
          Access your purchased digital products
        </p>
      </div>

      {allDownloads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Download className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No digital downloads</h3>
            <p className="text-muted-foreground mb-4 text-center">
              You haven&apos;t purchased any digital products yet.
            </p>
            <Button asChild>
              <Link href="/products?digital=true">Browse Digital Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {allDownloads.map((download) => {
            const isExpired = new Date(download.expires_at) < new Date();
            const downloadsRemaining = download.max_downloads - download.download_count;
            const isExhausted = downloadsRemaining <= 0;
            const canDownload = !isExpired && !isExhausted;

            return (
              <Card key={download.id} className={!canDownload ? "opacity-75" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{download.name}</CardTitle>
                    {isExpired && (
                      <Badge variant="destructive" className="flex-shrink-0">
                        Expired
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Download Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Downloads used</span>
                      <span>
                        {download.download_count} / {download.max_downloads}
                      </span>
                    </div>
                    <Progress
                      value={(download.download_count / download.max_downloads) * 100}
                      className="h-2"
                    />
                  </div>

                  {/* Expiry Info */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isExpired
                        ? "Expired on "
                        : "Expires "}
                      {new Date(download.expires_at).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Warnings */}
                  {isExhausted && !isExpired && (
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span>Download limit reached</span>
                    </div>
                  )}

                  {/* Download Button */}
                  {canDownload ? (
                    <Button asChild className="w-full">
                      <Link href={`/download/${download.download_token}`}>
                        <FileDown className="h-4 w-4 mr-2" />
                        Download ({downloadsRemaining} remaining)
                      </Link>
                    </Button>
                  ) : (
                    <Button disabled className="w-full">
                      {isExpired ? "Download Expired" : "No Downloads Remaining"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
