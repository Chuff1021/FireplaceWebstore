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
    <div className="bg-[#f6f6f4] min-h-screen">
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

      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
          <div>
            {isGasFireplacePage && (
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Premium Gas Fireplace Collection
              </p>
            )}
            <h1 className="text-3xl md:text-5xl font-semibold text-[#1f2937] leading-tight">{categoryName}</h1>
            <p className="mt-4 text-gray-600 max-w-2xl leading-relaxed">{categoryDescription}</p>
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
          </div>

          <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#1f2937] relative h-56 md:h-64 lg:h-72">
            <Image
              src={isGasFireplacePage ? "/categories/gas-fireplaces.jpg" : "/categories/fireplaces.jpg"}
              alt={categoryName}
              fill
              className="object-cover opacity-80"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-amber-200">Aaron&apos;s Hearth and Home</p>
              <p className="mt-1 text-lg font-semibold">Shop by style, size, and installation type</p>
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

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className={`lg:w-72 w-full ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-900">Filter Products</h3>
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
            <div className="bg-white rounded-2xl border border-gray-200 px-4 md:px-6 py-4 mb-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <button
                  className="lg:hidden inline-flex items-center gap-2 text-sm font-medium text-gray-700"
                  onClick={() => setShowFilters((current) => !current)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600">
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
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="grid md:grid-cols-[220px_1fr] gap-0">
                        <Link
                          href={`/product/${product.slug}`}
                          className="relative block h-56 md:h-full bg-gray-100"
                        >
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 220px"
                          />
                        </Link>

                        <div className="p-5 md:p-6">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold">{product.brand}</p>
                              <Link
                                href={`/product/${product.slug}`}
                                className="mt-1 block text-xl font-semibold text-[#1f2937] hover:text-amber-700 leading-snug"
                              >
                                {product.name}
                              </Link>
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
                            </div>

                            <div className="text-left md:text-right">
                              <p className="text-2xl font-semibold text-[#1f2937]">{formatPrice(livePrice)}</p>
                              {product.salePrice && (
                                <p className="text-sm text-gray-400 line-through">{formatPrice(product.price)}</p>
                              )}
                              <p className="mt-1 text-xs text-emerald-700 font-semibold">
                                {product.inStock ? "In stock" : "Out of stock"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">Model</p>
                              <p className="font-medium text-gray-800 truncate">{model}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">SKU</p>
                              <p className="font-medium text-gray-800 font-mono truncate">{product.sku}</p>
                            </div>
                            <div className="rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
                              <p className="text-[11px] uppercase tracking-wider text-gray-500">Rating</p>
                              <p className="font-medium text-gray-800">{product.rating.toFixed(1)} / 5</p>
                            </div>
                          </div>

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
                        </div>
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
