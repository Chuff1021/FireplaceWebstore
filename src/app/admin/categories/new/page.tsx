import { requireAdminAuth } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewCategoryPage() {
  await requireAdminAuth();

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
            <h1 className="text-2xl font-bold text-white">Add New Category</h1>
          </div>

          <CategoryForm />
        </div>
      </main>
    </div>
  );
}
