"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  slug: string;
  name: string;
  imageSrc?: string;
  imageAlt?: string;
};

export default function AdminCategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [items, setItems] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      try {
        const data = await requestAdmin<{ items: Category[] }>("/api/categories");
        setItems(data.items);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load categories");
      }
    }
    if (isAdmin) load();
  }, [isAdmin]);

  async function onDelete(slug: string) {
    if (!confirm(`Delete category ${slug}?`)) return;
    setBusy(slug);
    try {
      await requestAdmin(`/api/categories/${encodeURIComponent(slug)}`, { method: "DELETE" });
      setItems((prev) => prev.filter((c) => c.slug !== slug));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Categories</h1>
        <Link className="px-3 py-1 border border-black text-sm hover:bg-black hover:text-white" href="/admin/categories/new">New Category</Link>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Image</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.slug} className="border-b border-black/5">
                <td className="py-2 pr-4 font-mono text-xs">{c.slug}</td>
                <td className="py-2 pr-4">{c.name}</td>
                <td className="py-2 pr-4">{c.imageSrc ? <span className="text-xs">{c.imageSrc}</span> : "—"}</td>
                <td className="py-2 pr-4 flex gap-2">
                  <a className="px-3 py-1 border border-black text-xs hover:bg-black hover:text-white" href={`/admin/categories/${c.slug}`}>Edit</a>
                  <button className="px-3 py-1 border border-red-600 text-red-600 text-xs hover:bg-red-600 hover:text-white disabled:opacity-60" onClick={() => onDelete(c.slug)} disabled={busy === c.slug}>Delete</button>
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
