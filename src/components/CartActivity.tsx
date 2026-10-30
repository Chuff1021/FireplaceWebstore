"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { captureLanding } from "@/lib/landing-session";
import { recordCartActivity, resetCartJourney } from "@/lib/cart-activity";

export function CartActivity() {
  // Restore the persisted cart after the first render so the server and browser
  // agree, including header badges and the initial checkout/cart content.
  useEffect(() => { void useCartStore.persist.rehydrate(); }, []);
  const pathname = usePathname();
  useEffect(() => { captureLanding(); }, [pathname]);
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const seen = useRef(false);
  const fingerprint = JSON.stringify(items.map((i) => [i.product.sku, i.quantity]));
  const view = pathname === "/checkout" ? "checkout" : pathname === "/cart" || isOpen ? "cart" : "";
  useEffect(() => {
    if (!items.length) {
      if (seen.current) {
        void recordCartActivity("empty", []).catch(() => {});
        resetCartJourney();
        seen.current = false;
      }
      return;
    }
    if (view) {
      seen.current = true;
      void recordCartActivity(view, items).catch(() => {});
    }
  }, [view, fingerprint, items]);
  useEffect(() => {
    if (!items.length) return;
    const send = (event: "heartbeat" | "leave") => {
      if (seen.current) void recordCartActivity(event, useCartStore.getState().items).catch(() => {});
    };
    const timer = setInterval(() => { if (document.visibilityState === "visible") send("heartbeat"); }, 60000);
    const hide = () => send("leave");
    const visible = () => { if (document.visibilityState === "visible") send("heartbeat"); };
    window.addEventListener("pagehide", hide);
    document.addEventListener("visibilitychange", visible);
    return () => { clearInterval(timer); window.removeEventListener("pagehide", hide); document.removeEventListener("visibilitychange", visible); };
  }, [items.length]);
  return null;
}
