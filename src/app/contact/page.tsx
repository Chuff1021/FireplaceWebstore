"use client";

import { useState } from "react";
import { defaultStoreConfig } from "@/lib/store-config";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const { address } = defaultStoreConfig;
  const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const emailHref = `mailto:${defaultStoreConfig.email}?subject=${encodeURIComponent(formData.subject || "Website contact request")}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\n${formData.message}`)}`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="bg-[#f6efe5]">
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%),radial-gradient(circle_at_82%_18%,rgba(255,179,107,0.12),transparent_24%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Contact Aaron&apos;s Fireplace Co.</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">Real fireplace help from a real hearth team.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">
            Need help choosing a fireplace, confirming a part, planning installation, or scheduling service? Send the details and Aaron&apos;s will help with the next step.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:px-6 lg:grid-cols-[1fr_0.82fr]">
        <div className="border border-[#ded5c8] bg-[#fffdf9] p-6 shadow-[0_24px_80px_rgba(32,20,10,0.10)] md:p-8">
          <h2 className="text-3xl font-black tracking-[-0.04em] text-[#1d1712]">Send us a message</h2>
          <p className="mt-2 text-sm leading-6 text-[#6c6256]">
            The button below opens your email app with the details filled in so you can send the request directly to Aaron&apos;s Fireplace Co.
          </p>

          <form className="mt-7 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-bold text-[#1d1712]">Full Name *</label>
                <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Full name" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-bold text-[#1d1712]">Email Address *</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="you@example.com" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-1 block text-sm font-bold text-[#1d1712]">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="(417) 732-9775" />
              </div>
              <div>
                <label htmlFor="subject" className="mb-1 block text-sm font-bold text-[#1d1712]">Subject *</label>
                <select id="subject" name="subject" required value={formData.subject} onChange={handleChange} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]">
                  <option value="">Select a subject</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Installation Question">Installation Question</option>
                  <option value="Service & Maintenance">Service & Maintenance</option>
                  <option value="Parts & Accessories">Parts & Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-bold text-[#1d1712]">Message *</label>
              <textarea id="message" name="message" required rows={6} value={formData.message} onChange={handleChange} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Tell us what you need help with. Model numbers, photos you can send, measurements, and project details all help." />
            </div>

            <a href={emailHref} className="inline-flex w-full items-center justify-center gap-3 bg-[#ff7a18] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f] md:w-auto">
              <Send className="h-4 w-4" /> Email Aaron&apos;s Fireplace Co.
            </a>
          </form>
        </div>

        <aside className="space-y-5">
          {[
            { icon: MapPin, title: "Showroom", text: fullAddress, href: mapsHref, action: "Open in Maps" },
            { icon: Phone, title: "Phone", text: defaultStoreConfig.phone, href: `tel:${defaultStoreConfig.phone}`, action: "Call Aaron's" },
            { icon: Mail, title: "Email", text: defaultStoreConfig.email, href: `mailto:${defaultStoreConfig.email}`, action: "Send Email" },
            { icon: Clock, title: "Business Hours", text: `Mon-Fri ${defaultStoreConfig.business.hours.weekdays} · Saturday ${defaultStoreConfig.business.hours.saturday} · Sunday ${defaultStoreConfig.business.hours.sunday}` },
          ].map(({ icon: Icon, title, text, href, action }) => (
            <div key={title} className="border border-[#ded5c8] bg-[#fffdf9] p-5 shadow-[0_18px_55px_rgba(32,20,10,0.08)]">
              <Icon className="h-6 w-6 text-[#ff7a18]" />
              <h3 className="mt-4 text-lg font-black text-[#1d1712]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6c6256]">{text}</p>
              {href && action && (
                <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="mt-4 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.12em] text-[#c24d12] hover:text-[#ff7a18]">
                  {action} <ArrowRight className="h-4 w-4" />
                </a>
              )}
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
