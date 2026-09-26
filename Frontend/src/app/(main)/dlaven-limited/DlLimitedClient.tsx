"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeritageCarouselSection from "@/components/HeritageCarouselSection";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const LE_GRAND = `var(--font-le-grand), serif`;
const MANROPE = `var(--font-manrope), sans-serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

export default function DlLimitedClient() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLimitedProducts() {
      try {
        const productResponse = await api.listProducts({ tag: "dl-limited" });
        setProducts(productResponse.items as Product[]);
      } catch (err: unknown) {
        console.error("[DlLimitedClient] Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLimitedProducts();
  }, []);

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
        <p
          className="uppercase tracking-[0.25em] text-xs md:text-sm mb-4 md:mb-6 text-[#E2DDD7]/80"
          style={{ fontFamily: MANROPE }}
        >
          DL FANTOME CREATION
        </p>
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
          categorySubtitle="DL FANTOME CREATION"
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
        categorySubtitle="DL FANTOME CREATION"
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
        categorySubtitle="DL FANTOME CREATION"
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

      <div className="w-full max-w-5xl mx-auto border-t border-[#431717]/20 my-6 md:my-10" />

      {/* ══════════════════════════════════════════
          4. CATEGORY 4: MEN & WOMEN SPLIT + ALL CREATION CREED (Page 5)
      ══════════════════════════════════════════ */}
      <section className="w-full border-b border-[#431717]/15">
        {/* Top 2-Column Split: MEN & WOMEN */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 border-b border-[#431717]/20">
          
          {/* Left Column: MEN */}
          <div className="relative flex flex-col items-center justify-center py-16 md:py-24 px-8 text-center border-b md:border-b-0 md:border-r border-[#431717]/20 group overflow-hidden">
            <div className="relative w-full max-w-md h-72 sm:h-80 md:h-96 mb-8 overflow-hidden shadow-sm border border-[#431717]/15">
              <Image
                src="/images/menswear/IMG_9691.PNG"
                alt="MEN"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 90vw, 45vw"
              />
            </div>
            <h3
              className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.2em] font-normal mb-6 text-[#431717]"
              style={{ fontFamily: LE_GRAND }}
            >
              MEN
            </h3>
            <Link
              href="/dlaven-limited/heritage/mens"
              className="inline-flex items-center justify-center px-12 py-3.5 border border-[#431717] text-xs sm:text-[13px] tracking-[0.3em] font-medium uppercase text-[#431717] hover:bg-[#431717] hover:text-[#F6F4E6] active:scale-95 transition-all duration-300"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
            </Link>
          </div>

          {/* Right Column: WOMEN */}
          <div className="relative flex flex-col items-center justify-center py-16 md:py-24 px-8 text-center group overflow-hidden">
            <div className="relative w-full max-w-md h-72 sm:h-80 md:h-96 mb-8 overflow-hidden shadow-sm border border-[#431717]/15">
              <Image
                src="/images/heritage/womens_heritage.jpg"
                alt="WOMEN"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 90vw, 45vw"
              />
            </div>
            <h3
              className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.2em] font-normal mb-6 text-[#431717]"
              style={{ fontFamily: LE_GRAND }}
            >
              WOMEN
            </h3>
            <Link
              href="/dlaven-limited/heritage/womens"
              className="inline-flex items-center justify-center px-12 py-3.5 border border-[#431717] text-xs sm:text-[13px] tracking-[0.3em] font-medium uppercase text-[#431717] hover:bg-[#431717] hover:text-[#F6F4E6] active:scale-95 transition-all duration-300"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
            </Link>
          </div>

        </div>

        {/* Bottom Section: DISCOVER ALL CREATION & CREED */}
        <div className="w-full py-16 md:py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto flex flex-col items-center">
            <p
              className="uppercase tracking-[0.3em] text-xs sm:text-sm mb-3 text-[#6F3D24] font-medium"
              style={{ fontFamily: MANROPE }}
            >
              DL FANTOME CREATION
            </p>

            <Link
              href="/dlaven-limited/heritage"
              className="font-le-grand text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.18em] font-normal text-[#431717] hover:opacity-80 transition-opacity"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER ALL CREATION
            </Link>

            {/* Divider Line */}
            <div className="w-48 sm:w-64 h-px bg-[#431717]/35 my-8" />

            <p
              className="uppercase tracking-[0.35em] text-xs sm:text-sm md:text-base font-semibold text-[#431717]"
              style={{ fontFamily: LE_GRAND }}
            >
              NE DU ELUSIVE PREDATOR
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. CATEGORY 5: MENSWEAR (Page 6)
      ══════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-24 px-6 text-center border-b border-[#431717]/15">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <h2
            className="font-le-grand text-3xl sm:text-4xl md:text-6xl uppercase tracking-[0.2em] font-normal mb-4 text-[#431717]"
            style={{ fontFamily: LE_GRAND }}
          >
            MENSWEAR
          </h2>
          <p
            className="uppercase tracking-[0.3em] text-xs sm:text-sm text-[#6F3D24] font-medium"
            style={{ fontFamily: MANROPE }}
          >
            DL FANTOME CREATION
          </p>

          <div className="w-full max-w-4xl mt-12 overflow-hidden shadow-lg border border-[#431717]/15">
            <div
              className="relative w-full overflow-hidden group cursor-pointer"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src="/images/luxury_mens_sherwani.png"
                alt="MENSWEAR DL FANTOME CREATION"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 1024px) 95vw, 1100px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. CATEGORY 6: L' HERITAGE & L' FANTOME (Page 7)
      ══════════════════════════════════════════ */}
      <section className="w-full py-20 md:py-28 px-6 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-16 md:space-y-24">
          
          {/* Card 1: L' HERITAGE */}
          <div className="w-full flex flex-col items-center">
            <div
              className="relative overflow-hidden group cursor-pointer shadow-md rounded-none border border-[#431717]/15 mb-8"
              style={{ width: "clamp(280px, 48vw, 620px)", aspectRatio: "16/10" }}
            >
              <Image
                src="/images/heritage/mens_heritage.jpg"
                alt="L' HERITAGE"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 90vw, 55vw"
              />
            </div>

            <h3
              className="font-le-grand text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] font-normal mb-6 text-[#431717]"
              style={{ fontFamily: LE_GRAND }}
            >
              L&apos; HERITAGE
            </h3>

            <Link
              href="/dlaven-limited/heritage"
              className="inline-flex items-center justify-center px-12 py-3.5 border border-[#431717] text-xs sm:text-[13px] tracking-[0.3em] font-medium uppercase text-[#431717] hover:bg-[#431717] hover:text-[#F6F4E6] active:scale-95 transition-all duration-300"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
            </Link>
          </div>

          {/* Card 2: L' FANTOME */}
          <div className="w-full flex flex-col items-center">
            <div
              className="relative overflow-hidden group cursor-pointer shadow-md rounded-none border border-[#431717]/15 mb-8"
              style={{ width: "clamp(280px, 48vw, 620px)", aspectRatio: "16/10" }}
            >
              <Image
                src="/images/DPrimeOne.jpg"
                alt="L' FANTOME"
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 90vw, 55vw"
              />
            </div>

            <h3
              className="font-le-grand text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] font-normal mb-3 text-[#431717]"
              style={{ fontFamily: LE_GRAND }}
            >
              L&apos; FANTOME
            </h3>

            <p
              className="uppercase tracking-[0.25em] text-xs sm:text-sm text-[#6F3D24] font-medium mb-6"
              style={{ fontFamily: MANROPE }}
            >
              LE SOUVERAIN DES CIMES DE SPITI
            </p>

            <Link
              href="/dlaven-limited/international"
              className="inline-flex items-center justify-center px-12 py-3.5 border border-[#431717] text-xs sm:text-[13px] tracking-[0.3em] font-medium uppercase text-[#431717] hover:bg-[#431717] hover:text-[#F6F4E6] active:scale-95 transition-all duration-300"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
            </Link>
          </div>

        </div>
      </section>

    </main>
  );
}
