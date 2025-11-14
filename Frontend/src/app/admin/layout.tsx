import type { ReactNode } from "react";
import Link from "next/link";
export const metadata = {
  title: "Admin • D’ LAVÉN",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[220px_1fr]">
      <aside className="hidden md:flex flex-col border-r border-black/10 p-4 gap-2">
        <div className="text-xs uppercase tracking-wider text-black/70">
          Admin
        </div>
        <Link href="/admin/profile" className="text-sm hover:underline">
          Profile
        </Link>
        <Link href="/admin/users" className="text-sm hover:underline">
          Users
        </Link>
        <Link href="/admin/products" className="text-sm hover:underline">
          Products
        </Link>
        <Link href="/admin/categories" className="text-sm hover:underline">
          Categories
        </Link>
        <Link href="/admin/orders" className="text-sm hover:underline">
          Orders
        </Link>
        <Link href="/admin/settings" className="text-sm hover:underline">
          Settings
        </Link>
        <Link href="/admin/codes" className="text-sm hover:underline">
          Codes
        </Link>
        <Link href="/admin/dlaven-limited" className="text-sm hover:underline">
          DLaven Limited
        </Link>
        <Link href="/admin/prive" className="text-sm hover:underline">
          DLaven Privé
        </Link>
        <Link href="/admin/dl-barry" className="text-sm hover:underline">
          DL Barry
        </Link>
        {/* Add more admin sections here */}
      </aside>
      <main className="p-4 sm:p-6">{children}</main>
    </div>
  );
}
