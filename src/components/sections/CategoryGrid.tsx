import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame } from "lucide-react";
import { productCategories } from "@/lib/store-config";

const featuredCategoryLinks = [
  { label: "Gas Fireplaces", href: "/category/gas-fireplaces" },
  { label: "Electric Fireplaces", href: "/category/electric-fireplaces" },
  { label: "Wood Fireplaces", href: "/category/wood-fireplaces" },
  { label: "Gas Inserts", href: "/category/gas-inserts" },
  { label: "Wood Stoves", href: "/category/wood-stoves" },
  { label: "Pellet Stoves", href: "/category/pellet-stoves" },
];

const categoryVisuals: Record<string, string> = {
  fireplaces: "/products/electric-fireplaces/ama-60-tru-view-xl-eba8bac5.webp",
  inserts: "/products/gas-inserts/maj-ruby35in-9a1628a9.webp",
  stoves: "/products/wood-stoves/osb-ob03500-bba28a5a.webp",
  outdoor: "/categories/home-outdoor.webp",
  accessories: "/categories/home-accessories.webp",
  parts: "/categories/home-parts.webp",
};

export function CategoryGrid() {
  return (
    <section className="relative overflow-hidden border-t border-[#ff7a18]/20 bg-[#17120e] py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(255,122,24,0.18),transparent_30%),radial-gradient(circle_at_88%_28%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,#1f1711_0%,#241a13_52%,#120f0c_100%)]" />
      <div className="absolute left-1/2 top-0 h-px w-[84%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#ff7a18]/70 to-transparent" />

      <div className="relative mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-10 grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[0.95fr_0.55fr] lg:items-end">
          <div className="max-w-4xl">
            <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#ff9a3d]">
              <Flame className="h-4 w-4 fill-[#ff7a18] text-[#ff7a18]" />
              Shop By Category
            </p>
            <h2 className="mt-4 text-[38px] font-black leading-[0.98] tracking-[-0.055em] text-white md:text-[58px]">
              Shop fireplaces, stoves, inserts, and parts.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#d8c7b2]">
            Find the right hearth product faster — from complete fireplace systems to inserts, freestanding stoves, outdoor fire features, accessories, and replacement parts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {productCategories.map((category, index) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group relative min-h-[330px] overflow-hidden border border-white/14 bg-white/[0.075] shadow-[0_24px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7a18]/70 hover:bg-white/[0.12] hover:shadow-[0_30px_90px_rgba(255,122,24,0.16)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-transparent to-[#ff7a18]/10 opacity-60" />
              <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#ff7a18]/20 blur-3xl transition group-hover:bg-[#ff7a18]/35" />

              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#17120e]">
                <Image
                  src={categoryVisuals[category.id] ?? category.image}
                  alt={category.name}
                  fill
                  className="object-cover opacity-88 saturate-[0.92] transition duration-500 group-hover:scale-105 group-hover:opacity-100 group-hover:saturate-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070606] via-[#070606]/25 to-transparent" />
                <div className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#ffb36b] backdrop-blur-md">
                  0{index + 1}
                </div>
              </div>

              <div className="relative flex min-h-[150px] flex-col px-5 py-5">
                <h3 className="text-xl font-black tracking-[-0.035em] text-white transition-colors group-hover:text-[#ffb36b]">
                  {category.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#cfc0ad]">
                  {category.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-5 text-sm font-black uppercase tracking-[0.12em] text-[#ff8a24]">
                  <span>Shop now</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 border border-white/12 bg-white/[0.055] px-5 py-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff9a3d]">
                Popular Paths
              </p>
              <p className="mt-2 text-sm text-[#d8c7b2]">
                Popular fireplace categories and fuel types for faster shopping.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {featuredCategoryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/15 bg-black/25 px-4 py-2 text-sm font-bold text-[#f3e7d4] backdrop-blur-md transition hover:border-[#ff7a18] hover:bg-[#ff7a18] hover:text-black"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
