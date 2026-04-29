"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";
import type { Product } from "@/lib/store-config";

const FEATURED_FILTER_BRANDS = ["Lopi", "Fireplace Xtrordinair", "Fire Garden"];
const FUEL_TYPE_ORDER = ["Gas", "Wood", "Electric", "Pellet", "Outdoor", "Other"];

const MIRRORED_CATEGORY_SLUGS = new Set([
  "fireplaces",
  "inserts",
  "stoves",
  "outdoor",
  "gas-fireplaces",
  "electric-fireplaces",
  "wood-fireplaces",
  "outdoor-fireplaces",
  "gas-inserts",
  "wood-inserts",
  "pellet-inserts",
  "electric-inserts",
  "wood-stoves",
  "pellet-stoves",
  "gas-stoves",
  "accessories",
  "mantels",
  "remotes-controls",
  "doors-screens",
  "logs-media",
]);

const PRODUCTS_PER_PAGE = 24;
const MIRRORED_PRODUCTS_PER_PAGE = 20;

function formatPagePrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function getPriceBucket(price: number) {
  if (price <= 0) return "Contact for Pricing";
  if (price < 1500) return "Under $1,500";
  if (price < 3000) return "$1,500 - $2,999";
  if (price < 5000) return "$3,000 - $4,999";
  return "$5,000+";
}

function getFuelType(product: Product) {
  const source = `${product.name} ${product.categoryId} ${product.subcategoryId ?? ""}`.toLowerCase();
  if (source.includes("electric")) return "Electric";
  if (source.includes("pellet")) return "Pellet";
  if (source.includes("wood")) return "Wood";
  if (source.includes("outdoor") || source.includes("fire garden")) return "Outdoor";
  if (source.includes("gas") || source.includes("lopi") || source.includes("fireplace xtrordinair") || source.includes("fpx")) return "Gas";
  return "Other";
}

function getProductHref(product: Product) {
  const isContactForPricing = product.contactForPricing || product.price <= 0;
  return isContactForPricing
    ? "/contact"
    : `/product/${product.slug}`;
}

type CategoryFiltersProps = {
  slug: string;
  categoryName: string;
  products: Product[];
};

export function CategoryFilters({ slug, categoryName, products }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMirroredCategoryPage = MIRRORED_CATEGORY_SLUGS.has(slug);

  const initialBrands = useMemo(() => {
    const value = searchParams.get("brand");
    return value ? value.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const initialPrices = useMemo(() => {
    const value = searchParams.get("price");
    return value ? value.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const initialFuelTypes = useMemo(() => {
    const value = searchParams.get("fuel");
    return value ? value.split(",").filter(Boolean) : [];
  }, [searchParams]);
  const initialSort = searchParams.get("sort") ?? "featured";

  const [sortBy, setSortBy] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);
  const [selectedPrices, setSelectedPrices] = useState<string[]>(initialPrices);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(initialFuelTypes);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [slug, selectedBrands, selectedPrices, selectedFuelTypes, sortBy]);

  // Sync URL state for shareable filtered URLs (uses replace so we don't pollute history).
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedBrands.length > 0) params.set("brand", selectedBrands.join(","));
    if (selectedPrices.length > 0) params.set("price", selectedPrices.join(","));
    if (selectedFuelTypes.length > 0) params.set("fuel", selectedFuelTypes.join(","));
    if (sortBy !== "featured") params.set("sort", sortBy);
    const search = params.toString();
    const url = search ? `?${search}` : "";
    router.replace(`/category/${slug}${url}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBrands, selectedPrices, selectedFuelTypes, sortBy, slug]);

  const brandCounts = products.reduce<Record<string, number>>((counts, product) => {
    if (product.brand) counts[product.brand] = (counts[product.brand] ?? 0) + 1;
    return counts;
  }, {});
  const availableBrands = Object.keys(brandCounts).sort((a, b) => {
    const featuredA = FEATURED_FILTER_BRANDS.indexOf(a);
    const featuredB = FEATURED_FILTER_BRANDS.indexOf(b);
    if (featuredA !== -1 || featuredB !== -1) {
      if (featuredA === -1) return 1;
      if (featuredB === -1) return -1;
      return featuredA - featuredB;
    }
    return a.localeCompare(b);
  });
  const featuredAvailableBrands = FEATURED_FILTER_BRANDS.filter((brand) => brandCounts[brand]);
  const availablePriceBuckets = [...new Set(products.map((product) => getPriceBucket(product.salePrice ?? product.price)))];
  const fuelTypeCounts = products.reduce<Record<string, number>>((counts, product) => {
    const fuelType = getFuelType(product);
    counts[fuelType] = (counts[fuelType] ?? 0) + 1;
    return counts;
  }, {});
  const availableFuelTypes = FUEL_TYPE_ORDER.filter((fuelType) => fuelTypeCounts[fuelType]);
  const showFuelTypeFilter =
    availableFuelTypes.length > 1 && ["fireplaces", "inserts", "stoves", "outdoor"].includes(slug);

  const filteredProducts = products.filter((product) => {
    const livePrice = product.salePrice ?? product.price;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice =
      selectedPrices.length === 0 || selectedPrices.includes(getPriceBucket(livePrice));
    const matchesFuelType =
      selectedFuelTypes.length === 0 || selectedFuelTypes.includes(getFuelType(product));
    return matchesBrand && matchesPrice && matchesFuelType;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      case "price-high":
        return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      case "name":
        return a.name.localeCompare(b.name);
      default: {
        const priority = (product: Product) => {
          if (slug === "stoves" && product.brand === "Lopi" && product.subcategoryId === "wood-stoves") return 0;
          const featuredBrandIndex = FEATURED_FILTER_BRANDS.indexOf(product.brand);
          if (featuredBrandIndex !== -1) return 10 + featuredBrandIndex;
          return product.isFeatured ? 50 : 100;
        };
        const priorityDifference = priority(a) - priority(b);
        return priorityDifference !== 0 ? priorityDifference : a.name.localeCompare(b.name);
      }
    }
  });

  const productsPerPage = isMirroredCategoryPage ? MIRRORED_PRODUCTS_PER_PAGE : PRODUCTS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / productsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = sortedProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);
  const pagedProducts = sortedProducts.slice(startIndex - 1, endIndex);

  const pageWindowStart = Math.max(1, currentPage - 2);
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + 4);
  const pageNumbers = Array.from(
    { length: pageWindowEnd - pageWindowStart + 1 },
    (_, index) => pageWindowStart + index
  );

  function toggleBrand(brand: string, checked: boolean) {
    setSelectedBrands((current) =>
      checked ? [...current, brand] : current.filter((item) => item !== brand)
    );
  }
  function togglePrice(range: string, checked: boolean) {
    setSelectedPrices((current) =>
      checked ? [...current, range] : current.filter((item) => item !== range)
    );
  }
  function toggleFuelType(fuelType: string, checked: boolean) {
    setSelectedFuelTypes((current) =>
      checked ? [...current, fuelType] : current.filter((item) => item !== fuelType)
    );
  }

  return (
    <div className="mx-auto flex max-w-[1640px] flex-col xl:flex-row">
      <aside className="hidden w-[230px] shrink-0 border-r border-[#e0e0e0] xl:block">
        <div className="border-b border-[#e0e0e0] px-5 py-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">Shop By</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="mb-3 font-medium text-[#424242]">Price</p>
              {availablePriceBuckets.map((range) => (
                <label key={range} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                  <input
                    type="checkbox"
                    checked={selectedPrices.includes(range)}
                    onChange={(event) => togglePrice(range, event.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                  />
                  <span className="ml-4">{range}</span>
                </label>
              ))}
            </div>

            {showFuelTypeFilter && (
              <div className="border-t border-[#e0e0e0] pt-4">
                <p className="mb-3 font-medium text-[#424242]">Fuel Type</p>
                {availableFuelTypes.map((fuelType) => (
                  <label key={fuelType} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                    <input
                      type="checkbox"
                      checked={selectedFuelTypes.includes(fuelType)}
                      onChange={(event) => toggleFuelType(fuelType, event.target.checked)}
                      className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                    />
                    <span className="ml-4 flex-1">{fuelType}</span>
                    <span className="ml-2 text-xs text-[#8a8175]">{fuelTypeCounts[fuelType]}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-5 py-8">
          {featuredAvailableBrands.length > 0 && (
            <div className="mb-7 border-b border-[#e0e0e0] pb-6">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">Featured Brands</h2>
              <div className="mt-4 space-y-2">
                {featuredAvailableBrands.map((brand) => (
                  <button
                    key={brand}
                    type="button"
                    onClick={() => toggleBrand(brand, !selectedBrands.includes(brand))}
                    className={`w-full border px-3 py-2 text-left text-sm font-bold transition ${
                      selectedBrands.includes(brand)
                        ? "border-[#a54210] bg-[#a54210] text-white"
                        : "border-[#d9c7b0] bg-[#fbf4ea] text-[#2a211b] hover:border-[#a54210]"
                    }`}
                  >
                    {brand} <span className="font-normal opacity-75">({brandCounts[brand]})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">All Brands</h2>
          <div className="mt-4 max-h-[420px] overflow-auto pr-2">
            {availableBrands.map((brand) => (
              <label key={brand} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={(event) => toggleBrand(brand, event.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                />
                <span className="ml-4 flex-1">{brand}</span>
                <span className="ml-2 text-xs text-[#8a8175]">{brandCounts[brand]}</span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {featuredAvailableBrands.length > 0 && (
          <div className="border-b border-[#e0e0e0] px-4 py-5 md:px-5 xl:px-5">
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {featuredAvailableBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand, !selectedBrands.includes(brand))}
                  className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.1em] transition ${
                    selectedBrands.includes(brand)
                      ? "border-[#a54210] bg-[#a54210] text-white"
                      : "border-[#e1cbb2] bg-[#fffaf3] text-[#2a211b] hover:border-[#a54210]"
                  }`}
                >
                  {brand} ({brandCounts[brand]})
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 pb-16 pt-4 md:px-5 md:pt-6 xl:px-5 xl:pt-4">
          <div className="mb-7 grid gap-3 md:mb-8 md:grid-cols-[175px_220px_1fr] xl:mb-12 xl:grid-cols-[155px_220px_1fr]">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 border border-[#9e9e9e] bg-white text-sm text-[#212121] xl:hidden"
              onClick={() => setShowFilters((current) => !current)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>

            <p className="text-sm leading-5 tracking-[0.25px] text-[#212121] md:self-center md:text-base">
              {sortedProducts.length === 0
                ? "Showing 0 results"
                : `Showing ${startIndex}-${endIndex} of ${sortedProducts.length} results`}
            </p>

            <div className="md:ml-auto md:w-[243px]">
              <label className="sr-only" htmlFor={`sort-${slug}`}>
                Sort by
              </label>
              <select
                id={`sort-${slug}`}
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full border border-[#9e9e9e] bg-white px-4 text-sm tracking-[0.25px] text-[#424242] focus:outline-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Sort by: Price Low to High</option>
                <option value="price-high">Sort by: Price High to Low</option>
                <option value="name">Sort by: Name</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mb-8 border border-[#e0e0e0] bg-[#f4f4f4] p-4 xl:hidden">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">Price</h2>
                  {availablePriceBuckets.map((range) => (
                    <label key={range} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range)}
                        onChange={(event) => togglePrice(range, event.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                      />
                      <span className="ml-4">{range}</span>
                    </label>
                  ))}
                  {showFuelTypeFilter && (
                    <div className="mt-6 border-t border-[#d9c7b0] pt-5">
                      <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">Fuel Type</h2>
                      {availableFuelTypes.map((fuelType) => (
                        <label key={fuelType} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                          <input
                            type="checkbox"
                            checked={selectedFuelTypes.includes(fuelType)}
                            onChange={(event) => toggleFuelType(fuelType, event.target.checked)}
                            className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                          />
                          <span className="ml-4 flex-1">{fuelType}</span>
                          <span className="ml-2 text-xs text-[#8a8175]">{fuelTypeCounts[fuelType]}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  {featuredAvailableBrands.length > 0 && (
                    <div className="mb-6">
                      <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">Featured Brands</h2>
                      <div className="space-y-2">
                        {featuredAvailableBrands.map((brand) => (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => toggleBrand(brand, !selectedBrands.includes(brand))}
                            className={`w-full border px-3 py-2 text-left text-sm font-bold transition ${
                              selectedBrands.includes(brand)
                                ? "border-[#a54210] bg-[#a54210] text-white"
                                : "border-[#d9c7b0] bg-white text-[#2a211b]"
                            }`}
                          >
                            {brand} <span className="font-normal opacity-75">({brandCounts[brand]})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">All Brands</h2>
                  {availableBrands.map((brand) => (
                    <label key={brand} className="mb-3 flex cursor-pointer items-start text-sm text-[#424242]">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(event) => toggleBrand(brand, event.target.checked)}
                        className="mt-0.5 h-5 w-5 rounded-none border-[#bdbdbd] text-[#a54210] focus:ring-0"
                      />
                      <span className="ml-4 flex-1">{brand}</span>
                      <span className="ml-2 text-xs text-[#8a8175]">{brandCounts[brand]}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {pagedProducts.length === 0 ? (
            <div className="border border-[#e0e0e0] bg-white px-6 py-16 text-center text-[#5b5d5b]">
              {`No ${categoryName.toLowerCase()} matched the selected filters.`}
            </div>
          ) : (
            <div className="grid gap-x-4 gap-y-[60px] sm:grid-cols-2 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-4">
              {pagedProducts.map((product) => {
                const href = getProductHref(product);
                const image = resolveProductImage(product.images[0], product.images);
                const livePrice = product.salePrice ?? product.price;
                const isContactForPricing = product.contactForPricing || product.price <= 0;

                return (
                  <article key={product.id} className="max-w-full">
                    {product.isBestSeller && (
                      <div className="mb-2 ml-1 w-fit rounded-[12px] bg-[#e09623] px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#fafafa]">
                        Best Seller
                      </div>
                    )}

                    <Link href={href} className="group block">
                      <div className="mb-5 flex h-[136px] items-center justify-center border border-[#e0e0e0] bg-white md:h-[213px] xl:h-[246px]">
                        <div className="relative h-full w-full">
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-contain p-4"
                            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                        </div>
                      </div>

                      <h2 className="line-clamp-4 text-sm leading-6 tracking-[0.39px] text-[#212121] transition-colors group-hover:text-[#a54210]">
                        {product.name}
                      </h2>
                    </Link>

                    <div className="mt-3">
                      {isContactForPricing ? (
                        <Link
                          href={"/contact"}
                          className="inline-flex w-full items-center justify-center gap-2 border border-[#a54210] bg-[#a54210] px-4 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#7f2f0b]"
                        >
                          Contact for Pricing
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="text-base font-bold leading-5 tracking-[0.29px] text-[#a54210] md:text-lg md:tracking-[0.32px]">
                          {formatPagePrice(livePrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <Link href={href} className="inline-flex items-center gap-2 text-sm leading-5 text-[#003b4d] hover:underline">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-[18px] text-base md:mt-16 md:gap-[22px] xl:mt-[82px]">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className={`text-[#212121] ${currentPage === 1 ? "cursor-default text-[#9e9e9e]" : ""}`}
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    className={`flex h-[30px] w-[30px] items-center justify-center text-base ${
                      pageNumber === currentPage
                        ? "rounded-full bg-[#a54210] font-bold text-white"
                        : "text-[#616161]"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className={`text-[#212121] ${currentPage === totalPages ? "cursor-default text-[#9e9e9e]" : ""}`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
