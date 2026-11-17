import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fireplaceGuides } from "@/lib/seo-guides";
import { breadcrumbs, jsonLd, pageMetadata, absoluteUrl } from "@/lib/seo";
export function generateStaticParams() { return fireplaceGuides.map(g => ({ slug: g.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params, guide = fireplaceGuides.find(g => g.slug === slug);
  return guide ? pageMetadata(guide.title, guide.description, `/guides/${slug}`) : { robots: { index: false } };
}
export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params, guide = fireplaceGuides.find(g => g.slug === slug);
  if (!guide) notFound();
  return <article className="mx-auto max-w-4xl px-4 py-12">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Article", headline: guide.title, description: guide.description, mainEntityOfPage: absoluteUrl(`/guides/${slug}`), author: { "@type": "Organization", name: "Aaron's Fireplace Co.", url: absoluteUrl("/about") }, publisher: { "@id": absoluteUrl("/#business") } }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: guide.title, path: `/guides/${slug}` }])) }} />
    <nav className="text-sm text-orange-800"><Link href="/guides">All guides</Link></nav><h1 className="mt-5 text-3xl font-black leading-tight md:text-4xl">{guide.title}</h1><p className="mt-5 text-lg leading-8 text-gray-700">{guide.description}</p><p className="mt-4 text-sm text-gray-600">Aaron’s Fireplace Co. · Parts and project planning</p>
    <nav aria-label="In this guide" className="mt-8 rounded-xl bg-[#f6efe5] p-5"><p className="font-bold">In this guide</p><ul className="mt-3 space-y-2">{guide.sections.map((s,i) => <li key={s.heading}><a className="text-orange-800 underline" href={`#step-${i+1}`}>{s.heading}</a></li>)}</ul></nav>
    {guide.sections.map((s,i) => <section key={s.heading} id={`step-${i+1}`} className="mt-9 scroll-mt-24"><h2 className="text-2xl font-bold">{s.heading}</h2><p className="mt-3 leading-8 text-gray-700">{s.text}</p></section>)}
    <section className="mt-10 rounded-xl border bg-[#fff7ed] p-6"><h2 className="text-2xl font-bold">Put the information to work</h2><div className="mt-4 flex flex-wrap gap-5 font-bold text-orange-800 underline"><Link href={`/category/${guide.category}`}>Browse the catalog</Link><Link href="/contact">Ask Aaron’s for help</Link><a href="tel:4177329775">Call 417-732-9775</a>{slug === "measuring-for-fireplace-insert" && <Link href="/tools/insert-planner">Open the insert worksheet</Link>}{slug === "repair-or-replace-fireplace" && <Link href="/tools/repair-or-replace">Open the cost worksheet</Link>}</div></section>
    <nav aria-label="Related guides" className="mt-8"><h2 className="text-xl font-bold">Related reading</h2><ul className="mt-3 space-y-3">{guide.related.map(s => { const item = fireplaceGuides.find(g => g.slug === s); return item ? <li key={s}><Link href={`/guides/${s}`} className="text-orange-800 underline">{item.title}</Link></li> : null; })}</ul></nav>
  </article>;
}
