"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCartStore } from "@/lib/cart-store";

type Address = {
  name: string;
  email: string;
  phone: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  country: "US";
};
type Quote = {
  id: string;
  address: Address;
  lines: Array<{
    key: string;
    sku: string;
    name: string;
    quantity: number;
    unitPriceCents: number;
  }>;
  shipping: { id: string; label: string; amountCents: number };
  taxCents: number;
  totalCents: number;
  expiresAt: string;
};
type Config = {
  applicationId: string;
  locationId: string;
  environment: string;
};
type Card = {
  attach: (id: string) => Promise<void>;
  destroy: () => Promise<void>;
  tokenize: (details: unknown) => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
};
declare global {
  interface Window {
    Square?: {
      payments: (
        app: string,
        location: string,
      ) => { card: () => Promise<Card> };
    };
  }
}
const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    cents / 100,
  );
async function checkout(input: unknown) {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Checkout is temporarily unavailable.");
  return data;
}
function CardPayment({
  quote,
  config,
  authorized,
  pending,
}: {
  quote: Quote;
  config: Config;
  authorized: (id: string) => void;
  pending: (id: string) => void;
}) {
  const [loaded, setLoaded] = useState(
    Boolean(typeof window !== "undefined" && window.Square),
  );
  const [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const card = useRef<Card | null>(null),
    lock = useRef(false),
    token = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!loaded) return;
    let canceled = false;
    let instance: Card | null = null;
    (async () => {
      try {
        instance = await window
          .Square!.payments(config.applicationId, config.locationId)
          .card();
        if (canceled) {
          await instance.destroy();
          return;
        }
        await instance.attach("#square-card");
        card.current = instance;
        setReady(true);
      } catch {
        setError(
          "The secure card form could not load. You can request a quote below.",
        );
      }
    })();
    return () => {
      canceled = true;
      card.current = null;
      void instance?.destroy();
    };
  }, [loaded, config.applicationId, config.locationId]);
  async function pay() {
    if (lock.current || !card.current) return;
    lock.current = true;
    setBusy(true);
    setError("");
    try {
      if (Date.parse(quote.expiresAt) <= Date.now())
        throw new Error(
          "This quote has expired. Get a new quote before paying.",
        );
      if (!token.current) {
        const result = await card.current.tokenize({
          amount: (quote.totalCents / 100).toFixed(2),
          currencyCode: "USD",
          intent: "CHARGE",
          customerInitiated: true,
          sellerKeyedIn: false,
          billingContact: {
            givenName: quote.address.name,
            email: quote.address.email,
            addressLines: [quote.address.street, quote.address.street2].filter(
              Boolean,
            ),
            city: quote.address.city,
            state: quote.address.state,
            postalCode: quote.address.zip,
            countryCode: "US",
          },
        });
        if (result.status !== "OK" || !result.token)
          throw new Error(
            result.errors?.[0]?.message || "Check your card details.",
          );
        token.current = result.token;
      }
      sessionStorage.setItem("parts-order", quote.id);
      pending(quote.id);
      const result = await checkout({
        action: "authorize",
        quoteId: quote.id,
        sourceId: token.current,
      });
      if (["authorized", "paid"].includes(result.status))
        authorized(result.orderId);
      else throw new Error("The card authorization was not approved.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Payment could not be confirmed.",
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <section className="mt-6 border-t pt-6">
      <Script
        src={
          config.environment === "sandbox"
            ? "https://sandbox.web.squarecdn.com/v1/square.js"
            : "https://web.squarecdn.com/v1/square.js"
        }
        onReady={() => setLoaded(true)}
        onError={() => setError("The secure card form could not load.")}
      />
      <h2 className="text-xl font-bold">Secure card authorization</h2>
      <p className="my-3 text-sm text-gray-600">
        We’ll place a temporary hold of {money(quote.totalCents)} on your card.
        Payment is captured after we confirm your supplier order.
      </p>
      <div id="square-card" className="min-h-24" />
      {error && (
        <p role="alert" className="my-3 text-red-700">
          {error}
        </p>
      )}
      <button
        type="button"
        disabled={!ready || busy}
        onClick={() => void pay()}
        className="w-full rounded bg-orange-600 px-5 py-3 font-bold text-white disabled:opacity-50"
      >
        {busy
          ? "Confirming authorization…"
          : `Authorize ${money(quote.totalCents)}`}
      </button>
    </section>
  );
}
export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const [address, setAddress] = useState<Address>({
    name: "",
    email: "",
    phone: "",
    street: "",
    street2: "",
    city: "",
    state: "MO",
    zip: "",
    country: "US",
  });
  const [quote, setQuote] = useState<Quote | null>(null),
    [config, setConfig] = useState<Config | null>(null);
  const [shipping, setShipping] = useState<Array<Quote["shipping"]>>([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [pendingOrder, setPendingOrder] = useState("");
  const [success, setSuccess] = useState(""),
    [requestSent, setRequestSent] = useState(false),
    [notes, setNotes] = useState("");
  const cartFingerprint = JSON.stringify(
    items.map((i) => [i.product.sourceKey || i.product.sku, i.quantity]),
  );
  const lastCart = useRef(cartFingerprint);
  useEffect(() => {
    if (lastCart.current !== cartFingerprint) {
      lastCart.current = cartFingerprint;
      setQuote(null);
    }
  }, [cartFingerprint]);
  const authorized = useCallback(
    (id: string) => {
      setSuccess(id);
      setPendingOrder("");
      sessionStorage.removeItem("parts-order");
      clearCart();
    },
    [clearCart],
  );
  useEffect(() => {
    const id = pendingOrder || sessionStorage.getItem("parts-order");
    if (!id) return;
    let active = true;
    const poll = async () => {
      try {
        const r = await checkout({ action: "status", id });
        if (active && ["authorized", "paid"].includes(r.status)) authorized(id);
        if (["voided", "failed", "refunded"].includes(r.status)) {
          sessionStorage.removeItem("parts-order");
          setPendingOrder("");
          setError(
            "This payment was not approved or is canceled. Get a new quote to try again.",
          );
        }
      } catch {
        /* An uncertain authorization stays visible for reconciliation. */
      }
    };
    void poll();
    const timer = setInterval(() => void poll(), 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [authorized, pendingOrder]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1)),
      quoteId = params.get("quote"),
      token = params.get("token");
    if (!quoteId || !token) return;
    window.history.replaceState(null, "", window.location.pathname);
    checkout({ action: "redeem", quoteId, token })
      .then((r) => {
        setQuote(r.quote);
        setAddress(r.quote.address);
        setShipping(r.shipping);
        setConfig(r.square);
      })
      .catch((e) => setError(e.message));
  }, []);
  function change(key: keyof Address, value: string) {
    setAddress((a) => ({ ...a, [key]: value }));
    setQuote(null);
    setError("");
  }
  async function getQuote(shippingId?: string) {
    if (busy || pendingOrder) return;
    setBusy(true);
    setError("");
    setQuote(null);
    try {
      const r = await checkout({
        action: "quote",
        items: items.map((i) => ({
          key: i.product.sourceKey || i.product.sku,
          sku: i.product.sku,
          quantity: i.quantity,
        })),
        address,
        shippingId,
      });
      setQuote(r.quote);
      setShipping(r.shipping);
      setConfig(r.square);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "We couldn’t confirm shipping. Request an email quote below.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function requestQuote() {
    if (busy || pendingOrder) return;
    setBusy(true);
    setError("");
    try {
      if (!address.name.trim() || !address.email.includes("@"))
        throw new Error("Enter your name and email for the quote.");
      const r = await fetch("/api/customer-inbox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "order",
          name: address.name,
          email: address.email,
          phone: address.phone,
          subject: "Parts shipping and checkout quote requested",
          message: notes,
          metadata: {
            address: [
              address.street,
              address.street2,
              `${address.city}, ${address.state} ${address.zip}`,
              address.country,
            ]
              .filter(Boolean)
              .join("\n"),
            paymentStatus: "Not collected — quote requested",
            shipping: "To confirm",
            tax: "To confirm",
          },
          items: items.map((i) => ({
            name: i.product.name,
            sku: i.product.sku,
            quantity: i.quantity,
            price: (i.product.salePrice ?? i.product.price) * i.quantity,
          })),
        }),
      });
      if (!r.ok)
        throw new Error(
          "Your quote request could not be saved. Please try again.",
        );
      setRequestSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Quote request failed.");
    } finally {
      setBusy(false);
    }
  }
  if (success || requestSent)
    return (
      <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold">
          {success ? "Your order is authorized" : "Your quote request is saved"}
        </h1>
        <p className="mt-5">
          {success
            ? `Order ${success.slice(0, 8).toUpperCase()}. Your card has a temporary hold. We’ll email confirmation after arranging your supplier order.`
            : "We’ll confirm availability and shipping and email your checkout details. No payment has been collected."}
        </p>
        <Link
          href="/category/parts"
          className="mt-8 inline-block text-orange-700 underline"
        >
          Continue shopping parts
        </Link>
      </main>
    );
  if (!items.length && !quote)
    return (
      <main className="mx-auto min-h-[60vh] max-w-2xl px-4 py-16">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        {error && (
          <p role="alert" className="mt-4">
            {error}
          </p>
        )}
        <Link
          className="mt-6 inline-block text-orange-700 underline"
          href="/category/parts"
        >
          Shop parts
        </Link>
      </main>
    );
  return (
    <main className="min-h-screen bg-[#f6efe5] px-4 py-10 text-[#1d1712]">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black">Checkout</h1>
        <p className="mt-3 text-gray-600">
          Confirm your shipping address to check current parts availability and
          delivery options.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="min-w-0 rounded-lg border bg-white p-5 md:p-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void getQuote();
              }}
            >
              <h2 className="mb-5 text-xl font-bold">Contact and shipping</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["name", "Full name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone (optional)", "tel"],
                    ["street", "Street address", "text"],
                    ["street2", "Apartment / suite (optional)", "text"],
                    ["city", "City", "text"],
                    ["zip", "ZIP code", "text"],
                  ] as const
                ).map(([key, label, type]) => (
                  <label
                    key={key}
                    className={key === "street" ? "sm:col-span-2" : ""}
                  >
                    <span className="mb-1 block text-sm font-semibold">
                      {label}
                    </span>
                    <input
                      required={key !== "phone" && key !== "street2"}
                      type={type}
                      value={address[key]}
                      onChange={(e) => change(key, e.target.value)}
                      autoComplete={
                        {
                          name: "name",
                          email: "email",
                          phone: "tel",
                          street: "address-line1",
                          street2: "address-line2",
                          city: "address-level2",
                          zip: "postal-code",
                        }[key]
                      }
                      className="w-full rounded border border-gray-300 px-3 py-3"
                    />
                  </label>
                ))}
                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    State
                  </span>
                  <select
                    value={address.state}
                    onChange={(e) => change("state", e.target.value)}
                    className="w-full rounded border border-gray-300 px-3 py-3"
                  >
                    {"AL AR AZ CA CO CT DE FL GA IA ID IL IN KS KY LA MA MD ME MI MN MO MS MT NC ND NE NH NJ NM NV NY OH OK OR PA RI SC SD TN TX UT VA VT WA WI WV WY"
                      .split(" ")
                      .map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                  </select>
                </label>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Online shipping serves the contiguous United States. Other
                destinations and special orders can be quoted by email.
              </p>
              <button
                disabled={busy || Boolean(pendingOrder)}
                className="mt-6 w-full rounded bg-black px-5 py-3 font-bold text-white disabled:opacity-50"
              >
                {busy
                  ? "Checking availability and shipping…"
                  : "Get shipping and order total"}
              </button>
            </form>
            {pendingOrder && (
              <p role="status" className="mt-4 rounded border p-4">
                We’re confirming your card authorization. Keep this page open.
                You can review the order once its status is confirmed.
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="mt-5 rounded bg-orange-50 p-4 text-orange-900"
              >
                {error}
              </p>
            )}
            {quote && config && (
              <>
                <label className="mt-5 block text-sm font-bold">
                  Shipping service
                  <select
                    value={quote.shipping.id}
                    disabled={quote.shipping.id === "owner-confirmed"}
                    onChange={(e) => void getQuote(e.target.value)}
                    className="mt-2 w-full rounded border p-3"
                  >
                    {shipping.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label} — {money(s.amountCents)}
                      </option>
                    ))}
                  </select>
                </label>
                <CardPayment
                  key={quote.id}
                  quote={quote}
                  config={config}
                  authorized={authorized}
                  pending={setPendingOrder}
                />
              </>
            )}
            <section className="mt-8 border-t pt-5">
              <h2 className="text-lg font-bold">Need an email quote?</h2>
              <p className="mt-2 text-sm text-gray-600">
                For special orders, delivery questions, or items needing
                confirmation, send your cart to Aaron’s.
              </p>
              <label className="mt-3 block text-sm">
                Notes (optional)
                <textarea
                  className="mt-1 min-h-20 w-full rounded border p-3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </label>
              <button
                type="button"
                disabled={busy || Boolean(pendingOrder)}
                onClick={() => void requestQuote()}
                className="mt-3 w-full rounded border border-orange-600 px-5 py-3 font-bold text-orange-800 disabled:opacity-50"
              >
                Request quote by email
              </button>
            </section>
          </section>
          <aside className="h-fit min-w-0 rounded-lg border bg-white p-5">
            <h2 className="text-xl font-bold">Your order</h2>
            <ul className="mt-4 divide-y">
              {(quote
                ? quote.lines
                : items.map((i) => ({
                    key: i.product.id,
                    name: i.product.name,
                    sku: i.product.sku,
                    quantity: i.quantity,
                    unitPriceCents: Math.round(
                      (i.product.salePrice ?? i.product.price) * 100,
                    ),
                  }))
              ).map((l) => (
                <li key={l.key} className="py-3">
                  <p className="break-words font-medium">{l.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {l.sku} · Qty {l.quantity} ·{" "}
                    {money(l.unitPriceCents * l.quantity)}
                  </p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt>Items subtotal</dt>
                <dd>
                  {money(
                    quote
                      ? quote.lines.reduce(
                          (s, l) => s + l.unitPriceCents * l.quantity,
                          0,
                        )
                      : Math.round(getSubtotal() * 100),
                  )}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Shipping</dt>
                <dd>
                  {quote ? money(quote.shipping.amountCents) : "To calculate"}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Tax</dt>
                <dd>{quote ? money(quote.taxCents) : "To calculate"}</dd>
              </div>
              {quote && (
                <div className="flex justify-between border-t pt-3 text-lg font-bold">
                  <dt>Total</dt>
                  <dd>{money(quote.totalCents)}</dd>
                </div>
              )}
            </dl>
            <p className="mt-5 text-xs text-gray-500">
              {quote
                ? "Quote valid for 15 minutes. Availability is checked again before card authorization."
                : "Listed item prices are checked again before checkout. Shipping and tax are added to your confirmed total."}
            </p>
            <Link href="/cart" className="mt-5 inline-block text-sm underline">
              Edit cart
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
