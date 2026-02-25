"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Upload, CheckCircle, AlertCircle, ImageIcon, RefreshCw } from "lucide-react";

interface UploadState {
  status: "idle" | "uploading" | "success" | "error";
  message?: string;
  url?: string;
}

function LogoUploadCard({
  title,
  description,
  variant,
  currentUrl,
  fallbackUrl,
  darkBackground,
}: {
  title: string;
  description: string;
  variant: "main" | "light";
  currentUrl: string | null;
  fallbackUrl: string;
  darkBackground?: boolean;
}) {
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      // Validate type
      const allowed = ["image/svg+xml", "image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!allowed.includes(file.type)) {
        setState({ status: "error", message: "Please use SVG, PNG, JPG, or WebP." });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setState({ status: "error", message: "File must be under 5MB." });
        return;
      }

      // Show local preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);

      setState({ status: "uploading" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("variant", variant);

      try {
        const res = await fetch("/api/admin/logo", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setState({ status: "success", message: "Logo uploaded! Refresh the page to see it live.", url: data.url });
      } catch (err) {
        setState({ status: "error", message: err instanceof Error ? err.message : "Upload failed" });
      }
    },
    [variant]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const displayUrl = previewUrl || fallbackUrl;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Current Logo Preview */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Current Logo</p>
          <div
            className={`rounded-lg p-6 flex items-center justify-center min-h-[100px] ${
              darkBackground ? "bg-gray-900" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <Image
              src={displayUrl}
              alt="Logo preview"
              width={240}
              height={60}
              className="h-12 w-auto object-contain"
              unoptimized
            />
          </div>
        </div>

        {/* Upload Area */}
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Upload New Logo</p>
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-red-400 bg-red-50"
                : "border-gray-300 hover:border-red-400 hover:bg-red-50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/svg+xml,image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleChange}
            />
            {state.status === "uploading" ? (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin text-red-600" />
                <span className="text-sm">Uploading…</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm font-medium">Drop your logo here or click to browse</span>
                <span className="text-xs text-gray-400">SVG, PNG, JPG, WebP — max 5MB</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {state.status === "success" && (
          <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">Upload successful!</p>
              <p className="text-xs text-green-600 mt-0.5">{state.message}</p>
            </div>
          </div>
        )}
        {state.status === "error" && (
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{state.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [logos, setLogos] = useState<{ mainLogo: string | null; lightLogo: string | null }>({
    mainLogo: null,
    lightLogo: null,
  });

  useEffect(() => {
    fetch("/api/admin/logo")
      .then((r) => r.json())
      .then((data) => setLogos(data))
      .catch(() => {});
  }, []);

  return (
    <div className="p-8 max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Branding & Logo</h1>
        <p className="text-gray-500 mt-1">
          Upload your logo to replace the default placeholder. Changes appear on the storefront immediately after upload.
        </p>
      </div>

      {/* Tips */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
        <ImageIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Logo tips for best results:</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-700">
            <li>Use SVG format for crisp display at any size</li>
            <li>Recommended dimensions: 300 × 80 px (landscape/horizontal layout)</li>
            <li>Main logo: dark text/colors on a white background</li>
            <li>Footer logo: white or light-colored text for dark backgrounds</li>
          </ul>
        </div>
      </div>

      {/* Upload Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LogoUploadCard
          title="Main Logo"
          description="Shown in the site header on a white background."
          variant="main"
          currentUrl={logos.mainLogo}
          fallbackUrl="/logo.svg"
          darkBackground={false}
        />
        <LogoUploadCard
          title="Footer Logo"
          description="Shown in the footer on a dark background. Use a light/white version of your logo."
          variant="light"
          currentUrl={logos.lightLogo}
          fallbackUrl="/logo-light.svg"
          darkBackground={true}
        />
      </div>

      {/* After upload instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        <p className="font-medium mb-1">After uploading your logo:</p>
        <p>
          Your new logo will appear on the storefront right away. If you don&apos;t see it update in the header/footer,
          do a hard refresh (<kbd className="bg-blue-100 px-1 rounded">Ctrl+Shift+R</kbd> or{" "}
          <kbd className="bg-blue-100 px-1 rounded">Cmd+Shift+R</kbd>) to clear the browser cache.
        </p>
      </div>
    </div>
  );
}
