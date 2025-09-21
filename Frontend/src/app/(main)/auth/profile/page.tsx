"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
    }
  }, [loading, user, router]);

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
      console.error("[profile] update failed", { name, error: e });
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Edit Profile</h1>
        {loading ? (
          <p className="mt-4 text-sm text-black/70">Loading...</p>
        ) : user ? (
          <form className="mt-6 max-w-md space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-black/70">Name</label>
              <input
                type="text"
                className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-black/70">Email</label>
              <input
                type="email"
                className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
            <button type="button" className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider disabled:opacity-60" onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : null}
      </Container>
    </main>
  );
}
