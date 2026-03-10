import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadPelletInsertProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "pellet-inserts-scraped.json",
    idPrefix: "scraped-pellet-inserts",
    categoryId: "inserts",
    subcategoryId: "pellet-inserts",
  });
}

export async function loadPelletInsertProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadPelletInsertProductsInternal();
  }

  return cachedProductsPromise;
}
