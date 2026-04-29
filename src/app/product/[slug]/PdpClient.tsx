"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  Phone,
  Heart,
  Share2,
} from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/store-config";
import { resolveProductImages } from "@/lib/product-images";

type GalleryProps = {
  product: Product;
};

/**
 * Interactive image gallery — renders the main image with the user-selected
 * thumbnail. Server already emits the markup with the first image as the
 * default, but switching requires client state.
 */
export function PdpGallery({ product }: GalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const productImages = resolveProductImages(product.images?.[0], product.images);
  const selectedProductImage = productImages[selectedImageIndex] ?? productImages[0];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedImageIndex(0);
  }, [product.id]);

  const isContactForPricing = product.contactForPricing || product.price <= 0;
  const discount =
    !isContactForPricing && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
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

      {productImages.length > 1 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {productImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedImageIndex(i)}
              className={`relative w-20 h-20 rounded-lg border-2 overflow-hidden bg-gray-100 transition ${
                i === selectedImageIndex
                  ? "border-orange-600 ring-2 ring-orange-200"
                  : "border-gray-200 hover:border-orange-300"
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
      )}
    </div>
  );
}

type BuyBoxProps = {
  product: Product;
};

/**
 * Quantity selector + Add to Cart / Contact-for-Pricing CTA.
 * This is the only piece on the PDP that strictly needs `useCartStore`.
 */
export function PdpBuyBox({ product }: BuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();

  const isContactForPricing = product.contactForPricing || product.price <= 0;

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
  };

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {!isContactForPricing && (
        <div className="flex items-center border rounded-lg">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}

      {isContactForPricing ? (
        <Link
          href={"/contact"}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Phone className="w-5 h-5" />
          Contact for Pricing
        </Link>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      )}

      <button
        type="button"
        className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Add to wishlist"
      >
        <Heart className="w-5 h-5 text-gray-600" />
      </button>

      <button
        type="button"
        className="p-3 border rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Share product"
      >
        <Share2 className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}
