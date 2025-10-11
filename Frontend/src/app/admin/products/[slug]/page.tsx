"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  slug: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  images: string[];
  categorySlug?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  sizeOptions?: string[];
  details?: string[];
  materialCare?: string[];
  isLimited?: boolean; // New field for Dlaven Limited products
};

export default function AdminEditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [form, setForm] = useState({
    slug: params.slug,
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
    isLimited: false, // New state for Dlaven Limited
  });
  const [loadingItem, setLoadingItem] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ slug: string; name: string }>
  >([]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await requestAdmin<{ item: Product }>(
          `/api/products/${params.slug}`
        );
        const p = data.item;
        setForm({
          slug: p.slug,
          name: p.name,
          description: p.description || "",
          price: String(p.price),
          currency: p.currency,
          images: (p.images || []).join(","),
          categorySlug: p.categorySlug || "",
          inStock: !!p.inStock,
          rating: p.rating != null ? String(p.rating) : "",
          reviewsCount: p.reviewsCount != null ? String(p.reviewsCount) : "",
          sizeOptions: p.sizeOptions ? p.sizeOptions.join(",") : "",
          details: p.details ? p.details.join("\n") : "",
          materialCare: p.materialCare ? p.materialCare.join("\n") : "",
          isLimited: !!p.isLimited, // Set isLimited state
        });
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load product");
      } finally {
        setLoadingItem(false);
      }
    }
    if (isAdmin) load();
  }, [isAdmin, params.slug]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await requestAdmin<{
          items: Array<{ slug: string; name: string }>;
        }>("/api/categories");
        setCategories(data.items);
      } catch {}
    }
    if (isAdmin) loadCategories();
  }, [isAdmin]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price) || 0,
        currency: form.currency.trim() || "USD",
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        categorySlug: form.categorySlug.trim(),
        inStock: !!form.inStock,
        rating: form.rating ? Number(form.rating) : undefined,
        reviewsCount: form.reviewsCount ? Number(form.reviewsCount) : undefined,
        sizeOptions:
          form.sizeOptions
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean) || undefined,
        details:
          form.details
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean) || undefined,
        materialCare:
          form.materialCare
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean) || undefined,
        isLimited: form.isLimited, // Include isLimited in payload
      };
      await requestAdmin(`/api/products/${params.slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      router.replace("/admin/products");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!confirm(`Delete product ${params.slug}?`)) return;
    setDeleting(true);
    setError(null);
    try {
      await requestAdmin(`/api/products/${params.slug}`, { method: "DELETE" });
      router.replace("/admin/products");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit Product</h1>
        <button
          onClick={onDelete}
          className="px-3 py-1 border border-red-600 text-red-600 text-sm hover:bg-red-600 hover:text-white disabled:opacity-60"
          disabled={deleting}
        >
          Delete
        </button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      {loadingItem ? (
        <p className="mt-4 text-sm">Loading…</p>
      ) : (
        <form onSubmit={onSave} className="mt-6 grid grid-cols-1 gap-4">
          <Input label="Slug" value={form.slug} onChange={() => {}} disabled />
          <Input
            label="Name"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
          />
          <Textarea
            label="Description"
            value={form.description}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price"
              value={form.price}
              onChange={(v) => setForm((p) => ({ ...p, price: v }))}
            />
            <Input
              label="Currency"
              value={form.currency}
              onChange={(v) => setForm((p) => ({ ...p, currency: v }))}
            />
          </div>
          <Input
            label="Images (comma-separated URLs)"
            value={form.images}
            onChange={(v) => setForm((p) => ({ ...p, images: v }))}
          />
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
              value={form.categorySlug}
              onChange={(e) =>
                setForm((p) => ({ ...p, categorySlug: e.target.value }))
              }
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Rating (optional)"
              value={form.rating}
              onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
            />
            <Input
              label="Reviews Count (optional)"
              value={form.reviewsCount}
              onChange={(v) => setForm((p) => ({ ...p, reviewsCount: v }))}
            />
          </div>
          <Input
            label="Size Options (comma-separated)"
            value={form.sizeOptions}
            onChange={(v) => setForm((p) => ({ ...p, sizeOptions: v }))}
          />
          <Textarea
            label="Details (one per line)"
            value={form.details}
            onChange={(v) => setForm((p) => ({ ...p, details: v }))}
          />
          <Textarea
            label="Material & Care (one per line)"
            value={form.materialCare}
            onChange={(v) => setForm((p) => ({ ...p, materialCare: v }))}
          />
          <div className="flex items-center gap-2">
            <input
              id="instock"
              type="checkbox"
              checked={form.inStock}
              onChange={(e) =>
                setForm((p) => ({ ...p, inStock: e.target.checked }))
              }
            />
            <label htmlFor="instock" className="text-sm">
              In stock
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isLimited"
              type="checkbox"
              checked={form.isLimited}
              onChange={(e) =>
                setForm((p) => ({ ...p, isLimited: e.target.checked }))
              }
            />
            <label htmlFor="isLimited" className="text-sm">
              Is a Dlaven Limited product
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            <Link
              href="/admin/products"
              className="px-4 py-2 border border-black/30"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input
        disabled={disabled}
        className="mt-1 w-full border border-black/20 px-3 py-2 text-sm disabled:bg-black/5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <textarea
        className="mt-1 w-full border border-black/20 px-3 py-2 text-sm min-h-24"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

async function requestAdmin<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
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
