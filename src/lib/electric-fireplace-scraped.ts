import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadElectricFireplaceProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "electric-fireplaces-scraped.json",
    idPrefix: "scraped-electric",
    categoryId: "fireplaces",
    subcategoryId: "electric-fireplaces",
  });
}

export async function loadElectricFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadElectricFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
