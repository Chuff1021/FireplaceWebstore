import type { MetadataRoute } from "next";
import { catalogIdentities } from "@/lib/catalog";
import { productCategories } from "@/lib/store-config";
import { partsModels } from "@/lib/parts-models";
import { partsBrands } from "@/lib/seo-brands";
import { fireplaceGuides } from "@/lib/seo-guides";
import { absoluteUrl, isSearchEligibleProduct } from "@/lib/seo";
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await catalogIdentities();
  const paths = ["/", "/parts", "/guides", "/installation", "/showrooms", "/about", "/contact", "/shipping", "/returns", "/warranty", "/faq", "/tools/insert-planner", "/tools/repair-or-replace",
    ...productCategories.flatMap(c => [c, ...(c.subcategories || [])]).map(c => `/category/${c.slug}`),
    ...partsModels.map(m => `/parts/${m.brandSlug}/${m.slug}`), ...partsBrands.map(b => `/parts/${b.slug}`), ...fireplaceGuides.map(g => `/guides/${g.slug}`), ...products.filter(isSearchEligibleProduct).map(p => `/product/${p.slug}`)];
  // Do not invent last-modified dates or advertise filtered/private URLs.
  return [...new Set(paths)].map(path => ({ url: absoluteUrl(path) }));
}
