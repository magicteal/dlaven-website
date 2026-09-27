"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeritageCarouselSection from "@/components/HeritageCarouselSection";

const LE_GRAND = `var(--font-le-grand), serif`;
const MANROPE = `var(--font-manrope), sans-serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

export default function DlLimitedClient() {
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
    <main style={{ background: BG_CREAM, fontFamily: MANROPE }}>
      
      {/* ── Hero (D' LAVÉN Brand Warm Dark Background & Le Grand Typography) ── */}
      <section
        className="w-full flex flex-col items-center justify-center text-center pt-28 md:pt-36 pb-10 md:pb-12 px-6 text-[#F6F4E6]"
        style={{ background: BRAND_DARK, minHeight: "300px" }}
      >
        <h1
          className="font-le-grand uppercase leading-tight max-w-4xl text-[#F6F4E6]"
          style={{
            fontFamily: LE_GRAND,
            fontSize: "clamp(22px, 4.5vw, 50px)",
            letterSpacing: "0.08em",
          }}
        >
          D&apos; LAVEN &nbsp;&nbsp; x &nbsp;&nbsp; DL FANTOME
        </h1>
        <div className="mt-6 flex justify-center">
          <Link
            href="#limited-categories"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#F6F4E6]/60 text-xs tracking-[0.25em] font-semibold uppercase text-[#F6F4E6] hover:bg-[#F6F4E6] hover:text-[#431717] transition-all duration-300 shadow-sm"
            style={{ fontFamily: LE_GRAND }}
          >
            DISCOVER THE WORLD
          </Link>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#6F3D24]/20" />

      {/* ── Quote / Philosophy Section (Page 1) ── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-10 md:py-14 text-center"
        style={{ background: BG_CREAM }}
      >
        <h2
          className="font-le-grand text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] font-normal mb-6 text-[#431717]"
          style={{ fontFamily: LE_GRAND }}
        >
          DL FANTÔME
        </h2>
        <div
          className="max-w-3xl leading-relaxed font-light space-y-4"
          style={{ fontFamily: MANROPE, fontSize: "clamp(13px, 1.5vw, 16px)", color: BRAND_DARK }}
        >
          <p>
            True distinction is never measured by what is seen, but by what is understood. Inspired by the elusive Snow Leopard of Spiti DL FANTÔME embodies a world where rarity speaks quietly, craftsmanship reveals itself through detail, and exclusivity is never defined by numbers alone.
          </p>
          <p className="font-normal text-[#431717]">
            Each creation is individually numbered, conceived for those who recognise the value of what cannot be recreated.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1 — Top Center Video + Balanced 3-Image Grid
      ══════════════════════════════════════════ */}
      <section className="w-full pt-4 pb-4 md:pb-8 px-4 md:px-8 flex flex-col items-center" style={{ background: BG_CREAM }}>
        {/* Top center video container */}
        <div className="flex justify-center mb-6 w-full">
          <div
            className="relative overflow-hidden group cursor-pointer shadow-lg rounded-none"
            style={{ width: "clamp(220px, 30vw, 420px)", aspectRatio: "3/4" }}
          >
            <Image
              src="/images/fashion_hero.png"
              alt="DL FANTOME editorial"
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
            { src: "/images/DPrimeOne.jpg", alt: "DL FANTOME Showcase 1" },
            { src: "/images/DPrimeTwo.jpg", alt: "DL FANTOME Showcase 2" },
            { src: "/images/fashion_hero.png", alt: "DL FANTOME Showcase 3" },
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
          1. CATEGORY 1: DL FANTOME CLOTHING (Page 2)
      ══════════════════════════════════════════ */}
      <div id="limited-categories">
        <HeritageCarouselSection
          categoryTitle="DL FANTOME CLOTHING"
          buttonText="DISCOVER"
          block={{
            title: "DL FANTOME CLOTHING",
            modelImage: "/images/fashion_hero.png",
            exploreHref: "/dlaven-limited/clothes",
            carouselImages: [
              "/images/oneImg.png",
              "/images/twoImg.png",
              "/images/fashion_hero.png",
              "/images/mensReady.png",
            ],
          }}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto border-t border-[#431717]/20 my-6 md:my-10" />

      {/* ══════════════════════════════════════════
          2. CATEGORY 2: DL FANTOME JEWELRY (Page 3)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL FANTOME JEWELRY"
        buttonText="DISCOVER"
        block={{
          title: "DL FANTOME JEWELRY",
          modelImage: "/images/prive_jewellery_cover.png",
          exploreHref: "/dlaven-limited/jewellery",
          carouselImages: [
            "/images/womenswear/adornments_1.png",
            "/images/womenswear/adornments_2.jpg",
            "/images/prive_jewellery_cover.png",
            "/images/heritage_hero.png",
          ],
        }}
      />

      <div className="w-full max-w-5xl mx-auto border-t border-[#431717]/20 my-6 md:my-10" />

      {/* ══════════════════════════════════════════
          3. CATEGORY 3: DL FANTOME FRAGRANCE (Page 4)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL FANTOME FRAGRANCE"
        buttonText="DISCOVER"
        block={{
          title: "DL FANTOME FRAGRANCE",
          modelImage: "/images/fragrance_hero.png",
          exploreHref: "/dlaven-limited/fragrances",
          carouselImages: [
            "/images/frangrence.png",
            "/images/fragrance_hero.png",
            "/images/dlprive_end.png",
            "/images/oneImg.png",
          ],
        }}
      />

    </main>
  );
}
