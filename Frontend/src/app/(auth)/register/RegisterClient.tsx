"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { Check } from "lucide-react";

function safeNextPath(next: string | null) {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  return next;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function RegisterClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  // Pre-fill email from query param (coming from login page)
  const initialEmail = searchParams.get("email") || "";
  const nextPath = safeNextPath(searchParams.get("next")) ?? "/account";

  // Form state
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

  // Password validation
  const hasMinLength = password.length >= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?\":{}|<>]/.test(password);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      setError("Please fill in all required fields");
      return;
    }

    if (
      !hasMinLength ||
      !hasUppercase ||
      !hasLowercase ||
      !hasNumber ||
      !hasSpecial
    ) {
      setError("Password does not meet the requirements");
      return;
    }

    // Build DOB string
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
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full border border-[#ccc] px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-[#8b4513] bg-white";
  const labelClass = "block text-xs text-[#666] mb-1";

  return (
    <div className="min-h-[calc(100vh-160px)] pt-32 pb-12 sm:pt-36 sm:pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-xl uppercase tracking-[0.15em] text-[#2c3e50] font-light mb-2">
            Create an Account
          </h1>
          <p className="text-sm text-[#666]">
            By creating an account, you agree to accept the{" "}
            <Link
              href="/terms"
              className="text-[#8b4513] underline hover:no-underline"
            >
              General Terms and Conditions of Use
            </Link>{" "}
            and that your data will be processed in compliance with the{" "}
            <Link
              href="/privacy"
              className="text-[#8b4513] underline hover:no-underline"
            >
              Privacy Policy
            </Link>{" "}
            of D&apos;Lavén.
          </p>
        </div>

        <div className="bg-[#faf9f7] border border-[#e5e5e5] p-6 sm:p-8 lg:p-10">
          <div className="flex justify-end mb-4">
            <span className="text-xs text-red-600">* Required information</span>
          </div>

          <form onSubmit={onSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <div>
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#2c3e50] font-medium mb-6">
                  Login Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      E-mail <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      className={inputClass}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="E-mail *"
                      required
                    />
                    <p className="text-xs text-[#999] mt-1">
                      Expected format: yourname@domain.com
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className={labelClass}>
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
                      className={inputClass}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password *"
                      required
                    />
                  </div>

                  <div className="text-xs text-[#666] space-y-1">
                    <p className="text-[#999]">
                      For your security, we invite you to fill your password
                      according to the following criteria:
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                      <div
                        className={`flex items-center gap-1 ${
                          hasMinLength ? "text-green-600" : ""
                        }`}
                      >
                        {hasMinLength && <Check className="h-3 w-3" />}
                        <span>At least 10 characters</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          hasNumber ? "text-green-600" : ""
                        }`}
                      >
                        {hasNumber && <Check className="h-3 w-3" />}
                        <span>At least 1 number</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          hasUppercase ? "text-green-600" : ""
                        }`}
                      >
                        {hasUppercase && <Check className="h-3 w-3" />}
                        <span>At least 1 uppercase letter</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          hasSpecial ? "text-green-600" : ""
                        }`}
                      >
                        {hasSpecial && <Check className="h-3 w-3" />}
                        <span>At least 1 special character</span>
                      </div>
                      <div
                        className={`flex items-center gap-1 ${
                          hasLowercase ? "text-green-600" : ""
                        }`}
                      >
                        {hasLowercase && <Check className="h-3 w-3" />}
                        <span>At least 1 lowercase letter</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm uppercase tracking-[0.15em] text-[#2c3e50] font-medium mb-6">
                  Personal Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>
                      Title <span className="text-red-600">*</span>
                    </label>
                    <select
                      className={inputClass}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    >
                      <option value="">Title *</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Ms">Ms</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      First name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name *"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Last name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      className={inputClass}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name *"
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Telephone number <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="w-24">
                        <label className="block text-[10px] text-[#999] mb-0.5">
                          Area code *
                        </label>
                        <input
                          type="text"
                          className={inputClass}
                          value={areaCode}
                          onChange={(e) => setAreaCode(e.target.value)}
                          placeholder="+91"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] text-[#999] mb-0.5">
                          &nbsp;
                        </label>
                        <input
                          type="tel"
                          className={inputClass}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Telephone number *"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Date of birth</label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        className={inputClass}
                        value={dobMonth}
                        onChange={(e) => setDobMonth(e.target.value)}
                      >
                        <option value="">Month</option>
                        {MONTHS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        className={inputClass}
                        value={dobDay}
                        onChange={(e) => setDobDay(e.target.value)}
                        placeholder="Day"
                        min="1"
                        max="31"
                      />
                      <input
                        type="number"
                        className={inputClass}
                        value={dobYear}
                        onChange={(e) => setDobYear(e.target.value)}
                        placeholder="Year"
                        min="1900"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#e5e5e5] pt-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 border-[#ccc] rounded-sm"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                />
                <span className="text-xs text-[#666] leading-relaxed">
                  I agree to receive information by email about offers, services,
                  products and events from D&apos;Lavén or other group companies,
                  in accordance with the{" "}
                  <Link
                    href="/privacy"
                    className="text-[#8b4513] underline hover:no-underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              <p className="text-xs text-[#999] mt-2 ml-7">
                You can unsubscribe from email marketing communications via the
                &quot;Unsubscribe&quot; link at the bottom of each of our email
                promotional communications.
              </p>
            </div>

            {error && (
              <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
            )}

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="px-12 py-3 bg-[#3c3c3c] text-white text-sm uppercase tracking-[0.1em] hover:bg-[#2c2c2c] transition-colors disabled:opacity-60 rounded-sm"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create an Account"}
              </button>
            </div>

            <p className="text-center text-xs text-[#666] mt-4">
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(nextPath)}`}
                className="text-[#8b4513] underline hover:no-underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
