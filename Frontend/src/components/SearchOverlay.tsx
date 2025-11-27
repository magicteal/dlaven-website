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
  const overlayRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  // Keep an internal mounted flag so we can fully unrender when closed,
  // preventing any clipped content from appearing on mobile browsers.
  const [mounted, setMounted] = useState(false);

  // GSAP Animation Logic
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = "hidden"; // Disable scrolling
      // Ensure starting position is fully offscreen
      if (overlayRef.current) {
        gsap.set(overlayRef.current, { yPercent: -100 });
      }
      gsap.to(overlayRef.current, {
        yPercent: 0,
        duration: 0.45,
        ease: "power3.out",
      });
    } else {
      // Animate out, then fully unmount so nothing leaks visually
      if (overlayRef.current) {
        gsap.to(overlayRef.current, {
          yPercent: -100,
          duration: 0.35,
          ease: "power3.in",
          onComplete: () => {
            setMounted(false);
            document.body.style.overflow = "auto";
          },
        });
      } else {
        setMounted(false);
        document.body.style.overflow = "auto";
      }
    }

    // Cleanup to restore scroll on unmount
    return () => {
      document.body.style.overflow = "auto";
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

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-14 sm:h-16 md:h-20">
          <button
            onClick={onClose}
            aria-label="Close search"
            className="text-gray-600 hover:text-black"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8 max-w-6xl mx-auto">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search-input" className="sr-only">
              What are you looking for?
            </label>
            <div className="relative border-b-2 border-black">
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent py-4 text-xl md:text-2xl placeholder:text-gray-700 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 text-base md:text-lg">
            <div>
              <p className="font-semibold uppercase tracking-wider text-black text-base md:text-lg">
                IN DEMAND
              </p>
              <ul className="mt-6 space-y-4">
                {trendingSearches.map((item) => (
                  <li key={item} className="uppercase">
                    <Link
                      href={`/products?q=${encodeURIComponent(item)}`}
                      onClick={onClose}
                      className="block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold uppercase tracking-wider text-black text-base md:text-lg">
                NEW IN
              </p>
              <ul className="mt-6 space-y-4">
                {newInLinks.map((item) => (
                  <li key={item} className="uppercase">
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        item.toLowerCase()
                      )}`}
                      onClick={onClose}
                      className="block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-l-2 border-black/20 pl-8">
              <p className="font-semibold uppercase tracking-wider text-black text-base md:text-lg">
                SUGGESTIONS
              </p>
              <ul className="mt-6 space-y-4">
                {suggestionLinks.map((item) => (
                  <li key={item} className="uppercase">
                    <Link href="#" onClick={onClose} className="block">
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
