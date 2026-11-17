"use client";
import { landingAttribution } from "./landing-session";
import type { CartItem } from "./cart-store";

let memoryId = "";
let queue: Promise<unknown> = Promise.resolve();
const replacementIds = new Map<string, string>();
export function cartJourneyId() {
  try {
    const saved = sessionStorage.getItem("aarons-cart-journey");
    const touched = Number(sessionStorage.getItem("aarons-cart-touch") || 0);
    sessionStorage.setItem("aarons-cart-touch", String(Date.now()));
    if (saved && /^[a-f0-9-]{36}$/i.test(saved) && Date.now() - touched < 30 * 60000) return saved;
    if (saved) memoryId = "";
    memoryId ||= crypto.randomUUID();
    sessionStorage.setItem("aarons-cart-journey", memoryId);
  } catch { memoryId ||= crypto.randomUUID(); }
  return memoryId;
}
export function resetCartJourney() {
  memoryId = "";
  try { sessionStorage.removeItem("aarons-cart-journey"); sessionStorage.removeItem("aarons-cart-touch"); } catch { /* Private browsing may disable storage. */ }
}
export function cartSnapshot(items: CartItem[]) {
  return items.slice(0, 25).map(({ product, quantity }) => ({
    name: product.name, sku: product.sku, quantity,
    price: product.salePrice ?? product.price,
  }));
}
export function recordCartActivity(
  event: "cart" | "checkout" | "heartbeat" | "leave" | "contact" | "call" | "empty",
  items: CartItem[],
  extra: { contact?: { name: string; email: string; phone: string }; intent?: "checkout" | "callback" | "quote"; notes?: string } = {},
) {
  const payload = { action: "cart_activity", journeyId: cartJourneyId(), event, items: cartSnapshot(items), attribution: landingAttribution(), ...extra };
  // Establish the first cookie before the next event or contact-field edit.
  const result = queue.catch(() => {}).then(async () => {
    for (let attempt = 0; attempt < 2; attempt++) {
      while (replacementIds.has(payload.journeyId)) payload.journeyId = replacementIds.get(payload.journeyId)!;
      const response = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        keepalive: true, signal: AbortSignal.timeout(15000),
      });
      const data = await response.json();
      if (response.status === 404 && attempt === 0 && ["cart", "checkout", "contact", "call"].includes(event)) {
        // A cleared/expired cookie cannot reclaim an old cart. Start a fresh
        // session instead, including queued contact edits, without exposing it.
        resetCartJourney();
        replacementIds.set(payload.journeyId, cartJourneyId());
        continue;
      }
      if (!response.ok) throw new Error(data.error || "Your contact details could not be saved.");
      return data;
    }
  });
  queue = result;
  return result;
}
