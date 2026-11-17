"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const fieldClass = "mt-2 w-full rounded-lg border border-[#d7cab8] bg-white px-3 py-3 text-base";
const buttonClass = "rounded-lg bg-orange-800 px-5 py-3 font-bold text-white hover:bg-orange-900";
const dimensions = [
  ["front", "Front opening width"], ["rear", "Rear firebox width"], ["height", "Opening height"],
  ["depth", "Usable depth"], ["hearth", "Hearth projection in front"],
] as const;

export function InsertPlanner() {
  const [summary, setSummary] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSummary(`Please help review an insert project.\nExisting fireplace: ${data.get("type")}.\nPreferred fuel: ${data.get("fuel")}.\n${dimensions.map(([key, label]) => `${label}: ${data.get(key) || "unknown"} inches`).join("\n")}\nExisting model: ${String(data.get("model") || "unknown").slice(0, 100)}.\nI understand these measurements need a site-specific fit and installation review.`);
  }
  return <><form onSubmit={submit} className="mt-7 rounded-xl border bg-[#fffaf3] p-5 md:p-7">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="font-semibold">Existing fireplace type<select name="type" className={fieldClass}><option>Masonry</option><option>Manufactured fireplace</option><option>Unknown — needs review</option></select></label>
      <label className="font-semibold">Preferred insert fuel<select name="fuel" className={fieldClass}><option>Wood</option><option>Pellet</option><option>Gas</option><option>Electric</option><option>Not sure</option></select></label>
      {dimensions.map(([key,label]) => <label key={key} className="font-semibold">{label} (inches)<input name={key} type="number" min="0" max="300" step="0.125" inputMode="decimal" className={fieldClass} placeholder="Leave blank if unknown" /></label>)}
      <label className="font-semibold">Existing fireplace model (if known)<input name="model" maxLength={100} className={fieldClass} /></label>
    </div><p className="mt-5 text-sm leading-6 text-gray-700">Measure only from safe, normal access with the appliance cool. This worksheet organizes a request; it does not approve fit, select an appliance or replace an inspection.</p><button className={`${buttonClass} mt-5`} type="submit">Build my project summary</button>
  </form>{summary && <section className="mt-6 rounded-xl border p-5" aria-live="polite"><h2 className="text-xl font-bold">Your project summary</h2><p className="mt-3 whitespace-pre-line leading-7">{summary}</p><Link href={`/contact?message=${encodeURIComponent(summary)}`} className={`${buttonClass} mt-5 inline-block`}>Review in contact form</Link><p className="mt-3 text-sm text-gray-600">The summary is sent only after you submit the contact form.</p></section>}</>;
}

const costFields = [
  ["repairParts", "Repair parts"], ["repairLabor", "Repair labor / diagnosis"], ["repairShipping", "Repair shipping & other charges"],
  ["newUnit", "Replacement appliance"], ["installation", "Replacement installation & required accessories"], ["newShipping", "Replacement shipping & other charges"],
] as const;
export function RepairWorksheet() {
  const [result, setResult] = useState<{ repair: number; replacement: number } | null>(null);
  const dollars = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const amount = (key: string) => Math.round(Number(data.get(key)) * 100);
    const repair = amount("repairParts") + amount("repairLabor") + amount("repairShipping");
    const replacement = amount("newUnit") + amount("installation") + amount("newShipping");
    if (Number.isSafeInteger(repair) && Number.isSafeInteger(replacement)) setResult({ repair: repair / 100, replacement: replacement / 100 });
  }
  return <><form onSubmit={submit} className="mt-7 rounded-xl border bg-[#fffaf3] p-5 md:p-7"><p className="mb-5 leading-7 text-gray-700">Enter actual quotes in USD. Use the same tax basis on both sides and include all required work. Enter zero where a quote has no separate charge. No cost or tax rate is assumed.</p><div className="grid gap-5 sm:grid-cols-2">{costFields.map(([key,label]) => <label key={key} className="font-semibold">{label} ($)<input name={key} type="number" min="0" max="1000000" step="0.01" inputMode="decimal" required className={fieldClass} /></label>)}</div><button type="submit" className={`${buttonClass} mt-6`}>Compare my quotes</button></form>{result && <section className="mt-6 rounded-xl border p-5" aria-live="polite"><h2 className="text-xl font-bold">Upfront cost comparison</h2><dl className="mt-4 grid grid-cols-2 gap-3"><dt>Repair total</dt><dd className="font-bold">{dollars(result.repair)}</dd><dt>Replacement total</dt><dd className="font-bold">{dollars(result.replacement)}</dd><dt>Replacement minus repair</dt><dd className="font-bold">{dollars(result.replacement - result.repair)}</dd></dl><p className="mt-4 leading-7 text-gray-700">This is arithmetic using your quotes. Condition, diagnosed repair, correct parts, availability and installation suitability still need review. No remaining-life or energy-savings estimate is included.</p><Link href="/contact" className="mt-4 inline-block font-bold text-orange-800 underline">Discuss the repair or replacement</Link></section>}</>;
}
