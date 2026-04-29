"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/store-config";

const FEATURED_TRAVIS_SLUGS = [
  "fireplace-xtrordinair-4237-ember-glo-gas-fireplace",
  "fireplace-xtrordinair-864-tv-40k-gas-fireplace",
  "fpx-42apex",
  "fpx-44elitenexgenhybrid",
];

function preferFireplacePhotos(product: Product): Product {
  const images = product.images ?? [];
  const betterImages = [
    ...images.filter((image) => /-(3|4)\.webp$/.test(image)),
    ...images.filter((image) => /-2\.webp$/.test(image)),
    ...images.filter((image) => !/-[2-4]\.webp$/.test(image)),
  ];

  return {
    ...product,
    images: Array.from(new Set(betterImages)),
  };
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadFeaturedTravisProducts() {
      try {
        const responses = await Promise.all([
          fetch("/api/products?category=gas-fireplaces&limit=10000"),
          fetch("/api/products?category=wood-fireplaces&limit=10000"),
        ]);
        if (responses.some((response) => !response.ok)) throw new Error("Failed to load products");
        const catalog = (await Promise.all(responses.map((response) => response.json()))).flat() as Product[];
        const curatedProducts = FEATURED_TRAVIS_SLUGS.map((slug) => catalog.find((product) => product.slug === slug))
          .filter((product): product is Product => Boolean(product))
          .map(preferFireplacePhotos);

        if (!cancelled) setProducts(curatedProducts);
      } catch (error) {
        console.error("Unable to load featured Travis products", error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadFeaturedTravisProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#11100e] py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,122,24,0.20),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(255,179,107,0.12),transparent_24%)]" />
      <div className="relative mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-[#ff8a24]">
              <Sparkles className="h-4 w-4" /> Featured Fireplaces
            </p>
            <h2 className="mt-4 max-w-4xl text-[38px] font-black leading-[0.98] tracking-[-0.055em] md:text-[58px]">
              Featured Fireplace Xtrordinair models
            </h2>
          </div>

          <div className="border border-white/10 bg-white/[0.05] p-6 backdrop-blur lg:justify-self-end">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7a18]" />
              <p className="max-w-xl text-sm leading-6 text-[#e8d9c7]">
                Need help choosing? Send us your room, venting, and style goals and we&apos;ll help match the right fireplace to your home.
              </p>
            </div>
            <Link
              href="/design-tool"
              className="mx-auto mt-5 flex w-fit items-center justify-center gap-2 bg-[#ff7a18] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
            >
              Get Help Choosing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse border border-white/10 bg-white/[0.05]" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="border border-white/10 bg-white/[0.05] p-8 text-center text-[#d8c7b2]">
            Featured Fireplace Xtrordinair products are being prepared for this section.
          </div>
        )}
      </div>
    </section>
  );
}
