"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function AdminNewProductPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    description: "",
    price: "",
    currency: "USD",
    images: "",
    categorySlug: "",
    inStock: true,
    rating: "",
    reviewsCount: "",
    sizeOptions: "",
    details: "",
    materialCare: "",
  });
  const [categories, setCategories] = useState<Array<{ slug: string; name: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await requestAdmin<{ items: Array<{ slug: string; name: string }> }>("/api/categories");
        setCategories(data.items);
      } catch {}
    }
    if (isAdmin) loadCategories();
  }, [isAdmin]);

  async function uploadViaBackend(file: File): Promise<string> {
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
  const url = await uploadViaBackend(file);
      setForm((p) => {
        const urls = p.images.split(",").map((s) => s.trim()).filter(Boolean);
        urls.push(url);
        return { ...p, images: urls.join(",") };
      });
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
    setSaving(true);
    try {
      const body = {
        slug: form.slug.trim(),
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        currency: form.currency.trim() || "USD",
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        categorySlug: form.categorySlug.trim(),
        inStock: !!form.inStock,
        rating: form.rating ? Number(form.rating) : undefined,
        reviewsCount: form.reviewsCount ? Number(form.reviewsCount) : undefined,
        sizeOptions: form.sizeOptions.split(",").map((s) => s.trim()).filter(Boolean) || undefined,
        details: form.details.split("\n").map((s) => s.trim()).filter(Boolean) || undefined,
        materialCare: form.materialCare.split("\n").map((s) => s.trim()).filter(Boolean) || undefined,
      };
      await requestAdmin("/api/products", { method: "POST", body: JSON.stringify(body) });
      router.replace("/admin/products");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">New Product</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form onSubmit={onSave} className="mt-6 grid grid-cols-1 gap-4">
        <Input label="Slug" value={form.slug} onChange={(v) => setForm((p) => ({ ...p, slug: v }))} />
        <Input label="Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} />
        <Textarea label="Description" value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Price" value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v }))} />
          <Input label="Currency" value={form.currency} onChange={(v) => setForm((p) => ({ ...p, currency: v }))} />
        </div>
        <div>
          <label className="block text-sm font-medium">Images</label>
          <div className="mt-1 flex flex-col gap-2">
            <input
              className="w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="Paste image URLs (comma-separated) or use Upload"
              value={form.images}
              onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
              <button
                type="button"
                className="px-3 py-2 border border-black text-sm hover:bg-black hover:text-white disabled:opacity-60"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload Image"}
              </button>
            </div>
            {form.images ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {form.images.split(",").map((u, i) => (
                  <div key={i} className="relative w-16 h-16 border border-black/10 overflow-hidden">
                    <Image src={u} alt={`img-${i}`} fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-black/60">Uploads via backend Cloudinary route (admin-only).</p>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select className="mt-1 w-full border border-black/20 px-3 py-2 text-sm" value={form.categorySlug} onChange={(e) => setForm((p) => ({ ...p, categorySlug: e.target.value }))}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name} ({c.slug})</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Rating (optional)" value={form.rating} onChange={(v) => setForm((p) => ({ ...p, rating: v }))} />
          <Input label="Reviews Count (optional)" value={form.reviewsCount} onChange={(v) => setForm((p) => ({ ...p, reviewsCount: v }))} />
        </div>
        <Input label="Size Options (comma-separated)" value={form.sizeOptions} onChange={(v) => setForm((p) => ({ ...p, sizeOptions: v }))} />
        <Textarea label="Details (one per line)" value={form.details} onChange={(v) => setForm((p) => ({ ...p, details: v }))} />
        <Textarea label="Material & Care (one per line)" value={form.materialCare} onChange={(v) => setForm((p) => ({ ...p, materialCare: v }))} />
        <div className="flex items-center gap-2">
          <input id="instock" type="checkbox" checked={form.inStock} onChange={(e) => setForm((p) => ({ ...p, inStock: e.target.checked }))} />
          <label htmlFor="instock" className="text-sm">In stock</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60" disabled={saving}>{saving ? "Creating…" : "Create"}</button>
          <Link href="/admin/products" className="px-4 py-2 border border-black/30">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input className="mt-1 w-full border border-black/20 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <textarea className="mt-1 w-full border border-black/20 px-3 py-2 text-sm min-h-24" value={value} onChange={(e) => onChange(e.target.value)} />
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

