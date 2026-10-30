import "server-only";
import { cache } from "react";
import { filterPartsCatalog } from "@/lib/parts-catalog";
import type { Product } from "@/lib/store-config";
import { loadAccessoryProducts } from "@/lib/accessories-products";
import { loadElectricFireplaceProducts } from "@/lib/electric-fireplace-scraped";
import { loadElectricInsertProducts } from "@/lib/electric-inserts-scraped";
import { loadGasFireplaceProducts } from "@/lib/gas-fireplace-csv";
import { loadGasInsertProducts } from "@/lib/gas-inserts-scraped";
import { loadGasStoveProducts } from "@/lib/gas-stoves-scraped";
import { loadOutdoorFireplaceProducts } from "@/lib/outdoor-fireplace-scraped";
import { loadPelletInsertProducts } from "@/lib/pellet-inserts-scraped";
import { loadPelletStoveProducts } from "@/lib/pellet-stoves-scraped";
import { loadBasePartsProducts, applyPartsOffers, partFromLive } from "@/lib/parts-products";
import { livePartsByKeys, discoveredParts, livePartBySlug } from "@/lib/parts-commerce";
import { loadWoodFireplaceProducts } from "@/lib/wood-fireplace-scraped";
import { loadWoodInsertProducts } from "@/lib/wood-inserts-scraped";
import { loadWoodStoveProducts } from "@/lib/wood-stoves-scraped";

const loaders = {
  "accessories": loadAccessoryProducts,
  "electric-fireplaces": loadElectricFireplaceProducts,
  "electric-inserts": loadElectricInsertProducts,
  "gas-fireplaces": loadGasFireplaceProducts,
  "gas-inserts": loadGasInsertProducts,
  "gas-stoves": loadGasStoveProducts,
  "outdoor": loadOutdoorFireplaceProducts,
  "pellet-inserts": loadPelletInsertProducts,
  "pellet-stoves": loadPelletStoveProducts,
  "wood-fireplaces": loadWoodFireplaceProducts,
  "wood-inserts": loadWoodInsertProducts,
  "wood-stoves": loadWoodStoveProducts,
};
let appliances: Promise<Product[]> | undefined;
export function loadApplianceProducts() {
  appliances ??= Promise.all(Object.values(loaders).map(load => load())).then(groups => {
    // Never publish imported supplier review scores as reviews of Aaron's store.
    return [...new Map(groups.flat().map(p => [p.slug, { ...p, rating: 0, reviewCount: 0 }])).values()];
  }).catch(error => { appliances = undefined; throw error; });
  return appliances;
}
let partIndex: Promise<Map<string, Product>> | undefined;
function indexedParts() {
  partIndex ??= loadBasePartsProducts().then(items => new Map(items.map(p => [p.slug, p])));
  return partIndex;
}
export const findProduct = cache(async (slug: string): Promise<Product | null> => {
  const part = (await indexedParts()).get(slug);
  if (part) return (await hydrateParts([part]))[0];
  const appliance = (await loadApplianceProducts()).find(p => p.slug === slug);
  if (appliance) return appliance;
  const current = await livePartBySlug(slug);
  return current?.catalog ? applyPartsOffers([partFromLive(current)], new Map([[current.key, current]]))[0] : null;
});
export async function hydrateParts(products: Product[]) {
  return applyPartsOffers(products, await livePartsByKeys(products.map(p => p.sourceKey || "")));
}
export async function partsPage(params: URLSearchParams) {
  const result = filterPartsCatalog(await loadCatalogParts(), params);
  return { ...result, products: await hydrateParts(result.products) };
}
export async function categoryProducts(slug: string) {
  if (slug === "parts" || slug.endsWith("-parts")) return loadCatalogParts();
  const catalog = await loadApplianceProducts();
  return catalog.filter(p => p.categoryId === slug || p.subcategoryId === slug);
}
export async function catalogIdentities() {
  const [parts, products] = await Promise.all([loadCatalogParts(), loadApplianceProducts()]);
  return [...new Map([...products, ...parts].map(p => [p.slug, p])).values()];
}

export async function loadCatalogParts() {
  const [base, added] = await Promise.all([loadBasePartsProducts(), discoveredParts()]);
  const known = new Set(base.map(p => p.sourceKey));
  return base.concat(added.filter(p => p.catalog && !known.has(p.key)).map(partFromLive));
}
