import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { getAdminSession } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const [category] = await db
      .insert(categories)
      .values({
        name: body.name,
        slug: body.slug,
        description: body.description ?? "",
        image: body.image ?? "",
        sortOrder: body.sortOrder ?? 0,
        isActive: body.isActive ?? true,
      })
      .returning();

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
