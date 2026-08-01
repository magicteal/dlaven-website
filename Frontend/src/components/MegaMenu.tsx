"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, X } from "lucide-react";

export type MegaMenuCategoryKey =
  | "WOMENS"
  | "MENS"
  | "JEWELLERY"
  | "DL PRIVE"
  | "DL BERRY"
  | "FRAGRANCE"
  | "NEW IN"
  | null;

export interface SubCategoryItem {
  label: string;
  href: string;
  badge?: string;
}

export interface CategoryData {
  title: string;
  description: string;
  image: string;
  ctaHref: string;
  items: SubCategoryItem[];
}

export const MEGA_MENU_DATA: Record<string, CategoryData> = {
  WOMENS: {
    title: "WOMENS COLLECTION",
    description: "Explore timeless luxury, ready-to-wear, and fine adornments.",
    image: "/images/womens_heritage.jpg",
    ctaHref: "/womens-adornments",
    items: [
      { label: "DL LIMITED HERITAGE", href: "/dlaven-limited/heritage/womens", badge: "EXCLUSIVE" },
      { label: "DL LIMITED INTERNATIONAL", href: "/dlaven-limited/international/womens", badge: "EXCLUSIVE" },
      { label: "DL PRIVÉ HERITAGE", href: "/dl-prive/heritage/womens" },
      { label: "DL PRIVÉ INTERNATIONAL", href: "/dl-prive/international/womens" },
      { label: "DL BÉRRY HERITAGE", href: "/dl-barry/heritage/womens" },
      { label: "DL BÉRRY INTERNATIONAL", href: "/dl-barry/international/womens" },
      { label: "READY TO WEAR", href: "/womens-ready-to-wear" },
      { label: "DL PRIVÉ ADORNMENTS", href: "/prive-womens-adornments" },
    ],
  },
  MENS: {
    title: "MENS COLLECTION",
    description: "Refined sartorial elegance, signature adornments, and fragrances.",
    image: "/images/mensReady.png",
    ctaHref: "/mens-adornments",
    items: [
      { label: "DL LIMITED HERITAGE", href: "/dlaven-limited/heritage/mens", badge: "EXCLUSIVE" },
      { label: "DL LIMITED INTERNATIONAL", href: "/dlaven-limited/international/mens", badge: "EXCLUSIVE" },
      { label: "DL PRIVÉ HERITAGE", href: "/dl-prive/heritage/mens" },
      { label: "DL PRIVÉ INTERNATIONAL", href: "/dl-prive/international/mens" },
      { label: "DL BÉRRY HERITAGE", href: "/dl-barry/heritage/mens" },
      { label: "DL BÉRRY INTERNATIONAL", href: "/dl-barry/international/mens" },
      { label: "READY TO WEAR", href: "/mens-ready-to-wear" },
      { label: "DL PRIVÉ ADORNMENTS", href: "/prive-mens-adornments" },
    ],
  },
  JEWELLERY: {
    title: "HERITAGE & INTERNATIONAL JEWELLERY",
    description: "Handcrafted masterworks inspired by centuries of heritage.",
    image: "/images/heritage_hero.png",
    ctaHref: "/heritage-jewelry",
    items: [
      { label: "DL LIMITED HERITAGE JEWELLERY", href: "/dlaven-limited/heritage/jewellery" },
      { label: "DL LIMITED INTERNATIONAL JEWELLERY", href: "/dlaven-limited/international/jewellery" },
      { label: "DL PRIVÉ HERITAGE JEWELLERY", href: "/dl-prive/heritage/jewellery" },
      { label: "DL PRIVÉ INTERNATIONAL JEWELLERY", href: "/dl-prive/international/jewellery" },
      { label: "DL BÉRRY HERITAGE JEWELLERY", href: "/dl-barry/heritage/jewellery" },
      { label: "DL BÉRRY INTERNATIONAL JEWELLERY", href: "/dl-barry/international/jewellery" },
      { label: "WOMENS FINE ADORNMENTS", href: "/prive-womens-adornments" },
      { label: "MENS FINE ADORNMENTS", href: "/prive-mens-adornments" },
    ],
  },
  "DL PRIVE": {
    title: "DL PRIVÉ EDITIONS",
    description: "By invitation and code access only. Bespoke craftsmanship.",
    image: "/images/dlprive_1.jpg",
    ctaHref: "/dl-prive",
    items: [
      { label: "DL PRIVÉ HERITAGE COLLECTION", href: "/dl-prive/heritage", badge: "CODE REQUIRED" },
      { label: "DL PRIVÉ INTERNATIONAL COLLECTION", href: "/dl-prive/international" },
      { label: "PRIVÉ CLOTHES (READY TO WEAR)", href: "/dl-prive/clothes" },
      { label: "PRIVÉ FINE JEWELLERY", href: "/dl-prive/jewellery" },
      { label: "PRIVÉ HAUTE PARFUMERIE", href: "/dl-prive/fragrances" },
      { label: "PRIVÉ WOMENS SELECTION", href: "/dl-prive/womens" },
      { label: "PRIVÉ MENS SELECTION", href: "/dl-prive/mens" },
    ],
  },
  "DL BERRY": {
    title: "DL BÉRRY CREATIONS",
    description: "Bold contemporary expressions of modern luxury.",
    image: "/images/marquee_1.jpg",
    ctaHref: "/dl-barry",
    items: [
      { label: "DL BÉRRY HERITAGE COLLECTION", href: "/dl-barry/heritage" },
      { label: "DL BÉRRY INTERNATIONAL COLLECTION", href: "/dl-barry/international" },
      { label: "BÉRRY CLOTHES (READY TO WEAR)", href: "/dl-barry/clothes" },
      { label: "BÉRRY FINE JEWELLERY", href: "/dl-barry/jewellery" },
      { label: "BÉRRY HAUTE PARFUMERIE", href: "/dl-barry/fragrances" },
      { label: "BÉRRY WOMENS SELECTION", href: "/dl-barry/womens" },
      { label: "BÉRRY MENS SELECTION", href: "/dl-barry/mens" },
    ],
  },
  FRAGRANCE: {
    title: "HAUTE PARFUMERIE",
    description: "Rare olfactory compositions and bespoke elixir bottles.",
    image: "/images/fragrance_hero.png",
    ctaHref: "/fragrances",
    items: [
      { label: "DL LIMITED HERITAGE FRAGRANCE", href: "/dlaven-limited/heritage/fragrances" },
      { label: "DL LIMITED INTERNATIONAL FRAGRANCE", href: "/dlaven-limited/international/fragrances" },
      { label: "DL PRIVÉ HERITAGE FRAGRANCE", href: "/dl-prive/heritage/fragrances" },
      { label: "DL PRIVÉ INTERNATIONAL FRAGRANCE", href: "/dl-prive/international/fragrances" },
      { label: "DL BÉRRY HERITAGE FRAGRANCE", href: "/dl-barry/heritage/fragrances" },
      { label: "DL BÉRRY INTERNATIONAL FRAGRANCE", href: "/dl-barry/international/fragrances" },
      { label: "WOMENS PARFUM", href: "/fragrances?gender=women" },
      { label: "MENS PARFUM", href: "/fragrances?gender=men" },
    ],
  },
  "NEW IN": {
    title: "NEW ARRIVALS",
    description: "Discover the latest creations freshly unveiled from the House.",
    image: "/images/fashion_hero.png",
    ctaHref: "/products",
    items: [
      { label: "VIEW ALL NEW ARRIVALS", href: "/products", badge: "NEW" },
      { label: "DL LIMITED EDITIONS", href: "/dlaven-limited" },
      { label: "DL PRIVÉ EXCLUSIVES", href: "/dl-prive" },
      { label: "DL BÉRRY CREATIONS", href: "/dl-barry" },
    ],
  },
};

interface MegaMenuProps {
  activeCategory: MegaMenuCategoryKey;
  onClose: () => void;
}

export default function MegaMenu({
  activeCategory,
  onClose,
}: MegaMenuProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (activeCategory) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCategory, onClose]);

  if (!activeCategory || !MEGA_MENU_DATA[activeCategory]) return null;

  const data = MEGA_MENU_DATA[activeCategory];

  return (
    <>
      {/* Backdrop tint - positioned below the header so the navbar above remains unblurred */}
      <div
        className="fixed inset-0 top-[110px] md:top-[130px] bg-black/35 z-[30] transition-opacity duration-500 animate-fadeIn"
        onClick={onClose}
      />

      {/* Mega Menu Card Container - Compact height layout */}
      <div className="absolute top-[calc(100%+16px)] left-0 right-0 w-full z-[50] bg-[#e2ddd7] text-[#14161f] shadow-2xl rounded-none border border-[#14161f]/15 overflow-hidden transition-all duration-500 ease-out animate-megaMenuIn [font-family:var(--font-manrope)]">
        <div className="w-full px-5 py-4 md:px-8 md:py-5">
          {/* Header Bar inside Mega Menu Card: Path & Close button */}
          <div className="flex items-center justify-between border-b border-[#14161f]/15 pb-2.5 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] font-semibold text-[#431717]">
                D’LAVÉN
              </span>
              <span className="text-xs text-[#14161f]/40">/</span>
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium text-[#14161f]/75">
                {data.title}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] font-semibold text-[#14161f]/70 hover:text-[#431717] transition-colors p-0.5"
              aria-label="Close mega menu"
            >
              <span>CLOSE</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Grid Layout: Main sub-menu items + Featured Visual Callout */}
          <div
            key={activeCategory}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start transition-all duration-300 animate-fadeIn"
          >
            {/* Left 7 Columns: Items List in 2 Clean Sub-columns */}
            <div className="lg:col-span-7 flex flex-col justify-between h-full">
              <div>
                <div className="mb-3">
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.25em] text-[#431717] font-semibold mb-0.5">
                    CATEGORY EXCLUSIVES
                  </h3>
                  <h2 className="text-xl md:text-2xl font-light text-[#14161f] tracking-wide uppercase">
                    {data.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                  {data.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between py-1 text-xs font-medium tracking-[0.06em] uppercase text-[#14161f]/85 hover:text-[#000000] transition-all duration-200"
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.badge && (
                          <span className="text-[8px] px-1.5 py-0.2 bg-[#431717] text-white tracking-widest font-normal rounded-none">
                            {item.badge}
                          </span>
                        )}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#431717]" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom direct link */}
              <div className="mt-4 pt-2.5 border-t border-[#14161f]/15 flex items-center justify-between">
                <p className="text-[11px] text-[#14161f]/70 font-normal">
                  {data.description}
                </p>
                <Link
                  href={data.ctaHref}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#431717] hover:underline underline-offset-4 transition-all"
                >
                  <span>EXPLORE ALL</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Right 5 Columns: Compact Visual Showcase Banner */}
            <div className="lg:col-span-5 relative group overflow-hidden rounded-none bg-[#d8d2cb] aspect-[16/9] max-h-[230px] flex flex-col justify-end p-4 shadow-sm">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <div className="relative z-10 text-white">
                <span className="text-[9px] uppercase tracking-[0.25em] font-medium text-white/80 block mb-0.5">
                  HOUSE OF D’LAVÉN
                </span>
                <h4 className="text-base font-light tracking-wide uppercase mb-1.5">
                  {data.title}
                </h4>
                <Link
                  href={data.ctaHref}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 text-black text-[11px] font-medium uppercase tracking-[0.15em] hover:bg-white transition-colors rounded-none"
                >
                  <span>DISCOVER</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
