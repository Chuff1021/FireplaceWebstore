/* eslint-disable @next/next/no-img-element */
import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { count } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Package, Tag, Plus, ArrowRight } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdminAuth();

  const [productCount] = await db.select({ count: count() }).from(products);
  const [categoryCount] = await db.select({ count: count() }).from(categories);

  const recentProducts = await db
    .select()
    .from(products)
    .orderBy(products.createdAt)
    .limit(5);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg bg-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
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
