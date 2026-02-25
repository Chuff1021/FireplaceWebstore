import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("category");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") ?? "100");

    let query = db
      .select({
        product: products,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true));

    const allProducts = await query.limit(limit);

    // Filter by category slug if provided
    let filtered = allProducts;
    if (categorySlug) {
      filtered = allProducts.filter((p) => p.categorySlug === categorySlug);
    }
    if (featured === "true") {
      filtered = filtered.filter((p) => p.product.isFeatured);
    }

    return NextResponse.json(filtered.map(({ product, categoryName, categorySlug }) => ({
      ...product,
      categoryName,
      categorySlug,
    })));
  } catch (error) {
    console.error("Products API error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
