"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const trendingSearches = ["Heritage Chain", "T Shirts", "Shirts"];
const newInLinks = ["Heritage Chain", "Men"];
const suggestionLinks = ["DL PRIVÉ SELECTIon", "Personalization", "BOUTIQUE Locator"];

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // GSAP Animation Logic
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
      gsap.to(overlayRef.current, {
        y: "0%",
        duration: 0.6,
        ease: "power3.inOut",
      });
    } else {
      gsap.to(overlayRef.current, {
        y: "-100%",
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => {
          document.body.style.overflow = "auto"; // Re-enable scrolling after animation
        },
      });
    }

    // Cleanup function to ensure scroll is re-enabled if component unmounts
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

  return (
    <div
      ref={overlayRef}
      className="fixed top-0 left-0 z-[100] h-screen w-full bg-white/95 backdrop-blur-md"
      style={{ transform: "translateY(-100%)" }} // Initial position off-screen
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
