export function BrandsBar() {
  const brands = [
    "Napoleon",
    "Superior",
    "Dimplex",
    "Harman",
    "Vogelzang",
    "Majestic",
    "Heatilator",
    "Regency",
    "Vermont Castings",
    "Lennox",
  ];

  return (
    <section className="py-12 border-y bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-sm text-gray-500 uppercase tracking-wide mb-8">
          Trusted Brands We Carry
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-gray-400 hover:text-gray-700 transition-colors font-bold text-lg md:text-xl"
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
