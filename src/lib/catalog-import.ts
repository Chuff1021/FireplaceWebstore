import { db } from "@/db";
import {
  catalogSources,
  categories,
  importJobErrors,
  importJobs,
  licenseRecords,
  products,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { readFile } from "fs/promises";
import { DEFAULT_PRODUCT_IMAGE } from "@/lib/product-images";

export interface FireplaceImportRow {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price?: number;
  salePrice?: number | null;
  sku?: string;
  manufacturerSku?: string;
  brand?: string;
  categorySlug?: string;
  categoryName?: string;
  image?: string;
  images?: string[];
  specs?: Record<string, string>;
  features?: string[];
  fuelType?: string;
  ventType?: string;
  widthInches?: number | null;
  btuOutput?: number | null;
  isFeatured?: boolean;
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  isActive?: boolean;
  lifecycleStatus?: "draft" | "approved" | "published" | "archived";
  complianceStatus?: "green" | "yellow" | "red";
}

export interface FireplaceImportPayload {
  sourceSlug: string;
  sourceName: string;
  sourceType?: "manufacturer" | "dealer" | "licensed_dataset";
  approvalRef: string;
  usageScope: string;
  ownerContact: string;
  allowedAssetTypes?: string[];
  complianceStatus?: "green" | "yellow" | "red";
  products: FireplaceImportRow[];
}

export interface FireplaceCsvImportPayload {
  sourceSlug: string;
  sourceName: string;
  csvPath: string;
  sourceType?: "manufacturer" | "dealer" | "licensed_dataset";
  approvalRef?: string;
  usageScope?: string;
  ownerContact?: string;
  allowedAssetTypes?: string[];
  complianceStatus?: "green" | "yellow" | "red";
}

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function parseCsvRows(csvText: string): Record<string, string>[] {
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
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });
}

function ensureCsvHeaders(records: Record<string, string>[]) {
  if (records.length === 0) {
    throw new Error("CSV file is empty or missing rows");
  }

  const requiredColumns = ["brand", "model", "sku", "name", "category", "price"];
  const available = Object.keys(records[0]);
  const missing = requiredColumns.filter((column) => !available.includes(column));

  if (missing.length > 0) {
    throw new Error(`CSV missing required columns: ${missing.join(", ")}`);
  }
}

function normalizeImportImage(image: string | undefined): string {
  const normalized = image?.trim();
  return normalized && normalized.length > 0 ? normalized : DEFAULT_PRODUCT_IMAGE;
}

function normalizeImportImages(images?: string[]): string[] {
  const normalized = (images ?? [])
    .map((image) => image?.trim())
    .filter((image): image is string => Boolean(image));

  if (normalized.length > 0) return normalized;
  return [DEFAULT_PRODUCT_IMAGE];
}

export async function runFireplaceCatalogCsvImport(payload: FireplaceCsvImportPayload) {
  const csvRaw = await readFile(payload.csvPath, "utf-8");
  const records = parseCsvRows(csvRaw);
  ensureCsvHeaders(records);

  const mappedRows: FireplaceImportRow[] = records.map((row) => {
    const brand = row.brand?.trim() ?? "";
    const model = row.model?.trim() ?? "";
    const name = row.name?.trim() || [brand, model].filter(Boolean).join(" ") || "Unnamed Product";
    const sku = row.sku?.trim() || undefined;
    const price = parseNumber(row.price, 0);
    const description = row.description?.trim() || `${brand} ${model}`.trim();
    const category = row.category?.trim() || "fireplaces";
    const image = normalizeImportImage(row.image);
    const normalizedSku = sku || `${brand}-${model}`.replace(/\s+/g, "-");

    return {
      name,
      slug: `${brand}-${model}-${normalizedSku}`,
      description,
      shortDescription: description,
      sku,
      manufacturerSku: model,
      brand,
      categoryName: category,
      price,
      image,
      images: [image],
      inStock: true,
      isActive: true,
      lifecycleStatus: "approved",
      complianceStatus: payload.complianceStatus ?? "green",
      specs: {
        Model: model,
      },
    };
  });

  return runFireplaceCatalogImport({
    sourceSlug: payload.sourceSlug,
    sourceName: payload.sourceName,
    sourceType: payload.sourceType ?? "manufacturer",
    approvalRef: payload.approvalRef ?? "LOCAL-CSV-STARTER",
    usageScope: payload.usageScope ?? "Local CSV catalog import",
    ownerContact: payload.ownerContact ?? "admin@local",
    allowedAssetTypes: payload.allowedAssetTypes ?? ["images", "specs", "descriptions", "skus"],
    complianceStatus: payload.complianceStatus ?? "green",
    products: mappedRows,
  });
}

export async function runFireplaceCatalogImport(payload: FireplaceImportPayload) {
  const sourceSlug = toSlug(payload.sourceSlug || payload.sourceName);
  const sourceName = payload.sourceName?.trim();

  if (!sourceSlug || !sourceName || !payload.approvalRef?.trim()) {
    throw new Error("Missing required source and license metadata");
  }

  const existingSources = await db
    .select()
    .from(catalogSources)
    .where(eq(catalogSources.slug, sourceSlug))
    .limit(1);
  let source = existingSources[0];

  if (!source) {
    [source] = await db
      .insert(catalogSources)
      .values({
        name: sourceName,
        slug: sourceSlug,
        type: payload.sourceType ?? "manufacturer",
        isActive: true,
      })
      .returning();
  } else {
    [source] = await db
      .update(catalogSources)
      .set({
        name: sourceName,
        type: payload.sourceType ?? source.type,
        isActive: true,
        updatedAt: new Date(),
      })
      .where(eq(catalogSources.id, source.id))
      .returning();
  }

  const licenseRows = await db
    .select()
    .from(licenseRecords)
    .where(eq(licenseRecords.sourceId, source.id))
    .orderBy(desc(licenseRecords.createdAt))
    .limit(1);
  const existingLicense = licenseRows[0];

  if (!existingLicense) {
    await db.insert(licenseRecords).values({
      sourceId: source.id,
      approvalRef: payload.approvalRef,
      allowedAssetTypes: JSON.stringify(payload.allowedAssetTypes ?? ["images", "specs", "descriptions", "skus"]),
      usageScope: payload.usageScope,
      ownerContact: payload.ownerContact,
      status: payload.complianceStatus ?? "green",
      notes: "Imported via Phase 1 fireplace importer",
    });
  } else {
    await db
      .update(licenseRecords)
      .set({
        approvalRef: payload.approvalRef,
        allowedAssetTypes: JSON.stringify(payload.allowedAssetTypes ?? ["images", "specs", "descriptions", "skus"]),
        usageScope: payload.usageScope,
        ownerContact: payload.ownerContact,
        status: payload.complianceStatus ?? existingLicense.status,
        updatedAt: new Date(),
      })
      .where(eq(licenseRecords.id, existingLicense.id));
  }

  const [job] = await db
    .insert(importJobs)
    .values({
      sourceId: source.id,
      jobType: "fireplace_catalog",
      status: "running",
      totalCount: payload.products.length,
      successCount: 0,
      errorCount: 0,
      startedAt: new Date(),
      summary: "",
    })
    .returning();

  let successCount = 0;
  let errorCount = 0;

  for (const row of payload.products) {
    try {
      if (!row.name?.trim()) {
        throw new Error("Missing product name");
      }

      const productSlug = toSlug(row.slug || row.name);
      if (!productSlug) {
        throw new Error("Invalid product slug");
      }

      let categoryId: number | null = null;
      const rawCategorySlug = row.categorySlug || row.categoryName;

      if (rawCategorySlug) {
        const categorySlug = toSlug(rawCategorySlug);
        const categoryRows = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, categorySlug))
          .limit(1);
        const existingCategory = categoryRows[0];

        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          const [createdCategory] = await db
            .insert(categories)
            .values({
              name: row.categoryName?.trim() || rawCategorySlug,
              slug: categorySlug,
              description: "",
              image: "",
              isActive: true,
            })
            .returning();
          categoryId = createdCategory.id;
        }
      }

      const values = {
        name: row.name.trim(),
        slug: productSlug,
        description: row.description ?? "",
        shortDescription: row.shortDescription ?? "",
        price: parseNumber(row.price, 0),
        salePrice: row.salePrice ?? null,
        sku: row.sku ?? null,
        manufacturerSku: row.manufacturerSku ?? "",
        brand: row.brand ?? "",
        fuelType: row.fuelType ?? "",
        ventType: row.ventType ?? "",
        widthInches: row.widthInches ?? null,
        btuOutput: row.btuOutput ?? null,
        categoryId,
        sourceId: source.id,
        image: normalizeImportImage(row.image ?? row.images?.[0]),
        images: JSON.stringify(normalizeImportImages(row.images)),
        specs: JSON.stringify(row.specs ?? {}),
        features: JSON.stringify(row.features ?? []),
        inStock: row.inStock ?? true,
        isFeatured: row.isFeatured ?? false,
        isNew: row.isNew ?? false,
        isSale: row.isSale ?? false,
        isActive: row.isActive ?? true,
        lifecycleStatus: row.lifecycleStatus ?? "approved",
        complianceStatus: row.complianceStatus ?? payload.complianceStatus ?? "green",
      };

      const existingProductRows = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, productSlug), eq(products.sourceId, source.id)))
        .limit(1);
      const existingProduct = existingProductRows[0];

      if (existingProduct) {
        await db
          .update(products)
          .set({ ...values, updatedAt: new Date() })
          .where(eq(products.id, existingProduct.id));
      } else {
        await db.insert(products).values(values);
      }

      successCount += 1;
    } catch (error) {
      errorCount += 1;
      await db.insert(importJobErrors).values({
        jobId: job.id,
        rowKey: row.sku ?? row.manufacturerSku ?? row.slug ?? row.name ?? "unknown",
        message: error instanceof Error ? error.message : "Unknown import error",
        payload: JSON.stringify(row),
      });
    }
  }

  const status = errorCount > 0 ? "completed_with_errors" : "completed";
  const summary = `Imported ${successCount}/${payload.products.length} rows (${errorCount} errors)`;

  await db
    .update(importJobs)
    .set({
      status,
      successCount,
      errorCount,
      finishedAt: new Date(),
      summary,
    })
    .where(eq(importJobs.id, job.id));

  return {
    jobId: job.id,
    status,
    successCount,
    errorCount,
    totalCount: payload.products.length,
    summary,
  };
}
