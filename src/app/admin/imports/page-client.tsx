"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Database, PlayCircle, RefreshCw } from "lucide-react";

interface ImportJobRow {
  id: number;
  status: string;
  totalCount: number;
  successCount: number;
  errorCount: number;
  startedAt: string | null;
  finishedAt: string | null;
  summary: string;
  sourceName: string | null;
  sourceSlug: string | null;
}

const DEMO_PAYLOAD = {
  sourceSlug: "manufacturer-fireplace-feed",
  sourceName: "Manufacturer Fireplace Feed",
  sourceType: "manufacturer",
  approvalRef: "MFG-LICENSE-APPROVED",
  usageScope: "Web ecommerce catalog",
  ownerContact: "catalog@yourcompany.com",
  allowedAssetTypes: ["images", "specs", "descriptions", "skus"],
  complianceStatus: "green",
  products: [
    {
      name: "Direct Vent Gas Fireplace 36 in",
      slug: "direct-vent-gas-fireplace-36",
      shortDescription: "36-inch direct vent gas fireplace",
      description: "Manufacturer-provided licensed listing content.",
      sku: "DVG-36",
      manufacturerSku: "MFG-DVG-36",
      brand: "Napoleon",
      categorySlug: "fireplaces",
      price: 2499,
      salePrice: 2299,
      image: "https://cdn.jsdelivr.net/gh/Kilo-Org/example-assets/fireplace-main.jpg",
      images: [
        "https://cdn.jsdelivr.net/gh/Kilo-Org/example-assets/fireplace-main.jpg",
        "https://cdn.jsdelivr.net/gh/Kilo-Org/example-assets/fireplace-alt.jpg",
      ],
      specs: {
        Width: "36 in",
        Fuel: "Gas",
      },
      features: ["Electronic ignition", "Remote included"],
      fuelType: "Gas",
      ventType: "Direct Vent",
      widthInches: 36,
      btuOutput: 35000,
      isFeatured: true,
      isNew: false,
      isSale: true,
      inStock: true,
      isActive: true,
      lifecycleStatus: "approved",
      complianceStatus: "green",
    },
  ],
};

export default function AdminImportsClient() {
  const [jobs, setJobs] = useState<ImportJobRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadJobs() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/imports", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load imports");
      setJobs(data.jobs ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load imports");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadJobs();
  }, []);

  async function runDemoImport() {
    setRunning(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/admin/imports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DEMO_PAYLOAD),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setMessage(data.summary || "Import completed");
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setRunning(false);
    }
  }

  const totals = useMemo(() => {
    return jobs.reduce(
      (acc, job) => {
        acc.total += job.totalCount;
        acc.success += job.successCount;
        acc.errors += job.errorCount;
        return acc;
      },
      { total: 0, success: 0, errors: 0 }
    );
  }, [jobs]);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Catalog Imports</h1>
              <p className="text-gray-400 mt-1">Run and monitor licensed fireplace feed imports.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void loadJobs()}
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 px-3 py-2 rounded-lg text-sm"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={() => void runDemoImport()}
                disabled={running}
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-red-900 text-white px-3 py-2 rounded-lg text-sm"
              >
                <PlayCircle className="w-4 h-4" /> {running ? "Running..." : "Run Import"}
              </button>
            </div>
          </div>

          {(error || message) && (
            <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${error ? "border-red-700 bg-red-900/30 text-red-200" : "border-green-700 bg-green-900/30 text-green-200"}`}>
              {error || message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Rows Processed</p>
              <p className="text-white text-2xl font-semibold mt-1">{totals.total}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Rows Imported</p>
              <p className="text-green-300 text-2xl font-semibold mt-1">{totals.success}</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Import Errors</p>
              <p className="text-red-300 text-2xl font-semibold mt-1">{totals.errors}</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2 text-white font-medium">
              <Database className="w-4 h-4 text-gray-400" /> Recent Import Jobs
            </div>
            {loading ? (
              <div className="p-8 text-gray-400 text-sm">Loading imports...</div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-gray-400 text-sm">No import jobs yet. Run your first Phase 1 import.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="text-left px-4 py-3">Job</th>
                    <th className="text-left px-4 py-3">Source</th>
                    <th className="text-left px-4 py-3">Status</th>
                    <th className="text-left px-4 py-3">Counts</th>
                    <th className="text-left px-4 py-3">Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id} className="border-b border-gray-700/60 last:border-0">
                      <td className="px-4 py-3 text-gray-200">#{job.id}</td>
                      <td className="px-4 py-3 text-gray-300">{job.sourceName || "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded bg-gray-700 text-gray-200 text-xs">
                          {job.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {job.successCount}/{job.totalCount} ({job.errorCount} errors)
                      </td>
                      <td className="px-4 py-3 text-gray-400">{job.summary || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
