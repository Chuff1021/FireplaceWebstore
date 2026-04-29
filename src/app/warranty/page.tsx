import { seoMetadata } from "@/lib/seo-metadata";
import Link from "next/link";

export const metadata = seoMetadata({
  title: 'Fireplace Warranty Support',
  description: 'Warranty support guidance for fireplaces, inserts, stoves, parts, model numbers, serial numbers, installation details, and manufacturer claims.',
  path: "/warranty",
});

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f6efe5]">
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Product support</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">Warranty Information</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">Warranty coverage depends on the manufacturer, model, installation, and part type. Aaron’s Fireplace Co. helps customers identify warranty paths and gather the information manufacturers typically require.</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="border border-[#ded5c8] bg-[#fffdf9] p-6 shadow-[0_24px_80px_rgba(32,20,10,0.10)] md:p-8">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#201914]">What to know</h2>
          <ul className="mt-6 grid gap-4">
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">Keep model number, serial number, proof of purchase, and installation details available.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">Labor, diagnostics, shipping, and wear items may be handled differently than product defects.</li>
            <li className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-4 text-[#6f6255]">For service parts, compatibility and installation conditions matter before a warranty decision can be made.</li>
          </ul>
          <Link href="/contact" className="mt-8 inline-flex bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]">Request Help</Link>
        </div>
      </section>
    </main>
  );
}
