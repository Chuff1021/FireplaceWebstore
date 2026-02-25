import { Hero } from "@/components/sections/Hero";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { PromoBanner } from "@/components/sections/PromoBanner";
import { BrandsBar } from "@/components/sections/BrandsBar";
import { DesignToolBanner } from "@/components/sections/DesignToolBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsBar />
      <CategoryGrid />
      <DesignToolBanner />
      <FeaturedProducts />
      <PromoBanner />
    </>
  );
}
