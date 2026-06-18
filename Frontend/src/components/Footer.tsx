"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer
      className="text-white"
      style={{ backgroundColor: "#431717" }}
    >
        {/* Main grid */}
        <div className="max-w-[95%] mx-auto px-4 pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

            {/* Column 1: The company */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-6 font-medium"
                style={{ color: "#F6F4E6" }}
              >
                The company
              </p>
              <ul className="space-y-4">
                {[
                  { label: "Home", href: "/" },
                  { label: "Shop", href: "/products" },
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/contact" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms and Conditions", href: "/terms" },
                  { label: "Refund Policy", href: "/refund-policy" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
                      style={{ color: "#F6F4E6" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Your Account */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-6 font-medium"
                style={{ color: "#F6F4E6" }}
              >
                Your Account
              </p>
              <ul className="space-y-4">
                {[
                  { label: "My Account", href: "/me" },
                  { label: "Orders", href: "/orders" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm underline underline-offset-2 decoration-white/40 hover:decoration-white transition-colors"
                      style={{ color: "#F6F4E6" }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Sign Up For Updates */}
            <div>
              <p
                className="text-xs uppercase tracking-[0.2em] mb-6 font-medium"
                style={{ color: "#F6F4E6" }}
              >
                Sign Up For Updates
              </p>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: "#F6F4E6", opacity: 0.8 }}>
                By entering your email address below, you consent to receiving our newsletter with
                access to our latest collections, events and initiatives. More details on this are
                provided in our{" "}
                <Link href="/privacy" className="underline hover:opacity-100 transition-opacity" style={{ opacity: 0.9 }}>
                  Privacy Policy
                </Link>
                .
              </p>
              <form onSubmit={handleSubscribe} className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-transparent border-b text-sm py-3 pr-10 outline-none placeholder:text-white/50 focus:placeholder:text-white/30 transition-colors"
                  style={{
                    borderColor: "rgba(246,244,230,0.4)",
                    color: "#F6F4E6",
                  }}
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                  style={{ color: "#F6F4E6" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </form>
            </div>

          </div>
        </div>

        {/* Bottom: large logo */}
        <div className="border-t border-white/10 py-10 flex flex-col items-center gap-2">
          <Image
            src="/logos/logo.svg"
            alt="D' LAVÉN"
            width={480}
            height={115}
            className="w-[280px] sm:w-[380px] md:w-[480px] brightness-0 invert"
            priority
          />
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: "#F6F4E6", opacity: 0.7 }}>
            Estd. 2026
          </p>
        </div>
    </footer>
  );
}
