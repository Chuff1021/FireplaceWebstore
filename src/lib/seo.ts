import type { Metadata } from "next";
import type { Product } from "@/lib/store-config";
export const SITE_URL = "https://aaronsfireplaceco.com";
export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;
export function pageMetadata(title: string, description: string, path: string, noindex = false): Metadata {
  const fullTitle = `${title} | Aaron's Fireplace Co.`;
  return { title: { absolute: fullTitle }, description, alternates: { canonical: absoluteUrl(path) },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: { type: "website", title: fullTitle, description, url: absoluteUrl(path), siteName: "Aaron's Fireplace Co." },
    twitter: { card: "summary", title: fullTitle, description } };
}
export function jsonLd(value: unknown) { return JSON.stringify(value).replace(/</g, "\\u003c"); }
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({
    "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
export function productSchema(product: Product) {
  return { "@context": "https://schema.org", "@type": "Product", "@id": absoluteUrl(`/product/${product.slug}#product`),
    name: product.name, sku: product.sku, description: product.description,
    brand: { "@type": "Brand", name: product.brand }, url: absoluteUrl(`/product/${product.slug}`),
    image: product.images.filter(Boolean).map(absoluteUrl),
    // Quotes/estimates and imported stock are not merchant offers. No invented GTINs or ratings.
    ...(product.categoryId === "parts" && product.canPurchase && product.partsAvailability === "available" ? {
      offers: { "@type": "Offer", priceCurrency: "USD", price: (product.salePrice ?? product.price).toFixed(2),
        url: absoluteUrl(`/product/${product.slug}`), availability: "https://schema.org/InStock", seller: { "@id": `${SITE_URL}/#business` } }
    } : {}) };
}
export type PageSearch = Record<string, string | string[] | undefined>;
export function searchParameters(input: PageSearch) {
  const result = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) if (typeof value === "string") result.set(key, value);
  return result;
}

export function isSearchEligibleProduct(product: Product) {
  return product.categoryId !== "parts" || !/^(?:Pool & Spa Parts|BBQ & Gas Grill Parts|BBQ's & Grills)$/.test((product.specifications.Department || "").trim());
}
