"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { ArrowLeft, Mail, Phone, ShieldAlert } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { defaultStoreConfig } from "@/lib/store-config";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

export default function CheckoutPage() {
  const { items, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const update = (key: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [key]: value }));
    if (submitState !== "idle") setSubmitState("idle");
  };

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitState === "submitting") return;

    setSubmitState("submitting");
    try {
      const response = await fetch("/api/customer-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: "Online order request",
          message: formData.notes,
          total: getTotal(),
          metadata: {
            address: formData.address,
            subtotal: formatPrice(getSubtotal()),
            shipping: formatPrice(getShipping()),
            tax: formatPrice(getTax()),
          },
          items: items.map((item) => ({
            name: item.product.name,
            sku: item.product.sku ?? item.product.id,
            quantity: item.quantity,
            price: (item.product.salePrice ?? item.product.price) * item.quantity,
          })),
        }),
      });

      if (!response.ok) throw new Error("Order request failed");

      setSubmitState("success");
      setFormData({ name: "", email: "", phone: "", address: "", notes: "" });
    } catch {
      setSubmitState("error");
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#f6efe5] px-4 py-16 text-center">
        <h1 className="text-3xl font-black tracking-[-0.04em] text-[#1d1712]">Your cart is empty</h1>
        <p className="mx-auto mt-3 max-w-xl text-[#6c6256]">Add fireplaces, parts, or accessories before requesting help with an order.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 bg-[#ff7a18] px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-black transition hover:bg-[#ff963f]">
          <ArrowLeft className="h-4 w-4" /> Continue shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6efe5]">
      <section className="relative overflow-hidden bg-[#0b0b0a] px-4 py-16 text-white md:px-6 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,122,24,0.22),transparent_30%)]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff9a3d]">Order request</p>
          <h1 className="mt-5 text-[42px] font-black leading-[0.98] tracking-[-0.055em] md:text-[68px]">Complete your order with Aaron&apos;s.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e6d8c4]">
            Online card checkout is temporarily disabled for launch safety. We are not collecting card numbers on this website until a real payment processor is connected. Send this cart to Aaron&apos;s and we&apos;ll confirm price, availability, shipping, and payment options directly.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1fr_0.42fr]">
        <form onSubmit={submitOrder} className="border border-[#ded5c8] bg-white p-6 shadow-[0_24px_80px_rgba(32,20,10,0.10)] md:p-8">
          <div className="flex items-start gap-4 border border-[#ffd0a3] bg-[#fff7ed] p-5">
            <ShieldAlert className="mt-1 h-6 w-6 shrink-0 text-[#ff7a18]" />
            <div>
              <h2 className="text-2xl font-black tracking-[-0.04em] text-[#1d1712]">No payment information is collected here.</h2>
              <p className="mt-2 text-sm leading-6 text-[#6c6256]">This protects customers and keeps the live site honest while payment/order infrastructure is finished.</p>
            </div>
          </div>

          <h3 className="mt-8 text-xl font-black text-[#1d1712]">Your contact details</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1d1712]">Name *</label>
              <input required value={formData.name} onChange={(e) => update("name", e.target.value)} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Full name" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1d1712]">Email *</label>
              <input required type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1d1712]">Phone</label>
              <input value={formData.phone} onChange={(e) => update("phone", e.target.value)} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Best callback number" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1d1712]">Shipping address</label>
              <input value={formData.address} onChange={(e) => update("address", e.target.value)} className="w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Street, city, ZIP" />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1 block text-sm font-bold text-[#1d1712]">Questions or notes</label>
            <textarea value={formData.notes} onChange={(e) => update("notes", e.target.value)} className="min-h-28 w-full border border-[#d9c8b4] bg-white px-4 py-3 outline-none focus:border-[#ff7a18]" placeholder="Delivery needs, installation questions, preferred callback time, or anything else Aaron's should know." />
          </div>

          <h3 className="mt-8 text-xl font-black text-[#1d1712]">Cart items</h3>
          <div className="mt-4 divide-y divide-[#eadfce] border border-[#eadfce]">
            {items.map((item) => (
              <div key={item.product.id} className="grid gap-3 p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-black text-[#1d1712]">{item.product.name}</p>
                  <p className="mt-1 text-sm text-[#6c6256]">Qty: {item.quantity}{item.product.sku ? ` · SKU: ${item.product.sku}` : ""}</p>
                </div>
                <div className="font-black text-[#1d1712]">{formatPrice((item.product.salePrice ?? item.product.price) * item.quantity)}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="submit" disabled={submitState === "submitting"} className="inline-flex items-center justify-center gap-2 bg-[#ff7a18] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ff963f] disabled:cursor-not-allowed disabled:opacity-60">
              <Mail className="h-4 w-4" /> {submitState === "submitting" ? "Sending..." : "Send Order Request"}
            </button>
            <a href={`tel:${defaultStoreConfig.phone}`} className="inline-flex items-center justify-center gap-2 border border-[#1d1712] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#1d1712] transition hover:bg-[#1d1712] hover:text-white">
              <Phone className="h-4 w-4" /> Call {defaultStoreConfig.phone}
            </a>
          </div>
          {submitState === "success" && <p className="mt-4 text-sm font-semibold text-green-700">Order request received. Aaron&apos;s will follow up to confirm details.</p>}
          {submitState === "error" && <p className="mt-4 text-sm font-semibold text-red-700">Something went wrong. Please try again or call the store directly.</p>}
        </form>

        <aside className="h-fit border border-[#ded5c8] bg-[#fffdf9] p-6 shadow-[0_24px_80px_rgba(32,20,10,0.08)]">
          <h2 className="text-xl font-black text-[#1d1712]">Estimated summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-[#6c6256]">Subtotal</span><span className="font-bold text-[#1d1712]">{formatPrice(getSubtotal())}</span></div>
            <div className="flex justify-between"><span className="text-[#6c6256]">Shipping estimate</span><span className="font-bold text-[#1d1712]">{formatPrice(getShipping())}</span></div>
            <div className="flex justify-between"><span className="text-[#6c6256]">Tax estimate</span><span className="font-bold text-[#1d1712]">{formatPrice(getTax())}</span></div>
            <div className="flex justify-between border-t border-[#eadfce] pt-4 text-lg"><span className="font-black text-[#1d1712]">Estimated total</span><span className="font-black text-[#ff7a18]">{formatPrice(getTotal())}</span></div>
          </div>
          <p className="mt-5 text-xs leading-5 text-[#6c6256]">Final availability, freight, tax, and payment method must be confirmed by Aaron&apos;s Fireplace Co.</p>
        </aside>
      </section>
    </main>
  );
}
