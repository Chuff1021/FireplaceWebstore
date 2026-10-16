import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadImportedPartsProducts } from "@/lib/parts-products";
import { hearthCommerce } from "@/lib/parts-commerce";

export const runtime = "nodejs";
export const maxDuration = 120;
export async function POST(request: Request) {
  if (
    request.headers.get("origin") !== new URL(request.url).origin ||
    !request.headers.get("content-type")?.startsWith("application/json")
  )
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const jar = await cookies();
  let session: string = jar.get("parts-checkout")?.value || "";
  if (!session || !/^[a-f0-9]{64}$/.test(session))
    session = randomBytes(32).toString("hex");
  let authorizationRequested = false;
  try {
    const raw = await request.text();
    if (raw.length > 24000) throw new Error("Checkout request too large.");
    const input = JSON.parse(raw);
    if (
      !["quote", "authorize", "status", "redeem", "interest"].includes(
        input.action,
      )
    )
      throw new Error("Unknown checkout action.");
    if (input.action === "quote") {
      const catalog = await loadImportedPartsProducts();
      if (!Array.isArray(input.items))
        throw new Error("Choose parts for your cart.");
      input.items = input.items.map(
        (line: { key?: string; sku?: string; quantity: number }) => {
          // Persisted carts from the old site used positional IDs. Resolve them by
          // a unique SKU; never reuse an old part-123 index as a product identity.
          if (line.key?.startsWith("spu:"))
            return { key: line.key, quantity: line.quantity };
          const matches = catalog.filter(
            (p) => p.sku === (line.sku || line.key),
          );
          if (matches.length !== 1 || !matches[0].sourceKey)
            throw new Error(
              "This item needs an email quote. Please review your cart.",
            );
          return { key: matches[0].sourceKey, quantity: line.quantity };
        },
      );
    }
    if (input.action === "redeem") {
      if (
        typeof input.token !== "string" ||
        !/^[a-f0-9]{64}$/.test(input.token)
      )
        throw new Error("Invalid checkout link.");
      session = String(input.token);
      delete input.token;
    }
    authorizationRequested = input.action === "authorize";
    const result = await hearthCommerce("POST", { ...input, session });
    const response = NextResponse.json(result, {
      headers: { "Cache-Control": "private, no-store" },
    });
    response.cookies.set("parts-checkout", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  } catch (e) {
    const failure = e as { status?: number; processingUnknown?: boolean };
    const response = NextResponse.json(
      {
        error: e instanceof Error ? e.message : "Checkout unavailable.",
        processingUnknown: failure.processingUnknown ?? authorizationRequested,
      },
      {
        status: failure.status || 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
    response.cookies.set("parts-checkout", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }
}
