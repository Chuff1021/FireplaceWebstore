import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  getPartsDepartmentBySlug,
  partsCatalogStats,
  partsDepartments,
  partsPartTypes,
} from "@/lib/parts-taxonomy";
import { type Product } from "@/lib/store-config";

type PartsServerIntroProps = {
  slug: string;
  products: Product[];
};

export function PartsServerIntro({ slug, products }: PartsServerIntroProps) {
  const department = getPartsDepartmentBySlug(slug);
  const isLandingPage = slug === "parts";
  const name = isLandingPage ? "Fireplace Parts Department" : department?.name ?? "Fireplace Parts";
  const description = isLandingPage
    ? "Browse OEM and OEM-equivalent fireplace, gas stove, wood stove, pellet stove, electric fireplace, and outdoor hearth replacement parts by department, brand, part type, or SKU."
    : department?.description ?? "Browse fireplace replacement parts with expert fitment support.";
  const brands = Array.from(new Set(products.map((product) => product.brand).filter(Boolean))).slice(0, 16);
  const visibleProducts = products.slice(0, 8);

  return (
    <section className="bg-[#0b0b0a] text-white">
      <div className="border-b border-[#ff7a18]/20 bg-[#11100e]">
        <div className="mx-auto max-w-[1480px] px-4 py-3 md:px-6">
          <nav className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#d8c7b2]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#ffb36b]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {!isLandingPage && (
              <>
                <Link href="/category/parts" className="hover:text-[#ffb36b]">Parts</Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="text-white">{name}</span>
          </nav>
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-[#ff7a18]/20 bg-[#11100e] px-4 py-14 md:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.20),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-[1480px]">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Aaron&apos;s Parts Department</p>
          <h1 className="mt-4 max-w-5xl text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">{name}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">{description}</p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a3d]">Indexed parts</p>
              <p className="mt-2 text-3xl font-black">{products.length.toLocaleString()}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a3d]">Catalog brands</p>
              <p className="mt-2 text-3xl font-black">{partsCatalogStats.indexedBrands}</p>
            </div>
            <div className="border border-white/10 bg-white/[0.06] p-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#ff9a3d]">Need fitment help?</p>
              <Link href="/contact" className="mt-2 inline-block text-sm font-black uppercase tracking-[0.14em] text-[#ffb36b]">Ask a specialist</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f6efe5] px-4 py-8 text-[#211a15] md:px-6">
        <div className="mx-auto grid max-w-[1480px] gap-6 lg:grid-cols-3">
          <div className="border border-[#ded5c8] bg-[#fffdf9] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7a18]">Departments</p>
            <div className="mt-4 grid gap-2">
              <Link href="/category/parts" className="font-bold text-[#201914] hover:text-[#a54210]">All Fireplace Parts</Link>
              {partsDepartments.map((item) => (
                <Link key={item.slug} href={`/category/${item.slug}`} className="text-sm text-[#6f6255] hover:text-[#a54210]">{item.name}</Link>
              ))}
            </div>
          </div>

          <div className="border border-[#ded5c8] bg-[#fffdf9] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7a18]">Popular brands</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {brands.map((brand) => (
                <Link key={brand} href={`/category/${slug}`} className="rounded-full border border-[#ded5c8] px-3 py-1.5 text-xs font-bold text-[#4e4036] hover:border-[#a54210] hover:text-[#a54210]">{brand}</Link>
              ))}
            </div>
          </div>

          <div className="border border-[#ded5c8] bg-[#fffdf9] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7a18]">Common part types</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {partsPartTypes.map((partType) => (
                <Link key={partType} href={`/category/${slug}`} className="rounded-full border border-[#ded5c8] px-3 py-1.5 text-xs font-bold text-[#4e4036] hover:border-[#a54210] hover:text-[#a54210]">{partType}</Link>
              ))}
            </div>
          </div>
        </div>

        {visibleProducts.length > 0 && (
          <div className="mx-auto mt-6 max-w-[1480px] border border-[#ded5c8] bg-[#fffdf9] p-5">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff7a18]">Sample parts in this section</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.slug}`} className="border border-[#eadfce] bg-[#fff7ed] p-4 hover:border-[#a54210]">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a54210]">{product.brand}</p>
                  <h2 className="mt-2 line-clamp-2 text-sm font-black text-[#201914]">{product.name}</h2>
                  <p className="mt-2 text-xs text-[#6f6255]">SKU: {product.sku}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
