import Link from "next/link";
import { productCategories } from "@/lib/store-config";

const categoryIcons: Record<string, string> = {
  fireplaces: "🏠",
  inserts: "🔲",
  stoves: "♨️",
  outdoor: "🌿",
  accessories: "🛠️",
  parts: "⚙️",
};

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Shop By Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect heating solution for your home. Browse our complete selection
            of fireplaces, stoves, inserts, and accessories.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {productCategories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">
                  {categoryIcons[category.id] || "🔥"}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                {category.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
