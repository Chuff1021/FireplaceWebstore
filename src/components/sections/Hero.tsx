import Link from "next/link";
import Image from "next/image";
import { defaultStoreConfig } from "@/lib/store-config";

export function Hero() {
  return (
    <section className="relative bg-gray-900 text-white overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero/hero-fireplace.jpg"
          alt="Beautiful fireplace in a cozy living room"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            Free Shipping on Orders Over ${defaultStoreConfig.business.freeShipping.minimum}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Transform Your Home with the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Perfect Fireplace
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Republic, Missouri&apos;s trusted source for gas, wood, and electric fireplaces,
            inserts, and stoves. Expert advice, professional installation, and unbeatable prices.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/category/fireplaces"
              className="px-8 py-3 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition-colors shadow-lg shadow-red-700/30"
            >
              Shop Fireplaces
            </Link>
            <Link
              href="/category/stoves"
              className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
            >
              Browse Stoves
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 mt-10 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Authorized Dealer
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Expert Support
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✓</span> Professional Installation
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
