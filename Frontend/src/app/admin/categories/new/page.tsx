"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminNewCategoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  async function uploadImage(file: File): Promise<string> {
    const { API_BASE } = await import("@/lib/api");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_BASE}/api/uploads/image`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Upload failed");
    return data.item.url as string;
  }

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setImageSrc(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestAdmin(`/api/categories`, {
        method: "POST",
        body: JSON.stringify({ slug, name, imageSrc, imageAlt }),
      });
      router.replace("/admin/categories");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">New Category</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4">
        <label className="block">
          <span className="block text-sm font-medium">Slug</span>
          <input
            className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <input
            className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <div>
          <label className="block text-sm font-medium">Image Src</label>
          <input
            className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
            placeholder="Paste URL or use Upload"
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
          />
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
              id="image-upload"
              disabled={uploading}
            />
            <label
              htmlFor="image-upload"
              className="inline-block px-3 py-2 border border-black text-sm cursor-pointer hover:bg-black hover:text-white disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </label>
            {imageSrc && (
              <div className="mt-2 w-24 h-24 border border-black/10 relative">
                <Image
                  src={imageSrc}
                  alt="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <label className="block">
          <span className="block text-sm font-medium">Image Alt</span>
          <input
            className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
            disabled={busy}
          >
            {busy ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="px-4 py-2 border"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

async function requestAdmin<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { API_BASE } = await import("@/lib/api");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
