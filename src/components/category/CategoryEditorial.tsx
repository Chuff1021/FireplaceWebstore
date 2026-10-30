import Link from "next/link";
import { categoryEditorial } from "@/lib/seo-categories";
export function CategoryEditorial({ slug }: { slug: string }) {
  const content = categoryEditorial[slug];
  if (!content) return null;
  return <section aria-label="Selection and order help" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <h2 className="text-2xl font-black">Choosing {slug === "parts" ? "the right replacement part" : content.title.toLowerCase()}</h2>
    <div className="mt-6 grid gap-7 lg:grid-cols-3">{content.sections.map(section => <div key={section.heading}><h3 className="text-lg font-bold">{section.heading}</h3><p className="mt-3 text-sm leading-7 text-gray-700">{section.text}</p></div>)}</div>
    <nav aria-label="Planning resources" className="mt-7 flex flex-wrap gap-5 text-sm font-bold text-orange-800 underline"><Link href="/guides">Buying & parts guides</Link><Link href="/tools/insert-planner">Insert planning worksheet</Link><Link href="/parts">Parts by manufacturer</Link><Link href="/installation">Springfield metro installation</Link></nav>
  </section>;
}
