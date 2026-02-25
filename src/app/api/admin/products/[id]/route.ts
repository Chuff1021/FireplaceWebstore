import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin-auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await request.json();

    const [product] = await db
      .update(products)
      .set({
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
        isFeatured: body.isFeatured ?? false,
        isNew: body.isNew ?? false,
        isSale: body.isSale ?? false,
        inStock: body.inStock ?? true,
        isActive: body.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const productId = parseInt(id);
  if (isNaN(productId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await db.delete(products).where(eq(products.id, productId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
