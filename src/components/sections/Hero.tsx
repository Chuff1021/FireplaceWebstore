import Link from "next/link";
import { defaultStoreConfig } from "@/lib/store-config";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,146,60,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(220,38,38,0.2),transparent_50%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
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
              Browse our extensive collection of gas, wood, electric fireplaces, inserts, and stoves. 
              Expert advice, professional installation, and unbeatable prices.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/category/fireplaces"
                className="px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30"
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
                <span className="text-green-400">✓</span> Price Match Guarantee
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Expert Support
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Professional Installation
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-full blur-3xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center border border-gray-700">
                <span className="text-[120px]">🔥</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
