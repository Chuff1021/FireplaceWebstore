import { requireAdminAuth } from "@/lib/admin-auth";
import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  await requireAdminAuth();

  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) notFound();

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, categoryId))
    .limit(1);

  if (!category) notFound();

  return (
    <div className="flex min-h-screen bg-gray-950">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin/categories"
              className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-sm mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Categories
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Category</h1>
            <p className="text-gray-400 mt-1">{category.name}</p>
          </div>

          <CategoryForm category={category} />
        </div>
      </main>
    </div>
  );
}
