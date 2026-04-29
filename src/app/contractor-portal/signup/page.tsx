import Link from "next/link";

export default function ContractorSignupPage() {
  return (
    <main className="min-h-screen bg-[#fbf4ea] px-4 py-16 text-[#1d1712] md:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b84d13]">Contractor Application</p>
        <h1 className="mt-4 text-5xl font-black tracking-[-0.05em]">Apply for contractor pricing.</h1>
        <p className="mt-4 max-w-3xl text-[#655649]">Apply for contractor support, bid coordination, and future trade-program access with Aaron&apos;s Fireplace Co.</p>
        <form className="mt-10 grid gap-5 border border-[#ead6bd] bg-white p-6 shadow-xl md:grid-cols-2">
          {["Company Name", "Primary Contact", "Email", "Phone", "Trade Role", "Service Area"].map((label) => (
            <label key={label} className="text-sm font-bold text-[#3a2d23]">
              {label}
              <input className="mt-2 h-12 w-full border border-[#d8c6b0] px-4 outline-none focus:border-[#ff7a18]" />
            </label>
          ))}
          <label className="text-sm font-bold text-[#3a2d23] md:col-span-2">
            Tell us about your fireplace/project volume
            <textarea className="mt-2 min-h-32 w-full border border-[#d8c6b0] p-4 outline-none focus:border-[#ff7a18]" />
          </label>
          <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row">
            <button type="button" className="rounded-full bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black">Submit Application</button>
            <Link href="/contractor-portal" className="rounded-full border border-[#d8c6b0] px-7 py-4 text-center text-sm font-black uppercase tracking-[0.12em]">Back to Portal</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
