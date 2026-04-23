import { NextRequest, NextResponse } from "next/server";
import { getCrossVendorMatch, vendorLabel, effectivePrice } from "@/lib/cross-vendor";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;
  if (!sku) {
    return NextResponse.json({ sku: "", alternates: [] });
  }

  const match = await getCrossVendorMatch(sku);
  if (!match) {
    return NextResponse.json({ sku, alternates: [] });
  }

  const alternates = match.vendors.map((v) => ({
    vendor: v.vendor,
    vendorLabel: vendorLabel(v.vendor),
    sku: v.sku,
    name: v.name,
    price: effectivePrice(v),
    listPrice: v.price ?? null,
    salePrice: v.salePrice ?? null,
    inStock: v.inStock ?? null,
    stock: v.stock ?? null,
    availability: v.availability,
    productUrl: v.productUrl,
    imageUrl: v.imageUrl,
  }));

  return NextResponse.json({ sku, alternates });
}
