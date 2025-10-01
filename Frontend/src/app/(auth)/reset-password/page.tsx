"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (!token) {
      setError("Missing reset token. Please use the link from your email.");
      return;
    }
    try {
      await api.resetPassword({ token, password });
      setSuccess("Password updated.");
      setTimeout(() => router.replace("/me"), 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("token");
      if (t) setToken(t);
    } catch {}
  }, []);

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Reset Password</h1>
        <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-black/70">New Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider disabled:opacity-60"
            disabled={loading || !token}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </Container>
    </main>
  );
}
