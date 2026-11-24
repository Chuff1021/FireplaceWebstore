import Link from "next/link";
import { loadBasePartsProducts } from "@/lib/parts-products";
import { partsBrands } from "@/lib/seo-brands";
import { partsDepartments } from "@/lib/parts-taxonomy";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Fireplace Parts by Brand & Appliance", "Browse fireplace and stove replacement parts by manufacturer, appliance type or part number. Get model identification and nationwide order help.", "/parts");
export default async function PartsDirectory() {
  const products = await loadBasePartsProducts();
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.brand, (counts.get(p.brand) || 0) + 1);
  return <div className="bg-[#f6efe5] px-4 py-12"><div className="mx-auto max-w-6xl">
    <nav className="text-sm text-orange-800"><Link href="/">Home</Link> / Parts</nav>
    <h1 className="mt-6 text-4xl font-black">Fireplace & stove parts by manufacturer</h1>
    <p className="mt-4 max-w-3xl leading-7 text-gray-700">Search the replacement catalog by the brand on your appliance rating plate. Have a number already? Use the part-number search. A manufacturer match narrows the catalog; confirm the model, serial number and package before ordering.</p>
    <Link href="/category/parts" className="mt-5 inline-block rounded-lg bg-orange-800 px-5 py-3 font-bold text-white">Search by part number</Link>
    <h2 className="mt-10 text-2xl font-bold">Manufacturer departments</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{partsBrands.filter(b => counts.has(b.name)).map(b => <Link key={b.slug} href={`/parts/${b.slug}`} className="rounded-xl border border-[#ded5c8] bg-white p-5 hover:border-orange-800"><h3 className="text-xl font-bold">{b.name} parts</h3><p className="mt-2 text-sm text-gray-700">{counts.get(b.name)?.toLocaleString()} catalog listings · Browse replacement parts →</p></Link>)}</div>
    <h2 className="mt-10 text-2xl font-bold">Shop by appliance</h2><div className="mt-4 flex flex-wrap gap-3">{partsDepartments.map(d => <Link key={d.slug} href={`/category/${d.slug}`} className="rounded-lg border bg-white p-3 font-semibold text-orange-800">{d.name}</Link>)}</div>
    <details className="mt-8 rounded-lg border bg-white p-5"><summary className="cursor-pointer font-bold">All catalog manufacturers</summary><div className="mt-4 grid gap-3 sm:grid-cols-3">{[...counts].sort(([a],[b]) => a.localeCompare(b)).map(([name,count]) => <Link key={name} href={`/category/parts?brand=${encodeURIComponent(name)}`} className="text-sm text-orange-800 underline">{name} ({count})</Link>)}</div></details>
    <section className="mt-10 max-w-3xl"><h2 className="text-2xl font-bold">Not sure which part you need?</h2><p className="mt-3 leading-7 text-gray-700">Start with the complete appliance identification. An old part number, revision note or package quantity can change the correct replacement. If the listing does not establish a match, ask us to check before you order.</p><div className="mt-4 flex flex-wrap gap-5 font-semibold text-orange-800 underline"><Link href="/guides/find-fireplace-model-number">Find your model number</Link><Link href="/guides/fireplace-part-compatibility">Check part compatibility</Link><Link href="/contact">Ask the parts department</Link></div></section>
  </div></div>;
}
