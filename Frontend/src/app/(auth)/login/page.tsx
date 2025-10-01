"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setSuccess(`Welcome back, ${res.user.email}`);
      await refresh();
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Login</h1>
        <form onSubmit={onSubmit} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-black/70">Email</label>
            <input
              type="email"
              className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-black/70">Password</label>
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
          <div className="flex items-center justify-between">
            <a href="/forgot-password" className="text-xs text-black/70 hover:text-black">Forgot password?</a>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </Container>
    </main>
  );
}
