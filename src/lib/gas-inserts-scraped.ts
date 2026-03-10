import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadGasInsertProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "gas-inserts-scraped.json",
    idPrefix: "scraped-gas-inserts",
    categoryId: "inserts",
    subcategoryId: "gas-inserts",
  });
}

export async function loadGasInsertProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadGasInsertProductsInternal();
  }

  return cachedProductsPromise;
}
