import "server-only";

import catalog from "../../data/napoleon-outdoor.json";
import type { Product } from "@/lib/store-config";

// Prices and model photos are sourced individually from Napoleon's US catalog.
// A manufacturer listing is not evidence of local or supplier stock.
export const napoleonOutdoorProducts: Product[] = catalog.map((record, index) => ({
  id: `napoleon-outdoor-${record.sku.toLowerCase()}`,
  sku: record.sku,
  name: record.name,
  slug: record.slug,
  description: record.description,
  shortDescription: record.description,
  price: record.price,
  priceType: record.price > 0 ? "msrp" : undefined,
  contactForPricing: record.price <= 0,
  categoryId: "outdoor",
  subcategoryId: record.kind === "heater" ? "patio-heaters" : "fire-pits",
  brand: "Napoleon",
  images: [record.image],
  features: record.features,
  specifications: {
    ...Object.fromEntries(
      Object.entries(record.specifications).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    ),
    Model: record.sku,
    Brand: "Napoleon",
    "Product URL": record.productUrl,
    "Price basis": record.price > 0 ? "Manufacturer's suggested retail price (USD)" : "Contact for Pricing — no published U.S. MSRP",
    "Price checked": record.priceCheckedAt,
  },
  availabilityStatus: "confirm",
  inStock: false,
  stockQuantity: 0,
  rating: 0,
  reviewCount: 0,
  isFeatured: true,
  outdoorFeaturedOrder: index,
  isNew: false,
  isBestSeller: false,
}));
