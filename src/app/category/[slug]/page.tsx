"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, Star } from "lucide-react";
import {
  isPartsCategorySlug,
  PartsCategoryExperience,
} from "@/components/parts/PartsCategoryExperience";
import { defaultStoreConfig, productCategories, type Product } from "@/lib/store-config";
import { resolveProductImage } from "@/lib/product-images";

const PRODUCTS_PER_PAGE = 24;
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
]);
const MIRRORED_PRODUCTS_PER_PAGE = 20;
const FEATURED_FILTER_BRANDS = ["Lopi", "Fireplace Xtrordinair", "Fire Garden"];

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

const FUEL_TYPE_ORDER = ["Gas", "Wood", "Electric", "Pellet", "Outdoor", "Other"];

function getProductLink(product: Product) {
  return `/product/${product.slug}`;
}

function getProductLinkProps(product: Product) {
  return { href: getProductLink(product) };
}

function renderStars(rating: number) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));

  return [...Array(5)].map((_, index) => (
    <Star
      key={index}
      className={`h-3.5 w-3.5 ${index < rounded ? "fill-[#f4b23f] text-[#f4b23f]" : "text-[#d8d8d8]"}`}
    />
  ));
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const isMirroredCategoryPage = MIRRORED_CATEGORY_SLUGS.has(slug);
  const isPartsCategoryPage = isPartsCategorySlug(slug);

  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isPartsCategoryPage) {
      setCatalogProducts([]);
      setIsLoadingProducts(false);
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      setIsLoadingProducts(true);
      try {
        const response = await fetch(`/api/products?category=${encodeURIComponent(slug)}&limit=10000`, { cache: "no-store" });
        if (!response.ok) return;

        const data = (await response.json()) as Product[];
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogProducts(data);
        }
      } catch {
        // Keep the empty state if the API is unavailable.
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
  }, [isPartsCategoryPage]);

  useEffect(() => {
    setPage(1);
  }, [slug, selectedBrands, selectedPrices, selectedFuelTypes, sortBy]);

  const parentCategory = productCategories.find((category) => category.slug === slug);
  const flattenedSubcategories = productCategories.flatMap((category) =>
    (category.subcategories ?? []).map((subcategory) => ({
      ...subcategory,
      parent: category,
    }))
  );
  const subcategoryMatch = flattenedSubcategories.find((subcategory) => subcategory.slug === slug);

  const category = parentCategory ?? subcategoryMatch ?? null;
  const categoryName = category?.name ?? "All Products";
  const categoryDescription =
    category?.description ??
    "Browse our complete selection of fireplaces, stoves, inserts, and accessories.";
  const topLevelForPage = parentCategory ?? subcategoryMatch?.parent ?? null;
  const subcategoryLinks = topLevelForPage?.subcategories ?? [];

  if (isPartsCategoryPage) {
    return <PartsCategoryExperience slug={slug} />;
  }

  const categoryProducts = catalogProducts.filter((product) => {
    if (parentCategory) {
      const subcategoryIds = new Set((parentCategory.subcategories ?? []).map((sub) => sub.id));
      return (
        product.categoryId === parentCategory.id ||
        Boolean(product.subcategoryId && subcategoryIds.has(product.subcategoryId))
      );
    }

    if (subcategoryMatch) {
      return product.subcategoryId === subcategoryMatch.id;
    }

    return true;
  });

  const brandCounts = categoryProducts.reduce<Record<string, number>>((counts, product) => {
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
  const availablePriceBuckets = [...new Set(categoryProducts.map((product) => getPriceBucket(product.salePrice ?? product.price)))];
  const fuelTypeCounts = categoryProducts.reduce<Record<string, number>>((counts, product) => {
    const fuelType = getFuelType(product);
    counts[fuelType] = (counts[fuelType] ?? 0) + 1;
    return counts;
  }, {});
  const availableFuelTypes = FUEL_TYPE_ORDER.filter((fuelType) => fuelTypeCounts[fuelType]);
  const showFuelTypeFilter = availableFuelTypes.length > 1 && ["fireplaces", "inserts", "stoves", "outdoor"].includes(slug);

  const filteredProducts = categoryProducts.filter((product) => {
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
      default:
        return a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1;
    }
  });

  const productsPerPage = isMirroredCategoryPage ? MIRRORED_PRODUCTS_PER_PAGE : PRODUCTS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / productsPerPage));
  const currentPage = Math.min(page, totalPages);
  const startIndex = sortedProducts.length === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;
  const endIndex = Math.min(currentPage * productsPerPage, sortedProducts.length);
  const pagedProducts = sortedProducts.slice(startIndex - 1, endIndex);

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

  const pageWindowStart = Math.max(1, currentPage - 2);
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + 4);
  const pageNumbers = Array.from(
    { length: pageWindowEnd - pageWindowStart + 1 },
    (_, index) => pageWindowStart + index
  );

  if (!isMirroredCategoryPage) {
    return (
      <div className="min-h-screen bg-[#f7f7f7]">
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-[#a54210]">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" />
              {subcategoryMatch?.parent && (
                <>
                  <Link href={`/category/${subcategoryMatch.parent.slug}`} className="hover:text-[#a54210]">
                    {subcategoryMatch.parent.name}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="font-medium text-gray-900">{categoryName}</span>
            </nav>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10">
          <h1 className="text-4xl font-semibold text-gray-900">{categoryName}</h1>
          <p className="mt-3 max-w-2xl text-gray-600">{categoryDescription}</p>

          {subcategoryLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {subcategoryLinks.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/category/${subcategory.slug}`}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:border-[#a54210] hover:text-[#a54210]"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedProducts.map((product) => {
              const image = resolveProductImage(product.images[0], product.images);
              const href = getProductLinkProps(product);

              return (
                <Link
                  key={product.id}
                  href={href.href}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square bg-white">
                    <Image src={image} alt={product.name} fill className="object-contain p-5" sizes="25vw" />
                  </div>
                  <div className="border-t border-gray-100 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a54210]">{product.brand}</p>
                    <h2 className="mt-2 line-clamp-2 text-sm font-medium text-gray-900">{product.name}</h2>
                    <p className="mt-3 text-lg font-semibold text-[#a54210]">
                      {product.contactForPricing || product.price <= 0 ? "Contact for Pricing" : formatPagePrice(product.salePrice ?? product.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <div className="mx-auto max-w-[1640px] px-4 pt-3 md:px-5 xl:px-5">
        <nav className="mb-4 mt-3 flex items-center gap-2 text-xs text-[#5b5d5b]">
          <Link href="/" className="hover:text-[#a54210]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#c4c4c4]">{categoryName}</span>
        </nav>
      </div>

      <section className="border-b border-[#e0e0e0]">
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
            <div className="border-b border-[#e0e0e0] px-4 py-5 md:px-5 xl:px-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a54210]">Aaron&apos;s Fireplace Superstore</p>
                  <h1 className="mt-2 text-[34px] font-black leading-[1.08] tracking-[-0.045em] text-[#212121] md:text-[44px] xl:text-[56px]">
                    {categoryName}
                  </h1>
                  <p className="mt-3 max-w-[900px] text-sm leading-6 text-[#5b5d5b]">
                    {`Compare ${categoryName.toLowerCase()} by trusted brands, fuel type, install style, and project budget. Use the filters to narrow the catalog fast.`}
                  </p>
                </div>
                {featuredAvailableBrands.length > 0 && (
                  <div className="flex flex-wrap gap-2 lg:max-w-[520px] lg:justify-end">
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
                )}
              </div>
            </div>

            <div className="px-4 pb-16 pt-4 md:px-5 md:pt-6 xl:px-5 xl:pt-4">
              <div className="mb-7 grid gap-3 md:mb-8 md:grid-cols-[175px_220px_1fr] xl:mb-12 xl:grid-cols-[155px_220px_1fr]">
                <button
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
                  <select
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

              {isLoadingProducts ? (
                <div className="border border-[#e0e0e0] bg-white px-6 py-16 text-center text-[#5b5d5b]">
                  Loading products...
                </div>
              ) : pagedProducts.length === 0 ? (
                <div className="border border-[#e0e0e0] bg-white px-6 py-16 text-center text-[#5b5d5b]">
                  {`No ${categoryName.toLowerCase()} matched the selected filters.`}
                </div>
              ) : (
                <div className="grid gap-x-4 gap-y-[60px] sm:grid-cols-2 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-4">
                  {pagedProducts.map((product) => {
                    const href = getProductLinkProps(product);
                    const image = resolveProductImage(product.images[0], product.images);
                    const livePrice = product.salePrice ?? product.price;
                    const isContactForPricing = product.contactForPricing || product.price <= 0;
                    const hasReviews = product.reviewCount > 0;

                    return (
                      <article key={product.id} className="max-w-full">
                        {product.isBestSeller && (
                          <div className="mb-2 ml-1 w-fit rounded-[12px] bg-[#e09623] px-4 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[#fafafa]">
                            Best Seller
                          </div>
                        )}

                        <Link
                          href={href.href}
                          className="group block"
                        >
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

                        {hasReviews ? (
                          <div className="mb-2 mt-2 flex items-center">
                            <div className="flex items-center">{renderStars(product.rating)}</div>
                            <span className="ml-1 text-sm text-[#757575]">({product.reviewCount})</span>
                          </div>
                        ) : (
                          <div className="mb-2 mt-3 text-sm text-[#9e9e9e]">No reviews yet</div>
                        )}

                        <div className="mt-3">
                          {isContactForPricing ? (
                            <Link
                              href={`/contact?product=${encodeURIComponent(product.sku)}`}
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
                          <Link
                            href={href.href}
                            className="inline-flex items-center gap-2 text-sm leading-5 text-[#003b4d] hover:underline"
                          >
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
      </section>

      <section className="border-t border-[#e0e0e0] bg-[#f4f4f4] xl:bg-[#212121]">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 px-4 py-7 text-[#212121] md:px-5 md:py-8 xl:h-16 xl:min-h-16 xl:flex-row xl:items-center xl:gap-[60px] xl:px-5 xl:py-0 xl:text-white">
          <div className="flex flex-col xl:flex-row xl:items-center">
            <p className="text-[22px] font-bold xl:mr-2 xl:text-[22px]">Have Questions?</p>
            <p className="text-lg md:text-xl xl:text-xl">Talk to a fireplace specialist</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap xl:ml-auto xl:gap-9">
            <a
              href={`tel:${defaultStoreConfig.phone}`}
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.08em] xl:text-base xl:font-normal xl:tracking-[0.06em]"
            >
              Call {defaultStoreConfig.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.08em] xl:text-base xl:font-normal xl:tracking-[0.06em]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
