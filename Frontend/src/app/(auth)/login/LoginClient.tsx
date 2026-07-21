"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex" style={{ backgroundColor: "#F6F4E6" }}>
      {/* ── Left panel: editorial image ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-shrink-0">
        <Image
          src="/images/leftVisual.png"
          alt="D'Lavén — Heritage Luxury"
          fill
          className="object-cover object-center"
          priority
          sizes="55vw"
        />
        {/* Warm sepia overlay for brand cohesion */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(67,23,23,0.18) 0%, rgba(111,61,36,0.08) 60%, transparent 100%)",
          }}
        />
        {/* Brand label — bottom left */}
        <div className="absolute bottom-10 left-10 text-white">
          <p
            className="font-le-grand text-xs tracking-[0.3em] uppercase opacity-70 mb-2"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            D&apos; Lavén
          </p>
          <p
            className="font-le-grand text-2xl sm:text-3xl tracking-[0.12em] uppercase leading-tight"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
          >
            Heritage
            <br />
            Meets Luxury
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-24 py-16 lg:py-0 overflow-y-auto">
        {/* Logo / back-to-store */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-60"
            style={{ color: "#6F3D24" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to store
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto lg:mx-0">
          {/* Header */}
          <div className="mb-10">
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "#6F3D24", opacity: 0.6 }}
            >
              My D&apos; Lavén Account
            </p>
            <h1
              className="font-le-grand text-4xl sm:text-5xl leading-[1.1] tracking-widest uppercase"
              style={{ color: "#431717" }}
            >
              Welcome
              <br />
              Back
            </h1>
            <p className="mt-5 text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.55 }}>
              Sign in with your email and password, or{" "}
              <Link
                href="/register"
                className="underline underline-offset-4 decoration-1 hover:opacity-100 transition-opacity font-medium"
                style={{ color: "#6F3D24" }}
              >
                create a profile
              </Link>{" "}
              if you&apos;re new to D&apos; Lavén.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="relative">
              <label
                htmlFor="login-email"
                className="block text-[10px] tracking-[0.2em] uppercase mb-2"
                style={{ color: "#6F3D24", opacity: 0.7 }}
              >
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                placeholder="your@email.com"
                required
                className="w-full px-0 py-3 text-sm bg-transparent border-b outline-none transition-colors placeholder:opacity-30 focus:border-b-2"
                style={{
                  borderBottom: "1px solid rgba(67,23,23,0.25)",
                  color: "#431717",
                }}
                onFocus={(e) => (e.currentTarget.style.borderBottomWidth = "2px")}
                onBlur={(e) => (e.currentTarget.style.borderBottomWidth = "1px")}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="login-password"
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: "#6F3D24", opacity: 0.7 }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] tracking-[0.1em] underline underline-offset-4 decoration-1 transition-opacity hover:opacity-100"
                  style={{ color: "#6F3D24", opacity: 0.55 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••••"
                  required
                  className="w-full px-0 py-3 pr-10 text-sm bg-transparent border-b outline-none transition-colors placeholder:opacity-30 focus:border-b-2"
                  style={{
                    borderBottom: "1px solid rgba(67,23,23,0.25)",
                    color: "#431717",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderBottomWidth = "2px")}
                  onBlur={(e) => (e.currentTarget.style.borderBottomWidth = "1px")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100"
                  style={{ color: "#6F3D24", opacity: 0.4 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-xs py-3 px-4 border-l-2"
                style={{ borderColor: "#c0392b", color: "#c0392b", backgroundColor: "rgba(192,57,43,0.05)" }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-medium text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
                  ) : (
                    <>Sign In <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>
                  )}
                </span>
                {/* Hover shimmer */}
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6F3D24" }}
                />
              </button>
            </div>

            {/* Register link */}
            <p className="text-center text-[11px] tracking-wide" style={{ color: "#431717", opacity: 0.5 }}>
              New to D&apos; Lavén?{" "}
              <Link
                href={`/register?next=${encodeURIComponent(nextPath)}`}
                className="underline underline-offset-4 font-medium transition-opacity hover:opacity-100"
                style={{ color: "#6F3D24", opacity: 1 }}
              >
                Create an account
              </Link>
            </p>
          </form>

          {/* Benefits strip */}
          <div
            className="mt-14 pt-10 grid grid-cols-2 gap-6"
            style={{ borderTop: "1px solid rgba(67,23,23,0.12)" }}
          >
            {[
              { title: "Track Your Orders", desc: "Follow your orders every step of the way." },
              { title: "Streamline Checkout", desc: "Check out faster with saved addresses." },
            ].map((b) => (
              <div key={b.title}>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-2"
                  style={{ color: "#431717" }}
                >
                  {b.title}
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: "#431717", opacity: 0.55 }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
