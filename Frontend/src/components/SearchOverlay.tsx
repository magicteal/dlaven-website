"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = ["Heritage Chain", "T Shirts", "Shirts"];
const newInLinks = ["Heritage Chain", "Men"];
const suggestionLinks = [
  "DL PRIVÉ SELECTIon",
  "Personalization",
  "BOUTIQUE Locator",
];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  // Keep an internal mounted flag so we can fully unrender when closed,
  // preventing any clipped content from appearing on mobile browsers.
  const [mounted, setMounted] = useState(false);

  // GSAP Animation Logic
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Animate in: subtle dropdown and fade
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { y: -18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }
        );
      }
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "linear" }
        );
      }
    } else {
      // Animate out, then unmount
      const tl = gsap.timeline({ onComplete: () => setMounted(false) });
      if (panelRef.current) tl.to(panelRef.current, { y: -14, opacity: 0, duration: 0.38, ease: "power3.in" }, 0);
      if (backdropRef.current) tl.to(backdropRef.current, { opacity: 0, duration: 0.35, ease: "linear" }, 0);
    }

    // Cleanup to restore scroll on unmount
    return () => {
      // no body lock for dropdown variant
    };
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose(); // Close the overlay
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  if (!mounted) return null;

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div
      ref={backdropRef}
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[80] bg-black/0"
    >
      {/* Dropdown panel anchored below navbar */}
      <div
        ref={panelRef}
        className="absolute left-1/2 -translate-x-1/2 top-[80px] w-[min(1200px,calc(100%-2rem))] bg-white shadow-2xl border border-black/10"
      >
        {/* Search row */}
        <div className="px-4 sm:px-6 md:px-8 pt-4 sm:pt-6">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search-input" className="sr-only">
              What are you looking for?
            </label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent border border-black/20 px-3 sm:px-4 py-3 sm:py-3.5 pr-12 text-sm sm:text-base md:text-lg placeholder:text-gray-600 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center justify-end py-2">
            <button onClick={onClose} className="text-sm underline hover:no-underline">
              Cancel
            </button>
          </div>
        </div>

        {/* Content grid */}
        <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 text-sm sm:text-base">
            <div>
              <p className="font-semibold uppercase tracking-wider text-black">IN DEMAND</p>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                {trendingSearches.map((item) => (
                  <li key={item} className="uppercase">
                    <Link
                      href={`/products?q=${encodeURIComponent(item)}`}
                      onClick={onClose}
                      className="block hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-black">NEW IN</p>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                {newInLinks.map((item) => (
                  <li key={item} className="uppercase">
                    <Link
                      href={`/products?category=${encodeURIComponent(item.toLowerCase())}`}
                      onClick={onClose}
                      className="block hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:border-l border-black/10 md:pl-8">
              <p className="font-semibold uppercase tracking-wider text-black">SUGGESTIONS</p>
              <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                {suggestionLinks.map((item) => (
                  <li key={item} className="uppercase">
                    <Link href="#" onClick={onClose} className="block hover:underline">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
