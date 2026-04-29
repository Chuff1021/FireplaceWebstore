export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://aaronsfireplaceco.com"
).replace(/\/+$/, "");

export function absoluteUrl(path: string): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
