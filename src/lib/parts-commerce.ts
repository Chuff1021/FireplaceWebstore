import "server-only";
import { createHmac } from "node:crypto";

export type LivePart = {
  key: string;
  sku: string;
  sourceId: string;
  slug?: string;
  priceCents?: number;
  listCents?: number | null;
  quantity: number | null;
  status: "available" | "special_order" | "out_of_stock" | "unverified";
  availability: string;
  checkedAt: string | null;
  canPurchase: boolean;
  catalog?: Record<string, unknown>;
};
export async function hearthCommerce(
  method: "GET" | "POST",
  payload?: unknown,
  after?: string,
  keys?: string[],
  query?: { slug?: string; discovered?: boolean },
) {
  const origin = process.env.HEARTHOS_COMMERCE_ORIGIN,
    secret = process.env.HEARTHOS_WEBSITE_ORDER_SECRET;
  if (!origin || !secret || secret.length < 32)
    throw new Error(
      "Online checkout is being connected. Please request an email quote.",
    );
  const url = new URL("/api/integrations/parts-commerce", origin);
  if (url.protocol !== "https:" || url.username || url.password)
    throw new Error("Checkout configuration needs review.");
  if (after) url.searchParams.set("after", after);
  if (keys) url.searchParams.set("keys", keys.join(","));
  if (query?.slug) url.searchParams.set("slug", query.slug);
  if (query?.discovered) url.searchParams.set("discovered", "true");
  const body = payload === undefined ? "" : JSON.stringify(payload),
    timestamp = String(Date.now()),
    path = url.pathname + url.search;
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}\n${method}\n${path}\n${body}`)
    .digest("hex");
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-hearthos-timestamp": timestamp,
      "x-hearthos-signature": signature,
    },
    body: method === "POST" ? body : undefined,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(110000),
  });
  const result = await response.json();
  if (!response.ok)
    throw Object.assign(
      new Error(result.error || "Checkout is temporarily unavailable."),
      { status: response.status, processingUnknown: result.processingUnknown },
    );
  return result;
}
let cached: { expires: number; items: Map<string, LivePart> } | undefined;
let pending: Promise<Map<string, LivePart>> | undefined;
export async function liveParts(): Promise<Map<string, LivePart>> {
  if (!process.env.HEARTHOS_COMMERCE_ORIGIN) return new Map();
  if (cached && cached.expires > Date.now()) return cached.items;
  if (pending) return pending;
  pending = (async () => {
    const items = new Map<string, LivePart>();
    let after = "";
    for (let page = 0; page < 100; page++) {
      const data = await hearthCommerce("GET", undefined, after);
      if (!Array.isArray(data.items))
        throw new Error("Parts catalog unavailable.");
      for (const item of data.items as LivePart[]) items.set(item.key, item);
      if (!data.next) {
        cached = { expires: Date.now() + 60000, items };
        return items;
      }
      if (data.next === after)
        throw new Error("Parts catalog pagination failed.");
      after = data.next;
    }
    throw new Error("Parts catalog exceeds page limit.");
  })();
  try {
    return await pending;
  } catch {
    return new Map();
  } finally {
    pending = undefined;
  }
}

// Do not download every supplier offer to render a single SKU or one results page.
export async function livePartsByKeys(keys: string[]): Promise<Map<string, LivePart>> {
  const unique = [...new Set(keys.filter(Boolean))];
  if (!unique.length || !process.env.HEARTHOS_COMMERCE_ORIGIN) return new Map();
  const result = new Map<string, LivePart>();
  try {
    await Promise.all(Array.from({ length: Math.ceil(unique.length / 48) }, async (_, i) => {
      const batch = unique.slice(i * 48, (i + 1) * 48);
      const data = await hearthCommerce("GET", undefined, undefined, batch);
      if (!Array.isArray(data.items)) throw new Error("Parts catalog unavailable");
      for (const item of data.items as LivePart[]) if (batch.includes(item.key)) result.set(item.key, item);
    }));
  } catch { return new Map(); } // fail closed to unverified; preserve the owner override
  return result;
}

let discovered: { expires: number; items: LivePart[] } | undefined;
let discovering: Promise<LivePart[]> | undefined;
export async function discoveredParts(): Promise<LivePart[]> {
  if (!process.env.HEARTHOS_COMMERCE_ORIGIN) return [];
  if (discovered && discovered.expires > Date.now()) return discovered.items;
  discovering ??= (async () => {
    const items: LivePart[] = []; let after = "";
    for (let page = 0; page < 100; page++) {
      const data = await hearthCommerce("GET", undefined, after, undefined, { discovered: true });
      if (!Array.isArray(data.items)) throw new Error("Discovered parts unavailable");
      items.push(...data.items.filter((p: LivePart) => p.catalog));
      if (!data.next) { discovered = { expires: Date.now() + 60000, items }; return items; }
      if (data.next === after) throw new Error("Catalog pagination stalled");
      after = data.next;
    }
    throw new Error("Discovered catalog exceeds page limit");
  })();
  try { return await discovering; } catch { return []; } finally { discovering = undefined; }
}
export async function livePartBySlug(slug: string): Promise<LivePart | null> {
  if (!process.env.HEARTHOS_COMMERCE_ORIGIN || !/^[a-z0-9-]{1,220}$/.test(slug)) return null;
  const data = await hearthCommerce("GET", undefined, undefined, undefined, { slug });
  return data.items?.[0] || null;
}
