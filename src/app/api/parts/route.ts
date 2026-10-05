import { NextRequest, NextResponse } from "next/server";
import { filterPartsCatalog } from "@/lib/parts-catalog";
import { loadImportedPartsProducts } from "@/lib/parts-products";

export async function GET(request: NextRequest) {
  try {
    const products = await loadImportedPartsProducts();
    return NextResponse.json(filterPartsCatalog(products, request.nextUrl.searchParams));
  } catch (error) {
    console.error("Parts catalog error:", error);
    return NextResponse.json({ error: "Unable to load parts. Please try again." }, { status: 500 });
  }
}
