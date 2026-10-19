import "server-only";
import { liveParts } from "@/lib/parts-commerce";

import { readdir, readFile } from "fs/promises";
import path from "path";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/product-images";
import { type Product } from "@/lib/store-config";
import { normalizePartsBrand } from "@/lib/parts-catalog";

type ImportedPartRecord = {
  productId?: string;
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
  shippingLeadTime?: string;
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
  "Electric Stove Parts": "electric-fireplace-parts",
  "Electric Fireplace Parts": "electric-fireplace-parts",
  "Outdoor Fireplace Parts": "outdoor-fireplace-parts",
};

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toShortDescription(input: string) {
  if (input.length <= 160) {
    return input;
  }

  return `${input.slice(0, 157).trimEnd()}...`;
}

// These bundled files change on deployment, so warm requests can reuse the catalog.
let catalogPromise: Promise<Product[]> | undefined;

export async function loadImportedPartsProducts(): Promise<Product[]> {
  catalogPromise ??= readImportedPartsProducts().catch(error => {
    catalogPromise = undefined;
    throw error;
  });
  const [base, live] = await Promise.all([catalogPromise, liveParts()]);
  const uniqueBase = [...new Map(base.map(product => [product.id, product])).values()];
  const known = new Set(uniqueBase.map(product => product.sourceKey));
  const added: Product[] = [...live.values()].filter(part => part.catalog && !known.has(part.key)).map(part => {
    const c = part.catalog!, name = String(c.name || part.sku), brand = normalizePartsBrand(String(c.brand || "Other Parts"));
    return { id: `part-spu-${part.sourceId}`, sourceKey: part.key, sku: part.sku, slug: String(c.slug || toSlug(part.sku)), name,
      description: String(c.description || name), shortDescription: toShortDescription(String(c.description || name)), price: (part.priceCents || 0) / 100,
      categoryId: "parts", subcategoryId: departmentMap[String(c.department)] || "parts", brand,
      images: c.imageUrl ? [String(c.imageUrl)] : [DEFAULT_PRODUCT_IMAGE], features: [],
      specifications: { SKU: part.sku, Brand: brand, Department: String(c.department || "Parts"), "Part Type": String(c.partType || "N/A") },
      inStock: false, stockQuantity: 0, rating: 0, reviewCount: 0, isFeatured: false, isNew: true, isBestSeller: false,
    };
  });
  return uniqueBase.concat(added).map(product => {
    const current = live.get(product.sourceKey || "");
    const override = product.sku === "MA-212400" && !current;
    const status = override ? "out_of_stock" : current?.status || "unverified";
    const availability = override ? "Out of stock. 4 weeks until ready to ship" : current?.availability || "Availability needs confirmation";
    const price = current?.priceCents !== undefined ? current.priceCents / 100 : product.salePrice ?? product.price;
    const list = current ? (current.listCents ? current.listCents / 100 : price) : product.price;
    return { ...product, price: list, salePrice: list > price ? price : undefined,
      partsAvailability: status, availabilityCheckedAt: current?.checkedAt || undefined,
      publishedStockQuantity: current?.quantity ?? null, canPurchase: !override && Boolean(current?.canPurchase),
      inStock: status === "available", stockQuantity: current?.quantity ?? 0,
      features: product.features.filter(f => !f.startsWith("Availability:")).concat(`Availability: ${availability}`),
      specifications: { ...Object.fromEntries(Object.entries(product.specifications).filter(([key]) => !current || key !== "Shipping Lead Time")), Availability: availability },
    };
  });
}

async function readImportedPartsProducts(): Promise<Product[]> {
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
      // A few supplier breadcrumbs contain the product title instead of a brand.
      // Do not turn those titles or SKU strings into manufacturer filter options.
      const brandLabel = [record.breadcrumbBrand, record.brand].find(value =>
        value?.trim() && value.trim() !== name && !/[()]/.test(value)
      );
      const brand = normalizePartsBrand(brandLabel || "Other Parts");

      if (!name || !slug || livePrice <= 0) {
        continue;
      }

      index += 1;

      products.push({
        id: record.productId ? `part-spu-${record.productId}` : `part-${index}`,
        sourceKey: record.productId ? `spu:${record.productId}` : undefined,
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
        images: record.imageUrl ? [record.imageUrl] : [DEFAULT_PRODUCT_IMAGE],
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
          ...(record.shippingLeadTime ? { "Shipping Lead Time": record.shippingLeadTime.trim() } : {}),
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
