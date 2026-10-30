import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartActivity } from "@/components/CartActivity";
import { defaultStoreConfig } from "@/lib/store-config";
import { getLogoUrl, getLightLogoUrl } from "@/lib/logo-resolver";
import "./globals.css";
import { SITE_URL, jsonLd } from "@/lib/seo";

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
  title: defaultStoreConfig.seo.metaTitle,
  description: defaultStoreConfig.seo.metaDescription,
  keywords: defaultStoreConfig.seo.keywords.join(", "),
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({
          "@context": "https://schema.org", "@type": "Store", "@id": `${SITE_URL}/#business`,
          name: "Aaron's Fireplace Co.", url: SITE_URL, telephone: "+1-417-732-9775", foundingDate: "1989",
          address: { "@type": "PostalAddress", streetAddress: "611 E Harrison St", addressLocality: "Republic", addressRegion: "MO", postalCode: "65738", addressCountry: "US" },
          sameAs: [defaultStoreConfig.social.facebook],
        }) }} />
        <Header logoUrl={logoUrl} />
        <CartActivity />
        <main className="min-h-screen">{children}</main>
        <Footer lightLogoUrl={lightLogoUrl} />
      </body>
    </html>
  );
}
