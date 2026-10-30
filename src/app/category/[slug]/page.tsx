import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { productCategories } from "@/lib/store-config";
import { partsDepartmentSlugs } from "@/lib/parts-taxonomy";
import { categoryProducts, partsPage } from "@/lib/catalog";
import { PartsCategoryExperience } from "@/components/parts/PartsCategoryExperience";
import { CategoryExperience } from "@/components/category/CategoryExperience";
import { CategoryEditorial } from "@/components/category/CategoryEditorial";
import { categoryEditorial } from "@/lib/seo-categories";
import { breadcrumbs, jsonLd, pageMetadata, searchParameters, type PageSearch } from "@/lib/seo";
import { partsBrands } from "@/lib/seo-brands";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<PageSearch> };
export const dynamic = "force-dynamic";
const categories = productCategories.flatMap(c => [c, ...(c.subcategories || [])]);
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { slug } = await params, query = searchParameters(await searchParams), category = categories.find(c => c.slug === slug);
  if (!category) return { robots: { index: false, follow: true } };
  const page = Math.max(1, Math.floor(Number(query.get("page")) || 1));
  const filtered = [...query.keys()].some(key => !["page", "utm_source", "utm_medium", "utm_campaign", "gclid", "fbclid"].includes(key));
  const content = categoryEditorial[slug];
  return pageMetadata(`${content?.title || category.name}${page > 1 ? ` — Page ${page}` : ""}`,
    content?.description || `${category.description}. Browse ${category.name.toLowerCase()} and get order help from Aaron's Fireplace Co.`,
    `/category/${slug}${page > 1 ? `?page=${page}` : ""}`, filtered);
}
export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params, query = searchParameters(await searchParams);
  if (!categories.some(c => c.slug === slug)) notFound();
  const isParts = slug === "parts" || partsDepartmentSlugs.has(slug);
  const requestedPage = Math.max(1, Math.floor(Number(query.get("page")) || 1));
  if (slug === "parts" && query.has("brand") && [...query.keys()].every(k => k === "brand" || k === "page")) {
    const brand = partsBrands.find(b => b.name.toLowerCase() === query.get("brand")?.toLowerCase());
    if (brand) permanentRedirect(`/parts/${brand.slug}${requestedPage > 1 ? `?page=${requestedPage}` : ""}`);
  }
  const name = categories.find(c => c.slug === slug)!.name;
  if (isParts) {
    const apiParams = new URLSearchParams({ category: slug, pageSize: "20", page: query.get("page") || "1", sort: query.get("sort") || "name" });
    for (const key of ["brand", "partType", "q"]) if (query.get(key)) apiParams.set(key, query.get(key)!);
    const data = await partsPage(apiParams);
    if (requestedPage > Math.max(1, data.totalPages)) notFound();
    return <><PartsCategoryExperience key={`${slug}:${query}`} slug={slug} initialCatalog={data} initialKey={apiParams.toString()} /><CategoryEditorial slug={slug} /></>;
  }
  const products = await categoryProducts(slug);
  const perPage = ["fire-pits", "patio-heaters"].includes(slug) ? 24 : 20;
  if (requestedPage > Math.max(1, Math.ceil(products.length / perPage))) notFound();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name, path: `/category/${slug}` }])) }} />
    <CategoryExperience key={slug} slug={slug} initialProducts={products} /><CategoryEditorial slug={slug} /></>;
}
