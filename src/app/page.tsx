import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { BrandsBar } from "@/components/sections/BrandsBar";
import { DesignToolBanner } from "@/components/sections/DesignToolBanner";

import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata("Fireplaces, Stoves & Replacement Parts", "Shop fireplaces, wood and pellet stoves, inserts and replacement parts nationwide. Visit Aaron’s Fireplace Co. in Republic, serving the Springfield, MO metro.", "/");

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <section className="mx-auto max-w-7xl px-4 py-12"><h2 className="text-3xl font-black">Fireplace parts nationwide. Local help in the Springfield metro.</h2><p className="mt-4 max-w-3xl leading-7 text-gray-700">Find a replacement by part number or manufacturer, compare a new fireplace or stove, or plan an installation with our Republic, Missouri team. We sell to customers in all 50 states; shipping and product eligibility are confirmed for your order.</p><div className="mt-5 flex flex-wrap gap-4 font-bold text-orange-800 underline"><Link href="/parts">Shop fireplace parts by brand</Link><Link href="/guides">Fireplace buying & parts guides</Link><Link href="/installation">Springfield metro installation</Link></div></section>
      <BrandsBar />
      <DesignToolBanner />
      <FeaturedProducts />
      <PromoBanner />
    </>
  );
}
