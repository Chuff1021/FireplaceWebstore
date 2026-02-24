"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { productCategories, sampleProducts } from "@/lib/store-config";
import { useState } from "react";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const category = productCategories.find((c) => c.slug === slug);

  // Filter products by category
  const products = sampleProducts.filter((p) => p.categoryId === slug);

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

  // If no products match the category, show all sample products for demo
  const displayProducts = sortedProducts.length > 0 ? sortedProducts : sampleProducts;

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
            <span className="text-gray-900 font-medium">
              {category?.name || "All Products"}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {category?.name || "All Products"}
          </h1>
          <p className="text-gray-300 max-w-2xl">
            {category?.description ||
              "Browse our complete selection of fireplaces, stoves, inserts, and accessories."}
          </p>

          {/* Subcategory Links */}
          {category?.subcategories && (
            <div className="flex flex-wrap gap-2 mt-6">
              {category.subcategories.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${slug}/${sub.slug}`}
                  className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors border border-white/20"
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
                  {[
                    "Napoleon",
                    "Superior",
                    "Dimplex",
                    "Harman",
                    "Vogelzang",
                  ].map((brand) => (
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

          {/* Product Grid */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
