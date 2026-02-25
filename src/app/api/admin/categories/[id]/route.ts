import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAdminSession } from "@/lib/admin-auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categoryId = parseInt(id);
  if (isNaN(categoryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const body = await request.json();

    const [category] = await db
      .update(categories)
      .set({
        name: body.name,
        slug: body.slug,
        description: body.description ?? "",
        image: body.image ?? "",
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Update category error:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const categoryId = parseInt(id);
  if (isNaN(categoryId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await db.delete(categories).where(eq(categories.id, categoryId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
