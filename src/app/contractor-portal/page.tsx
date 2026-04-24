import Link from "next/link";
import { ArrowRight, BadgeDollarSign, Building2, FileText, HardHat, ShieldCheck, UploadCloud } from "lucide-react";

const benefits = [
  "Exclusive contractor pricing on fireplaces, inserts, stoves, venting, and outdoor fire features",
  "Bid requests for whole-home, multi-unit, and remodel projects",
  "Plan upload intake for takeoffs, appliance schedules, and install coordination",
  "Project order desk for builders, GCs, remodelers, designers, and installers",
];

const workflows = [
  { title: "Apply for Access", description: "Submit company details, trade role, service area, and resale/project volume so we can approve the right pricing tier.", icon: HardHat, href: "/contractor-portal/signup" },
  { title: "Request a Bid", description: "Send specs for fireplaces, venting, outdoor fire features, and job timing. We turn it into a project quote.", icon: FileText, href: "/contractor-portal/request-bid" },
  { title: "Upload House Plans", description: "Upload plans, elevations, appliance schedules, or inspiration files for takeoff and product matching.", icon: UploadCloud, href: "/contractor-portal/upload-plans" },
];

export default function ContractorPortalPage() {
  return (
    <main className="bg-[#0d0b0a] text-white">
      <section className="relative overflow-hidden border-b border-[#ff7a18]/25 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,122,24,0.26),transparent_30%),radial-gradient(circle_at_85%_30%,rgba(255,255,255,0.10),transparent_24%),linear-gradient(135deg,#0d0b0a_0%,#1b120c_50%,#080706_100%)]" />
        <div className="relative mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.95fr_0.65fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#ff7a18]/35 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#ffb36b] backdrop-blur">
              <Building2 className="h-4 w-4" /> Aaron&apos;s Contractor Portal
            </p>
            <h1 className="mt-6 max-w-5xl text-[44px] font-black leading-[0.98] tracking-[-0.055em] md:text-[72px]">
              Fireplace ordering built for builders, remodelers, and trade pros.
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-[#e7d7c5]">
              Apply for contractor pricing, request project bids, upload house plans, and coordinate fireplace packages from a single trade-focused portal.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/contractor-portal/signup" className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ff963f]">
                Apply for Access <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contractor-portal/request-bid" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/8 px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-white backdrop-blur transition hover:border-[#ff7a18] hover:text-[#ffb36b]">
                Request a Bid
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/12 bg-white/[0.07] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-[#ff7a18]/25 bg-black/30 p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#ffb36b]">Trade Desk</p>
                  <h2 className="mt-2 text-2xl font-black">What contractors get</h2>
                </div>
                <BadgeDollarSign className="h-10 w-10 text-[#ff7a18]" />
              </div>
              <ul className="mt-6 space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-6 text-[#f1e5d5]">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ff7a18]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbf4ea] px-4 py-16 text-[#1d1712] md:px-6 md:py-20">
        <div className="mx-auto max-w-[1500px]">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#b84d13]">Portal Workflow</p>
            <h2 className="mt-4 text-[36px] font-black leading-tight tracking-[-0.04em] md:text-[54px]">Everything a contractor needs before checkout.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {workflows.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.title} href={item.href} className="group border border-[#ead6bd] bg-white p-6 shadow-[0_20px_60px_rgba(82,48,17,0.10)] transition hover:-translate-y-1 hover:border-[#ff7a18] hover:shadow-[0_26px_70px_rgba(255,122,24,0.18)]">
                  <Icon className="h-9 w-9 text-[#b84d13]" />
                  <h3 className="mt-5 text-2xl font-black tracking-[-0.03em]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#655649]">{item.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#b84d13]">
                    Start <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
