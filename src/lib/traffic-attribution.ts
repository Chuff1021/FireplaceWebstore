// Only a channel label and a public landing path are retained. Never store URL
// queries, referrer URLs, search terms, customer details or ad identifiers.
export type TrafficAttribution = { channel: string; landingPath: string };
const publicPath = /^\/(?:$|(?:category|product|guides|parts|tools)(?:\/[a-z0-9-]+){0,3}\/?$|(?:installation|showrooms|about|contact|shipping|returns|faq|warranty)\/?$)/;
export function classifyLanding(href: string, referrer: string): TrafficAttribution {
  const url = new URL(href);
  const medium = (url.searchParams.get("utm_medium") || "").toLowerCase();
  let host = "";
  try { host = new URL(referrer).hostname.toLowerCase(); } catch { /* no referrer */ }
  const paid = ["cpc", "ppc", "paid", "paidsearch", "paid-social"].includes(medium) || ["gclid", "msclkid"].some(k => url.searchParams.has(k));
  const channel = paid ? "paid" : medium === "email" ? "email" : medium === "organic" ? "organic"
    : host === url.hostname || !host ? "direct"
    : /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|search\.yahoo\.com)$/.test(host) ? "organic"
    : /(^|\.)(facebook\.com|instagram\.com|youtube\.com|t\.co|pinterest\.com)$/.test(host) ? "social" : "referral";
  return { channel, landingPath: publicPath.test(url.pathname) && url.pathname.length <= 220 ? url.pathname : "/" };
}
