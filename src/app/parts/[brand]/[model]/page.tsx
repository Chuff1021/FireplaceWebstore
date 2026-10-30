import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { partsModels } from "@/lib/parts-models";
import { findProduct } from "@/lib/catalog";
import { ProductCard } from "@/components/ui/ProductCard";
import { breadcrumbs, jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ brand: string; model: string }> };
export const dynamic = "force-dynamic";
async function lookup(params: Props["params"]) { const p = await params; return partsModels.find(m => m.brandSlug === p.brand && m.slug === p.model); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const model = await lookup(params);
  return model ? pageMetadata(`${model.brand} ${model.model} Parts & Model References`, `Browse documented ${model.brand} ${model.model} parts references, source checks and application restrictions. Confirm model and serial information before ordering.`, `/parts/${model.brandSlug}/${model.slug}`) : { robots: { index: false } };
}
export default async function ModelPage({ params }: Props) {
  const model = await lookup(params);
  if (!model) notFound();
  const products = await Promise.all(model.parts.map(part => findProduct(part.slug)));
  const path = `/parts/${model.brandSlug}/${model.slug}`;
  return <div className="mx-auto max-w-6xl px-4 py-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name: `${model.brand} Parts`, path: `/parts/${model.brandSlug}` }, { name: `${model.model} Parts`, path }])) }} />
    <nav className="text-sm text-orange-800"><Link href={`/parts/${model.brandSlug}`}>All {model.brand} parts</Link> / {model.model}</nav><h1 className="mt-5 text-3xl font-black md:text-4xl">{model.brand} {model.model} parts</h1>
    <p className="mt-4 max-w-3xl leading-7 text-gray-700">These selected catalog references name {model.brand} {model.model} in the supplier’s application information. They are a starting point for identification, not a complete appliance parts diagram or a guarantee of fit for every production version. Read each restriction and match the full model and serial number.</p>
    <section className="mt-6 rounded-xl border bg-[#fff7ed] p-5"><h2 className="text-xl font-bold">Before choosing a replacement</h2><p className="mt-3 leading-7 text-gray-700">Record the rating-plate model, serial number and fuel type. Compare the original component number, connectors and package contents. Use the correct appliance manual; ask for review if the documentation and listing disagree.</p><div className="mt-3 flex flex-wrap gap-5 font-bold text-orange-800 underline"><Link href="/guides/find-fireplace-model-number">Find the model label</Link><Link href="/guides/fireplace-part-compatibility">Compatibility checklist</Link><Link href="/contact">Ask about this appliance</Link></div></section>
    <h2 className="mt-10 text-2xl font-bold">Selected replacement references</h2><div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{model.parts.map((part,i) => <article key={part.key} className="min-w-0"><div className="h-auto">{products[i] ? <ProductCard product={products[i]!} /> : <Link href={`/category/parts?q=${encodeURIComponent(part.sku)}`} className="font-bold text-orange-800 underline">Find part {part.sku}</Link>}</div><div className="mt-3 rounded-lg border bg-[#fffaf3] p-4"><h3 className="font-bold">Application & package notes</h3><p className="mt-2 text-sm leading-6">{part.notes}</p><p className="mt-3 text-xs text-gray-600">Public source reviewed {part.sourceCheckedAt.slice(0,10)}. This date concerns the model reference; current availability is shown on the product page.</p><a href={part.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-orange-800 underline">Supplier application source for {part.sku}</a></div></article>)}</div>
    <p className="mt-9 text-sm leading-7 text-gray-700">This collection is intentionally limited to documented references. A discontinued, unavailable or special-order component may still be listed for identification. Confirm availability, shipping and the final total before completing an order.</p>
  </div>;
}
