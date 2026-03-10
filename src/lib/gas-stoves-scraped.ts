import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadGasStoveProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "gas-stoves-scraped.json",
    idPrefix: "scraped-gas-stoves",
    categoryId: "stoves",
    subcategoryId: "gas-stoves",
  });
}

export async function loadGasStoveProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadGasStoveProductsInternal();
  }

  return cachedProductsPromise;
}
