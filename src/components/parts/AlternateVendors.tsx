"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Check, X, Loader2 } from "lucide-react";

type Alternate = {
  vendor: string;
  vendorLabel: string;
  sku: string;
  name?: string;
  price: number | null;
  listPrice: number | null;
  salePrice: number | null;
  inStock: boolean | null;
  stock: number | null;
  availability: string | null;
  productUrl: string | null;
  imageUrl: string | null;
};

type Props = {
  sku: string;
  currentVendor?: "stove-parts-unlimited" | "energy-parts-plus";
};

function formatPrice(value: number | null) {
  if (typeof value !== "number") return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function AlternateVendors({ sku, currentVendor = "stove-parts-unlimited" }: Props) {
  const [status, setStatus] = useState<"loading" | "done">("loading");
  const [alternates, setAlternates] = useState<Alternate[]>([]);

  useEffect(() => {
    if (!sku) return;
    let cancelled = false;

    fetch(`/api/cross-vendor/${encodeURIComponent(sku)}`)
      .then((r) => r.json())
      .then((data: { alternates?: Alternate[] }) => {
        if (cancelled) return;
        const list = (data.alternates ?? []).filter((a) => a.vendor !== currentVendor);
        setAlternates(list);
        setStatus("done");
      })
      .catch(() => {
        if (cancelled) return;
        setAlternates([]);
        setStatus("done");
      });

    return () => {
      cancelled = true;
    };
  }, [sku, currentVendor]);

  if (status === "loading") {
    return (
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        Checking other suppliers…
      </div>
    );
  }

  if (status === "done" && alternates.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 border border-orange-200 bg-orange-50/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Also available from</h3>
        <span className="text-xs text-gray-500">Live supplier stock</span>
      </div>
      <ul className="space-y-2">
        {alternates.map((alt) => (
          <li
            key={`${alt.vendor}-${alt.sku}`}
            className="flex items-center justify-between gap-3 text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-gray-900 truncate">{alt.vendorLabel}</span>
              {alt.inStock ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <Check className="w-3 h-3" />
                  {alt.stock != null ? `${alt.stock} in stock` : "In stock"}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                  <X className="w-3 h-3" />
                  Out of stock
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="tabular-nums font-semibold text-gray-900">
                {formatPrice(alt.price)}
              </span>
              {alt.productUrl ? (
                <a
                  href={alt.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-orange-700 hover:text-orange-800 hover:underline"
                >
                  View <ExternalLink className="w-3 h-3" />
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
