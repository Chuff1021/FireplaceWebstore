import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadOutdoorFireplaceProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "outdoor-fireplaces-scraped.json",
    idPrefix: "scraped-outdoor",
    categoryId: "fireplaces",
    subcategoryId: "outdoor-fireplaces",
  });
}

export async function loadOutdoorFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadOutdoorFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
