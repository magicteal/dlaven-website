"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDlavenPrivePage() {
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
      <h1 className="text-xl font-semibold">D&#39;LAVÉN Prive Management</h1>
      <p className="mt-2 text-sm text-black/60">
        Curate the Privé products and manage access codes. Codes are used to
        unlock access to the Privé area for customers.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Products Management Card */}
        <div className="border border-black/10 p-6 rounded-lg">
          <h2 className="font-semibold text-lg">Prive Products</h2>
          <p className="mt-2 text-sm text-black/70">
            Assign products to the <strong>prive</strong> category (category
            slug should be
            <code className="ml-1 bg-gray-100 px-1 rounded">prive</code>) so
            they appear on the Prive page once unlocked by code.
          </p>
          <div className="mt-4 flex gap-2">
            <Link href="/admin/products" passHref>
              <Button variant="outline">Manage Products</Button>
            </Link>
            <Link href="/admin/products/new?kind=prive" passHref>
              <Button variant="default">New Privé Product</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-black/60">
            Create or edit a product and set its category to <code>prive</code>.
          </p>
        </div>

        {/* Codes Flow Card */}
        <div className="border border-black/10 p-6 rounded-lg">
          <h2 className="font-semibold text-lg">Access Codes</h2>
          <p className="mt-2 text-sm text-black/70">
            Generate and manage access codes here. Imported or generated codes
            will be used to grant access to Privé products.
          </p>
          <div className="mt-4">
            <Link href="/admin/codes" passHref>
              <Button variant="outline">Manage Codes</Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-black/60">
            Use the Codes page to generate or import codes. The system tracks
            only codes and their usage.
          </p>
        </div>
      </div>
    </div>
  );
}
