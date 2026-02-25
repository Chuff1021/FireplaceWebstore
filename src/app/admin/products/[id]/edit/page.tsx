import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  await requireAdminAuth();

  const { id } = await params;
  const productId = parseInt(id);

  if (isNaN(productId)) notFound();

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) notFound();

  const allCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.name);

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Products
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Product</h1>
            <p className="text-gray-400 mt-1">{product.name}</p>
          </div>

          <ProductForm product={product} categories={allCategories} />
        </div>
      </main>
    </div>
  );
}
