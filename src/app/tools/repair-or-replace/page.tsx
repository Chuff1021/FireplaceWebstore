import Link from "next/link";
import { RepairWorksheet } from "@/components/tools/PlanningWorksheets";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Fireplace Repair or Replace Cost Worksheet", "Compare actual repair and replacement quotes, including parts, labor, installation and shipping. A practical fireplace planning worksheet.", "/tools/repair-or-replace");
export default function Page() {
  return <div className="mx-auto max-w-4xl px-4 py-12"><nav className="text-orange-800"><Link href="/guides">Guides & planning</Link></nav><h1 className="mt-5 text-3xl font-black md:text-4xl">Repair or replace: compare your quotes</h1><p className="mt-4 leading-7 text-gray-700">Use real, itemized estimates to see the upfront difference. Resolve diagnosis, compatibility and project scope before making the purchase decision.</p><RepairWorksheet /><Link href="/guides/repair-or-replace-fireplace" className="mt-8 inline-block font-bold text-orange-800 underline">Read the repair-or-replace guide</Link></div>;
}
