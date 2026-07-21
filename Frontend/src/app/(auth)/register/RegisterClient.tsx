"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { Check, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

function safeNextPath(next: string | null) {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  return next;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

/* ─── Shared underline-style input ─── */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "#6F3D24", opacity: 0.7 }}>
        {label}
        {required && <span className="ml-1" style={{ color: "#c0392b" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputBase =
  "w-full px-0 py-3 text-sm bg-transparent outline-none transition-all placeholder:opacity-30";
const inputBorder = { borderBottom: "1px solid rgba(67,23,23,0.25)", color: "#431717" } as React.CSSProperties;

function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderBottomWidth = "2px";
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderBottomWidth = "1px";
}

/* ─── Password strength dot ─── */
function StrengthRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 transition-colors duration-300 ${ok ? "" : "opacity-40"}`}>
      <span
        className="flex-shrink-0 h-3 w-3 rounded-full border transition-all duration-300"
        style={{
          borderColor: ok ? "#431717" : "rgba(67,23,23,0.3)",
          backgroundColor: ok ? "#431717" : "transparent",
        }}
      >
        {ok && <Check className="h-2 w-2 text-white m-auto" style={{ display: "block" }} />}
      </span>
      <span className="text-[10px] tracking-wide" style={{ color: "#431717" }}>
        {label}
      </span>
    </div>
  );
}

/* ─── Stepper indicator ─── */
function Step({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <span
      className="flex items-center justify-center h-6 w-6 rounded-full text-[10px] font-semibold transition-all duration-300"
      style={{
        backgroundColor: done || active ? "#431717" : "transparent",
        border: `1px solid ${done || active ? "#431717" : "rgba(67,23,23,0.25)"}`,
        color: done || active ? "#F6F4E6" : "rgba(67,23,23,0.4)",
      }}
    >
      {done ? <Check className="h-3 w-3" /> : n}
    </span>
  );
}

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const initialEmail = searchParams.get("email") || "";
  const nextPath = safeNextPath(searchParams.get("next")) ?? "/account";

  /* ── State ── */
  const [step, setStep] = useState<1 | 2>(1);

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [title, setTitle] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [areaCode, setAreaCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── Password rules ── */
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordOk = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial;

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  /* ── Step 1 → 2 ── */
  function nextStep(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Please enter your email address.");
    if (!passwordOk) return setError("Please meet all password requirements.");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Final submit ── */
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!firstName || !lastName) return setError("Please fill in your first and last name.");

    let dob: string | undefined;
    if (dobMonth && dobDay && dobYear) {
      const monthIndex = MONTHS.indexOf(dobMonth) + 1;
      dob = `${dobYear}-${String(monthIndex).padStart(2, "0")}-${String(dobDay).padStart(2, "0")}`;
    }

    setLoading(true);
    try {
      await api.register({
        email,
        password,
        firstName,
        lastName,
        title: title || undefined,
        areaCode,
        phone: phone || undefined,
        dob,
        marketingConsent,
      });
      await refresh();
      router.push(nextPath);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
      if (msg.toLowerCase().includes("email")) setStep(1);
    } finally {
      setLoading(false);
    }
  }

  /* ─────────────────────────────────────── */
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F6F4E6" }}>
      {/* ── Left editorial panel ── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden flex-shrink-0">
        <Image
          src="/images/rightVisual.png"
          alt="D'Lavén — Register"
          fill
          className="object-cover object-center"
          priority
          sizes="55vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(67,23,23,0.22) 0%, rgba(111,61,36,0.08) 60%, transparent 100%)",
          }}
        />
        {/* brand text */}
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
            Join the
            <br />
            House
          </p>
        </div>


      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-24 py-16 overflow-y-auto">
        {/* Back link */}
        <div className="mb-10">
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
          <div className="mb-8">
            <p
              className="text-[10px] tracking-[0.35em] uppercase mb-4"
              style={{ color: "#6F3D24", opacity: 0.6 }}
            >
              Create Account
            </p>
            <h1
              className="font-le-grand text-4xl sm:text-5xl leading-[1.1] tracking-widest uppercase"
              style={{ color: "#431717" }}
            >
              Join
              <br />
              D&apos; Lavén
            </h1>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.55 }}>
              By creating an account you accept our{" "}
              <Link href="/terms" className="underline underline-offset-4 decoration-1 font-medium" style={{ color: "#6F3D24" }}>
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-4 decoration-1 font-medium" style={{ color: "#6F3D24" }}>
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* ── Step indicator ── */}
          <div className="flex items-center gap-3 mb-10">
            <Step n={1} active={step === 1} done={step > 1} />
            <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#431717", opacity: step === 1 ? 0.9 : 0.35 }}>
              Account
            </span>
            <div className="flex-1 h-px mx-2" style={{ backgroundColor: "rgba(67,23,23,0.15)" }} />
            <Step n={2} active={step === 2} done={false} />
            <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#431717", opacity: step === 2 ? 0.9 : 0.35 }}>
              Profile
            </span>
          </div>

          {/* ══════════════ STEP 1: Login info ══════════════ */}
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-6" noValidate>
              <Field label="Email address" required>
                <input
                  type="email"
                  autoComplete="email"
                  className={`${inputBase} border-b`}
                  style={inputBorder}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="your@email.com"
                  required
                  onFocus={focusIn}
                  onBlur={focusOut}
                />
                <p className="text-[10px] mt-1 tracking-wide" style={{ color: "#431717", opacity: 0.35 }}>
                  yourname@domain.com
                </p>
              </Field>

              <Field label="Password" required>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${inputBase} border-b pr-10`}
                    style={inputBorder}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="••••••••••"
                    required
                    onFocus={focusIn}
                    onBlur={focusOut}
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
              </Field>

              {/* Password strength */}
              <div
                className="p-5 rounded-sm"
                style={{ backgroundColor: "rgba(67,23,23,0.04)", border: "1px solid rgba(67,23,23,0.1)" }}
              >
                <p className="text-[10px] tracking-[0.15em] uppercase mb-4" style={{ color: "#431717", opacity: 0.5 }}>
                  Password requirements
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  <StrengthRow ok={hasMinLength} label="At least 10 characters" />
                  <StrengthRow ok={hasNumber} label="At least 1 number" />
                  <StrengthRow ok={hasUppercase} label="1 uppercase letter" />
                  <StrengthRow ok={hasSpecial} label="1 special character" />
                  <StrengthRow ok={hasLowercase} label="1 lowercase letter" />
                </div>
              </div>

              {error && (
                <div
                  className="text-xs py-3 px-4 border-l-2"
                  style={{ borderColor: "#c0392b", color: "#c0392b", backgroundColor: "rgba(192,57,43,0.05)" }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="group relative w-full flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-medium text-white transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Continue <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6F3D24" }}
                />
              </button>

              <p className="text-center text-[11px] tracking-wide" style={{ color: "#431717", opacity: 0.5 }}>
                Already have an account?{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(nextPath)}`}
                  className="underline underline-offset-4 font-medium"
                  style={{ color: "#6F3D24", opacity: 1 }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* ══════════════ STEP 2: Personal info ══════════════ */}
          {step === 2 && (
            <form onSubmit={onSubmit} className="space-y-6" noValidate>
              {/* Title */}
              <Field label="Title" required>
                <select
                  className={`${inputBase} border-b appearance-none cursor-pointer`}
                  style={inputBorder}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  onFocus={focusIn}
                  onBlur={focusOut}
                >
                  <option value="" disabled>Select…</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                  <option value="Dr">Dr</option>
                </select>
              </Field>

              {/* First / Last name */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" required>
                  <input
                    type="text"
                    autoComplete="given-name"
                    className={`${inputBase} border-b`}
                    style={inputBorder}
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setError(null); }}
                    placeholder="First name"
                    required
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </Field>
                <Field label="Last name" required>
                  <input
                    type="text"
                    autoComplete="family-name"
                    className={`${inputBase} border-b`}
                    style={inputBorder}
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setError(null); }}
                    placeholder="Last name"
                    required
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </Field>
              </div>

              {/* Phone */}
              <Field label="Phone number" required>
                <div className="flex gap-3">
                  <div className="w-20 flex-shrink-0">
                    <input
                      type="text"
                      className={`${inputBase} border-b`}
                      style={inputBorder}
                      value={areaCode}
                      onChange={(e) => setAreaCode(e.target.value)}
                      placeholder="+91"
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="tel"
                      autoComplete="tel-national"
                      className={`${inputBase} border-b`}
                      style={inputBorder}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      required
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>
                </div>
              </Field>

              {/* DOB */}
              <Field label="Date of birth">
                <div className="grid grid-cols-3 gap-3">
                  <select
                    className={`${inputBase} border-b appearance-none cursor-pointer`}
                    style={inputBorder}
                    value={dobMonth}
                    onChange={(e) => setDobMonth(e.target.value)}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <input
                    type="number"
                    className={`${inputBase} border-b`}
                    style={inputBorder}
                    value={dobDay}
                    onChange={(e) => setDobDay(e.target.value)}
                    placeholder="Day"
                    min="1"
                    max="31"
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                  <input
                    type="number"
                    className={`${inputBase} border-b`}
                    style={inputBorder}
                    value={dobYear}
                    onChange={(e) => setDobYear(e.target.value)}
                    placeholder="Year"
                    min="1900"
                    max={new Date().getFullYear()}
                    onFocus={focusIn}
                    onBlur={focusOut}
                  />
                </div>
              </Field>

              {/* Marketing consent */}
              <label
                className="flex items-start gap-3 cursor-pointer group"
                style={{ paddingTop: "8px" }}
              >
                <span
                  className="relative flex-shrink-0 mt-0.5 h-4 w-4 border transition-all duration-200"
                  style={{
                    borderColor: marketingConsent ? "#431717" : "rgba(67,23,23,0.3)",
                    backgroundColor: marketingConsent ? "#431717" : "transparent",
                  }}
                >
                  {marketingConsent && <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                />
                <span className="text-[11px] leading-relaxed" style={{ color: "#431717", opacity: 0.6 }}>
                  I agree to receive exclusive offers, new collection alerts, and updates from D&apos;Lavén.{" "}
                  <Link href="/privacy" className="underline underline-offset-2" style={{ color: "#6F3D24" }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {error && (
                <div
                  className="text-xs py-3 px-4 border-l-2"
                  style={{ borderColor: "#c0392b", color: "#c0392b", backgroundColor: "rgba(192,57,43,0.05)" }}
                >
                  {error}
                </div>
              )}

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(null); }}
                  className="flex-shrink-0 px-6 py-4 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border"
                  style={{ borderColor: "rgba(67,23,23,0.25)", color: "#431717" }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex-1 flex items-center justify-center gap-3 py-4 text-xs tracking-[0.25em] uppercase font-medium text-white transition-all duration-300 disabled:opacity-60 overflow-hidden"
                  style={{ backgroundColor: "#431717" }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {loading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                    ) : (
                      <>Create Account <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" /></>
                    )}
                  </span>
                  <span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#6F3D24" }}
                  />
                </button>
              </div>

              <p className="text-center text-[11px] tracking-wide" style={{ color: "#431717", opacity: 0.5 }}>
                Already have an account?{" "}
                <Link
                  href={`/login?next=${encodeURIComponent(nextPath)}`}
                  className="underline underline-offset-4 font-medium"
                  style={{ color: "#6F3D24", opacity: 1 }}
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
