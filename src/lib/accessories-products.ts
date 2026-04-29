import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/store-config";

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadProductsFile(fileName: string): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", fileName);

  try {
    const jsonText = await readFile(filePath, "utf8");
    const parsed = JSON.parse(jsonText);
    return Array.isArray(parsed) ? (parsed as Product[]) : [];
  } catch {
    return [];
  }
}

export async function loadAccessoryProducts(): Promise<Product[]> {
  if (!cachedProductsPromise) {
    cachedProductsPromise = Promise.all([
      loadProductsFile("accessories-mantels.json"),
      loadProductsFile("accessories-remotes.json"),
      loadProductsFile("accessories-doors-screens.json"),
      loadProductsFile("accessories-screens.json"),
      loadProductsFile("accessories-gas-logs.json"),
      loadProductsFile("accessories-fire-media.json"),
    ]).then(([mantelProducts, remoteProducts, doorProducts, screenProducts, gasLogProducts, fireMediaProducts]) => [
      ...mantelProducts,
      ...remoteProducts,
      ...doorProducts,
      ...screenProducts,
      ...gasLogProducts,
      ...fireMediaProducts,
    ]);
  }

  return cachedProductsPromise;
}
