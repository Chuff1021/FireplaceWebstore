import { defaultStoreConfig, type Product } from "@/lib/store-config";
import { SITE_URL, absoluteUrl } from "@/lib/site-url";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: defaultStoreConfig.storeName,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
    telephone: defaultStoreConfig.phone,
    email: defaultStoreConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: defaultStoreConfig.address.street,
      addressLocality: defaultStoreConfig.address.city,
      addressRegion: defaultStoreConfig.address.state,
      postalCode: defaultStoreConfig.address.zip,
      addressCountry: "US",
    },
    sameAs: [
      defaultStoreConfig.social.facebook,
      defaultStoreConfig.social.instagram,
      defaultStoreConfig.social.youtube,
      defaultStoreConfig.social.twitter,
      defaultStoreConfig.social.pinterest,
    ].filter(Boolean),
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "HomeAndConstructionBusiness"],
    "@id": `${SITE_URL}/#localbusiness`,
    name: defaultStoreConfig.storeName,
    description: defaultStoreConfig.seo.metaDescription,
    url: SITE_URL,
    image: `${SITE_URL}/logo.png`,
    logo: `${SITE_URL}/logo.png`,
    telephone: defaultStoreConfig.phone,
    email: defaultStoreConfig.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: defaultStoreConfig.address.street,
      addressLocality: defaultStoreConfig.address.city,
      addressRegion: defaultStoreConfig.address.state,
      postalCode: defaultStoreConfig.address.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 37.1206,
      longitude: -93.4716,
    },
    areaServed: [
      { "@type": "State", name: "Missouri" },
      { "@type": "City", name: "Republic" },
      { "@type": "City", name: "Springfield" },
      { "@type": "City", name: "Branson" },
      { "@type": "City", name: "Nixa" },
      { "@type": "City", name: "Ozark" },
      { "@type": "Country", name: "United States" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "17:00",
      },
    ],
    sameAs: [defaultStoreConfig.social.facebook].filter(Boolean),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: defaultStoreConfig.storeName,
    description: defaultStoreConfig.seo.metaDescription,
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { name: string; url: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function productJsonLd(product: Product) {
  const productUrl = absoluteUrl(`/product/${product.slug}`);
  const primaryImage = product.images?.[0]
    ? absoluteUrl(product.images[0])
    : `${SITE_URL}/logo.png`;
  const allImages = (product.images ?? [])
    .filter(Boolean)
    .map((img) => absoluteUrl(img));

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.name,
    sku: product.sku,
    mpn: product.sku,
    description: product.description || product.shortDescription,
    image: allImages.length > 0 ? allImages : [primaryImage],
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
  };

  if (typeof product.reviewCount === "number" && product.reviewCount > 0 && typeof product.rating === "number" && product.rating > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    };
  }

  const price =
    typeof product.salePrice === "number" && product.salePrice > 0
      ? product.salePrice
      : product.price;
  if (!product.contactForPricing && typeof price === "number" && price > 0) {
    data.offers = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}/#organization` },
    };
  }

  return data;
}

export function collectionPageJsonLd(opts: {
  name: string;
  description: string;
  url: string;
  numberOfItems?: number;
  items?: Pick<Product, "name" | "slug">[];
}) {
  const itemListElement = (opts.items ?? []).slice(0, 24).map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    url: absoluteUrl(`/product/${item.slug}`),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${absoluteUrl(opts.url)}#collection`,
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.url),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    ...(typeof opts.numberOfItems === "number" || itemListElement.length > 0
      ? {
          mainEntity: {
            "@type": "ItemList",
            ...(typeof opts.numberOfItems === "number"
              ? { numberOfItems: opts.numberOfItems }
              : {}),
            ...(itemListElement.length > 0 ? { itemListElement } : {}),
          },
        }
      : {}),
  };
}

export function brandJsonLd(opts: {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": `${absoluteUrl(`/brand/${opts.slug}`)}#brand`,
    name: opts.name,
    url: absoluteUrl(`/brand/${opts.slug}`),
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.logo ? { logo: absoluteUrl(opts.logo) } : {}),
  };
}
