import Link from "next/link";

import { pageMetadata, jsonLd, SITE_URL } from "@/lib/seo";

export const metadata = pageMetadata("Fireplace Installation in Springfield, MO Metro", "Plan a fireplace, stove or insert installation with Aaron’s Fireplace Co. in Republic, Missouri. Serving the Springfield metro; nationwide product sales.", "/installation");

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f6efe5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "Service", name: "Fireplace and stove installation planning", provider: { "@id": `${SITE_URL}/#business` }, areaServed: { "@type": "Place", name: "Springfield, Missouri metropolitan area" }, url: `${SITE_URL}/installation` }) }} />
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Fireplace planning</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">Fireplace installation in the Springfield, MO metro</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">Fireplaces, inserts, stoves, venting, gas lines, clearances, and code requirements need expert review. From our showroom at 611 E Harrison St in Republic, Aaron’s Fireplace Co. helps homeowners in the Springfield, Missouri metro plan fireplaces, inserts and stove installations. We also sell products nationwide; local installation is scheduled within our actual service area.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="border border-[#ded5c8] bg-[#fffdf9] p-6 shadow-[0_24px_80px_rgba(32,20,10,0.10)] md:p-8">
          <p className="mb-5 leading-7 text-[#6f6255]">Bring photos of the proposed location, the existing appliance identification, opening and hearth measurements, and your preferred fuel. We will review project scope, access, required accessories and the next step for a site-specific quote. Call <a className="font-bold text-orange-800 underline" href="tel:4177329775">417-732-9775</a> to confirm service coverage and scheduling for your address.</p>
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#201914]">What to know</h2>
          <ul className="mt-6 grid gap-4">
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">We help evaluate fuel type, venting, dimensions, clearances, and project scope.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">New construction, remodels, replacements, and insert upgrades may require different planning steps.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">Final installation requirements must be verified before purchase and scheduling.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-bold text-orange-800 underline"><Link href="/contact">Request installation help</Link><Link href="/showrooms">Visit the Republic showroom</Link><Link href="/tools/insert-planner">Prepare insert measurements</Link></div>
          <Link href="/design-tool" className="mt-8 inline-flex bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]">Get Help Choosing</Link>
        </div>
      </section>
    </div>
  );
}
