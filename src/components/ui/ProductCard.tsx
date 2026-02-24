"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/store-config";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
          🔥
        </span>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.salePrice && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {discount}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
              BEST SELLER
            </span>
          )}
        </div>

        {/* Quick Add */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 p-3 bg-orange-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-700"
          aria-label="Add to cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.brand}
        </p>
        <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {product.salePrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-2">
          {product.inStock ? (
            <span className="text-xs text-green-600 font-medium">✓ In Stock</span>
          ) : (
            <span className="text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}
