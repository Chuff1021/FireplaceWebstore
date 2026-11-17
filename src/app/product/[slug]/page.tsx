import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categoryProducts, findProduct, hydrateParts } from "@/lib/catalog";
import { ProductDetail } from "@/components/product/ProductDetail";
import { breadcrumbs, jsonLd, pageMetadata, productSchema, isSearchEligibleProduct } from "@/lib/seo";
import { modelsForPart } from "@/lib/parts-models";
import Link from "next/link";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await findProduct((await params).slug);
  return product ? pageMetadata(product.name, `${product.shortDescription.slice(0, 115)} Get part and order help from Aaron's Fireplace Co.`, `/product/${product.slug}`, !isSearchEligibleProduct(product))
    : { title: "Product not found", robots: { index: false, follow: true } };
}
export default async function ProductPage({ params }: Props) {
  const product = await findProduct((await params).slug);
  if (!product) notFound();
  const group = await categoryProducts(product.subcategoryId || product.categoryId);
  let related = group.filter(p => p.id !== product.id && (product.categoryId !== "parts" || p.brand === product.brand)).slice(0, 4);
  if (product.categoryId === "parts") related = await hydrateParts(related);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productSchema(product)) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([
      { name: "Home", path: "/" }, { name: product.categoryId === "parts" ? "Fireplace Parts" : product.categoryId, path: `/category/${product.categoryId}` },
      { name: product.name, path: `/product/${product.slug}` }])) }} />
    <ProductDetail key={product.id} product={product} relatedProducts={related} />
    {product.categoryId === "parts" && <aside className="mx-auto max-w-7xl px-4 pb-10 text-sm leading-6">
      {modelsForPart(product.sourceKey || "").length > 0 && <div className="mb-6"><h2 className="text-xl font-bold">Documented model references</h2><ul className="mt-2 space-y-3">{modelsForPart(product.sourceKey || "").map(model => <li key={`${model.brandSlug}:${model.slug}`}><Link href={`/parts/${model.brandSlug}/${model.slug}`} className="font-bold text-orange-800 underline">{model.brand} {model.model}</Link><p className="mt-1 text-gray-700">{model.parts.find(p => p.key === product.sourceKey)?.notes}</p></li>)}</ul><p className="mt-3 text-xs text-gray-600">Supplier application information reviewed October 30, 2026. Confirm the full model and serial number; this is separate from the current stock check.</p></div>}
      <h2 className="text-xl font-bold">Confirm the part before ordering</h2>
      <p className="mt-2">Match the complete appliance model, serial number, part number and package contents. Similar-looking components can have different connections or revisions.</p>
      <div className="mt-3 flex flex-wrap gap-4 text-orange-800 underline"><Link href="/guides/find-fireplace-model-number">Find your model number</Link><Link href="/parts">Browse parts by manufacturer</Link><Link href={`/contact?product=${encodeURIComponent(product.sku)}`}>Ask about this part</Link></div>
    </aside>}
  </>;
}
