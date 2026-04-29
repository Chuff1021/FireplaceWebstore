import "server-only";

import { sampleProducts, type Product } from "@/lib/store-config";
import { loadAccessoryProducts } from "@/lib/accessories-products";
import { loadElectricFireplaceProducts } from "@/lib/electric-fireplace-scraped";
import { loadElectricInsertProducts } from "@/lib/electric-inserts-scraped";
import { loadGasFireplaceProducts } from "@/lib/gas-fireplace-csv";
import { loadGasInsertProducts } from "@/lib/gas-inserts-scraped";
import { loadGasStoveProducts } from "@/lib/gas-stoves-scraped";
import { loadOutdoorFireplaceProducts } from "@/lib/outdoor-fireplace-scraped";
import { loadPelletInsertProducts } from "@/lib/pellet-inserts-scraped";
import { loadPelletStoveProducts } from "@/lib/pellet-stoves-scraped";
import { loadImportedPartsProducts } from "@/lib/parts-products";
import { loadWoodFireplaceProducts } from "@/lib/wood-fireplace-scraped";
import { loadWoodInsertProducts } from "@/lib/wood-inserts-scraped";
import { loadWoodStoveProducts } from "@/lib/wood-stoves-scraped";

let cached: Product[] | null = null;
let cacheExpiresAt = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function loadAllProducts(): Promise<Product[]> {
  if (cached && Date.now() < cacheExpiresAt) {
    return cached;
  }

  const [
    accessoryProducts,
    electricProducts,
    electricInsertProducts,
    gasProducts,
    gasInsertProducts,
    gasStoveProducts,
    outdoorProducts,
    partsProducts,
    pelletInsertProducts,
    pelletStoveProducts,
    woodProducts,
    woodInsertProducts,
    woodStoveProducts,
  ] = await Promise.all([
    loadAccessoryProducts(),
    loadElectricFireplaceProducts(),
    loadElectricInsertProducts(),
    loadGasFireplaceProducts(),
    loadGasInsertProducts(),
    loadGasStoveProducts(),
    loadOutdoorFireplaceProducts(),
    loadImportedPartsProducts(),
    loadPelletInsertProducts(),
    loadPelletStoveProducts(),
    loadWoodFireplaceProducts(),
    loadWoodInsertProducts(),
    loadWoodStoveProducts(),
  ]);

  const nonGasSampleProducts = sampleProducts.filter(
    (product) =>
      product.subcategoryId !== "gas-fireplaces" &&
      product.subcategoryId !== "electric-fireplaces" &&
      product.subcategoryId !== "wood-fireplaces" &&
      product.subcategoryId !== "outdoor-fireplaces" &&
      product.subcategoryId !== "gas-inserts" &&
      product.subcategoryId !== "wood-inserts" &&
      product.subcategoryId !== "pellet-inserts" &&
      product.subcategoryId !== "electric-inserts" &&
      product.subcategoryId !== "wood-stoves" &&
      product.subcategoryId !== "pellet-stoves" &&
      product.subcategoryId !== "gas-stoves" &&
      product.categoryId !== "parts",
  );

  const all: Product[] = [
    ...nonGasSampleProducts,
    ...accessoryProducts,
    ...electricProducts,
    ...electricInsertProducts,
    ...gasProducts,
    ...gasInsertProducts,
    ...gasStoveProducts,
    ...outdoorProducts,
    ...partsProducts,
    ...pelletInsertProducts,
    ...pelletStoveProducts,
    ...woodProducts,
    ...woodInsertProducts,
    ...woodStoveProducts,
  ];

  const seen = new Set<string>();
  const deduped: Product[] = [];
  for (const product of all) {
    if (!product.slug || seen.has(product.slug)) continue;
    seen.add(product.slug);
    deduped.push(product);
  }

  cached = deduped;
  cacheExpiresAt = Date.now() + CACHE_TTL_MS;
  return deduped;
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  const products = await loadAllProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function loadProductsByCategorySlug(
  slug: string,
): Promise<Product[]> {
  const products = await loadAllProducts();
  return products.filter(
    (p) => p.categoryId === slug || p.subcategoryId === slug,
  );
}

export async function loadProductsByBrand(brand: string): Promise<Product[]> {
  const products = await loadAllProducts();
  const target = brand.toLowerCase();
  return products.filter((p) => p.brand?.toLowerCase() === target);
}

export async function loadAllBrands(): Promise<
  Array<{ name: string; slug: string; count: number }>
> {
  const products = await loadAllProducts();
  const map = new Map<string, { name: string; count: number }>();
  for (const product of products) {
    const name = (product.brand || "").trim();
    if (!name || name.toLowerCase() === "parts") continue;
    const key = name.toLowerCase();
    const entry = map.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      map.set(key, { name, count: 1 });
    }
  }
  return Array.from(map.values())
    .map(({ name, count }) => ({
      name,
      count,
      slug: name
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    }))
    .sort((a, b) => b.count - a.count);
}
