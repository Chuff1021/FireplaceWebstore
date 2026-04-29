import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { PartsCategoryExperience } from "@/components/parts/PartsCategoryExperience";
import { PartsServerIntro } from "@/components/parts/PartsServerIntro";
import { partsDepartmentSlugs } from "@/lib/parts-taxonomy";
import { loadAllProducts } from "@/lib/all-products";
import {
  defaultStoreConfig,
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/store-config";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";
import { breadcrumbJsonLd, collectionPageJsonLd } from "@/lib/site-jsonld";
import { CategoryFilters } from "./CategoryFilters";

export const dynamicParams = true;
export const revalidate = 3600;

function isPartsCategorySlug(slug: string): boolean {
  return slug === "parts" || partsDepartmentSlugs.has(slug);
}

const FEATURED_BRANDS = [
  "Travis Industries",
  "Fireplace Xtrordinair",
  "Lopi",
  "Napoleon",
  "Superior",
  "Empire",
  "Pearl Mantels",
  "Fire Garden",
];

type ResolvedCategory = {
  slug: string;
  name: string;
  description: string;
  parent: ProductCategory | null;
  category: ProductCategory;
  isTopLevel: boolean;
};

function findCategoryBySlug(slug: string): ResolvedCategory | null {
  const top = productCategories.find((category) => category.slug === slug);
  if (top) {
    return {
      slug,
      name: top.name,
      description: top.description,
      parent: null,
      category: top,
      isTopLevel: true,
    };
  }

  for (const parent of productCategories) {
    const sub = parent.subcategories?.find((s) => s.slug === slug);
    if (sub) {
      return {
        slug,
        name: sub.name,
        description: sub.description,
        parent,
        category: sub,
        isTopLevel: false,
      };
    }
  }

  return null;
}

function filterProductsForCategory(
  products: Product[],
  resolved: ResolvedCategory,
): Product[] {
  const { slug, category, isTopLevel } = resolved;

  const base = products.filter((product) => {
    if (isTopLevel) {
      const subcategoryIds = new Set(
        (category.subcategories ?? []).map((sub) => sub.id),
      );
      return (
        product.categoryId === category.id ||
        Boolean(product.subcategoryId && subcategoryIds.has(product.subcategoryId))
      );
    }
    return product.subcategoryId === category.id || product.categoryId === category.id;
  });

  if (slug === "fireplaces") {
    return Array.from(
      new Map(
        [
          ...base,
          ...products.filter((product) => product.brand === "Lopi"),
        ].map((product) => [product.id, product]),
      ).values(),
    );
  }

  return base;
}

const RICH_INTRO_BY_SLUG: Record<string, string> = {
  fireplaces:
    "Aaron's Fireplace Co. carries a full lineup of gas, wood-burning, electric, and outdoor fireplaces from Travis Industries, Fireplace Xtrordinair, Lopi, Napoleon, Superior, and Empire. Whether you're framing in a brand new linear gas hearth or replacing an old masonry firebox, our team can size, vent, and ship the right unit nationwide.",
  "gas-fireplaces":
    "Shop direct vent and B-vent gas fireplaces from the brands installers actually trust — Fireplace Xtrordinair, Napoleon, Superior, Empire, and more. Filter by BTU, width, vent style, and price to compare every model side by side, then call our specialists for sizing, gas line, and finish recommendations.",
  "wood-fireplaces":
    "Browse EPA-certified wood-burning fireplaces from Lopi, Travis Industries, and other top hearth builders. These radiant heat machines deliver the look of a real wood fire with modern combustion efficiency, secondary burn tubes, and large viewing glass — built to heat the whole house when the power goes out.",
  "electric-fireplaces":
    "Plug-and-play electric fireplaces from Dimplex, Modern Flames, Touchstone, and more — no venting, no gas line, no chimney required. Wall-mount, recessed, and built-in linear styles ship to all 50 states with realistic flame technology and supplemental heat for any room.",
  "outdoor-fireplaces":
    "Bring the hearth outside with Fire Garden and other premium outdoor gas fireplaces engineered for patios, pool decks, and outdoor kitchens. Stainless burners, weather-tight construction, and contemporary linear designs make a statement in any outdoor living space.",
  inserts:
    "Convert an inefficient masonry fireplace into a real heat source with a high-efficiency gas, wood, pellet, or electric insert. Aaron's Fireplace Co. stocks the most popular sizes from Lopi, Fireplace Xtrordinair, Napoleon, and Superior — and our experts measure your existing firebox so the new insert drops in clean.",
  "gas-inserts":
    "Direct vent gas fireplace inserts from Fireplace Xtrordinair, Napoleon, Superior, and Empire turn cold, drafty masonry fireplaces into 70-80% efficient zone heaters. Compare BTU output, viewing area, ember bed style, and remote options — then schedule a free measure with our certified hearth team.",
  "wood-inserts":
    "EPA-certified wood-burning inserts from Lopi, Travis Industries, and other proven brands. These steel and cast iron heat machines slide into existing masonry fireplaces and deliver up to 80% efficiency, secondary combustion, and 8-12 hour burn times on a single load.",
  "pellet-inserts":
    "Hands-off, thermostat-controlled pellet inserts from Harman, Quadra-Fire, and other leading pellet stove makers. Hopper-fed combustion delivers steady heat with one fill per day — perfect for converting an underperforming masonry fireplace into a real whole-room heating appliance.",
  "electric-inserts":
    "Drop-in electric fireplace inserts that bring instant flame ambience and supplemental heat to any existing fireplace opening. Plug-in installation, multi-color flame options, and silent fan-forced heaters from Dimplex, Modern Flames, and more.",
  stoves:
    "Freestanding wood, pellet, and gas stoves from Lopi, Travis Industries, Harman, and Quadra-Fire. Whether you're heating a cabin, a workshop, or your main living area, our specialists size the right BTU output and vent kit so the stove ships ready to install.",
  "wood-stoves":
    "EPA 2020-certified wood stoves from Lopi, Travis Industries, and other premium brands. Compare firebox size, BTU output, heat coverage, and burn time — every stove ships with the right vent components for a clean, code-compliant install.",
  "pellet-stoves":
    "Pellet stoves from Harman, Quadra-Fire, and more — automatic ignition, programmable thermostat, and 40+ pound hoppers for hands-off whole-room heat. The most efficient way to heat with biomass and a popular alternative to propane heat.",
  "gas-stoves":
    "Cast iron and steel gas stoves with the warmth of a hearth and the convenience of thermostatic control. Direct vent and B-vent options from Lopi, Napoleon, and Empire — perfect for bedrooms, additions, basements, and anywhere a chimney isn't practical.",
  outdoor:
    "Build a complete outdoor living space with fire pits, outdoor fireplaces, and gas burners from Fire Garden and other patio brands. Stainless construction, weather-rated electronics, and contemporary linear styling ship anywhere in the lower 48.",
  "fire-pits":
    "Linear and round gas fire pit burners, pans, and complete fire pit tables. Match-light and electronic ignition options sized from 24-inch patio designs all the way up to commercial 60-inch builds.",
  accessories:
    "Mantels, hearth pads, screens, glass doors, remotes, and decorative media — everything you need to finish a fireplace project. Pearl Mantels, Magra Hearth, and Skytech are stocked and ready to ship.",
  mantels:
    "Pearl Mantels solid wood mantel shelves and surrounds, plus Magra Hearth heat-resistant mantel beams and hearth slabs. Made in the USA, sized to fit standard openings, and ready to install with included hardware.",
  "remotes-controls":
    "Replacement and upgrade fireplace remotes, receivers, wall thermostats, and ignition modules from Skytech, Mertik Maxitrol, and other OEM-equivalent control brands. Match the right control to your existing valve so the fireplace works exactly the way it should.",
  "doors-screens":
    "Custom and stock fireplace glass doors, mesh curtain screens, and decorative grille screens. Protect kids and pets, slow down heat loss, and finish the front of any masonry or factory-built fireplace.",
  "logs-media":
    "Vented and vent-free gas log sets, plus glass media, decorative stones, and ceramic ember beds. Match the look of your fireplace's burner and finish off the flame appearance with the right realistic media.",
  parts:
    "The largest dedicated fireplace parts catalog on the web — over 13,000 OEM and OEM-equivalent replacement parts for wood, gas, pellet, and electric appliances. Search by appliance brand or part type and our specialists will confirm fitment before it ships.",
  "wood-coal-stove-parts":
    "Replacement firebricks, gaskets, glass, blowers, baffles, and burn tubes for wood and coal stoves, inserts, and furnaces. We carry parts for vintage and current models from every major North American manufacturer.",
  "gas-fireplace-parts":
    "Valves, pilots, thermocouples, thermopiles, burners, log sets, glass panels, and ignition modules for direct vent, B-vent, and vent-free gas fireplaces. OEM and OEM-equivalent parts ship same day on most in-stock items.",
  "gas-stove-parts":
    "Service parts for direct vent and freestanding gas stoves — gaskets, glass, valves, pilots, log sets, and ignition components. Match by appliance model number for guaranteed-fit replacements.",
  "pellet-stove-parts":
    "Augers, igniters, combustion blowers, room blowers, control boards, gaskets, and wear parts for every major pellet stove and pellet insert. Ship same day on most in-stock parts to keep your stove running through the heating season.",
  "electric-fireplace-parts":
    "Heating elements, LED light kits, remotes, receivers, and control boards for electric fireplaces and inserts from Dimplex, ClassicFlame, Touchstone, and more.",
  "outdoor-fireplace-parts":
    "Stainless burners, valves, key valves, fire pit pans, and weather-resistant ignition components for outdoor gas fireplaces and fire pits.",
};

function buildIntro(resolved: ResolvedCategory, count: number): string {
  const fromMap = RICH_INTRO_BY_SLUG[resolved.slug];
  if (fromMap) return fromMap;

  return `Shop ${count}+ ${resolved.name.toLowerCase()} from top hearth brands like Travis Industries, Lopi, Napoleon, Superior, and Empire. Aaron's Fireplace Co. ships nationwide with free expert consultation, in-house sizing support, and dealer-direct pricing. ${resolved.description}.`;
}

function buildMetaDescription(resolved: ResolvedCategory, count: number): string {
  const desc = `Shop ${count}+ ${resolved.name.toLowerCase()} from top brands like Travis Industries, Lopi, Napoleon, Superior, and Empire. Free expert sizing, nationwide shipping, dealer pricing.`;
  return desc.length > 160 ? desc.slice(0, 157).trimEnd() + "..." : desc;
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = new Set<string>();
  for (const category of productCategories) {
    slugs.add(category.slug);
    for (const sub of category.subcategories ?? []) {
      slugs.add(sub.slug);
    }
  }
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;

  if (isPartsCategorySlug(slug)) {
    const resolved = findCategoryBySlug(slug);
    const name = resolved?.name ?? "Fireplace Parts";
    const description =
      "Shop 13,000+ OEM and OEM-equivalent fireplace, wood stove, pellet stove, and gas appliance replacement parts. Same-day shipping, expert fitment support, and free phone consultation.";
    return {
      title: `${name} — Replacement Parts Catalog`,
      description,
      alternates: { canonical: absoluteUrl(`/category/${slug}`) },
      openGraph: {
        type: "website",
        title: `${name} — Aaron's Fireplace Co.`,
        description,
        url: absoluteUrl(`/category/${slug}`),
        siteName: defaultStoreConfig.storeName,
        images: ["/logo.png"],
      },
      twitter: {
        card: "summary_large_image",
        title: `${name} — Aaron's Fireplace Co.`,
        description,
        images: ["/logo.png"],
      },
    };
  }

  const resolved = findCategoryBySlug(slug);
  if (!resolved) {
    return {
      title: "Category Not Found",
      description: "The category you are looking for is not available.",
      robots: { index: false, follow: false },
      alternates: { canonical: absoluteUrl(`/category/${slug}`) },
    };
  }

  const allProducts = await loadAllProducts();
  const products = filterProductsForCategory(allProducts, resolved);
  const count = products.length;

  const description = buildMetaDescription(resolved, count);
  const ogImageProduct = products.find((p) => p.images?.[0]);
  const ogImage = ogImageProduct?.images?.[0]
    ? absoluteUrl(ogImageProduct.images[0])
    : `${SITE_URL}/logo.png`;

  const title = count > 0
    ? `${resolved.name} — ${count}+ Models`
    : resolved.name;

  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(`/category/${slug}`) },
    openGraph: {
      type: "website",
      title: `${resolved.name} — Aaron's Fireplace Co.`,
      description,
      url: absoluteUrl(`/category/${slug}`),
      siteName: defaultStoreConfig.storeName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: resolved.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${resolved.name} — Aaron's Fireplace Co.`,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const resolved = findCategoryBySlug(slug);

  // Parts categories use a dedicated taxonomy-driven experience with SSR crawl content.
  if (isPartsCategorySlug(slug)) {
    const name = resolved?.name ?? "Fireplace Parts";
    const description =
      "Shop OEM and OEM-equivalent fireplace, wood stove, pellet stove, and gas appliance replacement parts with expert fitment support from Aaron's Fireplace Co.";
    const allProducts = await loadAllProducts();
    const partsProducts = allProducts.filter((product) =>
      slug === "parts"
        ? product.categoryId === "parts" || product.subcategoryId?.includes("parts")
        : product.subcategoryId === slug || product.categoryId === slug,
    );
    const breadcrumbItems = [
      { name: "Home", url: "/" },
      ...(resolved?.parent
        ? [{ name: resolved.parent.name, url: `/category/${resolved.parent.slug}` }]
        : []),
      { name, url: `/category/${slug}` },
    ];

    return (
      <>
        <StructuredData
          id="parts-collection-jsonld"
          data={collectionPageJsonLd({
            name: `${name} | ${defaultStoreConfig.storeName}`,
            description,
            url: `/category/${slug}`,
            numberOfItems: partsProducts.length,
            items: partsProducts,
          })}
        />
        <StructuredData
          id="parts-breadcrumb-jsonld"
          data={breadcrumbJsonLd(breadcrumbItems)}
        />
        <PartsServerIntro slug={slug} products={partsProducts} />
        <Suspense
          fallback={
            <div className="mx-auto max-w-[1640px] px-4 py-12 text-center text-sm text-[#5b5d5b] md:px-5">
              Loading parts catalog...
            </div>
          }
        >
          <PartsCategoryExperience slug={slug} showHero={false} />
        </Suspense>
      </>
    );
  }

  if (!resolved) {
    notFound();
  }

  const allProducts = await loadAllProducts();
  const categoryProducts = filterProductsForCategory(allProducts, resolved);
  const productCount = categoryProducts.length;

  const introText = buildIntro(resolved, productCount);
  const subcategoryLinks = resolved.isTopLevel
    ? resolved.category.subcategories ?? []
    : resolved.parent?.subcategories ?? [];

  const breadcrumbItems: Array<{ name: string; url: string }> = [
    { name: "Home", url: "/" },
  ];
  if (resolved.parent) {
    breadcrumbItems.push({
      name: resolved.parent.name,
      url: `/category/${resolved.parent.slug}`,
    });
  }
  breadcrumbItems.push({ name: resolved.name, url: `/category/${slug}` });

  const collectionData = collectionPageJsonLd({
    name: `${resolved.name} | ${defaultStoreConfig.storeName}`,
    description: buildMetaDescription(resolved, productCount),
    url: `/category/${slug}`,
    numberOfItems: productCount,
    items: categoryProducts,
  });
  const breadcrumbData = breadcrumbJsonLd(breadcrumbItems);

  // Featured brand pills (visible on initial server render for crawlers).
  const brandCounts = categoryProducts.reduce<Record<string, number>>((acc, product) => {
    if (product.brand) acc[product.brand] = (acc[product.brand] ?? 0) + 1;
    return acc;
  }, {});
  const visibleFeaturedBrands = FEATURED_BRANDS.filter((brand) => brandCounts[brand]);

  return (
    <div className="min-h-screen bg-white text-[#212121]">
      <StructuredData id="category-collection-jsonld" data={collectionData} />
      <StructuredData id="category-breadcrumb-jsonld" data={breadcrumbData} />

      <div className="mx-auto max-w-[1640px] px-4 pt-3 md:px-5 xl:px-5">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 mt-3 flex items-center gap-2 text-xs text-[#5b5d5b]"
        >
          <Link href="/" className="hover:text-[#a54210]">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          {resolved.parent && (
            <>
              <Link
                href={`/category/${resolved.parent.slug}`}
                className="hover:text-[#a54210]"
              >
                {resolved.parent.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
          <span className="text-[#c4c4c4]">{resolved.name}</span>
        </nav>
      </div>

      <section className="border-b border-[#e0e0e0]">
        <div className="mx-auto max-w-[1640px] px-4 py-8 md:px-5 md:py-10 xl:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a54210]">
            Aaron&apos;s Fireplace Superstore
          </p>
          <h1 className="mt-2 text-[34px] font-black leading-[1.08] tracking-[-0.045em] text-[#212121] md:text-[44px] xl:text-[56px]">
            {resolved.name}
          </h1>
          <p className="mt-4 max-w-[920px] text-base leading-7 text-[#5b5d5b] md:text-[17px]">
            {introText}
          </p>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#7a3a16]">
            {productCount > 0
              ? `${productCount} ${resolved.name.toLowerCase()} ready to ship`
              : `Curated ${resolved.name.toLowerCase()} catalog`}
          </p>

          {subcategoryLinks.length > 0 && (
            <nav
              aria-label={`${resolved.name} sub-categories`}
              className="mt-6 flex flex-wrap gap-2"
            >
              {subcategoryLinks.map((subcategory) => {
                const isActive = subcategory.slug === slug;
                return (
                  <Link
                    key={subcategory.id}
                    href={`/category/${subcategory.slug}`}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-[#a54210] bg-[#a54210] text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-[#a54210] hover:text-[#a54210]"
                    }`}
                  >
                    {subcategory.name}
                  </Link>
                );
              })}
            </nav>
          )}

          {visibleFeaturedBrands.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a54210]">
                Featured brands in this collection
              </p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {visibleFeaturedBrands.map((brand) => (
                  <li key={brand}>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#e1cbb2] bg-[#fffaf3] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#2a211b]">
                      {brand}
                      <span className="text-[#8a5a35]">({brandCounts[brand]})</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section>
        <Suspense
          fallback={
            <div className="mx-auto max-w-[1640px] px-4 py-12 text-center text-sm text-[#5b5d5b] md:px-5">
              Loading {resolved.name.toLowerCase()}...
            </div>
          }
        >
          <CategoryFilters
            slug={slug}
            categoryName={resolved.name}
            products={categoryProducts}
          />
        </Suspense>
      </section>

      <section className="border-t border-[#e0e0e0] bg-[#f4f4f4] xl:bg-[#212121]">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 px-4 py-7 text-[#212121] md:px-5 md:py-8 xl:h-16 xl:min-h-16 xl:flex-row xl:items-center xl:gap-[60px] xl:px-5 xl:py-0 xl:text-white">
          <div className="flex flex-col xl:flex-row xl:items-center">
            <p className="text-[22px] font-bold xl:mr-2 xl:text-[22px]">Have Questions?</p>
            <p className="text-lg md:text-xl xl:text-xl">Talk to a fireplace specialist</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap xl:ml-auto xl:gap-9">
            <a
              href={`tel:${defaultStoreConfig.phone}`}
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.08em] xl:text-base xl:font-normal xl:tracking-[0.06em]"
            >
              Call {defaultStoreConfig.phone}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center text-sm font-bold uppercase tracking-[0.08em] xl:text-base xl:font-normal xl:tracking-[0.06em]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
