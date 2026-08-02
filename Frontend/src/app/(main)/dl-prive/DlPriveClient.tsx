"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeritageCarouselSection from "@/components/HeritageCarouselSection";

const LE_GRAND = `var(--font-le-grand), serif`;
const MANROPE = `var(--font-manrope), sans-serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

export default function DlPriveClient() {
  return (
    <main style={{ background: BG_CREAM, fontFamily: MANROPE }}>
      
      {/* ── Hero (D' LAVÉN Brand Warm Dark Background & Le Grand Typography) ── */}
      <section
        className="w-full flex flex-col items-center justify-center text-center pt-28 md:pt-36 pb-10 md:pb-12 px-6 text-[#F6F4E6]"
        style={{ background: BRAND_DARK, minHeight: "300px" }}
      >
        <p
          className="uppercase tracking-[0.25em] text-xs md:text-sm mb-4 md:mb-6 text-[#E2DDD7]/80"
          style={{ fontFamily: MANROPE }}
        >
          D&apos; LAVÉN PRIVÉ
        </p>
        <h1
          className="font-le-grand uppercase leading-tight max-w-4xl text-[#F6F4E6]"
          style={{
            fontFamily: LE_GRAND,
            fontSize: "clamp(22px, 4.5vw, 50px)",
            letterSpacing: "0.08em",
          }}
        >
          D&apos; LAVÉN &nbsp;&nbsp; X &nbsp;&nbsp; DL PRIVÉ L&apos;ORDONNANCE
        </h1>
        <div className="mt-6 flex justify-center">
          <Link
            href="#prive-categories"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#F6F4E6]/60 text-xs tracking-[0.25em] font-semibold uppercase text-[#F6F4E6] hover:bg-[#F6F4E6] hover:text-[#431717] transition-all duration-300 shadow-sm"
            style={{ fontFamily: LE_GRAND }}
          >
            DISCOVER PRIVÉ SELECTIONS
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#6F3D24]/20" />

      {/* ── Quote ── */}
      <section
        className="w-full flex items-center justify-center px-6 py-8 md:py-10"
        style={{ background: BG_CREAM }}
      >
        <p
          className="max-w-3xl text-center leading-relaxed font-light"
          style={{ fontFamily: MANROPE, fontSize: "clamp(13px, 1.5vw, 16px)", color: BRAND_DARK }}
        >
          &ldquo;&nbsp;
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>DL PRIVÉ L&apos; ACCÈS</span>{" "}
          has been a key supporter and partner of our brand for many years. It is a privilege to now
          bring the entire world of{" "}
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>D&apos; LAVÉN</span> to a dedicated
          space encompassing clothing, accessories and jewelry. This presentation marks a special
          moment where the best of{" "}
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>INDIA MEETS</span> &ldquo;{" "}
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>
            L&apos;INDE RENCONTRE L&apos;AUTORITÉ
          </span>{" "}
          &rdquo;&nbsp;&rdquo;
        </p>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1 — Top Center Video + Balanced 3-Image Grid
      ══════════════════════════════════════════ */}
      <section className="w-full pt-8 pb-2 md:pt-10 md:pb-4 px-4 md:px-8 flex flex-col items-center" style={{ background: BG_CREAM }}>
        {/* Top center video container */}
        <div className="flex justify-center mb-6 w-full">
          <div
            className="relative overflow-hidden group cursor-pointer shadow-lg rounded-none"
            style={{ width: "clamp(220px, 30vw, 420px)", aspectRatio: "3/4" }}
          >
            <Image
              src="/images/dlprive_2.jpg"
              alt="DL Privé video editorial"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width:768px) 85vw, 35vw"
              priority
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
              <div className="bg-white/25 backdrop-blur-md rounded-full p-4 md:p-5 flex items-center justify-center border border-white/50 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-white fill-white ml-0.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Balanced 3-Image Responsive Grid */}
        <div className="w-full max-w-5xl grid grid-cols-3 gap-3 md:gap-6 justify-center">
          {[
            { src: "/images/dlprive_2.jpg", alt: "DL Privé Gold Editorial" },
            { src: "/images/dlprive_1.jpg", alt: "DL Privé Tiger Editorial" },
            { src: "/images/dlprive_3.jpg", alt: "DL Privé White Editorial" },
          ].map((img, idx) => (
            <div
              key={`${img.src}-${idx}`}
              className="relative overflow-hidden w-full shadow-sm group cursor-pointer"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width:768px) 33vw, 25vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          1. CATEGORY 1: DL PRIVÉ CLOTHES (First)
      ══════════════════════════════════════════ */}
      <div id="prive-categories">
        <HeritageCarouselSection
          categoryTitle="DL PRIVÉ CLOTHES"
          categorySubtitle="HIGH COUTURE & CONTROLLED PRIVÉ ATTIRE"
          block={{
            title: "DL PRIVÉ CLOTHES",
            modelImage: "/images/leftVisual.png",
            exploreHref: "/dl-prive/clothes",
            carouselImages: [
              "/images/leftVisual.png",
              "/images/rightVisual.png",
              "/images/hero_bg.png",
              "/images/mensReady.png",
            ],
          }}
        />
      </div>

      <div className="w-full max-w-7xl mx-auto border-t border-[#431717]/15" />

      {/* ══════════════════════════════════════════
          2. CATEGORY 2: DL PRIVÉ JEWELLERY (Second)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL PRIVÉ JEWELLERY"
        categorySubtitle="HIGH JEWELLERY & EXCLUSIVE PRIVÉ SELECTIONS"
        block={{
          title: "DL PRIVÉ JEWELLERY",
          modelImage: "/images/dlprive_1.jpg",
          exploreHref: "/dl-prive/jewellery",
          carouselImages: [
            "/images/dlprive_1.jpg",
            "/images/dlprive_2.jpg",
            "/images/dlprive_3.jpg",
            "/images/prive_jewellery_cover.png",
          ],
        }}
      />

      <div className="w-full max-w-5xl mx-auto border-t border-[#431717]/20 my-6 md:my-10" />

      {/* ══════════════════════════════════════════
          3. CATEGORY 3: DL PRIVÉ FRAGRANCE (Third)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL PRIVÉ FRAGRANCE"
        categorySubtitle="PRIVÉ HAUTE PARFUMERIE & RESTRICTED ELIXIRS"
        block={{
          title: "DL PRIVÉ FRAGRANCE",
          modelImage: "/images/dlprive_end.png",
          exploreHref: "/dl-prive/fragrances",
          carouselImages: [
            "/images/dlprive_end.png",
            "/images/fragrance_hero.png",
            "/images/frangrence.png",
            "/images/marquee_3.jpg",
          ],
        }}
      />

    </main>
  );
}
