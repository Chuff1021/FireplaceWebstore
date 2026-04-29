import { defaultStoreConfig } from "@/lib/store-config";
import { SITE_URL } from "@/lib/site-url";

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
