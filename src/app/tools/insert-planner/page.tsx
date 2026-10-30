import Link from "next/link";
import { InsertPlanner } from "@/components/tools/PlanningWorksheets";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Fireplace Insert Measurement Worksheet", "Organize fireplace opening dimensions, hearth information and fuel preferences for an insert fit review with Aaron’s Fireplace Co.", "/tools/insert-planner");
export default function Page() {
  return <div className="mx-auto max-w-4xl px-4 py-12"><nav className="text-orange-800"><Link href="/guides">Guides & planning</Link></nav><h1 className="mt-5 text-3xl font-black md:text-4xl">Fireplace insert planning worksheet</h1><p className="mt-4 leading-7 text-gray-700">Gather the opening measurements and fireplace information a project review needs. An opening measurement is one part of confirming fit; the exact appliance instructions, fireplace eligibility, chimney and site all matter.</p><InsertPlanner /><Link href="/guides/measuring-for-fireplace-insert" className="mt-8 inline-block font-bold text-orange-800 underline">Read the measurement guide</Link></div>;
}
