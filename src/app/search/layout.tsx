import type { Metadata } from "next";

import { absoluteUrl } from "@/lib/site-url";
import { defaultStoreConfig } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Search Fireplaces, Stoves & Parts",
  description:
    "Search the full Aaron's Fireplace Co. catalog of fireplaces, inserts, stoves, and parts. Find the right model by name, brand, SKU, or category.",
  alternates: { canonical: absoluteUrl("/search") },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    title: "Search Fireplaces, Stoves & Parts | Aaron's Fireplace Co.",
    description:
      "Search the full Aaron's Fireplace Co. catalog of fireplaces, inserts, stoves, and parts.",
    url: absoluteUrl("/search"),
    siteName: defaultStoreConfig.storeName,
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: defaultStoreConfig.storeName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Fireplaces, Stoves & Parts | Aaron's Fireplace Co.",
    description:
      "Search the full Aaron's Fireplace Co. catalog of fireplaces, inserts, stoves, and parts.",
    images: ["/logo.png"],
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
