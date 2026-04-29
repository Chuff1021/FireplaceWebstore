"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Flame, Ruler, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import type { Product } from "@/lib/store-config";
import { resolveProductImage } from "@/lib/product-images";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCartStore();
  const productImage = resolveProductImage(product.images[0], product.images);
  const isContactForPricing = product.contactForPricing || product.price <= 0;
  const displayPrice = product.salePrice ?? product.price;
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
    openCart();
  };

  const cardHref = isContactForPricing ? "/contact" : `/product/${product.slug}`;

  return (
    <Link
      href={cardHref}
      className="group flex h-full flex-col overflow-hidden border border-[#ded5c8] bg-[#fffdf9] transition-all duration-300 hover:-translate-y-1 hover:border-[#ff7a18] hover:shadow-[0_28px_70px_rgba(32,20,10,0.14)]"
    >
      <div className="relative aspect-[1.08/1] overflow-hidden bg-[#f2eee7]">
        <Image
          src={productImage}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.035]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
            {product.brand || "Fireplace"}
          </span>
          {isContactForPricing ? (
            <span className="bg-[#ff7a18] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
              Contact for Pricing
            </span>
          ) : product.salePrice && (
            <span className="bg-[#ff7a18] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black">
              Save {discount}%
            </span>
          )}
        </div>
        {!isContactForPricing && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black text-white shadow-lg transition hover:bg-[#ff7a18] hover:text-black"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#8a5a35]">
          <Flame className="h-3.5 w-3.5 text-[#ff7a18]" />
          {product.sku || "Model available"}
        </div>
        <h3 className="line-clamp-3 min-h-[4.5rem] text-[17px] font-black leading-6 tracking-[-0.02em] text-[#1d1712] transition-colors group-hover:text-[#a54210]">
          {product.name}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#6a6258]">
          {product.specifications?.Width && (
            <span className="inline-flex items-center gap-1.5 border border-[#eadfce] bg-white px-2 py-1.5">
              <Ruler className="h-3.5 w-3.5 text-[#a54210]" /> {product.specifications.Width}
            </span>
          )}
          {product.inStock ? (
            <span className="border border-green-200 bg-green-50 px-2 py-1.5 font-semibold text-green-700">
              In stock
            </span>
          ) : (
            <span className="border border-red-200 bg-red-50 px-2 py-1.5 font-semibold text-red-700">
              Check availability
            </span>
          )}
        </div>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-[#eadfce] pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#8a8175]">{isContactForPricing ? "Dealer pricing" : "Starting at"}</p>
              <div className="flex items-baseline gap-2">
                <span className={isContactForPricing ? "inline-flex items-center justify-center border border-[#a54210] bg-[#a54210] px-3 py-2 text-sm font-black uppercase tracking-[0.08em] text-white transition group-hover:bg-[#7f2f0b]" : "text-xl font-black text-[#1d1712]"}>{isContactForPricing ? "Contact for Pricing" : formatPrice(displayPrice)}</span>
                {!isContactForPricing && product.salePrice && <span className="text-sm text-[#8a8175] line-through">{formatPrice(product.price)}</span>}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#a54210]">
              {isContactForPricing ? "Request Quote" : "View"} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
