import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadElectricInsertProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "electric-inserts-scraped.json",
    idPrefix: "scraped-electric-inserts",
    categoryId: "inserts",
    subcategoryId: "electric-inserts",
  });
}

export async function loadElectricInsertProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadElectricInsertProductsInternal();
  }

  return cachedProductsPromise;
}
