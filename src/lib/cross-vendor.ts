import "server-only";

import { readFile } from "fs/promises";
import path from "path";

export type CrossVendorEntry = {
  vendor: "stove-parts-unlimited" | "energy-parts-plus";
  sku: string;
  name?: string;
  price?: number | null;
  priceDisplay?: string | null;
  salePrice?: number | null;
  inStock?: boolean | null;
  stock?: number | null;
  availability?: string | null;
  productUrl?: string | null;
  imageUrl?: string | null;
};

export type CrossVendorMatch = {
  sku: string;
  vendors: CrossVendorEntry[];
};

type MapFile = {
  generatedAt?: string;
  totalSkus?: number;
  entries?: CrossVendorMatch[];
};

let cached: Map<string, CrossVendorMatch> | null = null;

function normalize(sku: string) {
  return sku.trim().toLowerCase().replace(/\s+/g, "");
}

async function loadMap(): Promise<Map<string, CrossVendorMatch>> {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "data", "cross-vendor-sku-map.json");

  try {
    const text = await readFile(filePath, "utf8");
    const parsed = JSON.parse(text) as MapFile;
    const map = new Map<string, CrossVendorMatch>();
    for (const entry of parsed.entries ?? []) {
      map.set(normalize(entry.sku), entry);
    }
    cached = map;
    return map;
  } catch {
    cached = new Map();
    return cached;
  }
}

export async function getCrossVendorMatch(sku: string): Promise<CrossVendorMatch | null> {
  if (!sku) return null;
  const map = await loadMap();
  return map.get(normalize(sku)) ?? null;
}

export async function getAlternateVendors(
  sku: string,
  currentVendor: CrossVendorEntry["vendor"]
): Promise<CrossVendorEntry[]> {
  const match = await getCrossVendorMatch(sku);
  if (!match) return [];
  return match.vendors.filter((v) => v.vendor !== currentVendor);
}

const VENDOR_LABELS: Record<CrossVendorEntry["vendor"], string> = {
  "stove-parts-unlimited": "Mountain View Hearth",
  "energy-parts-plus": "Energy Parts Plus",
};

export function vendorLabel(vendor: CrossVendorEntry["vendor"]): string {
  return VENDOR_LABELS[vendor];
}

export function effectivePrice(entry: CrossVendorEntry): number | null {
  if (typeof entry.salePrice === "number" && entry.salePrice > 0) return entry.salePrice;
  if (typeof entry.price === "number" && entry.price > 0) return entry.price;
  return null;
}
