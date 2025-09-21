"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import BrandText from "@/components/BrandText";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-white">
      {/* Top grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {/* Column 1: The Company */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 mb-4">The Company</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/shop" className="hover:underline">Shop</Link></li>
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link href="/refund" className="hover:underline">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 2: Your Account */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 mb-4">Your Account</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/account" className="hover:underline">My Account</Link></li>
              <li><Link href="/orders" className="hover:underline">Orders</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/70 mb-2">Sign up for updates</p>
            <p className="text-[11px] leading-relaxed text-white/70 max-w-[520px]">
              By entering your email address below, you consent to receiving our newsletter with access to our latest collections, events and initiatives. More details on this are provided in our
            </p>
            <div className="mt-4 flex items-center gap-2 border-b border-white/40 pb-3 flex-wrap">
              <Input type="email" placeholder="Email" className="border-0 px-0 flex-1 min-w-[200px]" />
              <button aria-label="Submit email" className="text-white/80 hover:text-white px-2">›</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-center text-[10px] text-white/70">
          © {year} D’ LAVÉN. All Rights Reserved
        </div>
      </div>

      {/* Bottom brand band */}
      <div className="border-t border-white/10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative py-16 sm:py-20 md:py-24">
          {/* Overlay row centered vertically */}
          <div className="absolute inset-0 z-10">
            <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs sm:text-sm text-white/85">
              <div className="flex w-full items-center justify-between gap-3 sm:gap-6">
                <a href="tel:+917488575159" className="hover:underline">+91-7488575159</a>
                <a href="mailto:youremail@gmail.com" className="hover:underline">youremail@gmail.com</a>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none">
            <BrandText className="w-[92vw] max-w-[560px] sm:w-[88vw] sm:max-w-[640px] md:w-[72vw] md:max-w-[980px] lg:max-w-[1120px] opacity-90" />
          </div>
        </div>
      </div>
    </footer>
  );
}
