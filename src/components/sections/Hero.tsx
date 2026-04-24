import Link from "next/link";
import Image from "next/image";
import { Flame, Search, ShieldCheck, Truck, Wrench } from "lucide-react";
import { defaultStoreConfig } from "@/lib/store-config";

const trustItems = [
  { icon: ShieldCheck, label: "Established 1989" },
  { icon: Wrench, label: "Fireplace expertise" },
  { icon: Truck, label: "Nationwide parts access" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0b0a] text-white">
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-fireplace.jpg"
          alt="Premium fireplace showroom living space"
          fill
          className="object-cover opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(255,122,24,0.28),transparent_34%),linear-gradient(90deg,#050505_0%,rgba(5,5,5,0.92)_33%,rgba(5,5,5,0.58)_67%,rgba(5,5,5,0.30)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[690px] max-w-[1640px] items-center gap-12 px-4 py-16 md:px-5 lg:grid-cols-[1.02fr_0.78fr] lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-7 inline-flex items-center gap-3 border border-[#ff7a18]/40 bg-black/45 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#ffb36b] backdrop-blur">
            <Flame className="h-4 w-4 fill-[#ff7a18] text-[#ff7a18]" />
            Aaron&apos;s Fireplace Co. · Est. 1989
          </div>

          <h1 className="max-w-4xl text-[38px] font-black leading-[1.08] tracking-[-0.035em] text-white md:text-[54px] xl:text-[66px]">
            Discover the Fireplace Your Home Deserves
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f3e7d4] md:text-xl">
            Shop fireplaces, inserts, stoves, and hard-to-find parts with expert guidance from a real fireplace company — not a generic big-box catalog.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/category/fireplaces"
              className="inline-flex items-center justify-center bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
            >
              Shop Fireplaces
            </Link>
            <Link
              href="/category/parts"
              className="inline-flex items-center justify-center border border-white/30 bg-white/10 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white backdrop-blur transition hover:border-[#ff7a18] hover:text-[#ffb36b]"
            >
              Find Parts
            </Link>
            <Link
              href="/design-tool"
              className="inline-flex items-center justify-center border border-[#ff7a18]/50 bg-black/35 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#ffb36b] backdrop-blur transition hover:bg-[#ff7a18] hover:text-black"
            >
              Get Help Choosing
            </Link>
          </div>

          <form action="/search" method="GET" className="mt-9 max-w-2xl border border-white/15 bg-white p-2 shadow-2xl shadow-black/40">
            <div className="flex h-14 items-center">
              <Search className="ml-4 h-5 w-5 text-[#7a5a42]" />
              <input
                name="q"
                placeholder="Search by brand, model, SKU, or part number"
                className="h-full min-w-0 flex-1 px-4 text-base text-[#211a15] outline-none"
              />
              <button className="h-full bg-[#17110d] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#ff7a18] hover:text-black">
                Search
              </button>
            </div>
          </form>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 border border-white/10 bg-black/30 px-4 py-3 text-sm text-[#f5e7d2] backdrop-blur">
                <Icon className="h-5 w-5 text-[#ff7a18]" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="ml-auto max-w-[500px] border border-[#ff7a18]/35 bg-black/55 p-6 shadow-2xl shadow-black/50 backdrop-blur">
            <Image
              src="/logo.png"
              alt={defaultStoreConfig.storeName}
              width={1100}
              height={1016}
              className="mx-auto h-auto w-full"
              priority
            />
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm uppercase tracking-[0.22em] text-[#ffb36b]">Intake engine</p>
              <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-white">Fireplaces. Parts. Expert help.</p>
              <p className="mt-3 text-sm leading-6 text-[#d9cbb9]">
                A more premium storefront built around trust, clear product discovery, and high-quality manufacturer imagery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
