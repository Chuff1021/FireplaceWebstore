import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadWoodInsertProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "wood-inserts-scraped.json",
    idPrefix: "scraped-wood-inserts",
    categoryId: "inserts",
    subcategoryId: "wood-inserts",
  });
}

export async function loadWoodInsertProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadWoodInsertProductsInternal();
  }

  return cachedProductsPromise;
}
