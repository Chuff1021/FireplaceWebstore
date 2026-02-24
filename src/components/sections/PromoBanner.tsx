import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Promo 1 */}
          <div className="relative bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
            <div className="relative">
              <span className="text-orange-200 text-sm font-medium uppercase tracking-wide">
                Limited Time Offer
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                Winter Sale — Up to 30% Off Select Fireplaces
              </h3>
              <p className="text-orange-100 mb-6">
                Warm up your home for less. Shop our biggest sale of the season on top-rated gas and electric fireplaces.
              </p>
              <Link
                href="/sale"
                className="inline-flex px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop the Sale
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
            <div className="relative">
              <span className="text-blue-200 text-sm font-medium uppercase tracking-wide">
                Professional Service
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">
                Free Installation Consultation
              </h3>
              <p className="text-blue-100 mb-6">
                Not sure what you need? Our certified technicians will assess your space and recommend the perfect solution.
              </p>
              <Link
                href="/installation"
                className="inline-flex px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
