"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await api.forgotPassword({ email });
      setSuccess("If an account exists, a reset link has been sent.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Forgot Password</h1>
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
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          <button
            type="submit"
            className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </Container>
    </main>
  );
}
