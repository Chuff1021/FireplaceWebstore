/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Loader2 } from "lucide-react";
import type { Category, Product } from "@/db/schema";

interface ProductFormProps {
  product?: Product;
  categories: Category[];
}

export default function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(product?.salePrice?.toString() ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [brand, setBrand] = useState(product?.brand ?? "");
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() ?? "");
  const [image, setImage] = useState(product?.image ?? "");
  const [images, setImages] = useState<string[]>(() => {
    try { return JSON.parse(product?.images ?? "[]"); } catch { return []; }
  });
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isNew, setIsNew] = useState(product?.isNew ?? false);
  const [isSale, setIsSale] = useState(product?.isSale ?? false);
  const [inStock, setInStock] = useState(product?.inStock ?? true);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  // Auto-generate slug from name
  function handleNameChange(value: string) {
    setName(value);
    if (!isEdit) {
      setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url as string;
  }

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setImage(url);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleAdditionalImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingImage(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setImages((prev) => [...prev, ...urls]);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  }

  function removeAdditionalImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
        shortDescription,
        price: parseFloat(price) || 0,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        sku: sku || null,
        brand,
        categoryId: categoryId ? parseInt(categoryId) : null,
        image,
        images: JSON.stringify(images),
        isFeatured,
        isNew,
        isSale,
        inStock,
        isActive,
      };

      const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products";
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

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-5">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="e.g. Napoleon Ascent 36 Gas Fireplace"
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
                  placeholder="napoleon-ascent-36-gas-fireplace"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Brief one-line description for product cards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-y"
                  placeholder="Detailed product description..."
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-5">Pricing & Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-7 pr-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Sale Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg pl-7 pr-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    placeholder="Leave blank if no sale"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="e.g. NAP-ASC-36"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Brand</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="e.g. Napoleon"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-5">Product Images</h3>

            {/* Main Image */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">Main Image</label>
              <div className="flex items-start gap-4">
                {image ? (
                  <div className="relative">
                    <img
                      src={image}
                      alt="Main product"
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
                    onChange={handleMainImageUpload}
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

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Additional Images</label>
              <div className="flex flex-wrap gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`Product ${i + 1}`}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(i)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center w-20 h-20 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-red-500 transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-400 mt-0.5">Add</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Fields */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-5">Status & Visibility</h3>
            <div className="space-y-3">
              {[
                { label: "Active (visible on site)", value: isActive, setter: setIsActive },
                { label: "In Stock", value: inStock, setter: setInStock },
                { label: "Featured Product", value: isFeatured, setter: setIsFeatured },
                { label: "Mark as New", value: isNew, setter: setIsNew },
                { label: "On Sale", value: isSale, setter: setIsSale },
              ].map(({ label, value, setter }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setter(!value)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                      value ? "bg-red-600" : "bg-gray-600"
                    }`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      value ? "translate-x-5" : "translate-x-0.5"
                    }`} />
                  </div>
                  <span className="text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h3 className="text-white font-semibold mb-5">Category</h3>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id.toString()}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-700 hover:bg-red-600 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              isEdit ? "Save Changes" : "Create Product"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
