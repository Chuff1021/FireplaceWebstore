import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function BrandsBar() {
  const brands = [
    { name: "DuraVent", slug: "duravent", logo: "/brands/efs-featured/duravent.webp", featuredImage: true },
    { name: "Superior", slug: "superior", logo: "/brands/efs-featured/superior.webp", featuredImage: true },
    { name: "Empire", slug: "empire", logo: "/brands/efs-featured/empire.webp", featuredImage: true },
    { name: "Majestic", slug: "majestic", logo: "/brands/efs-featured/majestic.webp", featuredImage: true },
    { name: "Metal-Fab", slug: "metal-fab", logo: "/brands/efs-featured/metal-fab.webp", featuredImage: true },
    { name: "Napoleon", slug: "napoleon", logo: "/brands/efs-featured/napoleon.webp", featuredImage: true },
    { name: "Pilgrim", slug: "pilgrim", logo: "/brands/efs-featured/pilgrim.webp", featuredImage: true },
    { name: "Kingsman", slug: "kingsman", logo: "/brands/efs-featured/kingsman.webp", featuredImage: true },
    { name: "Real Fyre", slug: "real-fyre", logo: "/brands/efs-featured/rh-peterson.webp", featuredImage: true },
    { name: "HPC", slug: "hpc", logo: "/brands/efs-featured/hearth-products-controls.webp", featuredImage: true },
    { name: "Dagan", slug: "dagan", logo: "/brands/efs-featured/dagan.webp", featuredImage: true },
    { name: "Monessen", slug: "monessen", logo: "/brands/efs-featured/monessen.webp", featuredImage: true },
    { name: "Goods of the Woods", slug: "goods-of-the-woods", logo: "/brands/efs-featured/goods-of-the-woods.webp", featuredImage: true },
    { name: "Hy-C Company", slug: "hy-c-company", logo: "/brands/efs-featured/hy-c.webp", featuredImage: true },
    { name: "AW Perkins", slug: "aw-perkins", logo: "/brands/efs-featured/aw-perkins.webp", featuredImage: true },
    { name: "MRCOOL", slug: "mrcool", logo: "/brands/efs-featured/mr--cool.webp", featuredImage: true },
    { name: "Ventis", slug: "ventis", logo: "/brands/efs-featured/ventis.webp", featuredImage: true },
    { name: "Fireplace Xtrordinair", slug: "fireplace-xtrordinair", logo: "/brands/fireplacex.png", featuredImage: false },
    { name: "Lopi", slug: "lopi", logo: "/brands/lopi.png", featuredImage: false },
  ];

  return (
    <section className="relative overflow-hidden border-t border-[#ff7a18]/20 bg-[#0d0b0a] py-16 text-white md:py-20" id="featured-brands">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,122,24,0.18),transparent_30%),radial-gradient(circle_at_84%_66%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,#120f0c_0%,#1d1510_54%,#090807_100%)]" />
      <div className="relative mx-auto max-w-[1640px] px-4 md:px-5">
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_0.55fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.26em] text-[#b84d13]">
              <ShieldCheck className="h-4 w-4 text-[#ff7a18]" />
              Trusted Hearth Brands
            </p>
            <h2 className="mt-4 text-[34px] font-black leading-[1.04] tracking-[-0.045em] text-white md:text-[52px]">
              Shop the Names Homeowners and Installers Trust
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-[#d8c7b2]">
            Browse proven fireplace, stove, venting, log set, and hearth accessory brands backed by real product support.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/12 bg-white/[0.055] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                href={`/brand/${brand.slug}`}
                className="group relative flex h-[118px] items-center justify-center overflow-hidden rounded-2xl border border-white/12 bg-white/90 px-5 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ff7a18]/75 hover:bg-white hover:shadow-[0_18px_42px_rgba(255,122,24,0.24)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#ff7a18]/8 opacity-0 transition group-hover:opacity-100" />
                <div className={`relative w-full transition duration-300 group-hover:scale-[1.035] ${brand.featuredImage ? "h-full" : "h-[70px]"}`}>
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 16vw"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/brand"
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white shadow-sm backdrop-blur-md transition hover:border-[#ff7a18] hover:bg-[#ff7a18] hover:text-black"
          >
            View All Brands <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
