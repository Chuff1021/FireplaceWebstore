import { NextRequest, NextResponse } from "next/server";
import { sampleProducts } from "@/lib/store-config";
import { loadElectricFireplaceProducts } from "@/lib/electric-fireplace-scraped";
import { loadGasFireplaceProducts } from "@/lib/gas-fireplace-csv";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") ?? "100");
    const electricProducts = await loadElectricFireplaceProducts();
    const gasProducts = await loadGasFireplaceProducts();
    const nonGasSampleProducts = sampleProducts.filter(
      (product) =>
        product.subcategoryId !== "gas-fireplaces" &&
        product.subcategoryId !== "electric-fireplaces"
    );
    const allProducts = [...nonGasSampleProducts, ...electricProducts, ...gasProducts];

    let filtered = allProducts;
    if (categorySlug) {
      filtered = filtered.filter(
        (product) => product.categoryId === categorySlug || product.subcategoryId === categorySlug
      );
    }
    if (slug) {
      filtered = filtered.filter((product) => product.slug === slug);
    }
    if (featured === "true") {
      filtered = filtered.filter((product) => product.isFeatured);
    }

    return NextResponse.json(filtered.slice(0, limit));
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
