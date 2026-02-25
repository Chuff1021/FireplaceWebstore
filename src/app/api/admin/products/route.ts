import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const [product] = await db
      .insert(products)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description ?? "",
        shortDescription: body.shortDescription ?? "",
        price: body.price ?? 0,
        salePrice: body.salePrice ?? null,
        sku: body.sku ?? null,
        brand: body.brand ?? "",
        categoryId: body.categoryId ?? null,
        image: body.image ?? "",
        images: body.images ?? "[]",
        specs: body.specs ?? "{}",
        features: body.features ?? "[]",
        isFeatured: body.isFeatured ?? false,
        isNew: body.isNew ?? false,
        isSale: body.isSale ?? false,
        inStock: body.inStock ?? true,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
