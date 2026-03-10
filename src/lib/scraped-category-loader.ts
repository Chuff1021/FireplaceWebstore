import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { sampleProducts, type Product } from "@/lib/store-config";

type ScrapedRecord = {
  sku?: string;
  name?: string;
  slug?: string;
  price?: number;
  salePrice?: number;
  brand?: string;
  imageUrl?: string;
  productUrl?: string;
  rating?: number;
  reviewCount?: number;
  isBestSeller?: boolean;
};

type LoadScrapedCategoryProductsOptions = {
  fileName: string;
  idPrefix: string;
  categoryId: string;
  subcategoryId: string;
};

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function toSentenceExcerpt(value: string, maxLength = 140): string {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function loadScrapedCategoryProducts(
  options: LoadScrapedCategoryProductsOptions
): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", options.fileName);

  let jsonText = "";

  try {
    jsonText = await readFile(filePath, "utf8");
  } catch {
    return [];
  }

  let records: ScrapedRecord[] = [];

  try {
    const parsed = JSON.parse(jsonText);
    if (Array.isArray(parsed)) {
      records = parsed;
    }
  } catch {
    return [];
  }

  const products: Array<Product | null> = records.map((record, index) => {
    const name = stripHtml(record.name || `${record.brand || "Fireplace"} ${record.sku || ""}`.trim());
    const slug = toSlug(record.slug || record.sku || name);
    const primaryPrice =
      typeof record.price === "number" && Number.isFinite(record.price) ? record.price : 0;
    const promoPrice =
      typeof record.salePrice === "number" && Number.isFinite(record.salePrice)
        ? record.salePrice
        : undefined;

    if (!name || !slug || primaryPrice <= 0) {
      return null;
    }

    return {
      id: `${options.idPrefix}-${index + 1}`,
      sku: (record.sku || slug).trim(),
      name,
      slug,
      description: name,
      shortDescription: toSentenceExcerpt(name),
      price: primaryPrice,
      salePrice: promoPrice && primaryPrice > promoPrice ? promoPrice : undefined,
      categoryId: options.categoryId,
      subcategoryId: options.subcategoryId,
      brand: (record.brand || name.split(" ")[0] || "Fireplace").trim(),
      images: record.imageUrl ? [record.imageUrl] : sampleProducts[0]?.images ?? [],
      features: record.productUrl ? [`Product page: ${record.productUrl}`] : [],
      specifications: {
        Model: (record.sku || slug).trim(),
        Brand: (record.brand || name.split(" ")[0] || "Fireplace").trim(),
        "Product URL": record.productUrl || "N/A",
      },
      inStock: true,
      stockQuantity: 25,
      rating:
        typeof record.rating === "number" && Number.isFinite(record.rating) ? record.rating : 0,
      reviewCount:
        typeof record.reviewCount === "number" && Number.isFinite(record.reviewCount)
          ? record.reviewCount
          : 0,
      isFeatured: index < 12,
      isNew: false,
      isBestSeller: Boolean(record.isBestSeller),
    } satisfies Product;
  });

  return products.filter((product): product is Product => product !== null);
}
