"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";
import { featuredPartsBrands, getPartsDepartmentBySlug, partsDepartments, partsDepartmentSlugs } from "@/lib/parts-taxonomy";
import type { PartsCatalogResponse } from "@/lib/parts-catalog";

const selectClass = "mt-2 h-12 w-full min-w-0 rounded-lg border border-[#d7cab8] bg-white px-3 text-base text-[#201914]";
const labelClass = "block min-w-0 text-sm font-semibold text-[#201914]";
const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

function PartsSearchForm({ initialQuery, onSearch }: { initialQuery: string; onSearch: (query: string) => void }) {
  const [query, setQuery] = useState(initialQuery);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query.trim());
  }
  return (
    <form onSubmit={submit} role="search">
      <label htmlFor="parts-search" className={labelClass}>Part number, model, or keyword</label>
      <div className="mt-2 flex gap-2">
        <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-lg border border-[#d7cab8] bg-white px-3">
          <Search className="h-5 w-5 shrink-0 text-[#a54210]" aria-hidden="true" />
          <input id="parts-search" type="search" value={query} onChange={event => setQuery(event.target.value)}
            placeholder="e.g. SRV7034-033 or igniter" maxLength={200}
            className="h-full min-w-0 w-full bg-transparent text-base text-[#201914] outline-none" />
        </div>
        <button type="submit" className="min-h-12 shrink-0 rounded-lg bg-[#a54210] px-4 font-bold text-white hover:bg-[#80320b]">Search</button>
      </div>
    </form>
  );
}

export function PartsCategoryExperience({ slug }: { slug: string }) {
  const searchParams = useSearchParams();
  const department = getPartsDepartmentBySlug(slug);
  const activeBrand = searchParams.get("brand") || "";
  const activePartType = searchParams.get("partType") || "";
  const activeQuery = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "name";
  const requestedPage = searchParams.get("page") || "1";
  const apiParams = new URLSearchParams({ category: slug, pageSize: "20", page: requestedPage, sort });
  if (activeBrand) apiParams.set("brand", activeBrand);
  if (activePartType) apiParams.set("partType", activePartType);
  if (activeQuery) apiParams.set("q", activeQuery);
  const requestKey = apiParams.toString();
  const resultsRef = useRef<HTMLElement>(null);
  const [catalog, setCatalog] = useState<{ key: string; data: PartsCatalogResponse } | null>(null);
  const [failure, setFailure] = useState<{ key: string; message: string } | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadParts() {
      try {
        const response = await fetch(`/api/parts?${requestKey}`, { signal: controller.signal });
        if (!response.ok) throw new Error("We couldn’t load the parts catalog. Please try again.");
        const data: PartsCatalogResponse = await response.json();
        if (!controller.signal.aborted) {
          setCatalog({ key: requestKey, data });
          setFailure(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setFailure({ key: requestKey, message: error instanceof Error ? error.message : "Unable to load parts." });
        }
      }
    }
    void loadParts();
    return () => controller.abort();
  }, [requestKey, retry]);

  function updateFilters(changes: Record<string, string>, nextSlug = slug) {
    const params = new URLSearchParams(window.location.search);
    params.delete("page");
    for (const [field, value] of Object.entries(changes)) {
      if (value) params.set(field, value); else params.delete(field);
    }
    const query = params.toString();
    const href = `/category/${nextSlug}${query ? `?${query}` : ""}`;
    // Query filters only need the parts API, not a second page-navigation request.
    if (nextSlug === slug) window.history.pushState(null, "", href);
    else window.location.assign(href);
  }

  function changePage(page: number) {
    updateFilters({ page: String(page) });
    resultsRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }

  if (slug !== "parts" && !department) return null;
  const data = catalog?.key === requestKey ? catalog.data : null;
  const error = failure?.key === requestKey ? failure.message : null;
  const loading = !data && !error;
  const available = catalog?.data.facets;
  const brands = available?.brands ?? [];
  const types = available?.partTypes ?? [];
  const departmentCounts = new Map(available?.departments.map(item => [item.name, item.count]));
  const quickBrands = featuredPartsBrands.filter(brand => brands.some(item => item.name === brand)).slice(0, 6);
  const hasFilters = Boolean(activeBrand || activePartType || activeQuery);
  const firstResult = data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const lastResult = data ? Math.min(data.page * data.pageSize, data.total) : 0;

  return (
    <div className="min-h-screen bg-[#f6efe5] text-[#201914]">
      <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-6 md:py-8">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#6f6255]">
          <Link href="/" className="hover:text-[#a54210]">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" />
          {department && <><Link href="/category/parts">Parts</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /></>}
          <span>{department?.name || "Parts Department"}</span>
        </nav>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{department?.name || "Find replacement parts"}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6f6255]">Search by part number or choose your manufacturer. Check your appliance model to confirm the right fit.</p>

        <section aria-label="Search and filter parts" className="mt-5 rounded-xl border border-[#ded5c8] bg-[#fffdf9] p-4 md:p-6">
          <PartsSearchForm key={activeQuery} initialQuery={activeQuery} onSearch={q => updateFilters({ q })} />
          <div className="mt-5 grid min-w-0 gap-4 md:grid-cols-3">
            <div className="min-w-0">
              <label htmlFor="parts-manufacturer" className={labelClass}>Manufacturer</label>
              <select id="parts-manufacturer" value={activeBrand} onChange={event => updateFilters({ brand: event.target.value, partType: "" })} className={selectClass}>
                <option value="">All manufacturers</option>
                {activeBrand && !brands.some(item => item.name === activeBrand) && <option value={activeBrand}>{activeBrand}</option>}
                {brands.map(item => <option key={item.name} value={item.name}>{item.name} ({item.count.toLocaleString()})</option>)}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="parts-department" className={labelClass}>Appliance / department</label>
              <select id="parts-department" value={slug} onChange={event => updateFilters({ brand: "", partType: "" }, event.target.value)} className={selectClass}>
                <option value="parts">All parts</option>
                {partsDepartments.filter(item => !available || departmentCounts.has(item.slug) || item.slug === slug).map(item =>
                  <option key={item.slug} value={item.slug}>{item.name}</option>
                )}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor="parts-type" className={labelClass}>Part type</label>
              <select id="parts-type" value={activePartType} onChange={event => updateFilters({ partType: event.target.value })} className={selectClass}>
                <option value="">All part types</option>
                {activePartType && !types.some(item => item.name === activePartType) && <option value={activePartType}>{activePartType}</option>}
                {types.map(item => <option key={item.name} value={item.name}>{item.name} ({item.count.toLocaleString()})</option>)}
              </select>
            </div>
          </div>
          {!activeBrand && quickBrands.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Popular manufacturers">
              <span className="text-sm text-[#6f6255]">Popular:</span>
              {quickBrands.map(brand => <button key={brand} type="button" onClick={() => updateFilters({ brand, partType: "" })}
                className="min-h-11 rounded-lg border border-[#d7cab8] px-3 text-sm font-semibold hover:border-[#a54210] hover:text-[#a54210]">{brand}</button>)}
            </div>
          )}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-2" aria-label="Selected filters">
              {[["brand", activeBrand], ["partType", activePartType], ["q", activeQuery]].filter(([, value]) => value).map(([field, value]) => (
                <button key={field} type="button" onClick={() => updateFilters({ [field]: "", ...(field === "brand" ? { partType: "" } : {}) })}
                  className="flex min-h-11 max-w-full items-center gap-2 rounded-lg bg-[#fff0df] px-3 text-left text-sm text-[#80320b]" aria-label={`Remove ${value} filter`}>
                  <span className="break-words">{value}</span><X className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              ))}
              <button type="button" onClick={() => updateFilters({ brand: "", partType: "", q: "" })} className="min-h-11 px-2 text-sm font-semibold text-[#a54210] underline">Clear filters</button>
            </div>
          )}
        </section>

        <section ref={resultsRef} id="parts-results" aria-label="Matching parts" aria-busy={loading} className="mt-6 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-black md:text-2xl">{activeBrand ? `${activeBrand} parts` : "Parts catalog"}</h2>
              <p className="mt-1 text-sm text-[#6f6255]" role="status" aria-live="polite">
                {loading ? "Loading matching parts…" : data ? `Showing ${firstResult.toLocaleString()}–${lastResult.toLocaleString()} of ${data.total.toLocaleString()} parts` : "Parts could not be loaded"}
              </p>
            </div>
            <div className="text-sm font-medium">
              <label htmlFor="parts-sort">Sort by</label>
              <select id="parts-sort" value={sort} onChange={event => updateFilters({ sort: event.target.value })} className="ml-2 h-11 max-w-full rounded-lg border border-[#d7cab8] bg-white px-2 text-base">
                <option value="name">Name: A–Z</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option>
              </select>
            </div>
          </div>
          {loading ? <div className="mt-4 rounded-xl border border-[#ded5c8] bg-white p-8 text-center text-[#6f6255]">Loading parts…</div>
            : error ? <div role="alert" className="mt-4 rounded-xl border border-[#ded5c8] bg-white p-6"><p>{error}</p>
              <button type="button" onClick={() => { setFailure(null); setRetry(value => value + 1); }} className="mt-3 min-h-11 rounded-lg bg-[#a54210] px-4 font-bold text-white">Try again</button></div>
            : data?.products.length === 0 ? <div className="mt-4 rounded-xl border border-[#ded5c8] bg-white p-6">
              <h3 className="font-bold">No matching parts</h3><p className="mt-2 text-sm leading-6 text-[#6f6255]">Try another part number or clear a filter. Need help identifying a part? <Link href="/contact" className="font-semibold text-[#a54210] underline">Send us your appliance model.</Link></p>
              <button type="button" onClick={() => updateFilters({ brand: "", partType: "", q: "" }, "parts")} className="mt-3 min-h-11 rounded-lg border border-[#d7cab8] px-4 font-semibold">Browse all parts</button>
            </div> : <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data?.products.map(product => (
                <Link key={product.id} href={`/product/${product.slug}`} className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] overflow-hidden rounded-xl border border-[#ded5c8] bg-white hover:border-[#a54210] sm:block">
                  <div className="relative min-h-[120px] bg-[#f2eee7] sm:aspect-[4/3] sm:min-h-0">
                    <Image src={resolveProductImage(product.images[0], product.images)} alt={product.name} fill sizes="(max-width: 639px) 88px, (max-width: 1023px) 45vw, 25vw" className="object-contain p-2 sm:p-4" />
                  </div>
                  <div className="min-w-0 p-3 sm:p-4">
                    <p className="text-xs font-semibold text-[#a54210]">{product.brand}</p>
                    <h3 className="mt-1 break-words text-sm font-bold leading-5 sm:text-base">{product.name}</h3>
                    <p className="mt-2 break-all text-xs text-[#6f6255]">Part #: {product.sku}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-lg font-black">{priceFormatter.format(product.salePrice ?? product.price)}</span>
                      <span className="text-sm font-semibold text-[#a54210]">View part →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>}
          {data && data.totalPages > 1 && <nav aria-label="Parts pages" className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button type="button" disabled={data.page === 1} onClick={() => changePage(data.page - 1)} className="flex min-h-12 items-center gap-1 rounded-lg border border-[#d7cab8] bg-white px-3 font-semibold disabled:opacity-40"><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
            <span className="text-sm">Page {data.page.toLocaleString()} of {data.totalPages.toLocaleString()}</span>
            <button type="button" disabled={data.page >= data.totalPages} onClick={() => changePage(data.page + 1)} className="flex min-h-12 items-center gap-1 rounded-lg border border-[#d7cab8] bg-white px-3 font-semibold disabled:opacity-40">Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
          </nav>}
        </section>
        <p className="mt-8 text-sm leading-6 text-[#6f6255]">Not sure which part fits? <Link href="/contact" className="font-semibold text-[#a54210] underline">Contact us with the model and serial number.</Link></p>
      </div>
    </div>
  );
}

export function isPartsCategorySlug(slug: string) {
  return slug === "parts" || partsDepartmentSlugs.has(slug);
}
