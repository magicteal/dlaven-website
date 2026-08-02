"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";

const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

export interface CategorySectionBlock {
  title: string;
  modelImage: string;
  exploreHref: string;
  carouselImages: string[];
}

interface HeritageCarouselSectionProps {
  categoryTitle?: string;
  categorySubtitle?: string;
  block: CategorySectionBlock;
}

export default function HeritageCarouselSection({
  categoryTitle,
  categorySubtitle,
  block,
}: HeritageCarouselSectionProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;
    let ctx = gsap.context(() => {
      gsap.fromTo(
        marqueeRef.current,
        { xPercent: -33.33 },
        {
          xPercent: 0,
          ease: "none",
          duration: 35,
          repeat: -1,
        }
      );
    }, marqueeRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full py-16 md:py-24 text-center overflow-hidden" style={{ background: BG_CREAM }}>
      
      {/* ── Main Category Section Title ── */}
      <div className="max-w-4xl mx-auto px-4 mb-10 md:mb-14">
        <h2
          className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.15em] font-normal"
          style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
        >
          {categoryTitle || block.title}
        </h2>
        {categorySubtitle && (
          <p className="mt-3 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#6F3D24] font-medium">
            {categorySubtitle}
          </p>
        )}
        <div className="w-24 h-px bg-[#431717]/25 mx-auto mt-6" />
      </div>

      {/* ══════════════════════════════════════════
          SINGLE CATEGORY BLOCK (No sub-parts / No International)
      ══════════════════════════════════════════ */}
      <div className="space-y-8 md:space-y-10">
        
        {/* Centered Featured Image (Landscape Format 16/9) */}
        <div className="flex justify-center">
          <div
            className="relative overflow-hidden cursor-pointer group shadow-sm"
            style={{ width: "clamp(260px, 34vw, 480px)", aspectRatio: "16/9" }}
          >
            <Image
              src={block.modelImage}
              alt={block.title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 80vw, 34vw"
            />
          </div>
        </div>

        {/* Explore Button (With Rich Luxury Hover Effect & Scale Animation) */}
        <div className="flex justify-center pt-2">
          <Link
            href={block.exploreHref}
            className="inline-flex items-center justify-center px-12 py-3.5 border border-[#431717] text-xs tracking-[0.3em] font-semibold uppercase text-[#431717] bg-transparent hover:bg-[#431717] hover:text-[#F6F4E6] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            style={{ fontFamily: LE_GRAND }}
          >
            EXPLORE
          </Link>
        </div>

        {/* GSAP Auto-Moving Infinite Marquee Carousel (Landscape Format 16/9) */}
        <div className="relative w-screen -mx-4 overflow-hidden py-4">
          <div ref={marqueeRef} className="flex gap-4 md:gap-6" style={{ width: "fit-content" }}>
            {[...Array(3)].map((_, setIdx) =>
              block.carouselImages.map((imgSrc, idx) => (
                <Link
                  key={`${imgSrc}-${setIdx}-${idx}`}
                  href={block.exploreHref}
                  className="relative flex-shrink-0 shadow-sm group overflow-hidden"
                  style={{ width: "clamp(220px, 28vw, 360px)", aspectRatio: "16/9" }}
                >
                  <Image
                    src={imgSrc}
                    alt={`${block.title} Image ${idx + 1}`}
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
