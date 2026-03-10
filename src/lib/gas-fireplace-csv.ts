import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { sampleProducts, type Product } from "@/lib/store-config";

const GAS_FIREPLACE_SCRAPED_JSON_CANDIDATES = [
  path.join(process.cwd(), "data", "gas-fireplaces-scraped.json"),
];

const GAS_FIREPLACE_CSV_CANDIDATES = [
  path.join(process.cwd(), "data", "efireplacestore-full-catalog.csv"),
];

type CsvRecord = Record<string, string>;
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

let cachedProductsPromise: Promise<Product[]> | null = null;

function parseCsvRows(csvText: string): CsvRecord[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      currentRow.push(currentCell.trim());
      currentCell = "";
      if (currentRow.some((cell) => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => header.toLowerCase().trim());
  return rows.slice(1).map((row) => {
    const record: CsvRecord = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });
}

function parseCurrencyNumber(value: string | undefined): number {
  if (!value) return 0;
  const normalized = value.replace(/[^0-9.-]+/g, "");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getSlugFromProductUrl(productUrl: string): string {
  const trimmed = productUrl.trim();
  const match = trimmed.match(/\/([^/?#]+)\.html(?:[?#].*)?$/i);
  return match?.[1]?.toLowerCase() ?? "";
}

function normalizeSkuForLookup(sku: string): string {
  return sku.trim().toLowerCase().replace(/^[a-z]{3}-/i, "");
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

async function readGasFireplaceScrapedJson(): Promise<string | null> {
  for (const candidate of GAS_FIREPLACE_SCRAPED_JSON_CANDIDATES) {
    try {
      return await readFile(candidate, "utf8");
    } catch {
      continue;
    }
  }

  return null;
}

async function readGasFireplaceCsv(): Promise<string> {
  for (const candidate of GAS_FIREPLACE_CSV_CANDIDATES) {
    try {
      return await readFile(candidate, "utf8");
    } catch {
      continue;
    }
  }

  throw new Error("Gas fireplace CSV file not found");
}

function parseScrapedGasFireplaceProducts(jsonText: string): Product[] {
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

      const product: Product = {
        id: `scraped-gas-${index + 1}`,
        sku: (record.sku || slug).trim(),
        name,
        slug,
        description: name,
        shortDescription: toSentenceExcerpt(name),
        price: primaryPrice,
        salePrice: promoPrice && primaryPrice > promoPrice ? promoPrice : undefined,
        categoryId: "fireplaces",
        subcategoryId: "gas-fireplaces",
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
      };

      return product;
    });

  return products.filter((product): product is Product => product !== null);
}

function buildCsvGasFireplaceProducts(csvText: string): Product[] {
  const records = parseCsvRows(csvText);

  return records.map((record, index) => {
    const name = stripHtml(record.title || `${record.brand} ${record.model_sku}`.trim());
    const description = stripHtml(record.description || name);
    const currentPrice = parseCurrencyNumber(record.current_price);
    const originalPrice = parseCurrencyNumber(record.original_price);
    const sku = (record.model_sku || `${record.brand}-${index + 1}`).trim();
    const productUrl = (record.product_url || "").trim();
    const imageUrl = (record.image_url || "").trim();
    const slugFromUrl = getSlugFromProductUrl(productUrl);
    const slugBase = slugFromUrl || toSlug(`${record.brand}-${sku}-${name}`);
    const hasDiscount = originalPrice > currentPrice && currentPrice > 0;

    return {
      id: `csv-gas-${index + 1}`,
      sku,
      name,
      slug: slugBase || `csv-gas-${index + 1}`,
      description,
      shortDescription: toSentenceExcerpt(description || name),
      price: hasDiscount ? originalPrice : currentPrice,
      salePrice: hasDiscount ? currentPrice : undefined,
      categoryId: "fireplaces",
      subcategoryId: "gas-fireplaces",
      brand: (record.brand || "Fireplace").trim(),
      images: imageUrl ? [imageUrl] : sampleProducts[0]?.images ?? [],
      features: productUrl ? [`Product page: ${productUrl}`] : [],
      specifications: {
        Model: sku,
        Brand: (record.brand || "Fireplace").trim(),
        "Product URL": productUrl || "N/A",
      },
      inStock: true,
      stockQuantity: 25,
      rating: 4.7,
      reviewCount: 12,
      isFeatured: index < 12,
      isNew: index < 24,
      isBestSeller: index < 8,
      };
    });
}

function buildProductLookup(products: Product[]): Map<string, Product> {
  const lookup = new Map<string, Product>();

  products.forEach((product) => {
    lookup.set(product.slug.toLowerCase(), product);
    lookup.set(product.sku.toLowerCase(), product);
    lookup.set(normalizeSkuForLookup(product.sku), product);
  });

  return lookup;
}

function mergeGasFireplaceProducts(baseProducts: Product[], overrideProducts: Product[]): Product[] {
  if (overrideProducts.length === 0) {
    return baseProducts;
  }

  const overrideLookup = buildProductLookup(overrideProducts);

  return baseProducts.map((product) => {
    const override =
      overrideLookup.get(product.slug.toLowerCase()) ??
      overrideLookup.get(product.sku.toLowerCase()) ??
      overrideLookup.get(normalizeSkuForLookup(product.sku));

    if (!override) {
      return product;
    }

    return {
      ...product,
      name: override.name || product.name,
      description: override.description || product.description,
      shortDescription: override.shortDescription || product.shortDescription,
      price: override.price || product.price,
      salePrice: override.salePrice,
      brand: override.brand || product.brand,
      images: override.images.length > 0 ? override.images : product.images,
      features: override.features.length > 0 ? override.features : product.features,
      specifications: {
        ...product.specifications,
        ...override.specifications,
      },
      rating: override.rating || product.rating,
      reviewCount: override.reviewCount || product.reviewCount,
      isBestSeller: override.isBestSeller,
    };
  });
}

async function loadGasFireplaceProductsInternal(): Promise<Product[]> {
  const csvText = await readGasFireplaceCsv();
  const csvProducts = buildCsvGasFireplaceProducts(csvText);

  const scrapedJson = await readGasFireplaceScrapedJson();
  if (scrapedJson) {
    const scrapedProducts = parseScrapedGasFireplaceProducts(scrapedJson);
    if (scrapedProducts.length > 0) {
      return mergeGasFireplaceProducts(csvProducts, scrapedProducts);
    }
  }

  return csvProducts;
}

export async function loadGasFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadGasFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
