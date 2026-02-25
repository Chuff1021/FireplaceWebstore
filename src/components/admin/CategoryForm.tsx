/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2 } from "lucide-react";
import type { Category } from "@/db/schema";

interface CategoryFormProps {
  category?: Category;
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [image, setImage] = useState(category?.image ?? "");
  const [sortOrder, setSortOrder] = useState(category?.sortOrder?.toString() ?? "0");
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImage(data.url as string);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const payload = {
        name,
        slug,
        description,
        image,
        sortOrder: parseInt(sortOrder) || 0,
        isActive,
      };

      const url = isEdit ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Category Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            placeholder="e.g. Gas Fireplaces"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">URL Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm"
            placeholder="gas-fireplaces"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-y"
            placeholder="Brief description of this category"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Category Image</label>
          <div className="flex items-start gap-4">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Category"
                  className="w-24 h-24 object-cover rounded-lg bg-gray-700"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : null}
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
              {uploadingImage ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Upload</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
            <div className="flex-1">
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                placeholder="Or paste image URL"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Sort Order</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              min="0"
            />
          </div>

          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsActive(!isActive)}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                  isActive ? "bg-red-600" : "bg-gray-600"
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isActive ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </div>
              <span className="text-sm text-gray-300">Active</span>
            </label>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        {saving ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEdit ? "Save Changes" : "Create Category"
        )}
      </button>
    </form>
  );
}
