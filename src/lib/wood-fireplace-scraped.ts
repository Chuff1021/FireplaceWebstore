import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadWoodFireplaceProductsInternal(): Promise<Product[]> {
  return loadScrapedCategoryProducts({
    fileName: "wood-fireplaces-scraped.json",
    idPrefix: "scraped-wood",
    categoryId: "fireplaces",
    subcategoryId: "wood-fireplaces",
  });
}

export async function loadWoodFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadWoodFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
