import { seoMetadata } from "@/lib/seo-metadata";
import Link from "next/link";

export const metadata = seoMetadata({
  title: 'Fireplace Installation Planning',
  description: "Plan a fireplace, insert, stove, venting, or remodel project with expert sizing and installation guidance from Aaron's Fireplace Co.",
  path: "/installation",
});

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f6efe5]">
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Fireplace planning</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">Professional Installation</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">Fireplaces, inserts, stoves, venting, gas lines, clearances, and code requirements need expert review. Aaron’s Fireplace Co. can help plan the right product and installation path for your home or project.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="border border-[#ded5c8] bg-[#fffdf9] p-6 shadow-[0_24px_80px_rgba(32,20,10,0.10)] md:p-8">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#201914]">What to know</h2>
          <ul className="mt-6 grid gap-4">
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">We help evaluate fuel type, venting, dimensions, clearances, and project scope.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">New construction, remodels, replacements, and insert upgrades may require different planning steps.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">Final installation requirements must be verified before purchase and scheduling.</li>
          </ul>
          <Link href="/design-tool" className="mt-8 inline-flex bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]">Get Help Choosing</Link>
        </div>
      </section>
    </main>
  );
}
