import "server-only";

import { readdir, readFile } from "fs/promises";
import path from "path";
import { type Product } from "@/lib/store-config";

type ImportedPartRecord = {
  sku?: string;
  slug?: string;
  name?: string;
  brand?: string;
  breadcrumbBrand?: string;
  department?: string;
  partType?: string;
  description?: string;
  price?: number;
  salePrice?: number;
  compareAtPrice?: number;
  availability?: string;
  inStock?: boolean;
  stock?: number | null;
  imageUrl?: string;
  productUrl?: string;
};

const departmentMap: Record<string, string> = {
  "Wood & Coal Stove Parts": "wood-coal-stove-parts",
  "Gas Fireplace Parts": "gas-fireplace-parts",
  "Gas Stove Parts": "gas-stove-parts",
  "Pellet Stove Parts": "pellet-stove-parts",
  "Electric Stove Parts": "electric-stove-parts",
  "Outdoor Fireplace Parts": "outdoor-fireplace-parts",
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeBrandLabel(value: string) {
  return value
    .replace(/\b(Pellet|Wood|Coal|Gas|Electric|Outdoor|Fireplace|Stove)\s+Parts\b/gi, "")
    .replace(/\bParts\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function toShortDescription(input: string) {
  if (input.length <= 160) {
    return input;
  }

  return `${input.slice(0, 157).trimEnd()}...`;
}

export async function loadImportedPartsProducts(): Promise<Product[]> {
  const partsDir = path.join(process.cwd(), "data", "parts");

  let fileNames: string[] = [];

  try {
    fileNames = (await readdir(partsDir)).filter((fileName) => fileName.endsWith(".json"));
  } catch {
    return [];
  }

  const products: Product[] = [];
  let index = 0;

  for (const fileName of fileNames.sort()) {
    const filePath = path.join(partsDir, fileName);
    let records: ImportedPartRecord[] = [];

    try {
      const text = await readFile(filePath, "utf8");
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        records = parsed;
      }
    } catch {
      continue;
    }

    for (const record of records) {
      const name = (record.name || "").trim();
      const sku = (record.sku || "").trim();
      const slug = toSlug(record.slug || sku || name);
      const subcategoryId =
        departmentMap[(record.department || "").trim()] || "parts";
      const livePrice =
        typeof record.salePrice === "number" && Number.isFinite(record.salePrice)
          ? record.salePrice
          : typeof record.price === "number" && Number.isFinite(record.price)
            ? record.price
            : 0;
      const originalPrice =
        typeof record.compareAtPrice === "number" &&
        Number.isFinite(record.compareAtPrice) &&
        record.compareAtPrice > livePrice
          ? record.compareAtPrice
          : livePrice;
      const brand =
        normalizeBrandLabel((record.breadcrumbBrand || "").trim()) ||
        (record.brand || "Parts").trim();

      if (!name || !slug || livePrice <= 0) {
        continue;
      }

      index += 1;

      products.push({
        id: `part-${index}`,
        sku: sku || slug,
        name,
        slug,
        description: (record.description || name).trim(),
        shortDescription: toShortDescription((record.description || name).trim()),
        price: originalPrice,
        salePrice: livePrice < originalPrice ? livePrice : undefined,
        categoryId: "parts",
        subcategoryId,
        brand,
        images: record.imageUrl ? [record.imageUrl] : ["/categories/parts.jpg"],
        features: [
          record.partType ? `Part Type: ${record.partType}` : "",
          record.availability ? `Availability: ${record.availability}` : "",
        ].filter(Boolean),
        specifications: {
          SKU: sku || slug,
          Brand: brand,
          Department: (record.department || "Parts").trim(),
          "Part Type": (record.partType || "N/A").trim(),
          Availability: (record.availability || "N/A").trim(),
        },
        inStock: Boolean(record.inStock),
        stockQuantity:
          typeof record.stock === "number" && Number.isFinite(record.stock) ? record.stock : 0,
        rating: 0,
        reviewCount: 0,
        isFeatured: index <= 24,
        isNew: false,
        isBestSeller: false,
      });
    }
  }

  return products;
}
