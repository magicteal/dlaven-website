"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { AlertCircle } from "lucide-react";

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

  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = safeNextPath(searchParams.get("next")) ?? "/account";

  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const res = await api.checkEmail(email);
      if (res.exists) {
        setStep("password");
      } else {
        router.push(
          `/register?email=${encodeURIComponent(email)}&next=${encodeURIComponent(nextPath)}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to check email";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    try {
      await api.login({ email, password });
      await refresh();
      router.push(nextPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center pt-32 pb-12 sm:pt-36 sm:pb-16">
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="bg-[#faf9f7] border border-[#e5e5e5] shadow-sm">
          <div className="px-6 py-4 border-b border-[#e5e5e5]">
            <h1 className="text-sm uppercase tracking-[0.15em] text-[#2c3e50] font-medium">
              Account
            </h1>
          </div>

          <div className="px-6 py-10 sm:px-12 sm:py-14">
            {step === "email" ? (
              <form onSubmit={handleContinue} className="max-w-md mx-auto">
                <p className="text-sm text-[#333] mb-6">
                  Please enter your email below to access or create your account
                </p>

                <div className="mb-4">
                  <label className="block text-xs text-[#666] mb-1">
                    E-mail <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8b4513] bg-white ${
                      error ? "border-red-500" : "border-[#ccc]"
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="E-mail *"
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-600 text-xs mb-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Required information</p>
                      <p className="text-[#666]">
                        Expected format: yourname@domain.com
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mt-6 px-6 py-3 bg-[#3c3c3c] text-white text-sm uppercase tracking-[0.1em] hover:bg-[#2c2c2c] transition-colors disabled:opacity-60 rounded-sm"
                  disabled={loading}
                >
                  {loading ? "Checking..." : "Continue"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="max-w-md mx-auto">
                <p className="text-sm text-[#333] mb-6">
                  Welcome back! Please enter your password to continue.
                </p>

                <div className="mb-4">
                  <label className="block text-xs text-[#666] mb-1">E-mail</label>
                  <input
                    type="email"
                    className="w-full border border-[#ccc] px-4 py-3 text-base bg-gray-100 text-[#666]"
                    value={email}
                    disabled
                  />
                  <button
                    type="button"
                    className="text-xs text-[#8b4513] underline mt-1"
                    onClick={() => {
                      setStep("email");
                      setPassword("");
                      setError(null);
                    }}
                  >
                    Use a different email
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs text-[#666]">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <button
                      type="button"
                      className="text-xs text-[#8b4513] underline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full border px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8b4513] bg-white ${
                      error ? "border-red-500" : "border-[#ccc]"
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Password *"
                    autoFocus
                  />
                </div>

                {error && <p className="text-red-600 text-xs mb-2">{error}</p>}

                <div className="flex justify-end mb-4">
                  <a
                    href="/forgot-password"
                    className="text-xs text-[#8b4513] underline hover:no-underline"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-[#3c3c3c] text-white text-sm uppercase tracking-[0.1em] hover:bg-[#2c2c2c] transition-colors disabled:opacity-60 rounded-sm"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
