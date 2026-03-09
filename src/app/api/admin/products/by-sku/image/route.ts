import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const sku = typeof body.sku === "string" ? body.sku.trim() : "";
    const image = typeof body.image === "string" ? body.image.trim() : "";

    if (!sku) return NextResponse.json({ error: "SKU is required" }, { status: 400 });
    if (!image) return NextResponse.json({ error: "Image URL is required" }, { status: 400 });

    const found = await db.select({ id: products.id }).from(products).where(eq(products.sku, sku)).limit(1);
    const target = found[0];

    if (!target) {
      return NextResponse.json({ error: `No product found for SKU ${sku}` }, { status: 404 });
    }

    await db
      .update(products)
      .set({
        image,
        images: JSON.stringify([image]),
        updatedAt: new Date(),
      })
      .where(eq(products.id, target.id));

    return NextResponse.json({ success: true, productId: target.id, sku, image });
  } catch (error) {
    console.error("Assign image by SKU error:", error);
    return NextResponse.json({ error: "Failed to assign image by SKU" }, { status: 500 });
  }
}

