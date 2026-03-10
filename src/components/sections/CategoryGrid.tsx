import Link from "next/link";
import Image from "next/image";
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
    <section className="border-t border-[#e5e0d8] bg-[#f7f3ec] py-14 md:py-16">
      <div className="mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#d9d2c6] pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a54210]">
              Shop By Category
            </p>
            <h2 className="mt-3 text-[30px] font-normal tracking-[-0.03em] text-[#1f1f1f] md:text-[38px]">
              Browse the main hearth categories without hunting through the menu.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#5f605c] md:text-[15px]">
            Start with the department that fits the space, then drill into fuel type, inserts, or freestanding stoves.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {productCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group overflow-hidden border border-[#d9d2c6] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#c46b33] hover:shadow-[0_18px_45px_rgba(52,32,16,0.08)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#efe6da]">
                <Image
                  src={categoryVisuals[category.id] ?? category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2d170d]/40 via-transparent to-transparent" />
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-5">
                <div>
                  <h3 className="text-base font-semibold text-[#1f1f1f] transition-colors group-hover:text-[#a54210]">
                    {category.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#6d6d68] md:text-[13px]">
                    {category.description}
                  </p>
                </div>
                <span className="shrink-0 text-xl text-[#a54210] transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-7 border border-[#d9d2c6] bg-white px-4 py-5 md:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#a54210]">
                Popular Paths
              </p>
              <p className="mt-2 text-sm text-[#5f605c]">
                Jump straight into the categories customers shop most often.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {featuredCategoryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-[#cfc6b8] px-4 py-2 text-sm font-medium text-[#383734] transition-colors hover:border-[#c46b33] hover:text-[#a54210]"
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
