"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, SlidersHorizontal, ShoppingCart } from "lucide-react";
import { productCategories, sampleProducts, type Product } from "@/lib/store-config";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { resolveProductImage } from "@/lib/product-images";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function splitModel(name: string, brand: string, sku: string) {
  if (name.startsWith(`${brand} `)) {
    return name.replace(`${brand} `, "").trim();
  }

  return sku;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(sampleProducts);
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch("/api/products?limit=1000", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as Product[];
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setCatalogProducts(data);
        }
      } catch {
        // Keep the local starter catalog if the API is unavailable.
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

  // Filter products by category/subcategory
  const products = catalogProducts.filter((product) => {
    if (parentCategory) {
      const subcategoryIds = new Set((parentCategory.subcategories ?? []).map((sub) => sub.id));
      return product.categoryId === parentCategory.id || Boolean(product.subcategoryId && subcategoryIds.has(product.subcategoryId));
    }

    if (subcategoryMatch) {
      return product.subcategoryId === subcategoryMatch.id;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...products].sort((a, b) => {
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

  const subcategoryLinks = topLevelForPage?.subcategories ?? [];

  const fireplaceFlowLinks = ["gas-fireplaces", "wood-fireplaces"]
    .map((subcategorySlug) => flattenedSubcategories.find((sub) => sub.slug === subcategorySlug))
    .filter(Boolean) as Array<(typeof flattenedSubcategories)[number]>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            {subcategoryMatch?.parent && (
              <>
                <Link
                  href={`/category/${subcategoryMatch.parent.slug}`}
                  className="hover:text-orange-600"
                >
                  {subcategoryMatch.parent.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 font-medium">
              {categoryName}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-300 max-w-2xl">
            {categoryDescription}
          </p>

          {/* Subcategory Links */}
          {subcategoryLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {subcategoryLinks.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors border border-white/20"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
          {topLevelForPage?.slug === "fireplaces" && fireplaceFlowLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-gray-300">Shop fireplace fuel:</span>
              {fireplaceFlowLinks.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  className="px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-300/30 text-amber-200 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white rounded-xl p-6 border sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

              {/* Fuel Type */}
              {subcategoryLinks.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">Browse This Family</h4>
                  <div className="space-y-1">
                    <Link
                      href={`/category/${topLevelForPage?.slug}`}
                      className="block text-sm text-gray-700 hover:text-orange-600"
                    >
                      All {topLevelForPage?.name}
                    </Link>
                    {subcategoryLinks.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/category/${sub.slug}`}
                        className={`block text-sm hover:text-orange-600 ${slug === sub.slug ? "text-orange-600 font-semibold" : "text-gray-600"}`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Fuel Type */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Fuel Type</h4>
                <div className="space-y-2">
                  {["Gas", "Wood", "Electric", "Pellet", "Propane"].map(
                    (fuel) => (
                      <label
                        key={fuel}
                        className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                        {fuel}
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="space-y-2">
                  {[
                    "Under $500",
                    "$500 - $1,000",
                    "$1,000 - $2,000",
                    "$2,000 - $3,000",
                    "Over $3,000",
                  ].map((range) => (
                    <label
                      key={range}
                      className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      {range}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Brand</h4>
                <div className="space-y-2">
                  {[...new Set(products.map((product) => product.brand))].sort().map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      {"★".repeat(rating)}
                      {"☆".repeat(5 - rating)} & Up
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

            {/* Product Catalog */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 border">
              <div className="flex items-center gap-4">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>
                <span className="text-sm text-gray-500">
                  {displayProducts.length} products
                </span>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

              {/* Products */}
              {displayProducts.length === 0 ? (
                <div className="bg-white rounded-xl border p-8 text-center text-gray-600">
                  No products currently listed in this category.
                </div>
              ) : (
                <div className="bg-white rounded-xl border overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-3 border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Make</div>
                    <div className="col-span-2">Model</div>
                    <div className="col-span-1">SKU</div>
                    <div className="col-span-2 text-right">Price</div>
                  </div>

                  <ul className="divide-y">
                    {displayProducts.map((product) => {
                      const livePrice = product.salePrice ?? product.price;
                      const model = splitModel(product.name, product.brand, product.sku);
                      const productImage = resolveProductImage(product.images[0], product.images);

                      return (
                        <li key={product.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                          <div className="md:grid md:grid-cols-12 md:gap-3 items-center">
                            <div className="col-span-5 flex items-center gap-3">
                              <Link
                                href={`/product/${product.slug}`}
                                className="relative h-16 w-16 rounded-md overflow-hidden border bg-gray-100 flex-shrink-0"
                              >
                                <Image src={productImage} alt={product.name} fill className="object-cover" sizes="64px" />
                              </Link>
                              <div className="min-w-0">
                                <Link
                                  href={`/product/${product.slug}`}
                                  className="font-semibold text-gray-900 hover:text-orange-600 line-clamp-2"
                                >
                                  {product.name}
                                </Link>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.shortDescription}</p>
                              </div>
                            </div>

                            <div className="col-span-2 mt-3 md:mt-0 text-sm text-gray-700">
                              <span className="md:hidden font-semibold text-gray-500 mr-1">Make:</span>
                              {product.brand}
                            </div>

                            <div className="col-span-2 mt-1 md:mt-0 text-sm text-gray-700">
                              <span className="md:hidden font-semibold text-gray-500 mr-1">Model:</span>
                              {model}
                            </div>

                            <div className="col-span-1 mt-1 md:mt-0 text-xs font-mono text-gray-500">
                              <span className="md:hidden font-semibold text-gray-500 mr-1">SKU:</span>
                              {product.sku}
                            </div>

                            <div className="col-span-2 mt-3 md:mt-0 text-right flex md:block items-center justify-between">
                              <div>
                                <p className="text-base font-bold text-gray-900">{formatPrice(livePrice)}</p>
                                {product.salePrice && (
                                  <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                                )}
                              </div>
                              <button
                                onClick={() => {
                                  addItem(product);
                                  openCart();
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-md hover:bg-orange-700 transition-colors"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
