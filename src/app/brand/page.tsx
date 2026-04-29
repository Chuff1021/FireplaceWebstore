import Link from "next/link";

import { loadAllBrands } from "@/lib/all-products";
import { seoMetadata } from "@/lib/seo-metadata";
import { defaultStoreConfig } from "@/lib/store-config";
import { StructuredData } from "@/components/seo/StructuredData";
import { collectionPageJsonLd, breadcrumbJsonLd } from "@/lib/site-jsonld";

export const revalidate = 3600;

export const metadata = seoMetadata({
  title: "Fireplace Brands",
  description:
    "Shop fireplace, stove, insert, outdoor fire, mantel, accessory, and replacement part brands carried by Aaron's Fireplace Co.",
  path: "/brand",
});

export default async function BrandIndexPage() {
  const brands = (await loadAllBrands()).filter((brand) => brand.count >= 3);

  return (
    <main className="min-h-screen bg-[#f6efe5]">
      <StructuredData
        id="brand-index-collection-jsonld"
        data={collectionPageJsonLd({
          name: `Fireplace Brands | ${defaultStoreConfig.storeName}`,
          description:
            "Browse fireplace, stove, insert, outdoor fire, mantel, accessory, and replacement part brands carried by Aaron's Fireplace Co.",
          url: "/brand",
          numberOfItems: brands.length,
        })}
      />
      <StructuredData
        id="brand-index-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Brands", url: "/brand" },
        ])}
      />

      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Aaron&apos;s Fireplace Brands</p>
          <h1 className="mt-5 max-w-4xl text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">
            Shop fireplaces and parts by brand.
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-[#e6d8c4]">
            Compare hearth products and replacement parts from leading fireplace, stove, insert, and accessory manufacturers. Each brand page links into the products currently loaded in Aaron&apos;s online catalog.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brand/${brand.slug}`}
              className="group border border-[#ded5c8] bg-[#fffdf9] p-5 shadow-[0_18px_50px_rgba(32,20,10,0.08)] transition hover:-translate-y-0.5 hover:border-[#a54210] hover:shadow-[0_24px_70px_rgba(32,20,10,0.14)]"
            >
              <p className="text-lg font-black tracking-[-0.03em] text-[#201914] group-hover:text-[#a54210]">
                {brand.name}
              </p>
              <p className="mt-2 text-sm text-[#6f6255]">
                {brand.count} catalog {brand.count === 1 ? "item" : "items"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
