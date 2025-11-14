"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default function AdminEditCategoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slugParam = (params as any)?.slug as string;
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

  useEffect(() => {
    async function load() {
      try {
        const data = await requestAdmin<{ item: any }>(`/api/categories/${encodeURIComponent(slugParam)}`);
        const item = data.item;
        setSlug(item.slug);
        setName(item.name || "");
        setImageSrc(item.imageSrc || "");
        setImageAlt(item.imageAlt || "");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load category");
      }
    }
    if (isAdmin && slugParam) load();
  }, [isAdmin, slugParam]);

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

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestAdmin(`/api/categories/${encodeURIComponent(slugParam)}`, {
        method: "PATCH",
        body: JSON.stringify({ slug, name, imageSrc, imageAlt }),
      });
      router.replace("/admin/categories");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete category ${slugParam}?`)) return;
    setBusy(true);
    try {
      await requestAdmin(`/api/categories/${encodeURIComponent(slugParam)}`, { method: "DELETE" });
      router.replace("/admin/categories");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Edit Category</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form className="mt-4 max-w-lg" onSubmit={onSave}>
        <label className="block mb-2">Slug
          <input className="w-full mt-1 p-2 border" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </label>
        <label className="block mb-2">Name
          <input className="w-full mt-1 p-2 border" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block mb-2">Image Src
          <input className="w-full mt-1 p-2 border" value={imageSrc} onChange={(e) => setImageSrc(e.target.value)} />
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
              className="inline-block px-3 py-1 border border-black text-xs cursor-pointer hover:bg-black hover:text-white disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </label>
            {imageSrc && (
              <div className="mt-2 w-32 h-32 border border-black/10 overflow-hidden">
                <img src={imageSrc} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </label>
        <label className="block mb-2">Image Alt
          <input className="w-full mt-1 p-2 border" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} />
        </label>
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 border" disabled={busy}>{busy ? "Saving..." : "Save"}</button>
          <button type="button" className="px-4 py-2 border border-red-600 text-red-600" onClick={onDelete} disabled={busy}>{busy ? "..." : "Delete"}</button>
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
