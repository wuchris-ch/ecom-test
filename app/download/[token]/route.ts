import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DigitalDownload } from "@/types/database";

interface RouteContext {
  params: Promise<{ token: string }>;
}

interface DownloadWithRelations extends DigitalDownload {
  order_items: {
    name: string;
    product_id: string;
    orders: { status: string; user_id: string };
  };
  products: { name: string; image_url: string | null } | null;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { token } = await context.params;

  // Use any to work around Supabase type inference issues with complex joins
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAdminClient() as any;

  // Get the download record
  const { data, error } = await supabase
    .from("digital_downloads")
    .select(`
      *,
      order_items!inner (
        name,
        product_id,
        orders!inner (
          status,
          user_id
        )
      ),
      products (
        name,
        image_url
      )
    `)
    .eq("download_token", token)
    .single();

  const download = data as DownloadWithRelations | null;

  if (error || !download) {
    return NextResponse.json(
      { error: "Download not found" },
      { status: 404 }
    );
  }

  // Check if order is paid
  if (download.order_items.orders.status !== "paid") {
    return NextResponse.json(
      { error: "Order not paid" },
      { status: 403 }
    );
  }

  // Check if download has expired
  if (new Date(download.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Download link has expired" },
      { status: 403 }
    );
  }

  // Check if download limit is reached
  if (download.download_count >= download.max_downloads) {
    return NextResponse.json(
      { error: "Download limit reached" },
      { status: 403 }
    );
  }

  // Increment download count
  await supabase
    .from("digital_downloads")
    .update({ download_count: download.download_count + 1 })
    .eq("id", download.id);

  const productName = download.products?.name || download.order_items.name;

  // For now, return a simple text file as a placeholder
  // In production, replace this with actual file serving from Supabase Storage
  const placeholderContent = `
Thank you for your purchase of "${productName}"!

This is a placeholder download file.

In a production environment, this would be your actual digital product.

To set up real file downloads:
1. Upload your digital products to Supabase Storage
2. Modify this route to fetch from storage
3. Stream the file to the user

Download ID: ${download.id}
Downloads used: ${download.download_count + 1}/${download.max_downloads}
Expires: ${new Date(download.expires_at).toLocaleDateString()}
  `.trim();

  return new NextResponse(placeholderContent, {
    headers: {
      "Content-Type": "text/plain",
      "Content-Disposition": `attachment; filename="${productName.replace(/[^a-z0-9]/gi, "_")}_readme.txt"`,
    },
  });
}
