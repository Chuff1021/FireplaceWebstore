import { requireAdminAuth } from "@/lib/admin-auth";
import { listInboxItems } from "@/lib/customer-inbox";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { ArrowRight, Inbox, Mail, ShoppingCart, Wrench } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  let total = 0;
  let orders = 0;
  let service = 0;
  let contact = 0;

  try {
    const items = await listInboxItems(200);
    total = items.length;
    orders = items.filter((item) => item.type === "order").length;
    service = items.filter((item) => item.type === "service").length;
    contact = items.filter((item) => item.type === "contact").length;
  } catch (error) {
    console.error("Failed to load inbox counts", error);
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="mt-1 text-gray-400">Check customer orders, website messages, and service requests.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-4">
            {[
              { label: "Inbox Items", value: total, icon: Inbox, color: "text-white", bg: "bg-gray-800" },
              { label: "Order Requests", value: orders, icon: ShoppingCart, color: "text-blue-100", bg: "bg-blue-950/40" },
              { label: "Service Requests", value: service, icon: Wrench, color: "text-orange-100", bg: "bg-orange-950/40" },
              { label: "Contact Messages", value: contact, icon: Mail, color: "text-green-100", bg: "bg-green-950/40" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className={`rounded-xl border border-gray-800 ${bg} p-5`}>
                <Icon className={`h-5 w-5 ${color}`} />
                <div className={`mt-4 text-3xl font-bold ${color}`}>{value}</div>
                <div className="mt-1 text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-orange-900 bg-orange-950/30 p-6">
            <h2 className="text-lg font-semibold text-white">Customer Inbox</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-orange-100/80">
              Future contact forms, order requests, and service appointment requests will be saved here.
            </p>
            <Link href="/admin/inbox" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-3 text-sm font-bold text-white hover:bg-orange-500">
              Open Inbox <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
