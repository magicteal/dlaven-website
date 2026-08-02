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
          D&apos; LAVÉN LIMITED
        </p>
        <h1
          className="font-le-grand uppercase leading-tight max-w-4xl text-[#F6F4E6]"
          style={{
            fontFamily: LE_GRAND,
            fontSize: "clamp(22px, 4.5vw, 50px)",
            letterSpacing: "0.08em",
          }}
        >
          D&apos; LAVÉN &nbsp;&nbsp; X &nbsp;&nbsp; DL LIMITED L&apos;ÉDITION
        </h1>
        <div className="mt-6 flex justify-center">
          <Link
            href="#limited-categories"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#F6F4E6]/60 text-xs tracking-[0.25em] font-semibold uppercase text-[#F6F4E6] hover:bg-[#F6F4E6] hover:text-[#431717] transition-all duration-300 shadow-sm"
            style={{ fontFamily: LE_GRAND }}
          >
            EXPLORE LIMITED CREATIONS
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
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>DL LIMITED L&apos; Édition</span>{" "}
          represents the pinnacle of rare craftsmanship and limited quantity releases. Each creation is
          individually numbered and crafted for distinguished collectors of{" "}
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>D&apos; LAVÉN</span>. This collection celebrates
          exclusive artistry where{" "}
          <span style={{ fontFamily: LE_GRAND, color: BRAND_DARK, fontWeight: 700 }}>PRECISION MEETS EXCLUSIVITY</span>. &rdquo;&nbsp;&rdquo;
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
              src="/images/fashion_hero.png"
              alt="DL Limited video editorial"
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
            { src: "/images/DPrimeOne.jpg", alt: "DL Limited Showcase 1" },
            { src: "/images/DPrimeTwo.jpg", alt: "DL Limited Showcase 2" },
            { src: "/images/fashion_hero.png", alt: "DL Limited Showcase 3" },
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
          1. CATEGORY 1: DL LIMITED CLOTHES (First)
      ══════════════════════════════════════════ */}
      <div id="limited-categories">
        <HeritageCarouselSection
          categoryTitle="DL LIMITED CLOTHES"
          categorySubtitle="REFINED SARTORIAL ATTIRE & COUTURE CUTS"
          block={{
            title: "DL LIMITED CLOTHES",
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
          2. CATEGORY 2: DL LIMITED JEWELLERY (Second)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL LIMITED JEWELLERY"
        categorySubtitle="FINE HANDCRAFTED ADORNMENTS & ARCHIVAL FILIGREE"
        block={{
          title: "DL LIMITED JEWELLERY",
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
          3. CATEGORY 3: DL LIMITED FRAGRANCE (Third)
      ══════════════════════════════════════════ */}
      <HeritageCarouselSection
        categoryTitle="DL LIMITED FRAGRANCE"
        categorySubtitle="HAUTE PARFUMERIE & RARE ELIXIRS"
        block={{
          title: "DL LIMITED FRAGRANCE",
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
