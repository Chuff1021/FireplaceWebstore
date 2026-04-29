import type { Metadata } from "next";

import { SITE_URL, absoluteUrl } from "@/lib/site-url";
import { defaultStoreConfig } from "@/lib/store-config";

type SeoMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string;
  index?: boolean;
};

export function seoMetadata({
  title,
  description,
  path,
  image = "/logo.png",
  index = true,
}: SeoMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);
  const fullTitle = title.includes(defaultStoreConfig.storeName)
    ? title
    : `${title} | ${defaultStoreConfig.storeName}`;

  return {
    title,
    description,
    alternates: { canonical },
    robots: {
      index,
      follow: index,
      googleBot: {
        index,
        follow: index,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: canonical,
      siteName: defaultStoreConfig.storeName,
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: defaultStoreConfig.storeName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export const homeUrl = SITE_URL;
