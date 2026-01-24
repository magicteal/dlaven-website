"use client";

import React, { useEffect, useState } from "react";
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

// Animation duration to match MenuDrawer
const ANIMATION_DURATION = 400;

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Animation mounting logic matching MenuDrawer pattern
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      // Opening: mount immediately
      setMounted(true);
      setIsClosing(false);
      // Lock body scroll
      document.body.style.overflow = "hidden";
    } else if (mounted) {
      // Closing: set closing state and delay unmount
      setIsClosing(true);
      timeout = setTimeout(() => {
        setMounted(false);
        setIsClosing(false);
        document.body.style.overflow = "";
      }, ANIMATION_DURATION);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isOpen, mounted]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  if (!mounted) return null;

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  // Determine animation state like MenuDrawer
  const state = isClosing ? "closed" : isOpen ? "open" : "closed";

  return (
    <div
      onClick={onBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      data-state={state}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 [animation-duration:400ms]"
    >
      {/* Full-width panel from top of viewport with slide animation */}
      <div
        data-state={state}
        className="w-full bg-white/95 backdrop-blur-xl shadow-2xl border-b border-black/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 [animation-duration:400ms]"
      >
        {/* Search section with max-width container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4">
          <div className="flex items-center justify-between mb-6">
            {/* <h2 className="text-2xl sm:text-3xl font-light tracking-wide">Search</h2> */}
          </div>

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
                className="w-full bg-white/80 backdrop-blur-sm border-2 border-black/15 focus:border-black/40 rounded-none px-4 sm:px-6 py-4 sm:py-5 pr-14 text-base sm:text-lg md:text-xl placeholder:text-gray-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <Search className="h-6 w-6" />
              </button>
            </div>
          </form>
        </div>

        {/* Content grid with max-width container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
            {/* In Demand Section */}
            <div className="space-y-5">
              <h3 className="font-semibold uppercase tracking-widest text-xs sm:text-sm text-black/70 mb-6">
                IN DEMAND
              </h3>
              <ul className="space-y-3">
                {trendingSearches.map((item, index) => (
                  <li
                    key={item}
                    className="transform transition-all duration-200 hover:translate-x-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={`/products?q=${encodeURIComponent(item)}`}
                      onClick={onClose}
                      className="block text-base sm:text-lg uppercase tracking-wide hover:text-gray-600 transition-colors duration-200 relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* New In Section */}
            <div className="space-y-5">
              <h3 className="font-semibold uppercase tracking-widest text-xs sm:text-sm text-black/70 mb-6">
                NEW IN
              </h3>
              <ul className="space-y-3">
                {newInLinks.map((item, index) => (
                  <li
                    key={item}
                    className="transform transition-all duration-200 hover:translate-x-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href={`/products?category=${encodeURIComponent(item.toLowerCase())}`}
                      onClick={onClose}
                      className="block text-base sm:text-lg uppercase tracking-wide hover:text-gray-600 transition-colors duration-200 relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions Section */}
            <div className="space-y-5 md:border-l border-black/10 md:pl-10 lg:pl-12">
              <h3 className="font-semibold uppercase tracking-widest text-xs sm:text-sm text-black/70 mb-6">
                SUGGESTIONS
              </h3>
              <ul className="space-y-3">
                {suggestionLinks.map((item, index) => (
                  <li
                    key={item}
                    className="transform transition-all duration-200 hover:translate-x-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Link
                      href="#"
                      onClick={onClose}
                      className="block text-base sm:text-lg uppercase tracking-wide hover:text-gray-600 transition-colors duration-200 relative group"
                    >
                      {item}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Close button styled like MenuDrawer */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="absolute right-4 top-4 h-8 w-8 grid place-items-center bg-black text-white shadow-sm border border-transparent z-[60] pointer-events-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
