import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import { sampleProducts, type Product } from "@/lib/store-config";

const GAS_FIREPLACE_CSV_CANDIDATES = [
  "/Users/fireplace/Desktop/gas_fireplaces_full.csv",
  path.join(process.cwd(), "data", "efireplacestore-full-catalog.csv"),
];

type CsvRecord = Record<string, string>;

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

async function loadGasFireplaceProductsInternal(): Promise<Product[]> {
  const csvText = await readGasFireplaceCsv();
  const records = parseCsvRows(csvText);

  return records.map((record, index) => {
    const name = stripHtml(record.title || `${record.brand} ${record.model_sku}`.trim());
    const description = stripHtml(record.description || name);
    const price = parseCurrencyNumber(record.current_price);
    const originalPrice = parseCurrencyNumber(record.original_price);
    const sku = (record.model_sku || `${record.brand}-${index + 1}`).trim();
    const productUrl = (record.product_url || "").trim();
    const imageUrl = (record.image_url || "").trim();
    const slugBase = toSlug(`${record.brand}-${sku}-${name}`);

    return {
      id: `csv-gas-${index + 1}`,
      sku,
      name,
      slug: slugBase || `csv-gas-${index + 1}`,
      description,
      shortDescription: toSentenceExcerpt(description || name),
      price,
      salePrice: originalPrice > price && price > 0 ? price : undefined,
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

export async function loadGasFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadGasFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
