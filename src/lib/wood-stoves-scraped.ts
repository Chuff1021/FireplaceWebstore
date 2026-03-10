import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadWoodStoveProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "wood-stoves-scraped.json",
    idPrefix: "scraped-wood-stoves",
    categoryId: "stoves",
    subcategoryId: "wood-stoves",
  });
}

export async function loadWoodStoveProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadWoodStoveProductsInternal();
  }

  return cachedProductsPromise;
}
