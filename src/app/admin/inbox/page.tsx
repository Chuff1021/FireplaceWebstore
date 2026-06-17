import { requireAdminAuth } from "@/lib/admin-auth";
import { listInboxItems, type InboxItem } from "@/lib/customer-inbox";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Inbox, Mail, Phone, ShoppingCart, Wrench } from "lucide-react";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: number | undefined) {
  if (typeof value !== "number") return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function getTypeStyle(type: InboxItem["type"]) {
  if (type === "order") return "bg-blue-500/15 text-blue-200 border-blue-500/30";
  if (type === "service") return "bg-orange-500/15 text-orange-200 border-orange-500/30";
  return "bg-green-500/15 text-green-200 border-green-500/30";
}

function getIcon(type: InboxItem["type"]) {
  if (type === "order") return ShoppingCart;
  if (type === "service") return Wrench;
  return Mail;
}

export default async function AdminInboxPage() {
  await requireAdminAuth();

  let items: InboxItem[] = [];
  let loadError = "";

  try {
    items = await listInboxItems(200);
  } catch (error) {
    console.error("Failed to load customer inbox", error);
    loadError = "The inbox could not be loaded. Check the Vercel Blob connection.";
  }

  const counts = {
    total: items.length,
    orders: items.filter((item) => item.type === "order").length,
    requests: items.filter((item) => item.type !== "order").length,
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Customer Inbox</h1>
              <p className="mt-1 text-gray-400">Orders, contact messages, and service requests submitted from the website.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-gray-800 bg-gray-900 px-4 py-3">
                <div className="text-2xl font-bold text-white">{counts.total}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">Total</div>
              </div>
              <div className="rounded-lg border border-blue-900 bg-blue-950/30 px-4 py-3">
                <div className="text-2xl font-bold text-blue-100">{counts.orders}</div>
                <div className="text-xs uppercase tracking-wide text-blue-300">Orders</div>
              </div>
              <div className="rounded-lg border border-green-900 bg-green-950/30 px-4 py-3">
                <div className="text-2xl font-bold text-green-100">{counts.requests}</div>
                <div className="text-xs uppercase tracking-wide text-green-300">Requests</div>
              </div>
            </div>
          </div>

          {loadError && (
            <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm font-semibold text-red-200">
              {loadError}
            </div>
          )}

          {items.length === 0 ? (
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-12 text-center">
              <Inbox className="mx-auto h-12 w-12 text-gray-600" />
              <h2 className="mt-4 text-lg font-semibold text-white">No customer submissions yet</h2>
              <p className="mt-2 text-sm text-gray-400">New website messages and order requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const Icon = getIcon(item.type);
                return (
                  <article key={item.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getTypeStyle(item.type)}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                        </div>
                        <h2 className="mt-3 text-xl font-bold text-white">{item.subject || "Website request"}</h2>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-300">
                          <span className="font-semibold text-white">{item.name || "No name"}</span>
                          {item.email && <a href={`mailto:${item.email}`} className="inline-flex items-center gap-1 text-orange-200 hover:text-orange-100"><Mail className="h-3.5 w-3.5" /> {item.email}</a>}
                          {item.phone && <a href={`tel:${item.phone}`} className="inline-flex items-center gap-1 text-orange-200 hover:text-orange-100"><Phone className="h-3.5 w-3.5" /> {item.phone}</a>}
                        </div>
                        {item.message && <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-gray-300">{item.message}</p>}

                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                          <dl className="mt-4 grid gap-2 rounded-lg border border-gray-800 bg-gray-950/60 p-4 text-sm sm:grid-cols-2">
                            {Object.entries(item.metadata).map(([key, value]) => (
                              <div key={key}>
                                <dt className="text-xs uppercase tracking-wide text-gray-500">{key.replace(/([A-Z])/g, " $1")}</dt>
                                <dd className="mt-1 text-gray-200">{value || "Not provided"}</dd>
                              </div>
                            ))}
                          </dl>
                        )}

                        {item.items && item.items.length > 0 && (
                          <div className="mt-4 overflow-hidden rounded-lg border border-gray-800">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-950 text-left text-xs uppercase tracking-wide text-gray-500">
                                <tr>
                                  <th className="px-4 py-3">Item</th>
                                  <th className="px-4 py-3">Qty</th>
                                  <th className="px-4 py-3 text-right">Price</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-800">
                                {item.items.map((orderItem, index) => (
                                  <tr key={`${orderItem.name}-${index}`}>
                                    <td className="px-4 py-3 text-gray-200">
                                      {orderItem.name}
                                      {orderItem.sku && <div className="text-xs text-gray-500">SKU: {orderItem.sku}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-300">{orderItem.quantity}</td>
                                    <td className="px-4 py-3 text-right text-gray-200">{formatMoney(orderItem.price)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>

                      {item.total !== undefined && (
                        <div className="rounded-lg border border-blue-900 bg-blue-950/30 px-4 py-3 text-right">
                          <div className="text-xs uppercase tracking-wide text-blue-300">Estimated Total</div>
                          <div className="mt-1 text-2xl font-bold text-blue-100">{formatMoney(item.total)}</div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
