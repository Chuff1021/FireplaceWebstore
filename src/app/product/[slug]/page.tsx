import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  Truck,
  Shield,
  Phone,
  Check,
} from "lucide-react";

import {
  loadAllProducts,
  loadProductBySlug,
} from "@/lib/all-products";
import {
  defaultStoreConfig,
  productCategories,
  type Product,
  type ProductCategory,
} from "@/lib/store-config";
import { ProductCard } from "@/components/ui/ProductCard";
import { AlternateVendors } from "@/components/parts/AlternateVendors";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  productJsonLd,
  breadcrumbJsonLd,
  type BreadcrumbItem,
} from "@/lib/site-jsonld";
import { absoluteUrl, SITE_URL } from "@/lib/site-url";

import { PdpGallery, PdpBuyBox } from "./PdpClient";

export const dynamicParams = true;
export const revalidate = 3600;

const PRERENDER_LIMIT = 500;

type RouteParams = { slug: string };
type RouteContext = { params: Promise<RouteParams> };

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

function findCategory(id: string | undefined): ProductCategory | null {
  if (!id) return null;
  for (const top of productCategories) {
    if (top.id === id || top.slug === id) return top;
    for (const sub of top.subcategories ?? []) {
      if (sub.id === id || sub.slug === id) return sub;
    }
  }
  return null;
}

function findTopCategoryFor(product: Product): ProductCategory | null {
  for (const top of productCategories) {
    if (top.id === product.categoryId || top.slug === product.categoryId) {
      return top;
    }
    for (const sub of top.subcategories ?? []) {
      if (
        sub.id === product.categoryId ||
        sub.slug === product.categoryId ||
        sub.id === product.subcategoryId ||
        sub.slug === product.subcategoryId
      ) {
        return top;
      }
    }
  }
  return null;
}

function truncateMeta(value: string): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized.length <= 160
    ? normalized
    : `${normalized.slice(0, 157).trimEnd()}...`;
}

function categoryNameFor(product: Product): string {
  const category = findCategory(product.subcategoryId) ?? findCategory(product.categoryId);
  return category?.name.toLowerCase() ?? "hearth product";
}

function metaDescriptionFor(product: Product): string {
  const categoryName = categoryNameFor(product);
  const skuText = product.sku ? ` SKU ${product.sku}` : "";
  const partType = product.specifications["Part Type"] || "replacement part";

  if (product.categoryId === "parts" || product.subcategoryId?.includes("parts")) {
    return truncateMeta(
      `${product.brand} ${product.name}${skuText} ${partType} for fireplaces, stoves, and hearth appliances. Verify fitment with Aaron's Fireplace Co. before ordering.`,
    );
  }

  if (product.contactForPricing || product.price <= 0) {
    return truncateMeta(
      `${product.brand} ${product.name}${skuText} ${categoryName}. Contact Aaron's Fireplace Co. for pricing, availability, sizing, venting, and ordering support.`,
    );
  }

  const price = product.salePrice ?? product.price;
  return truncateMeta(
    `${product.brand} ${product.name}${skuText} ${categoryName} from Aaron's Fireplace Co. Shop online for ${formatPrice(price)}, with expert sizing and order support.`,
  );
}

export async function generateStaticParams(): Promise<RouteParams[]> {
  try {
    const products = await loadAllProducts();
    const score = (p: Product) => {
      let s = 0;
      if (p.isFeatured) s += 100;
      if (p.isBestSeller) s += 50;
      if (p.isNew) s += 25;
      return s;
    };
    return products
      .slice()
      .sort((a, b) => score(b) - score(a))
      .slice(0, PRERENDER_LIMIT)
      .map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: RouteContext): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProductBySlug(slug);

  if (!product) {
    return {
      title: "Product not found",
      description:
        "The product you're looking for is no longer available at Aaron's Fireplace Co.",
      robots: { index: false, follow: true },
    };
  }

  const titleBase = product.brand
    ? `${product.brand} ${product.name}`
    : product.name;
  const description = metaDescriptionFor(product);
  const canonical = absoluteUrl(`/product/${product.slug}`);
  const primaryImage = product.images?.[0]
    ? absoluteUrl(product.images[0])
    : `${SITE_URL}/logo.png`;

  return {
    title: titleBase,
    description,
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: defaultStoreConfig.storeName,
      title: titleBase,
      description,
      url: canonical,
      images: [
        {
          url: primaryImage,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }: RouteContext) {
  const { slug } = await params;
  const products = await loadAllProducts();
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const isContactForPricing = product.contactForPricing || product.price <= 0;
  const discount =
    !isContactForPricing && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  const subcategory = findCategory(product.subcategoryId);
  const topCategory =
    findTopCategoryFor(product) ?? findCategory(product.categoryId);

  // Related products: same subcategoryId first, fall back to categoryId.
  // Exclude self, take 4. Apply existing FPX recommendation override.
  const sameSub = product.subcategoryId
    ? products.filter(
        (p) => p.id !== product.id && p.subcategoryId === product.subcategoryId,
      )
    : [];
  const sameCat = products.filter(
    (p) => p.id !== product.id && p.categoryId === product.categoryId,
  );

  let relatedPool: Product[] = sameSub.length > 0 ? sameSub : sameCat;

  if (product.brand === "Fireplace Xtrordinair") {
    const featuredFireplaceRecommendations = ["fpx-42apex", "fpx-44elitenexgenhybrid"]
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p))
      .filter((p) => p.id !== product.id);
    relatedPool = Array.from(
      new Map(
        [...featuredFireplaceRecommendations, ...relatedPool].map((p) => [p.id, p]),
      ).values(),
    );
  }

  const relatedProducts = relatedPool.slice(0, 4);

  // Build breadcrumb chain.
  const breadcrumbItems: BreadcrumbItem[] = [{ name: "Home", url: "/" }];
  if (topCategory) {
    breadcrumbItems.push({
      name: topCategory.name,
      url: `/category/${topCategory.slug}`,
    });
  }
  if (subcategory && subcategory.id !== topCategory?.id) {
    breadcrumbItems.push({
      name: subcategory.name,
      url: `/category/${subcategory.slug}`,
    });
  }
  breadcrumbItems.push({
    name: product.name,
    url: `/product/${product.slug}`,
  });

  return (
    <div className="bg-white">
      <StructuredData id="product-jsonld" data={productJsonLd(product)} />
      <StructuredData
        id="breadcrumb-jsonld"
        data={breadcrumbJsonLd(breadcrumbItems)}
      />

      {/* Breadcrumb */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-600">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            {topCategory ? (
              <>
                <Link
                  href={`/category/${topCategory.slug}`}
                  className="hover:text-orange-600"
                >
                  {topCategory.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : null}
            {subcategory && subcategory.id !== topCategory?.id ? (
              <>
                <Link
                  href={`/category/${subcategory.slug}`}
                  className="hover:text-orange-600"
                >
                  {subcategory.name}
                </Link>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : null}
            <span className="text-gray-900 font-medium line-clamp-1">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images (interactive island) */}
          <PdpGallery product={product} />

          {/* Product Info */}
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {isContactForPricing
                  ? "Contact for Pricing"
                  : formatPrice(product.salePrice ?? product.price)}
              </span>
              {!isContactForPricing && product.salePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                    Save {formatPrice(product.price - product.salePrice)}
                    {discount > 0 ? ` (${discount}% off)` : ""}
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6">{product.shortDescription}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock</span>
                  <span className="text-sm text-gray-500">
                    ({product.stockQuantity} available)
                  </span>
                </div>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* SKU */}
            <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>

            {product.categoryId === "parts" && product.sku ? (
              <AlternateVendors
                sku={product.sku}
                currentVendor="stove-parts-unlimited"
              />
            ) : null}

            {/* Quantity & Add to Cart (interactive island) */}
            <PdpBuyBox product={product} />

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Free Shipping</p>
                  <p className="text-xs text-gray-500">
                    Orders over ${defaultStoreConfig.business.freeShipping.minimum}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Warranty</p>
                  <p className="text-xs text-gray-500">Manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="font-medium text-sm text-gray-900">Expert Help</p>
                  <p className="text-xs text-gray-500">{defaultStoreConfig.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description, Specs, Reviews — rendered server-side as sections so
            full content is available to crawlers. Anchored for in-page nav. */}
        <div className="mt-16 space-y-12">
          <section id="description">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
            <div className="max-w-3xl">
              <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
                {product.description}
              </p>
              {product.features && product.features.length > 0 ? (
                <>
                  <h3 className="font-bold text-gray-900 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </section>

          {product.specifications &&
          Object.keys(product.specifications).length > 0 ? (
            <section id="specifications">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Specifications
              </h2>
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(
                      ([key, value], i) => (
                        <tr
                          key={key}
                          className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="px-4 py-3 font-medium text-gray-900 w-1/3">
                            {key}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{value}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {product.reviewCount > 0 ? (
            <section id="reviews">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reviews ({product.reviewCount})
              </h2>
              <div className="max-w-3xl">
                <div className="flex items-center gap-6 mb-8 p-6 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900">
                      {product.rating}
                    </div>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
