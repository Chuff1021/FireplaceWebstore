import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadPelletStoveProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "pellet-stoves-scraped.json",
    idPrefix: "scraped-pellet-stoves",
    categoryId: "stoves",
    subcategoryId: "pellet-stoves",
  });
}

export async function loadPelletStoveProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadPelletStoveProductsInternal();
  }

  return cachedProductsPromise;
}
