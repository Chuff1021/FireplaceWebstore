import Link from "next/link";

export default function ContractorBidPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-16 text-[#1d1712] md:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b84d13]">Project Bid Desk</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em]">Request a fireplace bid.</h1>
        <form className="mt-10 grid gap-5 border border-[#ead6bd] bg-[#fbf4ea] p-6 md:grid-cols-2">
          {["Project Name", "Builder / Company", "Contact Email", "Job Location", "Needed By", "Preferred Brands"].map((label) => (
            <label key={label} className="text-sm font-bold text-[#3a2d23]">
              {label}
              <input className="mt-2 h-12 w-full border border-[#d8c6b0] bg-white px-4 outline-none focus:border-[#ff7a18]" />
            </label>
          ))}
          <label className="text-sm font-bold text-[#3a2d23] md:col-span-2">
            Scope / Models / Rooms / Venting Notes
            <textarea className="mt-2 min-h-40 w-full border border-[#d8c6b0] bg-white p-4 outline-none focus:border-[#ff7a18]" />
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="rounded-full bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black">Request Bid</button>
            <Link href="/contractor-portal/upload-plans" className="rounded-full border border-[#d8c6b0] px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em]">Upload Plans</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
