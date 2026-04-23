import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Turbopack/Next's file tracer from scanning the 32K+ localized
  // product images under public/products. Those files are served as static
  // assets — routes never need them in their lambda bundle.
  outputFileTracingExcludes: {
    "*": [
      "public/products/**",
      "public/products/parts/**",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
      {
        protocol: "https",
        hostname: "www.efireplacestore.com",
      },
      {
        protocol: "https",
        hostname: "efireplacestore.com",
      },
      {
        protocol: "https",
        hostname: "cdn11.bigcommerce.com",
      },
    ],
  },
};

export default nextConfig;
