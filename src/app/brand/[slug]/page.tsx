import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ShieldCheck, Truck, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/ui/ProductCard";
import { StructuredData } from "@/components/seo/StructuredData";
import { brandJsonLd, breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/site-jsonld";
import {
  loadAllBrands,
  loadAllProducts,
} from "@/lib/all-products";
import { absoluteUrl } from "@/lib/site-url";
import { defaultStoreConfig, type Product } from "@/lib/store-config";

export const dynamicParams = true;
export const revalidate = 3600;

const BRAND_BLURBS: Record<string, string> = {
  travis:
    "Travis Industries is the parent company behind some of America's most respected hearth brands, including Lopi, Fireplace Xtrordinair, and Avalon. Engineered in Mukilteo, Washington, every Travis appliance is built around obsessive efficiency, clean-burn technology, and a multi-generational commitment to family-owned manufacturing.",
  lopi:
    "Lopi stoves and inserts are designed for homeowners who treat heat as a craft. Hand-built in Washington State by Travis Industries, every Lopi appliance fuses high-efficiency combustion with clean-burning emissions and the kind of cast-iron, glass, and stone detailing you expect from a flagship hearth brand.",
  "fireplace-xtrordinair":
    "Fireplace Xtrordinair (FPX) is the premium fireplace label inside Travis Industries, known for the Apex, Probuilder, and 4415 ProGS series. Expect oversized viewing glass, GreenSmart efficiency tuning, and a depth of customization (panels, fronts, media, andirons) that turns a fireplace into a true architectural element.",
  napoleon:
    "Napoleon has been engineering fireplaces, gas inserts, and stoves in North America since 1976. The line spans the bestselling Ascent linear gas series, the High Definition direct-vent platform, and the Timberwolf wood-burning lineup — all backed by Napoleon's President's Limited Lifetime Warranty.",
  majestic:
    "Majestic, part of Hearth & Home Technologies, is one of the most installed fireplace lines in North America. From the popular Quartz and Jade direct-vent gas fireplaces to the Pearl outdoor series, Majestic strikes a deliberate balance between authentic fire presentation, builder-friendly framing, and dealer-supported install.",
  superior:
    "Superior Fireplaces builds approachable, code-compliant gas, wood, and electric fireplaces with a strong dealer network. The DRT, DRC, and VRE series have earned a reputation in production homes and remodels alike for predictable framing, reliable ignition systems, and a clean modern aesthetic without premium pricing.",
  empire:
    "Empire Comfort Systems has manufactured American-built hearth products in Belleville, Illinois since 1932. The Boulevard linear gas, Tahoe Premium direct-vent, and Mantis high-efficiency lines combine generous BTU output with vent-free, b-vent, and direct-vent flexibility for nearly every home configuration.",
  "heat-and-glo":
    "Heat & Glo invented direct vent gas fireplaces in 1987 and has been pushing the category forward ever since. The Mezzo, True, and Cosmo series are known for clean linear flames, IntelliFire ignition, and the kind of design vocabulary architects specify on luxury new-construction projects.",
  mendota:
    "Mendota Hearth is built in Iowa and sold exclusively through authorized dealers. The FullView gas fireplaces and inserts are recognized for their oversized ceramic glass, ember-bed realism, and PF-2 control — a combination that has made Mendota a perennial favorite for premium retrofits.",
  regency:
    "Regency Fireplace Products has manufactured wood, gas, pellet, and electric appliances since 1979. From the Panorama wide-view gas series to the legendary CI2700 catalytic wood insert, Regency is the brand to know when efficiency, EPA certification, and long-burn-time performance matter most.",
  "quadra-fire":
    "Quadra-Fire stoves and inserts are engineered for serious heat. The four-point burn system, Auto-Burn pellet technology, and rugged cast iron construction have made Quadra-Fire a go-to for off-grid, rural, and high-BTU heating applications across North America.",
  "vermont-castings":
    "Vermont Castings has cast wood, gas, and pellet stoves in New England since 1975. Models like the Defiant, Encore, and Intrepid FlexBurn are American hearth icons — enameled cast iron, top-loading wood boxes, and a craft aesthetic you simply do not find at the production tier.",
  jotul:
    "Jotul has cast iron stoves and fireplaces in Norway since 1853, making it one of the oldest hearth manufacturers in continuous operation. The F 500 Oslo, F 602, and GF 370 lines deliver Scandinavian design discipline with EPA-certified clean burns and decades of heritage detailing.",
  "pacific-energy":
    "Pacific Energy is a Vancouver Island-based wood and gas stove maker known for the Super, Alderlea, and Vista series. Their EBT2 burn technology and floating firebox design produce long burn times, efficient secondary combustion, and a no-nonsense Pacific Northwest build quality.",
  dimplex:
    "Dimplex pioneered the modern electric fireplace and continues to lead it. The IgniteXL, Opti-V, and Revillusion series use patented flame technology to deliver the most realistic flame presentation in the electric category, with zero clearance, zero venting, and 120V plug-and-play installation.",
  "modern-flames":
    "Modern Flames builds linear electric fireplaces designed for contemporary architecture. The Orion and Landscape Pro series ship with multi-color flames, multi-color ember beds, and front-vented heat — a recipe that has made them a designer favorite for great rooms, primary suites, and commercial spaces.",
  touchstone:
    "Touchstone Home Products specializes in wall-mount and recessed electric fireplaces that ship direct to homeowners. The Sideline, Forte, and Onyx lines bring premium flame realism, quartz heaters, and remote control standard at a price point that fits real renovation budgets.",
  avalon:
    "Avalon stoves and inserts share the engineering platform that made Lopi famous, with a styling language tuned for traditional and transitional rooms. Built by Travis Industries in Washington State, the Olympic, Astoria, and Arbor models pair high-efficiency combustion with clean cast detailing.",
  kozy:
    "Kozy Heat designs and manufactures premium gas fireplaces in Lakefield, Minnesota. The Bayport, Carlton, and Slayton series are recognized for their intricate burner detail, high-output direct vent technology, and a level of dealer-trained installation that defines the upper end of the category.",
};

const FUEL_KEYWORDS: Array<{ key: string; label: string }> = [
  { key: "gas", label: "Gas" },
  { key: "wood", label: "Wood" },
  { key: "electric", label: "Electric" },
  { key: "pellet", label: "Pellet" },
  { key: "outdoor", label: "Outdoor" },
];

function getBrandBlurb(brandName: string, productCount: number): string {
  const normalized = brandName
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (BRAND_BLURBS[normalized]) {
    return BRAND_BLURBS[normalized];
  }

  return `Aaron's Fireplace Co. is an authorized ${brandName} dealer carrying ${productCount} live ${brandName} models — fireplaces, inserts, and stoves selected for our local install crews and our online customers. Every order is backed by manufacturer warranty, dealer pricing, and direct phone access to a fireplace specialist who knows the line.`;
}

function getFuelType(product: Product): string {
  const source = `${product.name} ${product.categoryId} ${product.subcategoryId ?? ""}`.toLowerCase();
  for (const { key, label } of FUEL_KEYWORDS) {
    if (source.includes(key)) return label;
  }
  return "Other";
}

async function findBrandBySlug(slug: string) {
  const brands = await loadAllBrands();
  return brands.find((b) => b.slug === slug) ?? null;
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const brands = await loadAllBrands();
  return brands.filter((b) => b.count >= 3).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const brand = await findBrandBySlug(params.slug);

  if (!brand) {
    return {
      title: "Brand Not Found",
      description: "The brand you are looking for is not available at Aaron's Fireplace Co.",
      robots: { index: false, follow: true },
    };
  }

  const title = `${brand.name} Fireplaces & Stoves — Authorized Dealer`;
  const description = `Shop ${brand.count} ${brand.name} fireplaces, inserts, and stoves. Authorized dealer with expert consultation, free shipping on most models, and dealer pricing.`;
  const url = absoluteUrl(`/brand/${brand.slug}`);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `${title} | Aaron's Fireplace Co.`,
      description,
      url,
      siteName: defaultStoreConfig.storeName,
      locale: "en_US",
      images: [
        {
          url: "/logo.png",
          width: 1200,
          height: 630,
          alt: `${brand.name} at ${defaultStoreConfig.storeName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Aaron's Fireplace Co.`,
      description,
      images: ["/logo.png"],
    },
  };
}

export default async function BrandPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const [brand, allProducts] = await Promise.all([
    findBrandBySlug(slug),
    loadAllProducts(),
  ]);

  if (!brand) {
    notFound();
  }

  const products = allProducts
    .filter((p) => p.brand && p.brand.toLowerCase() === brand.name.toLowerCase())
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const blurb = getBrandBlurb(brand.name, brand.count);

  const fuelCounts = products.reduce<Record<string, number>>((acc, product) => {
    const fuel = getFuelType(product);
    acc[fuel] = (acc[fuel] ?? 0) + 1;
    return acc;
  }, {});
  const fuelBreakdown = FUEL_KEYWORDS
    .map(({ label }) => ({ label, count: fuelCounts[label] ?? 0 }))
    .filter((entry) => entry.count > 0);

  const brandUrl = `/brand/${brand.slug}`;

  return (
    <main className="min-h-screen bg-[#f6efe5]">
      <StructuredData
        id="brand-jsonld"
        data={brandJsonLd({
          name: brand.name,
          slug: brand.slug,
          description: blurb,
        })}
      />
      <StructuredData
        id="brand-collection-jsonld"
        data={collectionPageJsonLd({
          name: `${brand.name} Fireplaces & Stoves | ${defaultStoreConfig.storeName}`,
          description: blurb,
          url: brandUrl,
          numberOfItems: products.length,
          items: products,
        })}
      />
      <StructuredData
        id="breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: brand.name, url: brandUrl },
        ])}
      />

      <div className="border-b border-[#e6dccb] bg-[#fffdf9]">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6">
          <nav className="flex items-center gap-2 text-sm text-[#6f6255]">
            <Link href="/" className="hover:text-[#a54210]">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#3a2f25]">Brands</span>
            <ChevronRight className="h-4 w-4" />
            <span className="font-semibold text-[#1d1712]">{brand.name}</span>
          </nav>
        </div>
      </div>

      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">
            Authorized {brand.name} Dealer
          </p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">
            {brand.name} Fireplaces &amp; Stoves
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 border border-[#ff7a18] bg-[#ff7a18]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#ffb56b]">
              <ShieldCheck className="h-4 w-4" />
              Authorized Dealer
            </span>
            <span className="inline-flex items-center gap-2 border border-[#ded5c8]/30 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#e6d8c4]">
              {products.length} models in stock
            </span>
            <span className="inline-flex items-center gap-2 border border-[#ded5c8]/30 bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#e6d8c4]">
              <Truck className="h-4 w-4" />
              Free shipping eligible
            </span>
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-[#e6d8c4]">{blurb}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#cabba4]">
            Need help choosing the right {brand.name} model? Call{" "}
            <a className="text-[#ff9a3d] hover:underline" href={`tel:${defaultStoreConfig.phone}`}>
              {defaultStoreConfig.phone}
            </a>{" "}
            or visit our showroom — every {brand.name} sale is supported by an Aaron&apos;s Fireplace
            Co. specialist who knows the line.
          </p>
        </div>
      </section>

      {fuelBreakdown.length > 1 && (
        <section className="border-b border-[#e6dccb] bg-[#fffdf9]">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">
              {brand.name} by fuel type
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {fuelBreakdown.map((entry) => (
                <div
                  key={entry.label}
                  className="border border-[#ded5c8] bg-[#fff7ed] px-5 py-3 text-sm text-[#3a2f25]"
                >
                  <span className="font-black uppercase tracking-[0.14em] text-[#1d1712]">
                    {entry.label}
                  </span>
                  <span className="ml-2 text-[#8a5a35]">{entry.count} models</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {products.length === 0 ? (
          <div className="border border-[#ded5c8] bg-[#fffdf9] px-6 py-16 text-center text-[#6f6255]">
            <p className="text-lg">
              No {brand.name} products are currently displayed online.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
            >
              Contact Us For Availability
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-[#e6dccb] bg-[#fffdf9]">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#a54210]">
              Talk to a {brand.name} specialist
            </p>
            <p className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#1d1712]">
              Dealer pricing, expert sizing, free shipping on most {brand.name} models.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${defaultStoreConfig.phone}`}
              className="inline-flex items-center gap-2 bg-black px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#1d1712]"
            >
              <Phone className="h-4 w-4" />
              Call {defaultStoreConfig.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
