import Link from "next/link";

export function DesignToolBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-800/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">
                ✦ AI-Powered
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Design Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                Fireplace
              </span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Not sure where to start? Our AI Design Tool guides you through a
              personalized quiz — fuel type, room size, style, and budget — then
              shows you exactly what your new fireplace will look like in your
              own room.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-10">
              {[
                "Upload a photo of your room for a live visualization",
                "Get personalized product recommendations",
                "Instant BTU guidance based on your room size",
                "Compare styles: traditional, modern, rustic & more",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-gray-300">
                  <span className="text-amber-400 mt-0.5 flex-shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/design-tool"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5"
            >
              <span>Start the Design Tool</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Right: Visual card mockup */}
          <div className="relative">
            <div className="bg-gray-800/60 backdrop-blur border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
              {/* Fake wizard step preview */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="ml-2 text-gray-400 text-sm">
                  {"Aaron's AI Design Tool"}
                </span>
              </div>

              {/* Step indicators */}
              <div className="flex gap-1.5 mb-6">
                {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                  <div
                    key={step}
                    className={`h-1.5 flex-1 rounded-full ${
                      step <= 3 ? "bg-amber-500" : "bg-gray-700"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                Step 3 of 7 — Design Style
              </p>
              <h3 className="text-white text-xl font-semibold mb-5">
                What style fits your home?
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Traditional", icon: "🏛️", active: false },
                  { label: "Modern", icon: "◼", active: true },
                  { label: "Rustic", icon: "🪵", active: false },
                  { label: "Transitional", icon: "✦", active: false },
                ].map(({ label, icon, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      active
                        ? "border-amber-500 bg-amber-500/10 text-white"
                        : "border-gray-700 bg-gray-900/50 text-gray-400"
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="font-medium text-sm">{label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-gray-700 flex justify-between items-center">
                <span className="text-gray-500 text-sm">← Back</span>
                <button className="px-5 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg">
                  Continue →
                </button>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              FREE TOOL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
