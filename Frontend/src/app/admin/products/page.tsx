"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

type Product = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  categorySlug?: string;
  inStock?: boolean;
};

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [items, setItems] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await requestAdmin<{ items: Product[] }>("/api/products");
        setItems(data.items);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load products");
      }
    }
    if (isAdmin) load();
  }, [isAdmin]);

  async function onDelete(slug: string) {
    if (!confirm(`Delete product ${slug}?`)) return;
    setBusy(slug);
    try {
      await requestAdmin(`/api/products/${slug}`, { method: "DELETE" });
      setItems((prev) => prev.filter((p) => p.slug !== slug));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Products</h1>
        <a className="px-3 py-1 border border-black text-sm hover:bg-black hover:text-white" href="/admin/products/new">New Product</a>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2 pr-4">Category</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.slug} className="border-b border-black/5">
                <td className="py-2 pr-4 font-mono text-xs">{p.slug}</td>
                <td className="py-2 pr-4">{p.name}</td>
                <td className="py-2 pr-4">{new Intl.NumberFormat(undefined, { style: "currency", currency: p.currency, maximumFractionDigits: 0 }).format(p.price)}</td>
                <td className="py-2 pr-4">{p.categorySlug || "—"}</td>
                <td className="py-2 pr-4">{p.inStock ? "In stock" : "Sold out"}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <a className="px-3 py-1 border border-black text-xs hover:bg-black hover:text-white" href={`/admin/products/${p.slug}`}>Edit</a>
                  <button className="px-3 py-1 border border-red-600 text-red-600 text-xs hover:bg-red-600 hover:text-white disabled:opacity-60" onClick={() => onDelete(p.slug)} disabled={busy === p.slug}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
