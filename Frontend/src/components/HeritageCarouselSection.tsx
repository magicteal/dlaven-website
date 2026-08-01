"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const LE_GRAND = `var(--font-le-grand), serif`;
const MANROPE = `var(--font-manrope), sans-serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";
const BRAND_GOLD = "#A47E53";

export interface SubCategoryBlock {
  title: string;
  modelImage: string;
  exploreHref: string;
  carouselImages: string[];
}

interface HeritageCarouselSectionProps {
  categoryTitle: string; // e.g. "DL LIMITED JEWELLERY"
  categorySubtitle?: string;
  heritageBlock: SubCategoryBlock;
  internationalBlock: SubCategoryBlock;
}

export default function HeritageCarouselSection({
  categoryTitle,
  categorySubtitle,
  heritageBlock,
  internationalBlock,
}: HeritageCarouselSectionProps) {
  const heritageMarqueeRef = useRef<HTMLDivElement>(null);
  const internationalMarqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heritageMarqueeRef.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        heritageMarqueeRef.current,
        { xPercent: -33.33 },
        {
          xPercent: 0,
          ease: "none",
          duration: 35,
          repeat: -1,
        }
      );
    }, heritageMarqueeRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!internationalMarqueeRef.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        internationalMarqueeRef.current,
        { xPercent: 0 },
        {
          xPercent: -33.33,
          ease: "none",
          duration: 35,
          repeat: -1,
        }
      );
    }, internationalMarqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full py-12 md:py-16 text-center overflow-hidden" style={{ background: BG_CREAM }}>
      
      {/* ── Main Category Section Title ── */}
      <div className="max-w-4xl mx-auto px-4 mb-10">
        <h2
          className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.15em] font-normal"
          style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
        >
          {categoryTitle}
        </h2>
        {categorySubtitle && (
          <p className="mt-2 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#6F3D24] font-medium">
            {categorySubtitle}
          </p>
        )}
        <div className="w-20 h-px bg-[#431717]/20 mx-auto mt-5" />
      </div>

      {/* ══════════════════════════════════════════
          1. HERITAGE SUB-BLOCK
      ══════════════════════════════════════════ */}
      <div className="mb-16 space-y-6">
        
        {/* Centered Featured Image (Landscape Format 16/9) */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden cursor-pointer group shadow-sm"
            style={{ width: "clamp(240px, 32vw, 440px)", aspectRatio: "16/9" }}
          >
            <Image
              src={heritageBlock.modelImage}
              alt={heritageBlock.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 80vw, 32vw"
            />
          </div>
        </div>

        {/* Sub-block Title */}
        <h3
          className="font-le-grand uppercase tracking-[0.25em] text-base sm:text-lg font-normal"
          style={{ fontFamily: LE_GRAND, color: BRAND_GOLD }}
        >
          {heritageBlock.title}
        </h3>

        {/* Explore Button */}
        <div className="flex justify-center">
          <Link
            href={heritageBlock.exploreHref}
            className="inline-flex items-center justify-center px-9 py-2 border text-xs tracking-[0.3em] font-medium uppercase transition-all duration-300 shadow-sm"
            style={{
              fontFamily: LE_GRAND,
              borderColor: BRAND_DARK,
              color: BRAND_DARK,
              backgroundColor: "transparent",
            }}
          >
            EXPLORE
          </Link>
        </div>

        {/* GSAP Auto-Moving Infinite Marquee Carousel (Landscape Format 16/9) */}
        <div className="relative w-screen -mx-4 overflow-hidden py-3">
          <div ref={heritageMarqueeRef} className="flex gap-4 md:gap-5" style={{ width: "fit-content" }}>
            {[...Array(3)].map((_, setIdx) =>
              heritageBlock.carouselImages.map((imgSrc, idx) => (
                <Link
                  key={`${imgSrc}-${setIdx}-${idx}`}
                  href={heritageBlock.exploreHref}
                  className="relative flex-shrink-0 shadow-sm group overflow-hidden"
                  style={{ width: "clamp(220px, 28vw, 360px)", aspectRatio: "16/9" }}
                >
                  <Image
                    src={imgSrc}
                    alt={`${heritageBlock.title} Image ${idx + 1}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 60vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════
          2. INTERNATIONAL SUB-BLOCK
      ══════════════════════════════════════════ */}
      <div className="space-y-6">
        
        {/* Centered Featured Image (Landscape Format 16/9) */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden cursor-pointer group shadow-sm"
            style={{ width: "clamp(240px, 32vw, 440px)", aspectRatio: "16/9" }}
          >
            <Image
              src={internationalBlock.modelImage}
              alt={internationalBlock.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 80vw, 32vw"
            />
          </div>
        </div>

        {/* Sub-block Title */}
        <h3
          className="font-le-grand uppercase tracking-[0.25em] text-base sm:text-lg font-normal"
          style={{ fontFamily: LE_GRAND, color: BRAND_GOLD }}
        >
          {internationalBlock.title}
        </h3>

        {/* Explore Button */}
        <div className="flex justify-center">
          <Link
            href={internationalBlock.exploreHref}
            className="inline-flex items-center justify-center px-9 py-2 border text-xs tracking-[0.3em] font-medium uppercase transition-all duration-300 shadow-sm"
            style={{
              fontFamily: LE_GRAND,
              borderColor: BRAND_DARK,
              color: BRAND_DARK,
              backgroundColor: "transparent",
            }}
          >
            EXPLORE
          </Link>
        </div>

        {/* GSAP Auto-Moving Infinite Marquee Carousel (Landscape Format 16/9) */}
        <div className="relative w-screen -mx-4 overflow-hidden py-3">
          <div ref={internationalMarqueeRef} className="flex gap-4 md:gap-5" style={{ width: "fit-content" }}>
            {[...Array(3)].map((_, setIdx) =>
              internationalBlock.carouselImages.map((imgSrc, idx) => (
                <Link
                  key={`${imgSrc}-${setIdx}-${idx}`}
                  href={internationalBlock.exploreHref}
                  className="relative flex-shrink-0 shadow-sm group overflow-hidden"
                  style={{ width: "clamp(220px, 28vw, 360px)", aspectRatio: "16/9" }}
                >
                  <Image
                    src={imgSrc}
                    alt={`${internationalBlock.title} Image ${idx + 1}`}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 60vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </Link>
              ))
            )}
          </div>
        </div>

      </div>

    </section>
  );
}
