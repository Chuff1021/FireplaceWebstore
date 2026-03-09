/* eslint-disable @next/next/no-img-element */
import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Link from "next/link";
import { Plus, Package, Pencil, Trash2 } from "lucide-react";
import { resolveProductImage } from "@/lib/product-images";

export default async function AdminProductsPage() {
  await requireAdminAuth();

  const allProducts = await db
    .select({
      product: products,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.createdAt);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <p className="text-gray-400 mt-1">{allProducts.length} products total</p>
            </div>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Link>
          </div>

          {/* Products Table */}
          {allProducts.length === 0 ? (
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No products yet</h3>
              <p className="text-gray-400 mb-6">Add your first product to get started.</p>
              <Link
                href="/admin/products/new"
                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </Link>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Product
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">
                      Price
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
                  {allProducts.map(({ product, categoryName }) => (
                    <tr key={product.id} className="hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={resolveProductImage(product.image)}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-lg bg-gray-700 flex-shrink-0"
                          />
                          <div>
                            <div className="text-white font-medium text-sm">{product.name}</div>
                            <div className="text-gray-500 text-xs">{product.sku || product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-gray-300 text-sm">{categoryName || "—"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {product.salePrice ? (
                            <>
                              <span className="text-white font-medium text-sm">${product.salePrice.toFixed(2)}</span>
                              <span className="text-gray-500 text-xs line-through ml-2">${product.price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-white font-medium text-sm">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <div className="flex gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            product.isActive
                              ? "bg-green-900/50 text-green-400"
                              : "bg-gray-700 text-gray-400"
                          }`}>
                            {product.isActive ? "Active" : "Inactive"}
                          </span>
                          {product.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-900/50 text-yellow-400">
                              Featured
                            </span>
                          )}
                          {product.isNew && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-900/50 text-blue-400">
                              New
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteProductButton productId={product.id} productName={product.name} />
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

// Client component for delete button
function DeleteProductButton({ productId, productName }: { productId: number; productName: string }) {
  return (
    <form
      action={`/api/admin/products/${productId}/delete`}
      method="POST"
      onSubmit={(e) => {
        if (!confirm(`Delete "${productName}"? This cannot be undone.`)) {
          e.preventDefault();
        }
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
  );
}
