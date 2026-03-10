import { NextRequest, NextResponse } from "next/server";
import { sampleProducts } from "@/lib/store-config";
import { loadElectricFireplaceProducts } from "@/lib/electric-fireplace-scraped";
import { loadElectricInsertProducts } from "@/lib/electric-inserts-scraped";
import { loadGasFireplaceProducts } from "@/lib/gas-fireplace-csv";
import { loadGasInsertProducts } from "@/lib/gas-inserts-scraped";
import { loadOutdoorFireplaceProducts } from "@/lib/outdoor-fireplace-scraped";
import { loadPelletInsertProducts } from "@/lib/pellet-inserts-scraped";
import { loadWoodFireplaceProducts } from "@/lib/wood-fireplace-scraped";
import { loadWoodInsertProducts } from "@/lib/wood-inserts-scraped";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const slug = searchParams.get("slug");
    const limit = parseInt(searchParams.get("limit") ?? "100");
    const electricProducts = await loadElectricFireplaceProducts();
    const electricInsertProducts = await loadElectricInsertProducts();
    const gasProducts = await loadGasFireplaceProducts();
    const gasInsertProducts = await loadGasInsertProducts();
    const outdoorProducts = await loadOutdoorFireplaceProducts();
    const pelletInsertProducts = await loadPelletInsertProducts();
    const woodProducts = await loadWoodFireplaceProducts();
    const woodInsertProducts = await loadWoodInsertProducts();
    const nonGasSampleProducts = sampleProducts.filter(
      (product) =>
        product.subcategoryId !== "gas-fireplaces" &&
        product.subcategoryId !== "electric-fireplaces" &&
        product.subcategoryId !== "wood-fireplaces" &&
        product.subcategoryId !== "outdoor-fireplaces" &&
        product.subcategoryId !== "gas-inserts" &&
        product.subcategoryId !== "wood-inserts" &&
        product.subcategoryId !== "pellet-inserts" &&
        product.subcategoryId !== "electric-inserts"
    );
    const allProducts = [
      ...nonGasSampleProducts,
      ...electricProducts,
      ...electricInsertProducts,
      ...gasProducts,
      ...gasInsertProducts,
      ...outdoorProducts,
      ...pelletInsertProducts,
      ...woodProducts,
      ...woodInsertProducts,
    ];

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
