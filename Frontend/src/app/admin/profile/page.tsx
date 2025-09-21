"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function AdminProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/auth/login");
      else if (!isAdmin) router.replace("/");
      else {
        setName(user.name || "");
        setEmail(user.email);
      }
    }
  }, [loading, user, isAdmin, router]);

  async function onSave() {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await api.updateProfile({ name });
      await refresh();
      setMessage("Profile updated.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      console.error("[admin/profile] update failed", { name, error: e });
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-semibold">My Profile</h1>
      {loading ? (
        <p className="mt-4 text-sm text-black/70">Loading...</p>
      ) : user && isAdmin ? (
        <form className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <button
            type="button"
            className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : null}
    </div>
  );
}
