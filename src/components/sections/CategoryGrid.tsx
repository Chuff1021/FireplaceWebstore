import Link from "next/link";
import Image from "next/image";
import { productCategories } from "@/lib/store-config";

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
              className="group bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-orange-300"
            >
              <div className="relative h-32 w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-4 md:p-5">
          <p className="text-xs uppercase tracking-wider text-gray-500 mb-3">Fireplaces Quick Browse</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/category/fireplaces"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              All Fireplaces
            </Link>
            <Link
              href="/category/gas-fireplaces"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              Gas Fireplaces
            </Link>
            <Link
              href="/category/wood-fireplaces"
              className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:border-orange-300 hover:text-orange-600 transition-colors"
            >
              Wood Fireplaces
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
