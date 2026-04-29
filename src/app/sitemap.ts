import type { MetadataRoute } from "next";
import { loadAllProducts, loadAllBrands } from "@/lib/all-products";
import { productCategories } from "@/lib/store-config";
import { SITE_URL } from "@/lib/site-url";

const PRODUCTS_PER_SHARD = 5000;

const STATIC_PATHS: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/showrooms", priority: 0.8, changeFrequency: "monthly" },
  { path: "/service-appointment", priority: 0.7, changeFrequency: "monthly" },
  { path: "/installation", priority: 0.7, changeFrequency: "monthly" },
  { path: "/financing", priority: 0.6, changeFrequency: "monthly" },
  { path: "/trade-program", priority: 0.5, changeFrequency: "monthly" },
  { path: "/sale", priority: 0.7, changeFrequency: "weekly" },
  { path: "/design-tool", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/returns", priority: 0.4, changeFrequency: "yearly" },
  { path: "/warranty", priority: 0.4, changeFrequency: "yearly" },
  { path: "/shipping", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
];

const LOCAL_LANDING_PATHS = [
  "/local/fireplace-store-republic-mo",
  "/local/fireplace-store-springfield-mo",
  "/local/fireplace-store-branson-mo",
  "/local/fireplace-store-nixa-mo",
  "/local/fireplace-store-ozark-mo",
  "/local/fireplace-installation-springfield-mo",
];

export async function generateSitemaps(): Promise<Array<{ id: number }>> {
  const products = await loadAllProducts();
  const productCount = products.length;
  const productShards = Math.max(1, Math.ceil(productCount / PRODUCTS_PER_SHARD));
  const shards = [0];
  for (let i = 1; i <= productShards; i += 1) shards.push(i);
  return shards.map((id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  if (id === 0) {
    const brands = await loadAllBrands();

    const categoryUrlsByPath = new Map<string, MetadataRoute.Sitemap[number]>();
    for (const category of productCategories) {
      categoryUrlsByPath.set(`/category/${category.slug}`, {
        url: `${SITE_URL}/category/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
      for (const sub of category.subcategories ?? []) {
        categoryUrlsByPath.set(`/category/${sub.slug}`, {
          url: `${SITE_URL}/category/${sub.slug}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.85,
        });
      }
    }
    const categoryUrls = Array.from(categoryUrlsByPath.values());

    const brandUrls: MetadataRoute.Sitemap = brands
      .filter((b) => b.count >= 3)
      .map((b) => ({
        url: `${SITE_URL}/brand/${b.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
      url: `${SITE_URL}${p.path}`,
      lastModified: now,
      changeFrequency: p.changeFrequency,
      priority: p.priority,
    }));

    const localUrls: MetadataRoute.Sitemap = LOCAL_LANDING_PATHS.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    }));

    return [...staticUrls, ...categoryUrls, ...brandUrls, ...localUrls];
  }

  const products = await loadAllProducts();
  const start = (id - 1) * PRODUCTS_PER_SHARD;
  const end = start + PRODUCTS_PER_SHARD;
  return products.slice(start, end).map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.categoryId === "parts" ? 0.5 : 0.7,
  }));
}
