"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  ShoppingCart,
  Shield,
  Phone,
  Minus,
  Plus,
  Heart,
  Share2,
  Check,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig, type Product } from "@/lib/store-config";
import { ProductCard } from "@/components/ui/ProductCard";
import { resolveProductImages } from "@/lib/product-images";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductDetail({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">(
    "description"
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addItem, openCart } = useCartStore();

  const productImages = resolveProductImages(product?.images?.[0], product?.images);
  const selectedProductImage = productImages[selectedImageIndex] ?? productImages[0];

  useEffect(() => {
    if (product.categoryId === "parts" && product.sourceKey) {
      void fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "interest", items: [{ key: product.sourceKey, quantity: 1 }] }) }).catch(() => {});
    }
  }, [product.categoryId, product.sourceKey]);

  const isContactForPricing = product.contactForPricing || product.price <= 0;
  const discount = !isContactForPricing && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

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
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-[#f2eee7] rounded-2xl relative overflow-hidden border border-[#eadfce]">
              <Image
                src={selectedProductImage}
                alt={product.name}
                fill
                className="object-contain p-6"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {!isContactForPricing && product.salePrice && (
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
            <div className="mt-4 flex max-w-full gap-3 overflow-x-auto pb-2">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`relative h-20 w-20 shrink-0 rounded-lg border-2 overflow-hidden bg-gray-100 transition ${
                    i === selectedImageIndex ? "border-orange-600 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300"
                  }`}
                  aria-label={`Show ${product.name} image ${i + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} view ${i + 1}`}
                    fill
                    className="object-contain p-1"
                    sizes="80px"
                  />
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

            {/* Price */}
            {product.priceType === "msrp" && <p className="mb-2 text-sm font-semibold text-gray-500">Napoleon U.S. MSRP</p>}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {isContactForPricing ? "Contact for Pricing" : formatPrice(product.salePrice ?? product.price)}
              </span>
              {!isContactForPricing && product.salePrice && (
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
              {product.categoryId === "parts" ? (
                <div className="space-y-2">
                  <p className="font-medium">{{ available: "Available", special_order: "Special order", out_of_stock: "Out of stock", unverified: "Availability needs confirmation" }[product.partsAvailability || "unverified"]}
                    {product.publishedStockQuantity != null && product.partsAvailability === "available" ? ` · ${product.publishedStockQuantity} available at last check` : ""}</p>
                  <p className="text-sm text-gray-600">{product.specifications.Availability}</p>
                  {product.availabilityCheckedAt && <p className="text-xs text-gray-500">Availability checked {new Date(product.availabilityCheckedAt).toLocaleString()}. Supplier stock is confirmed again at checkout.</p>}
                </div>
              ) : product.availabilityStatus === "confirm" ? (
                <span className="font-medium text-gray-600">Contact us to confirm availability and delivery timing.</span>
              ) : product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock</span>
                  <span className="text-sm text-gray-500">
                    ({product.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-red-600 font-medium">Out of Stock</span>
                  {product.specifications["Shipping Lead Time"] && (
                    <p className="mt-2 text-sm text-gray-600">{product.specifications["Shipping Lead Time"]}</p>
                  )}
                </div>
              )}
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-wrap gap-4 mb-8">
              {!isContactForPricing && product.availabilityStatus !== "confirm" && <div className="flex items-center border rounded-lg">
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
              </div>}

              {product.availabilityStatus === "confirm" ? (
                <Link
                  href={`/contact?product=${encodeURIComponent(product.sku)}`}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  {isContactForPricing ? "Contact for Pricing" : "Contact to Order"}
                </Link>
              ) : isContactForPricing ? (
                <Link
                  href={`/contact?product=${encodeURIComponent(product.sku)}`}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Contact for Pricing
                </Link>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={product.categoryId === "parts" ? product.partsAvailability === "out_of_stock" : !product.inStock}
                  className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {product.categoryId === "parts" && !product.canPurchase ? "Add to quote request" : "Add to Cart"}
                </button>
              )}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
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
                  { key: "reviews", label: "Reviews" },
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

            {(
              <div hidden={activeTab !== "specs"}>
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
              </div></div>
            )}

            {activeTab === "reviews" && <p className="text-gray-600">No verified customer reviews have been published for this product.</p>}

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
