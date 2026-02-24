"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Truck,
  Shield,
  Phone,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { sampleProducts, defaultStoreConfig } from "@/lib/store-config";
import { ProductCard } from "@/components/ui/ProductCard";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );
  const { addItem, openCart } = useCartStore();

  const product = sampleProducts.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const relatedProducts = sampleProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  // If not enough related products, fill with other products
  const displayRelated =
    relatedProducts.length >= 2
      ? relatedProducts
      : sampleProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
  };

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/category/${product.categoryId}`}
              className="hover:text-orange-600 capitalize"
            >
              {product.categoryId}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
              <span className="text-[150px]">🔥</span>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.salePrice && (
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded">
                    NEW
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded">
                    BEST SELLER
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <button
                  key={i}
                  className={`w-20 h-20 rounded-lg border-2 flex items-center justify-center bg-gray-100 ${
                    i === 1 ? "border-orange-600" : "border-gray-200"
                  }`}
                >
                  <span className="text-2xl">🔥</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                    Save {formatPrice(product.price - product.salePrice)}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6">{product.shortDescription}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock</span>
                  <span className="text-sm text-gray-500">
                    ({product.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-500 mb-6">SKU: {product.sku}</p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>

              <button
                className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5 text-gray-600" />
              </button>

              <button
                className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">
                    Orders over ${defaultStoreConfig.business.freeShipping.minimum}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-500">Manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Expert Help</p>
                  <p className="text-xs text-gray-500">{defaultStoreConfig.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b">
            <div className="flex gap-8">
              {(
                [
                  { key: "description", label: "Description" },
                  { key: "specs", label: "Specifications" },
                  { key: "reviews", label: `Reviews (${product.reviewCount})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-4 font-medium transition-colors ${
                    activeTab === tab.key
                      ? "text-orange-600 border-b-2 border-orange-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>
                <h3 className="font-bold text-gray-900 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value], i) => (
                        <tr
                          key={key}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 w-1/3">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{value}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="max-w-3xl">
                <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {product.rating}
                    </div>
                    <div className="flex mt-1">
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
                    <p className="text-sm text-gray-500 mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => (
                      <div key={stars} className="flex items-center gap-2">
                        <span className="text-sm w-8">{stars}★</span>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{
                              width: `${
                                stars === 5
                                  ? 70
                                  : stars === 4
                                  ? 20
                                  : stars === 3
                                  ? 7
                                  : stars === 2
                                  ? 2
                                  : 1
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "John D.",
                      rating: 5,
                      date: "2 weeks ago",
                      text: "Absolutely love this fireplace! The installation was straightforward and the heat output is amazing. Highly recommend.",
                    },
                    {
                      name: "Sarah M.",
                      rating: 4,
                      date: "1 month ago",
                      text: "Beautiful design and works great. Took off one star because the remote could be more responsive, but overall very happy with the purchase.",
                    },
                    {
                      name: "Mike R.",
                      rating: 5,
                      date: "2 months ago",
                      text: "Best fireplace I've ever owned. The flame presentation is incredibly realistic and it heats our entire living room efficiently.",
                    },
                  ].map((review, i) => (
                    <div key={i} className="border-b pb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              className={`w-4 h-4 ${
                                j < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-gray-900">
                          {review.name}
                        </span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <p className="text-gray-700">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {displayRelated.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayRelated.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
