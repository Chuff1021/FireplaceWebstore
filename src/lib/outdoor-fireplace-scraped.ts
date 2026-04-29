import "server-only";

import { loadScrapedCategoryProducts } from "@/lib/scraped-category-loader";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

function getOutdoorSubcategory(product: Product) {
  const source = `${product.name} ${product.slug}`.toLowerCase();
  if (source.includes("fire pit") || source.includes("firepit") || source.includes("burner") || source.includes("torch")) {
    return "fire-pits";
  }

  return "outdoor-fireplaces";
}

async function loadOutdoorFireplaceProductsInternal(): Promise<Product[]> {
  const products = await loadScrapedCategoryProducts({
    fileName: "outdoor-fireplaces-scraped.json",
    idPrefix: "scraped-outdoor",
    categoryId: "outdoor",
    subcategoryId: "outdoor-fireplaces",
  });

  return products.map((product) => ({
    ...product,
    categoryId: "outdoor",
    subcategoryId: getOutdoorSubcategory(product),
  }));
}

export async function loadOutdoorFireplaceProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = loadOutdoorFireplaceProductsInternal();
  }

  return cachedProductsPromise;
}
