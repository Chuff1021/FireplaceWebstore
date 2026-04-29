import type { Metadata } from "next";

import { seoMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = seoMetadata({
  title: 'Fireplace Design Tool',
  description: "Use Aaron's Fireplace Co.'s fireplace design tool to narrow down fuel type, project scope, room size, style, budget, and next steps.",
  path: "/design-tool",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
