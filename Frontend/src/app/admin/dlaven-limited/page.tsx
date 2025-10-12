"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDlavenLimitedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  if (loading || !isAdmin) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-xl font-semibold">D'LAVÉN Limited Management</h1>
      <p className="mt-2 text-sm text-black/60">
        Manage exclusive products and the codes to access them.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Management Card */}
        <div className="border border-black/10 p-6 rounded-lg">
          <h2 className="font-semibold text-lg">Limited Products</h2>
          <p className="mt-2 text-sm text-black/70">
            Mark products as part of the "Dlaven Limited" collection to make
            them appear on the exclusive page.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/admin/products" passHref>
              <Button variant="outline">Manage Products</Button>
            </Link>
            <Link href="/admin/products/new?kind=limited" passHref>
              <Button variant="default">New Limited Product</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-black/60">
            Go to the products page, edit a product, and check the "Is a Dlaven
            Limited product" box.
          </p>
        </div>

        {/* Codes Management Card */}
        <div className="border border-black/10 p-6 rounded-lg">
          <h2 className="font-semibold text-lg">Access Codes</h2>
          <p className="mt-2 text-sm text-black/70">
            Generate new batches of codes specifically for the "Dlaven Limited"
            collection.
          </p>
          <div className="mt-4">
            <Link href="/admin/codes" passHref>
              <Button variant="outline">Manage Codes</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-black/60">
            On the codes page, enter{" "}
            <code className="bg-gray-100 p-1 rounded">dlaven-limited</code> in
            the "Collection" field before generating.
          </p>
        </div>
      </div>
    </div>
  );
}
