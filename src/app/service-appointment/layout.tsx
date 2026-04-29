import type { Metadata } from "next";

import { seoMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = seoMetadata({
  title: 'Schedule Fireplace Service',
  description: "Request fireplace, stove, or insert service help from Aaron's Fireplace Co. for maintenance, diagnostics, cleaning, and repair planning.",
  path: "/service-appointment",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
