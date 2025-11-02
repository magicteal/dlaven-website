"use client";

import { useState } from "react";
import Container from "@/components/Container";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-64px)] flex flex-col">
        <main className="flex-1 flex items-center justify-center py-12 sm:py-16">
          <Container>
            <div className="mx-auto w-full max-w-lg text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
                Enter the World of D&apos;LAVÉN
              </h1>
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/70 text-center">
                    Email
                  </label>
                  <input
                    type="email"
                    className="mt-1 w-full border border-black/20 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black mx-auto"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-black/70 text-center">
                    Password
                  </label>
                  <input
                    type="password"
                    className="mt-1 w-full border border-black/20 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-black mx-auto"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                {success ? (
                  <p className="text-sm text-emerald-600">{success}</p>
                ) : null}
                <div className="flex items-center justify-between">
                  <a
                    href="/forgot-password"
                    className="text-xs text-black/70 hover:text-black"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="space-y-3 mt-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-black text-white text-base disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                  <Link href="/register" className="inline-block w-full">
                    <Button
                      variant="outline"
                      className="w-full px-6 py-4 text-base"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </form>
            </div>
          </Container>
        </main>
      </div>

      <Footer />
    </>
  );
}
