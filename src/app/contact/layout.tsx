import type { Metadata } from "next";

import { seoMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = seoMetadata({
  title: "Contact Aaron's Fireplace Co.",
  description: "Contact Aaron's Fireplace Co. for fireplace selection, replacement parts, installation planning, service questions, and showroom support in Republic, MO.",
  path: "/contact",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
