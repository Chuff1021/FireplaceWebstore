"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Search } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";
import {
  featuredPartsBrands,
  getPartsDepartmentBySlug,
  partsCatalogStats,
  partsDepartments,
  partsDepartmentSlugs,
  partsPartTypes,
} from "@/lib/parts-taxonomy";
import { type Product } from "@/lib/store-config";

type PartsCategoryExperienceProps = {
  slug: string;
  showHero?: boolean;
};

type BrandLink = {
  name: string;
  href: string;
};

function toBrandBadge(name: string) {
  return name
    .split(/[\s-]+/)
    .map((piece) => piece.slice(0, 1))
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function buildFilterHref(slug: string, brand?: string, partType?: string) {
  const params = new URLSearchParams();

  if (brand) {
    params.set("brand", brand);
  }

  if (partType) {
    params.set("partType", partType);
  }

  const query = params.toString();
  return query ? `/category/${slug}?${query}` : `/category/${slug}`;
}

function matchesPartsQuery(product: Product, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    product.name,
    product.sku,
    product.brand,
    product.shortDescription,
    product.description,
    product.specifications["Part Type"] || "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

export function PartsCategoryExperience({ slug, showHero = true }: PartsCategoryExperienceProps) {
  const searchParams = useSearchParams();
  const department = getPartsDepartmentBySlug(slug);
  const isLandingPage = slug === "parts";
  const activeBrand = searchParams.get("brand") ?? "";
  const activePartType = searchParams.get("partType") ?? "";

  const [brandQuery, setBrandQuery] = useState("");
  const [partsQuery, setPartsQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);

      try {
        const category = isLandingPage ? "parts" : slug;
        const response = await fetch(`/api/products?category=${category}&limit=50000`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as Product[];

        if (!cancelled && Array.isArray(data)) {
          setProducts(data);
        }
      } catch {
        if (!cancelled) {
          setProducts([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProducts(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [isLandingPage, slug]);

  if (!isLandingPage && !department) {
    return null;
  }

  const brandLinks: BrandLink[] = isLandingPage
    ? partsDepartments.flatMap((item) =>
        item.brands.map((brand) => ({
          name: brand.name,
          href: buildFilterHref("parts", brand.name),
        }))
      )
    : (department?.brands ?? []).map((brand) => ({
        name: brand.name,
        href: buildFilterHref(slug, brand.name),
      }));

  const uniqueBrandLinks = brandLinks.filter(
    (brand, index, array) => array.findIndex((entry) => entry.name === brand.name) === index
  );

  const visibleBrands = uniqueBrandLinks.filter(
    (brand) =>
      brandQuery.trim().length === 0 ||
      brand.name.toLowerCase().includes(brandQuery.trim().toLowerCase())
  );

  const filteredProducts = products
    .filter((product) => !activeBrand || product.brand === activeBrand)
    .filter(
      (product) =>
        !activePartType || (product.specifications["Part Type"] || "").toLowerCase() === activePartType.toLowerCase()
    )
    .filter((product) => matchesPartsQuery(product, partsQuery))
    .sort((left, right) => {
      if (left.inStock !== right.inStock) {
        return left.inStock ? -1 : 1;
      }

      return left.name.localeCompare(right.name);
    });

  const productResults = filteredProducts.slice(0, 20);
  const hasActiveFilters = Boolean(activeBrand || activePartType || partsQuery.trim());

  return (
    <div className="min-h-screen bg-[#0b0b0a] text-[#211a15]">
      {showHero && (
        <>
      <div className="border-b border-[#ff7a18]/20 bg-[#11100e]">
        <div className="mx-auto max-w-[1480px] px-4 py-3 md:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#d8c7b2]">
            <Link href="/" className="hover:text-[#ffb36b]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {!isLandingPage && (
              <>
                <Link href="/category/parts" className="hover:text-[#ffb36b]">
                  Parts
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-white">{isLandingPage ? "Parts Department" : department?.name}</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden border-b border-[#ff7a18]/20 bg-[#11100e] px-4 py-14 text-white md:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-[1480px]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Aaron&apos;s Parts Department</p>
          <h1 className="mt-4 max-w-5xl text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">
            {isLandingPage ? "Find the right fireplace part faster." : department?.name}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">
            Search by SKU, brand, or part type. If you are not sure what fits, send us the model number and we will help verify the right replacement part before you order.
          </p>
        </div>
      </section>
        </>
      )}

      <div className="mx-auto grid max-w-[1480px] gap-8 bg-[#f6efe5] px-4 py-8 md:px-6 xl:grid-cols-[290px_minmax(0,1fr)] xl:gap-10">
        <aside className="h-fit border border-[#ff7a18]/25 bg-[#11100e] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Parts Division</p>
            <h2 className="mt-3 text-2xl font-black text-white">
              {isLandingPage ? "Shop by Department" : department?.name}
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#d8c7b2]">
              {isLandingPage
                ? "Search by SKU, browse by brand, or drill down by department to get to the exact replacement part faster."
                : department?.description}
            </p>
          </div>

          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Departments</p>
            <div className="mt-4 space-y-2">
              <Link
                href="/category/parts"
                className={`block border px-3 py-3 text-sm transition ${
                  isLandingPage
                    ? "border-[#ff7a18] bg-[#ff7a18] text-black shadow-[0_14px_34px_rgba(255,122,24,0.22)]"
                    : "border-white/10 bg-white/[0.04] text-[#f3e7d4] hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)]"
                }`}
              >
                All Parts
              </Link>
              {partsDepartments.map((item) => (
                <Link
                  key={item.slug}
                  href={`/category/${item.slug}`}
                  className={`block border px-3 py-3 text-sm transition ${
                    slug === item.slug
                      ? "border-[#ff7a18] bg-[#ff7a18] text-black shadow-[0_14px_34px_rgba(255,122,24,0.22)]"
                      : "border-white/10 bg-white/[0.04] text-[#f3e7d4] hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-b border-white/10 px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Common Part Types</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {partsPartTypes.map((partType) => (
                <Link
                  key={partType}
                  href={buildFilterHref(isLandingPage ? "parts" : slug, activeBrand || undefined, partType)}
                  rel="nofollow"
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                    activePartType === partType
                      ? "border-[#ff7a18] bg-[#ff7a18] text-black shadow-[0_14px_34px_rgba(255,122,24,0.22)]"
                      : "border-white/10 bg-white/[0.04] text-[#f3e7d4] hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)] hover:text-[#ff7a18]"
                  }`}
                >
                  {partType}
                </Link>
              ))}
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Lookup Tips</p>
            <p className="mt-3 text-sm leading-6 text-[#d8c7b2]">
              Try a manufacturer name, exact SKU, or part family like igniter, blower, gasket, or pilot assembly.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="overflow-hidden border border-[#ded5c8] bg-[#fffdf9] shadow-[0_24px_80px_rgba(32,20,10,0.10)]">
            <div className="px-6 py-7 md:px-8 md:py-8">
              <div className="mx-auto max-w-[920px] text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">
                  {isLandingPage ? "Replacement Parts" : "Department Parts"}
                </p>
                <h1 className="mt-4 text-[34px] font-black leading-tight tracking-[-0.03em] text-[#201914] md:text-[44px]">
                  {isLandingPage
                    ? "Search the parts catalog"
                    : `Search ${department?.name}`}
                </h1>
                <p className="mt-4 text-base leading-7 text-[#6f6255]">
                  {isLandingPage
                    ? "Use the search box, department filters, and brand filters to narrow down real replacement parts."
                    : "Use the brand and part-type filters below to narrow this department, then click into matching part pages."}
                </p>

                <div className="mt-8 border border-[#d7cab8] bg-[#fffdf9] p-5 text-left shadow-[0_18px_45px_rgba(82,52,23,0.08)]">
                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <label className="block">
                      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff7a18]">
                        Search Part Number, SKU, or Product Name
                      </span>
                      <div className="mt-3 flex h-14 items-center gap-3 border border-[#ff7a18]/45 bg-[#fffdf9] px-4">
                        <Search className="h-5 w-5 text-[#ff7a18]" />
                        <input
                          value={partsQuery}
                          onChange={(event) => setPartsQuery(event.target.value)}
                          placeholder="Example: 99900405, blower, SRV7034-033"
                          className="w-full bg-transparent text-base text-[#201914] outline-none placeholder:text-[#7a6a5a]"
                        />
                      </div>
                    </label>

                    <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
                      <div className="border border-[#ded5c8] bg-[#fff7ed] px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff7a18]">Products</p>
                        <p className="mt-2 text-2xl font-black text-[#201914]">
                          {partsCatalogStats.indexedProducts.toLocaleString()}
                        </p>
                      </div>
                      <div className="border border-[#ded5c8] bg-[#fff7ed] px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff7a18]">Brands</p>
                        <p className="mt-2 text-2xl font-black text-[#201914]">{partsCatalogStats.indexedBrands}</p>
                      </div>
                      <div className="border border-[#ded5c8] bg-[#fff7ed] px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff7a18]">Showing</p>
                        <p className="mt-2 text-2xl font-black text-[#201914]">{filteredProducts.length.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                      {activeBrand && (
                        <span className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-[#6f6255]">
                          Brand: {activeBrand}
                        </span>
                      )}
                      {activePartType && (
                        <span className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-[#6f6255]">
                          Part Type: {activePartType}
                        </span>
                      )}
                      {partsQuery.trim() && (
                        <span className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-[#6f6255]">
                          Search: {partsQuery.trim()}
                        </span>
                      )}
                      <Link
                        href={isLandingPage ? "/category/parts" : `/category/${slug}`}
                        className="ml-2 text-[#ff7a18] hover:text-[#ff7a18]"
                      >
                        Clear filters
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 border border-[#ded5c8] bg-[#fffdf9] shadow-[0_24px_80px_rgba(32,20,10,0.10)] px-6 py-6 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Shop by Brand</p>
                <h2 className="mt-2 text-3xl font-black text-[#201914]">Click a brand to filter real parts</h2>
              </div>
              <label className="block w-full max-w-[360px]">
                <span className="sr-only">Search brands</span>
                <div className="flex h-12 items-center gap-3 border border-[#ff7a18]/45 bg-[#fffdf9] px-4">
                  <Search className="h-4 w-4 text-[#ff7a18]" />
                  <input
                    value={brandQuery}
                    onChange={(event) => setBrandQuery(event.target.value)}
                    placeholder="Search brands like Harman, Napoleon, Lopi"
                    className="w-full bg-transparent text-sm text-[#201914] outline-none placeholder:text-[#7a6a5a]"
                  />
                </div>
              </label>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleBrands.map((brand) => (
                <Link
                  key={brand.name}
                  href={brand.href}
                  rel="nofollow"
                  className={`flex min-h-[84px] items-center gap-4 border px-4 py-4 transition ${
                    activeBrand === brand.name
                      ? "border-[#ff7a18] bg-[#ff7a18] text-black shadow-[0_14px_34px_rgba(255,122,24,0.22)]"
                      : "border-[#ded5c8] bg-[#fffdf9] hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)]"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      activeBrand === brand.name ? "bg-[#fffdf9] text-[#ff7a18]" : "bg-[#fff7ed] text-[#ff7a18]"
                    }`}
                  >
                    {toBrandBadge(brand.name)}
                  </div>
                  <div>
                    <p className="text-base font-black">{brand.name}</p>
                    <p className={`text-xs uppercase tracking-[0.14em] ${activeBrand === brand.name ? "text-white/80" : "text-[#ff7a18]"}`}>
                      View parts
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {visibleBrands.length === 0 && (
              <div className="mt-4 border border-[#ded5c8] bg-[#fffdf9] px-4 py-4 text-sm text-[#6f6255]">
                No brands matched that search. Try a broader manufacturer name.
              </div>
            )}
          </section>

          {isLandingPage && (
            <section className="mt-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Shop by Department</p>
                  <h2 className="mt-2 text-3xl font-black text-[#201914]">Core parts categories</h2>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {partsDepartments.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/category/${item.slug}`}
                    className="group overflow-hidden border border-[#ded5c8] bg-[#fffdf9] shadow-[0_24px_80px_rgba(32,20,10,0.10)] transition hover:-translate-y-0.5 hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden border-b border-[#ded5c8]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="px-5 py-5">
                      <h3 className="text-xl font-black text-[#201914]">{item.name}</h3>
                      <p className="mt-3 text-sm leading-6 text-[#d8c7b2]">{item.description}</p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#ff7a18]">
                        Browse department
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-8 border border-[#ded5c8] bg-[#fffdf9] shadow-[0_24px_80px_rgba(32,20,10,0.10)] px-6 py-6 md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Parts Results</p>
                <h2 className="mt-2 text-3xl font-black text-[#201914]">
                  {isLandingPage ? "Imported parts ready to browse" : `${department?.name} results`}
                </h2>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="mt-6 border border-[#ded5c8] bg-[#fffdf9] px-4 py-8 text-center text-sm text-[#6f6255]">
                Loading parts...
              </div>
            ) : productResults.length === 0 ? (
              <div className="mt-6 border border-[#ded5c8] bg-[#fffdf9] px-4 py-8 text-center text-sm text-[#6f6255]">
                No parts matched the current filters yet.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {productResults.map((product) => {
                  const image = resolveProductImage(product.images[0], product.images);
                  const livePrice = product.salePrice ?? product.price;
                  const partType = product.specifications["Part Type"] || "Replacement Part";

                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group overflow-hidden border border-[#ded5c8] bg-[#fffdf9] transition hover:-translate-y-1 hover:border-[#ff7a18] hover:shadow-[0_28px_70px_rgba(32,20,10,0.14)]"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#ded5c8] bg-[#f2eee7]">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="px-4 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff7a18]">
                          {product.brand} | {partType}
                        </p>
                        <h3 className="mt-2 line-clamp-3 min-h-[72px] text-base font-black leading-6 text-[#201914]">
                          {product.name}
                        </h3>
                        <p className="mt-2 text-sm text-[#6f6255]">SKU: {product.sku}</p>
                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xl font-black text-[#201914]">{formatPrice(livePrice)}</p>
                            {product.salePrice && product.price > product.salePrice && (
                              <p className="text-sm text-[#8a7b6b] line-through">{formatPrice(product.price)}</p>
                            )}
                          </div>
                          <span className="text-sm font-medium text-[#ff7a18]">View Part</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {isLandingPage && (
            <section className="mt-8 border border-[#ded5c8] bg-[#fffdf9] shadow-[0_24px_80px_rgba(32,20,10,0.10)] px-6 py-6 md:px-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#ff7a18]">Featured Brands</p>
                  <h2 className="mt-2 text-3xl font-black text-[#201914]">Major parts brands</h2>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {featuredPartsBrands.map((brand) => (
                  <Link
                    key={brand}
                    href={buildFilterHref("parts", brand)}
                    rel="nofollow"
                    className="flex min-h-[84px] items-center gap-4 border border-[#ded5c8] bg-[#fffdf9] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[#ff7a18] hover:shadow-[0_18px_45px_rgba(255,122,24,0.12)]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fff7ed] text-sm font-bold text-[#ff7a18]">
                      {toBrandBadge(brand)}
                    </div>
                    <div>
                      <p className="text-base font-black text-[#201914]">{brand}</p>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#ff7a18]">View parts</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export function isPartsCategorySlug(slug: string) {
  return slug === "parts" || partsDepartmentSlugs.has(slug);
}
