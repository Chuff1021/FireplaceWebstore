/* eslint-disable @next/next/no-img-element */
import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { products, categories, serviceRequests } from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { CalendarDays, Package, Phone, Tag, Plus, ArrowRight } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  const [productCount] = await db.select({ count: count() }).from(products);
  const [categoryCount] = await db.select({ count: count() }).from(categories);
  const [newServiceRequestCount] = await db
    .select({ count: count() })
    .from(serviceRequests)
    .where(eq(serviceRequests.status, "new"));

  const recentProducts = await db
    .select()
    .from(products)
    .orderBy(products.createdAt)
    .limit(5);

  const recentServiceRequests = await db
    .select()
    .from(serviceRequests)
    .orderBy(desc(serviceRequests.createdAt))
    .limit(6);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your store.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-400" />
                </div>
                <Link
                  href="/admin/products/new"
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </Link>
              </div>
              <div className="text-3xl font-bold text-white">{productCount.count}</div>
              <div className="text-gray-400 text-sm mt-1">Total Products</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                  <Tag className="w-5 h-5 text-green-400" />
                </div>
                <Link
                  href="/admin/categories/new"
                  className="text-xs text-green-400 hover:text-green-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </Link>
              </div>
              <div className="text-3xl font-bold text-white">{categoryCount.count}</div>
              <div className="text-gray-400 text-sm mt-1">Categories</div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 border border-orange-500/40">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-orange-300" />
                </div>
                <span className="rounded-full bg-orange-500/15 px-2 py-1 text-xs font-bold text-orange-200">New</span>
              </div>
              <div className="text-3xl font-bold text-white">{newServiceRequestCount.count}</div>
              <div className="text-gray-400 text-sm mt-1">New Service Requests</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/admin/products/new"
                className="flex items-center gap-3 bg-red-700 hover:bg-red-600 text-white rounded-lg px-4 py-3 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add New Product</span>
              </Link>
              <Link
                href="/admin/categories/new"
                className="flex items-center gap-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-3 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">Add New Category</span>
              </Link>
            </div>
          </div>

          {/* Service Requests */}
          <div className="bg-gray-800 rounded-xl border border-orange-500/30 mb-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-lg font-semibold text-white">Service Requests</h2>
                <p className="mt-1 text-sm text-gray-400">New appointment requests submitted from the website.</p>
              </div>
              <CalendarDays className="h-5 w-5 text-orange-300" />
            </div>

            {recentServiceRequests.length === 0 ? (
              <div className="p-8 text-center">
                <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No service requests yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {recentServiceRequests.map((request) => (
                  <div key={request.id} className="grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-white font-semibold">{request.name}</span>
                        <span className="rounded-full bg-orange-500/15 px-2 py-1 text-xs font-bold uppercase tracking-wide text-orange-200">{request.status}</span>
                      </div>
                      <div className="mt-2 grid gap-1 text-sm text-gray-300 sm:grid-cols-2">
                        <div><span className="text-gray-500">Appliance:</span> {request.applianceType}</div>
                        <div><span className="text-gray-500">Service:</span> {request.serviceType}</div>
                        <div><span className="text-gray-500">Requested:</span> {request.requestedDate} — {request.preferredTime}</div>
                        <div><span className="text-gray-500">Address:</span> {request.address || "Not provided"}</div>
                      </div>
                      {request.notes && <p className="mt-3 text-sm leading-6 text-gray-400">{request.notes}</p>}
                      {request.createdAt && <p className="mt-3 text-xs text-gray-500">Submitted {request.createdAt.toLocaleString()}</p>}
                    </div>
                    <div className="flex flex-col gap-2 lg:items-end">
                      <a href={`tel:${request.phone}`} className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500">
                        <Phone className="h-4 w-4" /> {request.phone}
                      </a>
                      {request.email && <a href={`mailto:${request.email}`} className="text-sm text-orange-200 hover:text-orange-100">{request.email}</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Products */}
          <div className="bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Recent Products</h2>
              <Link
                href="/admin/products"
                className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No products yet.</p>
                <Link
                  href="/admin/products/new"
                  className="inline-flex items-center gap-2 mt-4 bg-red-700 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add your first product
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 p-4">
                    <img
                      src={resolveProductImage(product.image)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-700"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium truncate">{product.name}</div>
                      <div className="text-gray-400 text-sm">${product.price.toFixed(2)}</div>
                    </div>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
