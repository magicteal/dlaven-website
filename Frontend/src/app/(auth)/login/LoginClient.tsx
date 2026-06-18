"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

function safeNextPath(next: string | null) {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  return next;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = safeNextPath(searchParams.get("next")) ?? "/account";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      // Check if email exists; if not, redirect to register
      const res = await api.checkEmail(normalizedEmail);
      if (!res.exists) {
        router.push(
          `/register?email=${encodeURIComponent(normalizedEmail)}&next=${encodeURIComponent(nextPath)}`
        );
        return;
      }
      await api.login({ email: normalizedEmail, password });
      await refresh();
      router.push(nextPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#F6F4E6" }} className="min-h-screen">
      {/* Login form section */}
      <div className="pt-32 pb-20 px-4 text-center">
        <h1
          className="font-le-grand text-4xl sm:text-5xl md:text-6xl font-normal tracking-widest uppercase"
          style={{ color: "#431717" }}
        >
          My D&apos; Lavén Account
        </h1>

        <h2
          className="font-le-grand text-xl sm:text-2xl md:text-3xl font-normal tracking-widest uppercase mt-6"
          style={{ color: "#6F3D24" }}
        >
          Continue With Your Email Address
        </h2>

        <p className="mt-4 text-sm" style={{ color: "#431717", opacity: 0.7 }}>
          Sign in with your email and password or{" "}
          <Link href="/register" className="underline hover:opacity-100 transition-opacity">
            create a profile
          </Link>{" "}
          if you are new.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 max-w-sm mx-auto space-y-4 text-left">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              placeholder="Email*"
              required
              className="w-full border px-4 py-3 text-sm bg-transparent outline-none focus:border-[#431717] transition-colors"
              style={{ borderColor: "#431717", color: "#431717" }}
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              placeholder="Password*"
              required
              className="w-full border px-4 py-3 text-sm bg-transparent outline-none focus:border-[#431717] transition-colors"
              style={{ borderColor: "#431717", color: "#431717" }}
            />
          </div>

          {error && (
            <p className="text-red-700 text-xs">{error}</p>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs underline underline-offset-2"
              style={{ color: "#6F3D24" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm tracking-widest uppercase text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: "#6F3D24" }}
          >
            {loading ? "Signing in…" : "Log in"}
          </button>
        </form>
      </div>

      {/* Join D'Lavén section */}
      <div
        className="py-20 px-4 text-center"
        style={{ borderTop: "1px solid rgba(67,23,23,0.2)" }}
      >
        <div>
          <h3
            className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase"
            style={{ color: "#431717" }}
          >
            Join D&apos; Lavén
          </h3>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl mx-auto">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#431717" }}
              >
                Track Your Orders
              </p>
              <p className="text-sm" style={{ color: "#431717", opacity: 0.7 }}>
                Follow your orders every step of the way.
              </p>
            </div>
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#431717" }}
              >
                Streamline Checkout
              </p>
              <p className="text-sm" style={{ color: "#431717", opacity: 0.7 }}>
                Check out faster with saved addresses and payment methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
