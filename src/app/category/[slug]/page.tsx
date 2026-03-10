"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  SlidersHorizontal,
  ShoppingCart,
  ShieldCheck,
  Truck,
  Star,
  Sparkles,
  Flame,
  BadgeCheck,
  Filter,
} from "lucide-react";
import { productCategories, sampleProducts, type Product } from "@/lib/store-config";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { resolveProductImage } from "@/lib/product-images";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function splitModel(name: string, brand: string, sku: string) {
  if (name.startsWith(`${brand} `)) {
    return name.replace(`${brand} `, "").trim();
  }

  return sku;
}

function getPriceBucket(price: number) {
  if (price < 1500) return "Under $1,500";
  if (price < 3000) return "$1,500 - $2,999";
  if (price < 5000) return "$3,000 - $4,999";
  return "$5,000+";
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const isGasFireplacePage = slug === "gas-fireplaces";

  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(sampleProducts);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products?limit=2000", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as Product[];
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogProducts(data);
        }
      } catch {
        // Keep local starter catalog if API unavailable
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const parentCategory = productCategories.find((c) => c.slug === slug);
  const flattenedSubcategories = productCategories.flatMap((category) =>
    (category.subcategories ?? []).map((subcategory) => ({
      ...subcategory,
      parent: category,
    }))
  );
  const subcategoryMatch = flattenedSubcategories.find((sub) => sub.slug === slug);

  const category = parentCategory ?? subcategoryMatch ?? null;
  const categoryName = category?.name ?? "All Products";
  const categoryDescription =
    category?.description ??
    "Browse our complete selection of fireplaces, stoves, inserts, and accessories.";
  const topLevelForPage = parentCategory ?? subcategoryMatch?.parent ?? null;
  const subcategoryLinks = topLevelForPage?.subcategories ?? [];

  const baseProducts = catalogProducts.filter((product) => {
    if (parentCategory) {
      const subcategoryIds = new Set((parentCategory.subcategories ?? []).map((sub) => sub.id));
      return (
        product.categoryId === parentCategory.id ||
        Boolean(product.subcategoryId && subcategoryIds.has(product.subcategoryId))
      );
    }

    if (subcategoryMatch) return product.subcategoryId === subcategoryMatch.id;
    return true;
  });

  const availableBrands: string[] = [...new Set(baseProducts.map((product) => product.brand).filter(Boolean))].sort();

  const filteredProducts = baseProducts.filter((product) => {
    const livePrice = product.salePrice ?? product.price;
    const priceBucket = getPriceBucket(livePrice);

    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = selectedPrices.length === 0 || selectedPrices.includes(priceBucket);
    const matchesStock = !inStockOnly || product.inStock;

    return matchesBrand && matchesPrice && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice ?? a.price) - (b.salePrice ?? b.price);
      case "price-high":
        return (b.salePrice ?? b.price) - (a.salePrice ?? a.price);
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return a.isNew ? -1 : 1;
      default:
        return a.isFeatured ? -1 : 1;
    }
  });

  const displayProducts = sortedProducts;

  return (
    <div className={`min-h-screen ${isGasFireplacePage ? "bg-white" : "bg-[#f6f6f4]"}`}>
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            {subcategoryMatch?.parent && (
              <>
                <Link
                  href={`/category/${subcategoryMatch.parent.slug}`}
                  className="hover:text-amber-700 transition-colors"
                >
                  {subcategoryMatch.parent.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
        </div>
      </div>

      <section className={`border-b ${isGasFireplacePage ? "bg-gradient-to-b from-[#faf7f1] to-white border-amber-100" : "bg-white border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div>
            {isGasFireplacePage && (
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white text-amber-900 border border-amber-300 mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Gas Fireplace Collection
              </p>
            )}
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1f2937] leading-tight">
              {isGasFireplacePage ? "Gas Fireplaces" : categoryName}
            </h1>
            <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">
              {isGasFireplacePage
                ? "Shop direct vent, vent-free, and linear gas fireplaces from trusted brands. Compare ignition systems, dimensions, and style options with expert support from Aaron's Hearth and Home."
                : categoryDescription}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-700" />
                Fast Nationwide Shipping
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                Trusted Manufacturer Warranties
              </span>
              <span className="inline-flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-700" />
                Expert Support from Republic, MO
              </span>
            </div>

            {isGasFireplacePage && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl">
                <div className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Fuel Type</p>
                  <p className="font-semibold text-gray-900">Natural Gas & LP</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Installation</p>
                  <p className="font-semibold text-gray-900">Insert, Built-In, Linear</p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-700">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">Support</p>
                  <p className="font-semibold text-gray-900">Sizing & Venting Help</p>
                </div>
              </div>
            )}
          </div>

          <div className={`rounded-2xl overflow-hidden border relative h-56 md:h-64 lg:h-72 ${isGasFireplacePage ? "border-amber-200 shadow-lg" : "border-gray-200 bg-[#1f2937]"}`}>
            <Image
              src={isGasFireplacePage ? "/categories/gas-fireplaces.jpg" : "/categories/fireplaces.jpg"}
              alt={categoryName}
              fill
              className={`object-cover ${isGasFireplacePage ? "opacity-95" : "opacity-80"}`}
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Aaron&apos;s Hearth and Home</p>
              <p className="mt-1 text-lg font-semibold">
                {isGasFireplacePage ? "Modern warmth with cleaner-burning convenience" : "Shop by style, size, and installation type"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        {subcategoryLinks.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <Link
              href={`/category/${topLevelForPage?.slug}`}
              className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                slug === topLevelForPage?.slug
                  ? "bg-[#1f2937] text-white border-[#1f2937]"
                  : "bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:text-amber-700"
              }`}
            >
              All {topLevelForPage?.name}
            </Link>
            {subcategoryLinks.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${sub.slug}`}
                className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                  slug === sub.slug
                    ? "bg-[#1f2937] text-white border-[#1f2937]"
                    : "bg-white text-gray-700 border-gray-300 hover:border-amber-400 hover:text-amber-700"
                }`}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        <div className={`flex flex-col lg:flex-row gap-8 items-start ${isGasFireplacePage ? "lg:gap-10" : ""}`}>
          <aside className={`lg:w-72 w-full ${showFilters ? "block" : "hidden lg:block"}`}>
            <div
              className={`rounded-2xl p-6 sticky top-24 ${
                isGasFireplacePage
                  ? "bg-[#fcfbf8] border border-amber-200 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900 inline-flex items-center gap-2">
                  {isGasFireplacePage && <Filter className="w-4 h-4 text-amber-700" />}
                  Filter Products
                </h3>
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setSelectedPrices([]);
                    setInStockOnly(false);
                  }}
                  className="text-xs font-medium text-amber-700 hover:text-amber-800"
                >
                  Reset
                </button>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Availability</h4>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-amber-700 focus:ring-amber-600"
                  />
                  In stock only
                </label>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {["Under $1,500", "$1,500 - $2,999", "$3,000 - $4,999", "$5,000+"].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPrices.includes(range)}
                        onChange={(e) => {
                          setSelectedPrices((current) =>
                            e.target.checked ? [...current, range] : current.filter((item) => item !== range)
                          );
                        }}
                        className="rounded border-gray-300 text-amber-700 focus:ring-amber-600"
                      />
                      {range}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Brand</h4>
                <div className="space-y-2 max-h-56 overflow-auto pr-1">
                  {availableBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => {
                          setSelectedBrands((current) =>
                            e.target.checked ? [...current, brand] : current.filter((item) => item !== brand)
                          );
                        }}
                        className="rounded border-gray-300 text-amber-700 focus:ring-amber-600"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            <div
              className={`rounded-2xl px-4 md:px-6 py-4 mb-4 flex items-center justify-between ${
                isGasFireplacePage
                  ? "bg-[#fffdfa] border border-amber-200"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                  onClick={() => setShowFilters((current) => !current)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600 inline-flex items-center gap-2">
                  {isGasFireplacePage && <BadgeCheck className="w-4 h-4 text-amber-700" />}
                  <span className="font-semibold text-gray-900">{displayProducts.length}</span> products
                </p>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {displayProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center text-gray-600">
                No products currently listed for these filters.
              </div>
            ) : (
              <div className="space-y-4">
                {displayProducts.map((product) => {
                  const livePrice = product.salePrice ?? product.price;
                  const model = splitModel(product.name, product.brand, product.sku);
                  const productImage = resolveProductImage(product.images[0], product.images);

                  return (
                    <article
                      key={product.id}
                      className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                        isGasFireplacePage
                          ? "border-gray-200 hover:border-amber-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
                          : "border-gray-200 hover:shadow-md"
                      }`}
                    >
                      <div className={isGasFireplacePage ? "grid md:grid-cols-[260px_1fr_220px]" : "grid md:grid-cols-[220px_1fr] gap-0"}>
                        <Link
                          href={`/product/${product.slug}`}
                          className={`relative block bg-gray-100 ${isGasFireplacePage ? "h-56 md:h-full" : "h-56 md:h-full"}`}
                        >
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes={isGasFireplacePage ? "(max-width: 768px) 100vw, 260px" : "(max-width: 768px) 100vw, 220px"}
                          />
                        </Link>

                        <div className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-gray-100">
                          <div className="flex flex-col gap-4">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold inline-flex items-center gap-1.5">
                                {isGasFireplacePage && <Flame className="w-3.5 h-3.5" />}
                                {product.brand}
                              </p>
                              <Link
                                href={`/product/${product.slug}`}
                                className="mt-1 block text-lg md:text-xl font-semibold text-[#1f2937] hover:text-amber-700 leading-snug"
                              >
                                {product.name}
                              </Link>
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.shortDescription || "Premium gas fireplace with modern styling and efficient heating performance."}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">Model</p>
                              <p className="font-medium text-gray-800 truncate">{model}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">SKU</p>
                              <p className="font-medium text-gray-800 font-mono truncate">{product.sku}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">Fuel</p>
                              <p className="font-medium text-gray-800">Gas Fireplace</p>
                            </div>
                          </div>

                          {isGasFireplacePage && (
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              <span className="px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-gray-200">Direct Vent</span>
                              <span className="px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-gray-200">Linear Options</span>
                              <span className="px-2.5 py-1 rounded-full bg-[#f7f7f7] border border-gray-200">Remote Ready</span>
                            </div>
                          )}

                          {!isGasFireplacePage && (
                            <div className="mt-5 flex items-center gap-3">
                              <button
                                onClick={() => {
                                  addItem(product);
                                  openCart();
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1f2937] text-white text-sm font-semibold hover:bg-black transition-colors"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                              </button>
                              <Link
                                href={`/product/${product.slug}`}
                                className="inline-flex items-center px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          )}
                        </div>

                        {isGasFireplacePage && (
                          <div className="p-5 md:p-6 border-t md:border-t-0 md:border-l border-gray-100 bg-[#fcfcfb] flex flex-col justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-gray-500">Starting At</p>
                              <p className="text-3xl font-semibold text-[#1f2937] mt-1">{formatPrice(livePrice)}</p>
                              {product.salePrice && (
                                <p className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</p>
                              )}
                              <p className={`mt-2 text-xs font-semibold ${product.inStock ? "text-emerald-700" : "text-red-600"}`}>
                                {product.inStock ? "In stock • Ships fast" : "Currently unavailable"}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                addItem(product);
                                openCart();
                              }}
                              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1f2937] text-white text-sm font-semibold hover:bg-black transition-colors"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add to Cart
                            </button>
                            <Link
                              href={`/product/${product.slug}`}
                              className="w-full inline-flex items-center justify-center px-4 py-3 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-amber-400 hover:text-amber-700 transition-colors"
                            >
                              View Product
                            </Link>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
