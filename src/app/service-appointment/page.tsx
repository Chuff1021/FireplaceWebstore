"use client";

import { type FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, CalendarDays, Clock, Flame, Home, Phone, Wrench } from "lucide-react";
import { defaultStoreConfig } from "@/lib/store-config";

type ServiceRequest = {
  name: string;
  phone: string;
  email: string;
  applianceType: string;
  serviceType: string;
  requestedDate: string;
  preferredTime: string;
  address: string;
  notes: string;
};

const initialRequest: ServiceRequest = {
  name: "",
  phone: "",
  email: "",
  applianceType: "",
  serviceType: "",
  requestedDate: "",
  preferredTime: "",
  address: "",
  notes: "",
};

const applianceTypes = ["Gas fireplace or stove", "Wood stove or fireplace", "Pellet stove", "Not sure"];
const serviceTypes = ["Service / repair", "Annual cleaning", "Maintenance / inspection", "New issue diagnosis", "Other"];
const timeWindows = ["Morning", "Midday", "Afternoon", "Any time that day"];

export default function ServiceAppointmentPage() {
  const [request, setRequest] = useState<ServiceRequest>(initialRequest);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const update = (key: keyof ServiceRequest, value: string) => {
    setRequest((current) => ({ ...current, [key]: value }));
    if (submitState !== "idle") setSubmitState("idle");
  };

  const canSubmit = Boolean(
    request.name &&
      request.phone &&
      request.applianceType &&
      request.serviceType &&
      request.requestedDate &&
      request.preferredTime
  );

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || submitState === "submitting") return;

    setSubmitState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) throw new Error("Request failed");

      setSubmitState("success");
      setRequest(initialRequest);
    } catch {
      setSubmitState("error");
      setErrorMessage("Something went wrong. Please try again or call us directly.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f1e8]">
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-5 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(255,122,24,0.22),transparent_34%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Service request</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">
            Request a Fireplace or Stove Service Call
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">
            Tell us what kind of unit you have, what is going on, and what date/time of day works best. We&apos;ll follow up to confirm the final appointment day and time.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 md:px-5 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="border border-[#e2d3c0] bg-white p-6 shadow-[0_24px_80px_rgba(48,31,14,0.08)] md:p-8">
          <form className="space-y-7" onSubmit={submitRequest}>
              <div>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[#1d1712]">Service details</h2>
                <p className="mt-2 text-sm leading-6 text-[#6c6256]">
                  Submit this form and Aaron&apos;s Fireplace Co. will receive it directly in our internal service queue. No email app required.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Name *</label>
                  <input className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.name} onChange={(e) => update("name", e.target.value)} placeholder="Full name" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Phone *</label>
                  <input className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Best callback number" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Email</label>
                  <input className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.email} onChange={(e) => update("email", e.target.value)} placeholder="Optional email" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Service address</label>
                  <input className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.address} onChange={(e) => update("address", e.target.value)} placeholder="Street, city, ZIP" />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-bold text-[#1d1712]">What needs service? *</p>
                  <div className="grid gap-2">
                    {applianceTypes.map((type) => (
                      <button key={type} type="button" onClick={() => update("applianceType", type)} className={`border px-4 py-3 text-left text-sm font-bold transition ${request.applianceType === type ? "border-[#ff7a18] bg-[#fff3e8] text-[#1d1712]" : "border-[#e4d8c8] bg-white text-[#6c6256] hover:border-[#ff7a18]"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-bold text-[#1d1712]">Service type *</p>
                  <div className="grid gap-2">
                    {serviceTypes.map((type) => (
                      <button key={type} type="button" onClick={() => update("serviceType", type)} className={`border px-4 py-3 text-left text-sm font-bold transition ${request.serviceType === type ? "border-[#ff7a18] bg-[#fff3e8] text-[#1d1712]" : "border-[#e4d8c8] bg-white text-[#6c6256] hover:border-[#ff7a18]"}`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Requested date *</label>
                  <input type="date" className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.requestedDate} onChange={(e) => update("requestedDate", e.target.value)} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-[#1d1712]">Ideal time of day *</label>
                  <select className="w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.preferredTime} onChange={(e) => update("preferredTime", e.target.value)}>
                    <option value="">Select a time window</option>
                    {timeWindows.map((window) => (
                      <option key={window} value={window}>{window}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-[#1d1712]">What should we know?</label>
                <textarea className="min-h-32 w-full border border-[#d9c8b4] px-4 py-3 outline-none focus:border-[#ff7a18]" value={request.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Brand/model if known, symptoms, error codes, cleaning needs, access notes, or anything else that helps us prepare." />
              </div>

              <button type="submit" disabled={!canSubmit || submitState === "submitting"} className={`inline-flex w-full items-center justify-center gap-3 px-7 py-4 text-sm font-black uppercase tracking-[0.14em] transition md:w-auto ${canSubmit && submitState !== "submitting" ? "bg-[#ff7a18] text-black hover:bg-[#ff963f]" : "cursor-not-allowed bg-[#ff7a18]/40 text-black/50"}`}>
                {submitState === "submitting" ? "Submitting Request..." : "Request Service Appointment"} <CheckCircle2 className="h-4 w-4" />
              </button>
              {submitState === "success" ? (
                <p className="border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
                  Request received. We&apos;ll review it and contact you to confirm the appointment.
                </p>
              ) : (
                <p className="text-sm text-[#6c6256]">Your request goes straight to Aaron&apos;s internal service dashboard so the team can follow up.</p>
              )}
              {submitState === "error" && <p className="text-sm font-semibold text-red-700">{errorMessage}</p>}
            </form>
        </div>

        <aside className="space-y-4">
          {[
            { icon: Flame, title: "Gas", text: "Service requests for gas fireplaces, gas inserts, gas logs, and gas stoves." },
            { icon: Home, title: "Wood", text: "Wood stove and fireplace service requests, cleaning needs, inspections, and issue diagnosis." },
            { icon: Wrench, title: "Pellet", text: "Pellet stove cleaning, maintenance, and service call requests." },
            { icon: CalendarDays, title: "Scheduling", text: "Choose your ideal date and time of day. We&apos;ll contact you to finalize the appointment." },
            { icon: Clock, title: "Not live calendar yet", text: "This first version is built for lead capture. Later we can expose real available days and times." },
            { icon: Phone, title: "Need help now?", text: `Call ${defaultStoreConfig.phone} during business hours.` },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-[#e2d3c0] bg-white p-5">
              <Icon className="h-6 w-6 text-[#ff7a18]" />
              <h3 className="mt-4 font-black text-[#1d1712]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6c6256]">{text}</p>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
