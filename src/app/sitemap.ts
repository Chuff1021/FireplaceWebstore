import type { MetadataRoute } from "next";
import { loadAllProducts, loadAllBrands } from "@/lib/all-products";
import { productCategories } from "@/lib/store-config";
import { SITE_URL } from "@/lib/site-url";
import { localLandingPages } from "@/lib/local-seo";

const STATIC_PATHS: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  { path: "/brand", priority: 0.8, changeFrequency: "weekly" },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [products, brands] = await Promise.all([loadAllProducts(), loadAllBrands()]);

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

  const staticUrls: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));

  const localUrls: MetadataRoute.Sitemap = localLandingPages.map((page) => ({
    url: `${SITE_URL}/local/${page.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const brandUrls: MetadataRoute.Sitemap = brands
    .filter((brand) => brand.count >= 3)
    .map((brand) => ({
      url: `${SITE_URL}/brand/${brand.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/product/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: product.categoryId === "parts" ? 0.5 : 0.7,
  }));

  return [
    ...staticUrls,
    ...Array.from(categoryUrlsByPath.values()),
    ...localUrls,
    ...brandUrls,
    ...productUrls,
  ];
}
