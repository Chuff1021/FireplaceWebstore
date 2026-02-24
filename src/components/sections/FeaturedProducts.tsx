"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { sampleProducts } from "@/lib/store-config";

export function FeaturedProducts() {
  const featured = sampleProducts.filter((p) => p.isFeatured);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Our most popular fireplaces, stoves, and inserts
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden md:inline-flex px-6 py-2 border-2 border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
          >
            View All Products
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex px-6 py-2 border-2 border-orange-600 text-orange-600 font-medium rounded-lg hover:bg-orange-600 hover:text-white transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
