"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/store-config";

const TRAVIS_BRANDS = ["Fireplace Xtrordinair", "Lopi", "Fire Garden"];
const EXCLUDED_CATEGORY_IDS = new Set(["parts"]);

function isTravisProduct(product: Product) {
  return TRAVIS_BRANDS.includes(product.brand) && !EXCLUDED_CATEGORY_IDS.has(product.categoryId);
}

function brandSort(product: Product) {
  const index = TRAVIS_BRANDS.indexOf(product.brand);
  return index === -1 ? TRAVIS_BRANDS.length : index;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTravisProducts() {
      try {
        const response = await fetch("/api/products?limit=10000");
        if (!response.ok) throw new Error("Failed to load products");
        const catalog = (await response.json()) as Product[];
        const travisProducts = catalog
          .filter(isTravisProduct)
          .sort((a, b) => brandSort(a) - brandSort(b) || a.name.localeCompare(b.name));

        if (!cancelled) setProducts(travisProducts);
      } catch (error) {
        console.error("Unable to load Travis Industries products", error);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTravisProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const brandCounts = useMemo(() => {
    return TRAVIS_BRANDS.map((brand) => ({
      brand,
      count: products.filter((product) => product.brand === brand).length,
    }));
  }, [products]);

  return (
    <section className="relative overflow-hidden bg-[#11100e] py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(255,122,24,0.20),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(255,179,107,0.12),transparent_24%)]" />
      <div className="relative mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.26em] text-[#ff8a24]">
              <Sparkles className="h-4 w-4" /> Travis Industries Collection
            </p>
            <h2 className="mt-4 max-w-4xl text-[38px] font-black leading-[0.98] tracking-[-0.055em] md:text-[58px]">
              Premium fireplaces from Lopi, Fireplace Xtrordinair, and Fire Garden.
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d8c7b2]">
              Explore current Travis Industries models available through Aaron&apos;s Fireplace Co. These products are quote-based so we can confirm fit, venting, options, and dealer pricing before the project moves forward.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:justify-self-end">
            {brandCounts.map(({ brand, count }) => (
              <div key={brand} className="border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
                <div className="flex items-center gap-2 text-[#ffb36b]">
                  <Flame className="h-5 w-5" />
                  <span className="text-[11px] font-black uppercase tracking-[0.18em]">Featured Brand</span>
                </div>
                <p className="mt-3 text-lg font-black text-white">{brand}</p>
                <p className="mt-1 text-sm text-[#d8c7b2]">{loading ? "Loading" : `${count} models`}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-4 border border-white/10 bg-black/30 p-5 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7a18]" />
            <p className="max-w-3xl text-sm leading-6 text-[#e8d9c7]">
              Need help choosing? Every Travis model here can be routed through our quote flow so we can help match the right fireplace, insert, stove, or outdoor fire feature to the space.
            </p>
          </div>
          <Link
            href="/design-tool"
            className="inline-flex shrink-0 items-center justify-center gap-2 bg-[#ff7a18] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
          >
            Get Help Choosing <ArrowRight className="h-4 w-4" />
          </Link>
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
            Travis Industries products are being prepared for this section.
          </div>
        )}
      </div>
    </section>
  );
}
