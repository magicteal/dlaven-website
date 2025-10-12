import Link from "next/link";

export default function AdminDlBarryPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">DL Barry (Admin)</h1>
      <p className="mt-2 text-sm text-black/70">
        Manage DL Barry products and settings.
      </p>

      <div className="mt-6 space-y-2">
        <Link
          href="/admin/products?section=dl-barry"
          className="inline-block text-sm hover:underline"
        >
          View DL Barry products
        </Link>
      </div>
    </div>
  );
}
