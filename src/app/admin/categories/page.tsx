/* eslint-disable @next/next/no-img-element */
import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Tag, Pencil, Trash2 } from "lucide-react";

export default async function AdminCategoriesPage() {
  await requireAdminAuth();

  const allCategories = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder, categories.name);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Categories</h1>
              <p className="text-gray-400 mt-1">{allCategories.length} categories total</p>
            </div>
            <Link
              href="/admin/categories/new"
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </Link>
          </div>

          {allCategories.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
              <Tag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No categories yet</h3>
              <p className="text-gray-400 mb-6">Add categories to organize your products.</p>
              <Link
                href="/admin/categories/new"
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Category
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                      Slug
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4 hidden sm:table-cell">
                      Status
                    </th>
                    <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-10 h-10 object-cover rounded-lg bg-gray-700 flex-shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Tag className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium text-sm">{category.name}</div>
                            {category.description && (
                              <div className="text-gray-500 text-xs truncate max-w-xs">{category.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-gray-400 text-sm font-mono">{category.slug}</span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          category.isActive
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-700 text-gray-400"
                        }`}>
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/categories/${category.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <form
                            action={`/api/admin/categories/${category.id}/delete`}
                            method="POST"
                            onSubmit={(e) => {
                              if (!confirm(`Delete "${category.name}"?`)) e.preventDefault();
                            }}
                          >
                            <button
                              type="submit"
                              className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
