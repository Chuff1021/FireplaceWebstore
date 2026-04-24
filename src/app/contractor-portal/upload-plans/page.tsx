import Link from "next/link";
import { UploadCloud } from "lucide-react";

export default function ContractorPlanUploadPage() {
  return (
    <main className="min-h-screen bg-[#0d0b0a] px-4 py-16 text-white md:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ffb36b]">Plan Upload</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em]">Upload house plans for fireplace takeoff.</h1>
        <div className="mt-10 rounded-[2rem] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-xl">
          <div className="flex min-h-72 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-[#ff7a18]/55 bg-black/25 p-8 text-center">
            <UploadCloud className="h-14 w-14 text-[#ff7a18]" />
            <h2 className="mt-5 text-2xl font-black">Drag plans here or choose files</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#e7d7c5]">PDFs, drawings, elevations, appliance schedules, spec sheets, and inspiration images. Storage wiring comes next.</p>
            <button type="button" className="mt-6 rounded-full bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black">Choose Files</button>
          </div>
        </div>
        <Link href="/contractor-portal/request-bid" className="mt-8 inline-flex rounded-full border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-[0.12em]">Continue to Bid Request</Link>
      </div>
    </main>
  );
}
