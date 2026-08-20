"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

type NavLink = { label: string; href: string };
type NavSection = { heading: string; links: NavLink[] };

// Featured visual on the left of the search panel
const featured = {
  label: "Heritage Jewellery",
  href: "/heritage-jewelry",
  image: "/images/leftVisual.png",
};

// Category columns shown on the right. Each column may hold several sections.
const searchColumns: NavSection[][] = [
  [
    {
      heading: "Women",
      links: [
        { label: "New In", href: "/products" },
        { label: "Ready-to-Wear", href: "/womens-ready-to-wear" },
        { label: "Heritage Jewellery", href: "/heritage-jewelry" },
        { label: "DL Privé Edition", href: "/prive" },
        { label: "Fragrance", href: "/fragrances" },
        { label: "View all", href: "/womens-adornments" },
      ],
    },
  ],
  [
    {
      heading: "Men",
      links: [
        { label: "New In", href: "/products" },
        { label: "Ready-to-Wear", href: "/mens-ready-to-wear" },
        { label: "Heritage Jewellery", href: "/heritage-jewelry" },
        { label: "DL Privé Edition", href: "/prive" },
        { label: "View all", href: "/mens-adornments" },
      ],
    },
  ],
  [
    {
      heading: "Jewellery",
      links: [
        { label: "Heritage Jewellery", href: "/heritage-jewelry" },
        { label: "Privé Jewellery", href: "/prive-jewellery" },
        { label: "View all", href: "/heritage-jewelry" },
      ],
    },
    {
      heading: "Fragrance",
      links: [
        { label: "Signature Scents", href: "/fragrances" },
        { label: "View all", href: "/fragrances" },
      ],
    },
  ],
  [
    {
      heading: "The House",
      links: [
        { label: "World of D'Lavén", href: "/world-of-d-laven" },
        { label: "DL Services", href: "/services" },
        { label: "Destinations", href: "/destinations" },
        { label: "Personalization", href: "/services" },
      ],
    },
  ],
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
      data-search-backdrop=""
      className="fixed inset-0 z-[35] bg-black/20 backdrop-blur-sm"
    >
      {/* Panel drops down from beneath the navbar. */}
      <div
        data-state={state}
        data-search-panel=""
        className="absolute left-4 right-4 top-28 z-[36] bg-[#F6F4E6] text-[#14161f] [font-family:var(--font-manrope)] backdrop-blur-md shadow-2xl border border-black/10 md:left-6 md:right-6 md:top-32"
      >
        {/* Search field */}
        <div className="px-6 sm:px-10 lg:px-12 pt-8 sm:pt-10 pb-6">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl">
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
                className="w-full bg-transparent border-0 border-b border-black/25 focus:border-black/60 rounded-none px-1 py-2.5 pr-10 text-sm sm:text-base placeholder:text-gray-500 focus:outline-none transition-colors duration-300"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black transition-colors duration-200"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Featured image + category columns */}
        <div className="flex items-stretch gap-6 lg:gap-10 px-6 sm:px-10 lg:px-12 pb-10">
          {/* Left visual with label overlay */}
          <Link
            href={featured.href}
            onClick={onClose}
            className="group relative hidden md:block w-52 lg:w-64 shrink-0 overflow-hidden"
          >
            <Image
              src={featured.image}
              alt={featured.label}
              fill
              sizes="256px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <span className="absolute bottom-4 left-4 right-4 text-white text-xs uppercase tracking-[0.15em]">
              {featured.label}
            </span>
          </Link>

          {/* Category columns */}
          <div className="flex-1 min-w-0 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {searchColumns.map((column, ci) => (
              <div key={ci} className="space-y-8">
                {column.map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-semibold uppercase tracking-widest text-[0.65rem] text-[#14161f]/55 mb-4">
                      {section.heading}
                    </h3>
                    <ul className="space-y-2.5">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="block text-xs tracking-wide text-[#14161f]/90 hover:text-black transition-colors duration-200"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="absolute right-5 top-5 h-9 w-9 grid place-items-center rounded-full border border-[#14161f]/20 bg-transparent text-[#14161f]/70 hover:text-[#000000] hover:border-[#14161f]/45 transition-colors duration-200 z-[60] pointer-events-auto"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
