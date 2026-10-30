"use client";
import { classifyLanding, type TrafficAttribution } from "./traffic-attribution";
let landing: TrafficAttribution | undefined;
export function captureLanding(): TrafficAttribution {
  const now = Date.now();
  try {
    const saved = JSON.parse(sessionStorage.getItem("aarons-landing") || "null");
    if (saved && now - saved.touched < 30 * 60000 && typeof saved.value?.landingPath === "string") landing = saved.value;
    else landing = classifyLanding(window.location.href, document.referrer);
    sessionStorage.setItem("aarons-landing", JSON.stringify({ value: landing, touched: now }));
  } catch { landing ||= classifyLanding(window.location.href, document.referrer); }
  return landing || classifyLanding(window.location.href, document.referrer);
}
export function landingAttribution() { return landing || captureLanding(); }
