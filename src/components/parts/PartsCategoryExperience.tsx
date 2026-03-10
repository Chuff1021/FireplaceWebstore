"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ExternalLink, Search } from "lucide-react";
import {
  featuredPartsBrands,
  getPartsDepartmentBySlug,
  partsCatalogStats,
  partsDepartments,
  partsDepartmentSlugs,
  partsPartTypes,
} from "@/lib/parts-taxonomy";

type PartsCategoryExperienceProps = {
  slug: string;
};

function toBrandBadge(name: string) {
  return name
    .split(/[\s-]+/)
    .map((piece) => piece.slice(0, 1))
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function PartsCategoryExperience({ slug }: PartsCategoryExperienceProps) {
  const department = getPartsDepartmentBySlug(slug);
  const isLandingPage = slug === "parts";

  if (!isLandingPage && !department) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#2f2418]">
      <div className="border-b border-[#d6c9b8] bg-[#f8f4ee]">
        <div className="mx-auto max-w-[1480px] px-4 py-3 md:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#7d6751]">
            <Link href="/" className="hover:text-[#8b4513]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {!isLandingPage && (
              <>
                <Link href="/category/parts" className="hover:text-[#8b4513]">
                  Parts
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-[#2f2418]">{isLandingPage ? "Parts Department" : department?.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-8 md:px-6 xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-10">
        <aside className="h-fit border border-[#d7cab8] bg-[#fbf8f3]">
          <div className="border-b border-[#d7cab8] px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Parts Division</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#2f2418]">
              {isLandingPage ? "Shop by Department" : department?.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#6a5845]">
              {isLandingPage
                ? "A dedicated parts storefront built around model-specific replacement components, brand directories, and repair-focused navigation."
                : department?.description}
            </p>
          </div>

          <div className="border-b border-[#d7cab8] px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Departments</p>
            <div className="mt-4 space-y-2">
              {partsDepartments.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className={`block border px-3 py-3 text-sm transition ${
                    slug === item.slug
                      ? "border-[#8b4513] bg-[#8b4513] text-white"
                      : "border-[#ddcfbf] bg-white text-[#2f2418] hover:border-[#8b4513]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-b border-[#d7cab8] px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Common Part Types</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {partsPartTypes.map((partType) => (
                <span
                  key={partType}
                  className="rounded-full border border-[#dccfbe] bg-white px-3 py-1.5 text-xs font-medium text-[#5f4b39]"
                >
                  {partType}
                </span>
              ))}
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Data Source</p>
            <p className="mt-3 text-sm leading-6 text-[#6a5845]">
              Taxonomy and public catalog discovery are being built from Stove Parts Unlimited. Layout direction is modeled after Energy Parts Plus.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {isLandingPage ? (
            <>
              <section className="overflow-hidden border border-[#d7cab8] bg-[#fbf8f3]">
                <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_370px]">
                  <div className="px-6 py-7 md:px-8 md:py-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Replacement Parts</p>
                    <h1 className="mt-4 max-w-[760px] text-[34px] font-semibold leading-tight tracking-[-0.03em] text-[#2f2418] md:text-[44px]">
                      Parts organized like a real service catalog, not a leftover accessories page.
                    </h1>
                    <p className="mt-4 max-w-[760px] text-base leading-7 text-[#665544]">
                      The new parts division is being built around department browsing, brand directories, and model-specific parts paths so customers can find the exact component they need faster.
                    </p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                      <div className="border border-[#dccfbe] bg-white px-4 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Products Found</p>
                        <p className="mt-3 text-3xl font-semibold text-[#2f2418]">
                          {partsCatalogStats.indexedProducts.toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-[#dccfbe] bg-white px-4 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Brands Found</p>
                        <p className="mt-3 text-3xl font-semibold text-[#2f2418]">
                          {partsCatalogStats.indexedBrands}
                        </p>
                      </div>
                      <div className="border border-[#dccfbe] bg-white px-4 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Core Departments</p>
                        <p className="mt-3 text-3xl font-semibold text-[#2f2418]">
                          {partsCatalogStats.indexedSitemapGroups}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#d7cab8] bg-[#efe4d7] lg:border-l lg:border-t-0">
                    <div className="flex h-full flex-col justify-between px-6 py-7 md:px-8 md:py-8">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Search First</p>
                        <h2 className="mt-4 text-2xl font-semibold text-[#2f2418]">Model, SKU, or brand based parts lookup</h2>
                        <p className="mt-4 text-sm leading-6 text-[#665544]">
                          The long-term goal is a full internal parts database. This first phase establishes the department and brand navigation so the rest of the import has the right structure to land on.
                        </p>
                      </div>

                      <div className="mt-8 flex items-center gap-3 border border-[#d0bba3] bg-white px-4 py-3 text-sm text-[#6a5845]">
                        <Search className="h-4 w-4 text-[#8b4513]" />
                        Search by model number, part type, or exact SKU
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Shop by Department</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">Core parts categories</h2>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {partsDepartments.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/category/${item.slug}`}
                      className="group overflow-hidden border border-[#d7cab8] bg-[#fbf8f3] transition hover:-translate-y-0.5 hover:border-[#8b4513]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#d7cab8]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="px-5 py-5">
                        <h3 className="text-xl font-semibold text-[#2f2418]">{item.name}</h3>
                        <p className="mt-3 text-sm leading-6 text-[#665544]">{item.description}</p>
                        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#8b4513]">
                          {item.brands.length} featured brand paths
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="mt-8 border border-[#d7cab8] bg-[#fbf8f3] px-6 py-6 md:px-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Featured Brands</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">Major parts brands</h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {featuredPartsBrands.map((brand) => (
                    <div
                      key={brand}
                      className="flex min-h-[84px] items-center gap-4 border border-[#ddcfbf] bg-white px-4 py-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe4d7] text-sm font-bold text-[#8b4513]">
                        {toBrandBadge(brand)}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#2f2418]">{brand}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#8b4513]">Parts Directory</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          ) : (
            department && (
              <>
                <section className="overflow-hidden border border-[#d7cab8] bg-[#fbf8f3]">
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="px-6 py-7 md:px-8 md:py-8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Department</p>
                      <h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.03em] text-[#2f2418] md:text-[44px]">
                        {department.name}
                      </h1>
                      <p className="mt-4 max-w-[760px] text-base leading-7 text-[#665544]">{department.description}</p>
                      <div className="mt-8 flex flex-wrap gap-2">
                        {partsPartTypes.map((partType) => (
                          <span
                            key={partType}
                            className="rounded-full border border-[#dccfbe] bg-white px-3 py-1.5 text-xs font-medium text-[#5f4b39]"
                          >
                            {partType}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="relative min-h-[280px] border-t border-[#d7cab8] lg:border-l lg:border-t-0">
                      <Image src={department.image} alt={department.name} fill className="object-cover" />
                    </div>
                  </div>
                </section>

                <section className="mt-8 border border-[#d7cab8] bg-[#fbf8f3] px-6 py-6 md:px-8">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Shop by Brand</p>
                      <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">Brand directories under this department</h2>
                    </div>
                    <a
                      href={department.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden items-center gap-2 text-sm font-medium text-[#8b4513] hover:text-[#6f370f] md:flex"
                    >
                      Source reference
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {department.brands.map((brand) => (
                      <div key={brand.name} className="border border-[#ddcfbf] bg-white px-5 py-5">
                        <div className="flex items-start gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe4d7] text-sm font-bold text-[#8b4513]">
                            {toBrandBadge(brand.name)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-lg font-semibold text-[#2f2418]">{brand.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-[#665544]">
                              Model-specific diagrams, replacement parts, and service components for this brand.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="border border-[#d7cab8] bg-[#fbf8f3] px-6 py-6 md:px-8">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Build Direction</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">What comes next in this department</h2>
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="border border-[#ddcfbf] bg-white px-4 py-4">
                        <p className="text-sm font-semibold text-[#2f2418]">Full product import</p>
                        <p className="mt-2 text-sm leading-6 text-[#665544]">
                          Pull every public product page from the Stove Parts Unlimited product sitemap and normalize the part fields into your catalog.
                        </p>
                      </div>
                      <div className="border border-[#ddcfbf] bg-white px-4 py-4">
                        <p className="text-sm font-semibold text-[#2f2418]">Model-page navigation</p>
                        <p className="mt-2 text-sm leading-6 text-[#665544]">
                          Add brand and model landing pages so customers can drill down the same way they do on the source catalog.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-[#d7cab8] bg-[#efe4d7] px-6 py-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Status</p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#2f2418]">Phase one is structure.</h2>
                    <p className="mt-4 text-sm leading-6 text-[#665544]">
                      This department page is now ready for the deeper brand, model, and product import instead of routing users into the old generic accessories flow.
                    </p>
                  </div>
                </section>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export function isPartsCategorySlug(slug: string) {
  return slug === "parts" || partsDepartmentSlugs.has(slug);
}
