import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { defaultStoreConfig } from "@/lib/store-config";
import { getLogoUrl, getLightLogoUrl } from "@/lib/logo-resolver";
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
        <Header logoUrl={logoUrl} />
        <main className="min-h-screen">{children}</main>
        <Footer lightLogoUrl={lightLogoUrl} />
      </body>
    </html>
  );
}
