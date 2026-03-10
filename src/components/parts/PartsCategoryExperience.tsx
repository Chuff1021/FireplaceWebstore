"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Search } from "lucide-react";
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
  const [brandQuery, setBrandQuery] = useState("");
  const [partsQuery, setPartsQuery] = useState("");

  if (!isLandingPage && !department) {
    return null;
  }

  const visibleBrands = (isLandingPage
    ? partsDepartments.flatMap((item) => item.brands)
    : (department?.brands ?? [])
  ).filter((brand, index, array) => {
    const alreadySeen = array.findIndex((item) => item.name === brand.name) !== index;
    const matchesQuery =
      brandQuery.trim().length === 0 ||
      brand.name.toLowerCase().includes(brandQuery.trim().toLowerCase());

    return !alreadySeen && matchesQuery;
  });

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
                <div className="px-6 py-7 md:px-8 md:py-8">
                  <div className="mx-auto max-w-[920px] text-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Replacement Parts</p>
                    <h1 className="mt-4 text-[34px] font-semibold leading-tight tracking-[-0.03em] text-[#2f2418] md:text-[44px]">
                      Parts organized like a real service catalog, not a leftover accessories page.
                    </h1>
                    <p className="mt-4 text-base leading-7 text-[#665544]">
                      The new parts division is being built around department browsing, brand directories, and model-specific parts paths so customers can find the exact component they need faster.
                    </p>

                    <div className="mt-8 border border-[#d7cab8] bg-white p-5 text-left shadow-[0_18px_45px_rgba(82,52,23,0.08)]">
                      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                        <label className="block">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">
                            Search Part Number or SKU
                          </span>
                          <div className="mt-3 flex h-14 items-center gap-3 border border-[#ccbba6] bg-[#fcfaf7] px-4">
                            <Search className="h-5 w-5 text-[#8b4513]" />
                            <input
                              value={partsQuery}
                              onChange={(event) => setPartsQuery(event.target.value)}
                              placeholder="Example: 99900405, SRV7000-462, blower kit"
                              className="w-full bg-transparent text-base text-[#2f2418] outline-none placeholder:text-[#8f7a66]"
                            />
                          </div>
                        </label>
                        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
                          <div className="border border-[#dccfbe] bg-[#f8f3ed] px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Products</p>
                            <p className="mt-2 text-2xl font-semibold text-[#2f2418]">
                              {partsCatalogStats.indexedProducts.toLocaleString()}
                            </p>
                          </div>
                          <div className="border border-[#dccfbe] bg-[#f8f3ed] px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Brands</p>
                            <p className="mt-2 text-2xl font-semibold text-[#2f2418]">
                              {partsCatalogStats.indexedBrands}
                            </p>
                          </div>
                          <div className="border border-[#dccfbe] bg-[#f8f3ed] px-4 py-3">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8b4513]">Departments</p>
                            <p className="mt-2 text-2xl font-semibold text-[#2f2418]">
                              {partsCatalogStats.indexedSitemapGroups}
                            </p>
                          </div>
                        </div>
                      </div>

                      {partsQuery.trim() && (
                        <div className="mt-4 rounded-sm border border-[#e3d4c3] bg-[#fbf6f1] px-4 py-3 text-sm text-[#6a5845]">
                          Search wiring is being moved into the live parts catalog next. This query is staged here now so the lookup stays front-and-center instead of buried on the side.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <section className="mt-8 border border-[#d7cab8] bg-[#fbf8f3] px-6 py-6 md:px-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Shop by Brand</p>
                    <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">Find the brand first</h2>
                    <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#665544]">
                      Customers usually know the stove or fireplace brand before they know the exact part. This brand finder keeps that path obvious.
                    </p>
                  </div>
                  <label className="block w-full max-w-[360px]">
                    <span className="sr-only">Search brands</span>
                    <div className="flex h-12 items-center gap-3 border border-[#ccbba6] bg-white px-4">
                      <Search className="h-4 w-4 text-[#8b4513]" />
                      <input
                        value={brandQuery}
                        onChange={(event) => setBrandQuery(event.target.value)}
                        placeholder="Search brands like Harman, Napoleon, Lopi"
                        className="w-full bg-transparent text-sm text-[#2f2418] outline-none placeholder:text-[#8f7a66]"
                      />
                    </div>
                  </label>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visibleBrands.map((brand) => (
                    <div
                      key={brand.name}
                      className="flex min-h-[84px] items-center gap-4 border border-[#ddcfbf] bg-white px-4 py-4"
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe4d7] text-sm font-bold text-[#8b4513]">
                        {toBrandBadge(brand.name)}
                      </div>
                      <div>
                        <p className="text-base font-semibold text-[#2f2418]">{brand.name}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-[#8b4513]">Parts Directory</p>
                      </div>
                    </div>
                  ))}
                </div>

                {visibleBrands.length === 0 && (
                  <div className="mt-4 border border-[#ddcfbf] bg-white px-4 py-4 text-sm text-[#665544]">
                    No brands matched that search. Try a broader manufacturer name.
                  </div>
                )}
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
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#8b4513]">Shop by Brand</p>
                      <h2 className="mt-2 text-3xl font-semibold text-[#2f2418]">Brand directories under this department</h2>
                    </div>
                    <label className="block w-full max-w-[360px]">
                      <span className="sr-only">Search brands</span>
                      <div className="flex h-12 items-center gap-3 border border-[#ccbba6] bg-white px-4">
                        <Search className="h-4 w-4 text-[#8b4513]" />
                        <input
                          value={brandQuery}
                          onChange={(event) => setBrandQuery(event.target.value)}
                          placeholder="Search brands in this department"
                          className="w-full bg-transparent text-sm text-[#2f2418] outline-none placeholder:text-[#8f7a66]"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {visibleBrands.map((brand) => (
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

                  {visibleBrands.length === 0 && (
                    <div className="mt-4 border border-[#ddcfbf] bg-white px-4 py-4 text-sm text-[#665544]">
                      No brands matched that search in this department.
                    </div>
                  )}
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
