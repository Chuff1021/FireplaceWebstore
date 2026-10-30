import { NextRequest, NextResponse } from "next/server";
import { categoryProducts, findProduct, hydrateParts, loadApplianceProducts, partsPage } from "@/lib/catalog";
export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams, slug = params.get("slug"), category = params.get("category");
    const parsed = Number(params.get("limit") ?? 100);
    const limit = Number.isFinite(parsed) ? Math.max(1, Math.min(10000, Math.floor(parsed))) : 100;
    let products = slug ? [await findProduct(slug)].filter(p => p !== null)
      : category ? await categoryProducts(category) : await loadApplianceProducts();
    if (!slug && params.get("q")) {
      const q = params.get("q")!.slice(0, 200).toLowerCase();
      const result = await partsPage(new URLSearchParams({ q, pageSize: "24" }));
      products = products.filter(p => [p.name, p.sku, p.brand, p.description].join(" ").toLowerCase().includes(q)).concat(result.products);
    }
    if (params.get("featured") === "true") products = products.filter(p => p.isFeatured);
    products = products.slice(0, category && (category === "parts" || category.endsWith("-parts")) ? Math.min(limit, 48) : limit);
    if (!slug && category && (category === "parts" || category.endsWith("-parts"))) products = await hydrateParts(products);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 503 });
  }
}
