import Link from "next/link";
import { ArrowRight, Camera, ClipboardCheck, Ruler, Wrench } from "lucide-react";

const steps = [
  { icon: Ruler, label: "Room, fuel, venting, and budget" },
  { icon: Camera, label: "Optional photos for expert review" },
  { icon: ClipboardCheck, label: "Shortlist of realistic fireplace options" },
  { icon: Wrench, label: "Clear next step for quote or fitment help" },
];

export function DesignToolBanner() {
  return (
    <section className="relative overflow-hidden bg-[#11100e] py-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,122,24,0.18),transparent_30%),radial-gradient(circle_at_80%_65%,rgba(255,122,24,0.12),transparent_28%)]" />
      <div className="relative mx-auto grid max-w-[1640px] gap-10 px-4 md:px-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.26em] text-[#ff8a24]">
            Guided fireplace planning
          </p>
          <h2 className="mt-4 max-w-3xl text-[40px] font-black leading-[0.98] tracking-[-0.055em] md:text-[58px]">
            Not sure what fits? We&apos;ll help narrow it down.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d8c7b2]">
            Answer a few quick questions about your room, fuel type, style, budget, and project photos. We&apos;ll point you toward realistic fireplace options and follow up with expert guidance when your project needs a closer look.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/design-tool"
              className="inline-flex items-center justify-center gap-3 bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f]"
            >
              Start Matchmaker <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center border border-white/20 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:border-[#ff7a18] hover:text-[#ffb36b]"
            >
              Talk to an expert
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {steps.map(({ icon: Icon, label }, index) => (
            <div key={label} className="border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="mb-8 flex items-center justify-between">
                <Icon className="h-7 w-7 text-[#ff7a18]" />
                <span className="font-mono text-sm text-white/35">0{index + 1}</span>
              </div>
              <p className="text-lg font-bold leading-7 text-white">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
