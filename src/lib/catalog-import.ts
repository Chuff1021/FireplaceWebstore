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

export async function runFireplaceCatalogImport(payload: FireplaceImportPayload) {
  const sourceSlug = toSlug(payload.sourceSlug || payload.sourceName);
  const sourceName = payload.sourceName?.trim();

  if (!sourceSlug || !sourceName || !payload.approvalRef?.trim()) {
    throw new Error("Missing required source and license metadata");
  }

  let source = await db
    .select()
    .from(catalogSources)
    .where(eq(catalogSources.slug, sourceSlug))
    .limit(1)
    .then((rows) => rows[0]);

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

  const existingLicense = await db
    .select()
    .from(licenseRecords)
    .where(eq(licenseRecords.sourceId, source.id))
    .orderBy(desc(licenseRecords.createdAt))
    .limit(1)
    .then((rows) => rows[0]);

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
        const existingCategory = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, categorySlug))
          .limit(1)
          .then((rows) => rows[0]);

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
        image: row.image ?? row.images?.[0] ?? "",
        images: JSON.stringify(row.images ?? []),
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

      const existingProduct = await db
        .select({ id: products.id })
        .from(products)
        .where(and(eq(products.slug, productSlug), eq(products.sourceId, source.id)))
        .limit(1)
        .then((rows) => rows[0]);

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
