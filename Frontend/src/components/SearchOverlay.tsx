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

const trendingSearches = ["Handbags", "Shoes", "Belts", "Bags"];
const newInLinks = ["Women", "Men"];
const suggestionLinks = ["GG Marmont", "Personalization", "Store Locator"];

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

        <div className="mt-8 max-w-4xl mx-auto">
          <form onSubmit={handleSearchSubmit}>
            <label htmlFor="search-input" className="sr-only">
              What are you looking for?
            </label>
            <div className="relative border-b border-black">
              <input
                id="search-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="w-full bg-transparent py-3 text-lg placeholder:text-gray-500 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <p className="font-semibold uppercase tracking-wider">
                Trending Searches
              </p>
              <ul className="mt-4 space-y-3">
                {trendingSearches.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/products?q=${encodeURIComponent(item)}`}
                      onClick={onClose}
                      className="hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wider">New In</p>
              <ul className="mt-4 space-y-3">
                {newInLinks.map((item) => (
                  <li key={item}>
                    <Link
                      href={`/products?category=${encodeURIComponent(
                        item.toLowerCase()
                      )}`}
                      onClick={onClose}
                      className="hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2">
              <p className="font-semibold uppercase tracking-wider">
                Suggestions
              </p>
              <ul className="mt-4 space-y-3">
                {suggestionLinks.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      onClick={onClose}
                      className="hover:underline"
                    >
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
