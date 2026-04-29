import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { defaultStoreConfig } from "@/lib/store-config";
import { getLogoUrl, getLightLogoUrl } from "@/lib/logo-resolver";
import { SITE_URL } from "@/lib/site-url";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  organizationJsonLd,
  localBusinessJsonLd,
  websiteJsonLd,
} from "@/lib/site-jsonld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultStoreConfig.seo.metaTitle,
    template: `%s | ${defaultStoreConfig.storeName}`,
  },
  description: defaultStoreConfig.seo.metaDescription,
  keywords: defaultStoreConfig.seo.keywords.join(", "),
  applicationName: defaultStoreConfig.storeName,
  openGraph: {
    type: "website",
    siteName: defaultStoreConfig.storeName,
    title: defaultStoreConfig.seo.metaTitle,
    description: defaultStoreConfig.seo.metaDescription,
    url: SITE_URL,
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
    title: defaultStoreConfig.seo.metaTitle,
    description: defaultStoreConfig.seo.metaDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const logoUrl = getLogoUrl();
  const lightLogoUrl = getLightLogoUrl();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <StructuredData id="ld-organization" data={organizationJsonLd()} />
        <StructuredData id="ld-localbusiness" data={localBusinessJsonLd()} />
        <StructuredData id="ld-website" data={websiteJsonLd()} />
        <Header logoUrl={logoUrl} />
        <main className="min-h-screen">{children}</main>
        <Footer lightLogoUrl={lightLogoUrl} />
      </body>
    </html>
  );
}
