import "server-only";

import { readFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/store-config";

const remoteProducts: Product[] = [
  {
    id: "accessory-skytech-1001t-lcd",
    sku: "SKY-1001T-LCD-A",
    name: "Skytech 1001T-LCD Fireplace Remote Control with Timer",
    slug: "skytech-1001t-lcd-fireplace-remote-control-with-timer",
    description: "Thermostatic Skytech fireplace remote control with LCD display and countdown timer for many gas fireplace and stove applications.",
    shortDescription: "Thermostatic fireplace remote control with timer and LCD display.",
    price: 0,
    contactForPricing: true,
    categoryId: "accessories",
    subcategoryId: "remotes-controls",
    brand: "Skytech",
    images: ["/products/parts/remote-ac.jpg", "/categories/remote-controls.jpg"],
    features: ["Thermostatic control", "LCD display", "Countdown timer"],
    specifications: { Brand: "Skytech", Type: "Remote Control", Model: "1001T-LCD" },
    inStock: true,
    stockQuantity: 10,
    rating: 0,
    reviewCount: 0,
    isFeatured: true,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "accessory-skytech-programmable-fireplace-remote-control",
    sku: "SKY-3301P2",
    name: "Skytech Programmable Fireplace Remote Control",
    slug: "skytech-programmable-fireplace-remote-control",
    description: "Programmable fireplace remote control option for compatible gas fireplace systems. Contact Aaron's to confirm compatibility before ordering.",
    shortDescription: "Programmable fireplace remote control for compatible gas systems.",
    price: 0,
    contactForPricing: true,
    categoryId: "accessories",
    subcategoryId: "remotes-controls",
    brand: "Skytech",
    images: ["/products/parts/remote-elect-b.jpg", "/categories/remote-controls.jpg"],
    features: ["Programmable operation", "Compatibility check recommended", "Quote required"],
    specifications: { Brand: "Skytech", Type: "Remote Control" },
    inStock: true,
    stockQuantity: 10,
    rating: 0,
    reviewCount: 0,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
  },
  {
    id: "accessory-heat-n-glo-heatilator-rc200-fireplace-remote",
    sku: "2166-320",
    name: "Heat N Glo / Heatilator RC200 Fireplace Remote",
    slug: "heat-n-glo-heatilator-rc200-fireplace-remote",
    description: "Replacement fireplace remote for select Heat N Glo and Heatilator gas fireplace systems. Aaron's can help verify the correct remote before purchase.",
    shortDescription: "Replacement RC200-style fireplace remote for select HHT systems.",
    price: 0,
    contactForPricing: true,
    categoryId: "accessories",
    subcategoryId: "remotes-controls",
    brand: "Heat N Glo",
    images: ["/products/parts/ge-remote.jpg", "/categories/remote-controls.jpg"],
    features: ["Replacement remote", "Compatibility verification recommended", "Gas fireplace control"],
    specifications: { Brand: "Heat N Glo / Heatilator", Type: "Remote Control", Model: "2166-320" },
    inStock: true,
    stockQuantity: 10,
    rating: 0,
    reviewCount: 0,
    isFeatured: false,
    isNew: false,
    isBestSeller: false,
  },
];

let cachedProductsPromise: Promise<Product[]> | null = null;

async function loadMantelProducts(): Promise<Product[]> {
  const filePath = path.join(process.cwd(), "data", "accessories-mantels.json");

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
    cachedProductsPromise = loadMantelProducts().then((mantelProducts) => [...mantelProducts, ...remoteProducts]);
  }

  return cachedProductsPromise;
}
