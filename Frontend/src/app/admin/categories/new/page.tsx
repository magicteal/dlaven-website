"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

export default function AdminNewCategoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const [form, setForm] = useState({
    slug: "",
    name: "",
    imageSrc: "",
    imageAlt: "",
    heroImage: "",
    badge: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

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

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>, field: 'imageSrc' | 'heroImage') {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const url = await uploadViaBackend(file);
      setForm((p) => ({ ...p, [field]: url }));
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
      await api.adminCreateCategory({
        slug: form.slug.trim(),
        name: form.name.trim(),
        imageSrc: form.imageSrc.trim() || undefined,
        imageAlt: form.imageAlt.trim() || undefined,
        heroImage: form.heroImage.trim() || undefined,
        badge: form.badge.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      router.replace("/admin/categories");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create category");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">New Category</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <form onSubmit={onSave} className="mt-6 grid grid-cols-1 gap-4">
        <Input
          label="Slug"
          value={form.slug}
          onChange={(v) => setForm((p) => ({ ...p, slug: v }))}
        />
        <Input
          label="Name"
          value={form.name}
          onChange={(v) => setForm((p) => ({ ...p, name: v }))}
        />
        <div>
          <label className="block text-sm font-medium">Card Image (imageSrc)</label>
          <div className="mt-1 flex flex-col gap-2">
            <input
              className="w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="Paste URL or use Upload"
              value={form.imageSrc}
              onChange={(e) => setForm((p) => ({ ...p, imageSrc: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-2 border border-black text-sm hover:bg-black hover:text-white disabled:opacity-60"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files?.[0]) {
                      onFileSelect({ target } as React.ChangeEvent<HTMLInputElement>, 'imageSrc');
                    }
                  };
                  input.click();
                }}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload Image"}
              </button>
            </div>
            {form.imageSrc ? (
              <div className="relative w-24 h-24 border border-black/10">
                <Image
                  src={form.imageSrc}
                  alt={form.imageAlt || "category image"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
        <Input
          label="Card Image Alt (imageAlt)"
          value={form.imageAlt}
          onChange={(v) => setForm((p) => ({ ...p, imageAlt: v }))}
        />
        <div>
          <label className="block text-sm font-medium">Hero Image (optional)</label>
          <div className="mt-1 flex flex-col gap-2">
            <input
              className="w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="Paste URL or use Upload"
              value={form.heroImage}
              onChange={(e) => setForm((p) => ({ ...p, heroImage: e.target.value }))}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="px-3 py-2 border border-black text-sm hover:bg-black hover:text-white disabled:opacity-60"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: Event) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files?.[0]) {
                      onFileSelect({ target } as React.ChangeEvent<HTMLInputElement>, 'heroImage');
                    }
                  };
                  input.click();
                }}
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "Upload Hero"}
              </button>
            </div>
            {form.heroImage ? (
              <div className="relative w-24 h-24 border border-black/10">
                <Image
                  src={form.heroImage}
                  alt="hero image"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </div>
        </div>
        <Input
          label="Badge (optional)"
          value={form.badge}
          onChange={(v) => setForm((p) => ({ ...p, badge: v }))}
        />
        <Textarea
          label="Description (optional)"
          value={form.description}
          onChange={(v) => setForm((p) => ({ ...p, description: v }))}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Creating…" : "Create"}
          </button>
          <Link href="/admin/categories" className="px-4 py-2 border">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Input({
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
      <input
        className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
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
