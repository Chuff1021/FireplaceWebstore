import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { partsModels } from "@/lib/parts-models";
import { partsBrands } from "@/lib/seo-brands";
import { partsPage } from "@/lib/catalog";
import { PartsCategoryExperience } from "@/components/parts/PartsCategoryExperience";
import { breadcrumbs, jsonLd, pageMetadata, searchParameters, type PageSearch } from "@/lib/seo";

type Props = { params: Promise<{ brand: string }>; searchParams: Promise<PageSearch> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { brand: slug } = await params;
  const brand = partsBrands.find(b => b.slug === slug);
  const query = searchParameters(await searchParams);
  if (!brand) return { robots: { index: false } };
  const page = Math.max(1, Math.floor(Number(query.get("page")) || 1));
  return pageMetadata(`${brand.name} Fireplace & Stove Parts${page > 1 ? ` — Page ${page}` : ""}`, `Find ${brand.name} replacement parts by part number and appliance type. Confirm model, serial limits and package contents with Aaron’s Fireplace Co.`, `/parts/${brand.slug}${page > 1 ? `?page=${page}` : ""}`, [...query.keys()].some(k => ["brand","partType","q","sort"].includes(k)));
}
export default async function BrandPage({ params, searchParams }: Props) {
  const { brand: slug } = await params, brand = partsBrands.find(b => b.slug === slug);
  if (!brand) notFound();
  const query = searchParameters(await searchParams);
  if (query.has("brand")) {
    const target = partsBrands.find(b => b.name.toLowerCase() === query.get("brand")?.toLowerCase());
    if (target) { query.delete("brand"); permanentRedirect(`/parts/${target.slug}${query.size ? `?${query}` : ""}`); }
    permanentRedirect(`/category/parts?${query}`);
  }
  const apiParams = new URLSearchParams({ category: "parts", pageSize: "20", page: query.get("page") || "1", sort: query.get("sort") || "name", brand: brand.name });
  for (const key of ["partType", "q"]) if (query.get(key)) apiParams.set(key, query.get(key)!);
  const data = await partsPage(apiParams);
  if (Number(query.get("page")) > Math.max(1, data.totalPages)) notFound();
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name: "Parts by Manufacturer", path: "/parts" }, { name: `${brand.name} Parts`, path: `/parts/${slug}` }])) }} />
    <section className="mx-auto max-w-6xl px-4 pt-10 pb-6"><nav className="text-sm text-orange-800"><Link href="/parts">All manufacturers</Link> / {brand.name}</nav><h1 className="mt-5 text-3xl font-black">{brand.name} fireplace & stove replacement parts</h1><p className="mt-4 max-w-3xl leading-7 text-gray-700">{brand.intro}</p><div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-orange-800 underline"><Link href={`/category/${brand.department}?brand=${encodeURIComponent(brand.name)}`}>Browse by appliance type</Link><Link href="/guides/fireplace-part-compatibility">Compatibility checklist</Link><Link href="/contact">Help identifying a part</Link></div></section>
    {partsModels.some(m => m.brandSlug === slug) && <section className="mx-auto max-w-6xl px-4 pb-6"><h2 className="text-xl font-bold">Browse documented model references</h2><div className="mt-3 flex flex-wrap gap-3">{partsModels.filter(m => m.brandSlug === slug).map(m => <Link key={m.slug} href={`/parts/${slug}/${m.slug}`} className="rounded-lg border px-4 py-3 text-sm font-semibold text-orange-800">{m.model}</Link>)}</div></section>}
    <PartsCategoryExperience key={`${slug}:${query}`} slug="parts" initialCatalog={data} initialKey={apiParams.toString()} fixedBrand={brand.name} basePath={`/parts/${slug}`} />
    <section className="mx-auto max-w-6xl px-4 pb-10"><h2 className="text-xl font-bold">What to check on a {brand.name} part</h2><ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-gray-700"><li>Complete model, fuel type and serial or revision limits.</li><li>Original part number and any documented replacement number.</li><li>Included pieces, quantity per package and any required additional components.</li><li>Current availability and shipping confirmation for your destination.</li></ul><p className="mt-4 text-sm text-gray-600">These are catalog listings, not a guarantee that every component fits every {brand.name} appliance. Manufacturer names identify the products; dealer status is not implied by a parts listing.</p></section>
  </>;
}
