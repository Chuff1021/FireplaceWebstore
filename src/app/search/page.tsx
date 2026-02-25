"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sampleProducts, productCategories, Product, ProductCategory } from "@/lib/store-config";
import { Search, X } from "lucide-react";

function SearchResults() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);

  const results = useMemo<{ products: Product[]; categories: ProductCategory[] }>(() => {
    const q = queryParam.toLowerCase().trim();
    if (!q) return { products: [], categories: [] };

    const matchingProducts = sampleProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.categoryId.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q)
    );

    const matchingCategories = productCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(q) ||
        category.description.toLowerCase().includes(q)
    );

    return { products: matchingProducts, categories: matchingCategories };
  }, [queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  const hasResults = results.products.length > 0 || results.categories.length > 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Search Header */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Search</h1>
          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for fireplaces, stoves, inserts..."
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {queryParam && (
            <p className="text-gray-600 mb-8">
              {hasResults ? (
                <>
                  Found {results.products.length} product{results.products.length !== 1 ? "s" : ""} and{" "}
                  {results.categories.length} categor{results.categories.length !== 1 ? "ies" : "y"} for {'"'}{queryParam}{'"'}
                </>
              ) : (
                <>No results found for {'"'}{queryParam}{'"'}</>
              )}
            </p>
          )}

          {!queryParam && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Enter a search term to find products and categories</p>
            </div>
          )}

          {queryParam && !hasResults && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No results found</p>
              <p className="text-gray-400">
                {'Try searching for "fireplace", "stove", or "insert"'}
              </p>
            </div>
          )}

          {/* Category Results */}
          {results.categories.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {results.categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 right-2 text-white font-medium text-sm">
                        {category.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {results.products.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-square relative bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      {product.isBestSeller && (
                        <span className="absolute top-2 left-2 bg-red-700 text-white text-xs font-semibold px-2 py-1 rounded">
                          Best Seller
                        </span>
                      )}
                      {product.isNew && (
                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-gray-900 group-hover:text-red-700 transition-colors">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          ${(product.salePrice ?? product.price).toLocaleString()}
                        </span>
                        {product.salePrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ${product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>}>
      <SearchResults />
    </Suspense>
  );
}
