import { NextRequest, NextResponse } from "next/server";
import { partsPage } from "@/lib/catalog";
export async function GET(request: NextRequest) {
  try { return NextResponse.json(await partsPage(request.nextUrl.searchParams)); }
  catch (error) {
    console.error("Parts catalog error:", error);
    return NextResponse.json({ error: "Unable to load parts. Please try again." }, { status: 503 });
  }
}
