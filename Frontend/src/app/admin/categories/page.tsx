"use client";

import { categories } from "@/data/categories";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function AdminCategoriesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Categories (fixed)</h1>
      <p className="mt-1 text-sm text-black/70">
        The site uses a fixed set of categories. You cannot add or remove
        categories from the admin panel.
      </p>

      <div className="mt-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="py-2 pr-4">Slug</th>
              <th className="py-2 pr-4">Name</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.slug} className="border-b border-black/5">
                <td className="py-2 pr-4 font-mono text-xs">{c.slug}</td>
                <td className="py-2 pr-4">{c.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
