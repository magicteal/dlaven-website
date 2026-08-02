"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Marquee from "@/components/Marquee";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const POPPINS = `var(--font-poppins), sans-serif`;
const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";
const BRAND_GOLD = "#A47E53";

interface Props {
  pillarName: "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-barry" | "dl-prive";
  collection?: "heritage" | "international" | "all";
  category: "jewellery" | "clothes" | "fragrances" | "all";
  gender: "mens" | "womens";
}

// Tailored asset curation per gender & category
const GENDER_ASSETS: Record<
  string,
  {
    heroLeft: string;
    heroRight: string;
    marqueeImgs: string[];
    heritageImg: string;
    heritageSubtitle: string;
    intlImg: string;
    intlSubtitle: string;
  }
> = {
  "mens-clothes": {
    heroLeft: "/images/heritage/mens_heritage.jpg",
    heroRight: "/images/womenswear/adornments_2.jpg",
    marqueeImgs: [
      "/images/menswear/IMG_9691.PNG",
      "/images/menswear/IMG_9340.PNG",
      "/images/menswear/adornments_main.png",
      "/images/heritage/mens_heritage.jpg",
      "/images/oneImg.png",
      "/images/twoImg.png",
    ],
    heritageImg: "/images/menswear/IMG_9340.PNG",
    heritageSubtitle: "L' INDE ENTRE HÉRITAGE ET AUTORITÉ",
    intlImg: "/images/menswear/adornments_main.png",
    intlSubtitle: "LA OU L'INDE D'HIER DIALOGUE AVEC L'INDE D'AUJOURD'HUI",
  },
  "womens-clothes": {
    heroLeft: "/images/womens_heritage.jpg",
    heroRight: "/images/womenswear/adornments_1.png",
    marqueeImgs: [
      "/images/womenswear/adornments_1.png",
      "/images/womenswear/adornments_2.jpg",
      "/images/oneImg.png",
      "/images/twoImg.png",
      "/images/marquee_2.jpg",
      "/images/womens_heritage.jpg",
    ],
    heritageImg: "/images/womenswear/adornments_1.png",
    heritageSubtitle: "L' ELEGANCE SANS FRONTIERES",
    intlImg: "/images/oneImg.png",
    intlSubtitle: "LE DIALOGUE CONTEMPORAIN ET L'ART DU DRAPÉ",
  },
  "mens-jewellery": {
    heroLeft: "/images/mens_heritage.jpg",
    heroRight: "/images/prive_jewellery_cover.png",
    marqueeImgs: [
      "/images/mens_heritage.jpg",
      "/images/prive_jewellery_cover.png",
      "/images/DPrimeOne.jpg",
      "/images/marquee_1.jpg",
      "/images/mens_heritage.jpg",
      "/images/prive_jewellery_cover.png",
    ],
    heritageImg: "/images/mens_heritage.jpg",
    heritageSubtitle: "ADORNMENTS ARCHIVAUX & FILIGRANE ROYALE",
    intlImg: "/images/prive_jewellery_cover.png",
    intlSubtitle: "HIGH JEWELLERY & MODERNIST PRECISION",
  },
  "womens-jewellery": {
    heroLeft: "/images/womens_heritage.jpg",
    heroRight: "/images/womenswear/adornments_2.jpg",
    marqueeImgs: [
      "/images/womens_heritage.jpg",
      "/images/womenswear/adornments_2.jpg",
      "/images/womenswear/adornments_1.png",
      "/images/marquee_2.jpg",
      "/images/womens_heritage.jpg",
      "/images/womenswear/adornments_2.jpg",
    ],
    heritageImg: "/images/womens_heritage.jpg",
    heritageSubtitle: "L'ART DU BIJOU ET L'ÉCLAT ANCESTRAL",
    intlImg: "/images/womenswear/adornments_2.jpg",
    intlSubtitle: "PARURES CONTEMPORAINES ET CRÉATIONS PRIVÉES",
  },
  "mens-fragrances": {
    heroLeft: "/images/fragrance_hero.png",
    heroRight: "/images/frangrence.png",
    marqueeImgs: [
      "/images/fragrance_hero.png",
      "/images/frangrence.png",
      "/images/dlprive_end.png",
      "/images/marquee_4.jpg",
      "/images/fragrance_hero.png",
      "/images/frangrence.png",
    ],
    heritageImg: "/images/fragrance_hero.png",
    heritageSubtitle: "HAUTE PARFUMERIE & ESSENCES RARES",
    intlImg: "/images/frangrence.png",
    intlSubtitle: "ELIXIRS CONTEMPORAINS ET NOTES IMMORTELLES",
  },
  "womens-fragrances": {
    heroLeft: "/images/frangrence.png",
    heroRight: "/images/fragrance_hero.png",
    marqueeImgs: [
      "/images/frangrence.png",
      "/images/fragrance_hero.png",
      "/images/dlprive_end.png",
      "/images/marquee_1.jpg",
      "/images/frangrence.png",
      "/images/fragrance_hero.png",
    ],
    heritageImg: "/images/frangrence.png",
    heritageSubtitle: "FLEURS NOBLES ET ACCORDS HERITAGE",
    intlImg: "/images/fragrance_hero.png",
    intlSubtitle: "SOUFFLE INTERNATIONAL ET CREATIONS PRICIEUSES",
  },
};

export default function GenderCategoryView({
  pillarName,
  pillarSlug,
  collection = "all",
  category = "clothes",
  gender = "mens",
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const heritageRef = useRef<HTMLDivElement>(null);
  const intlRef = useRef<HTMLDivElement>(null);

  const assetKey = `${gender}-${category}`;
  const assets = GENDER_ASSETS[assetKey] || GENDER_ASSETS["mens-clothes"];

  const genderTitle = gender === "mens" ? "MENSWEAR" : "WOMENSWEAR";
  const categoryTitle = category.toUpperCase();
  const fullTitle = `${genderTitle} ${categoryTitle}`;

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const tagMap: Record<string, "dl-limited" | "dl-barry" | "dl-prive"> = {
          "dlaven-limited": "dl-limited",
          "dl-barry": "dl-barry",
          "dl-prive": "dl-prive",
        };
        const tag = tagMap[pillarSlug];
        const res = await api.listProducts({ tag });
        setProducts((res.items as unknown as Product[]) || []);
      } catch (err) {
        console.error("[GenderCategoryView] Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [pillarSlug]);

  const filteredProducts = React.useMemo(() => {
    let list = [...products];

    // Filter by Category
    if (category === "clothes") {
      list = list.filter(
        (p) => p.categorySlug === "mens-ready-to-wear" || p.category?.toLowerCase().includes("wear") || p.category?.toLowerCase().includes("cloth")
      );
    } else if (category === "jewellery") {
      list = list.filter(
        (p) => p.categorySlug === "heritage-jewelry" || p.category?.toLowerCase().includes("jewel") || p.category?.toLowerCase().includes("adorn")
      );
    } else if (category === "fragrances") {
      list = list.filter(
        (p) => p.categorySlug === "fragrances" || p.category?.toLowerCase().includes("fragrance") || p.category?.toLowerCase().includes("parfum")
      );
    }

    // Filter by Gender
    if (gender === "mens") {
      list = list.filter((p) => p.categorySlug?.includes("mens") || p.name.toLowerCase().includes("men"));
    } else if (gender === "womens") {
      list = list.filter((p) => p.categorySlug?.includes("womens") || p.name.toLowerCase().includes("women"));
    }

    return list;
  }, [products, category, gender]);

  const scrollToHeritage = () => {
    heritageRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToIntl = () => {
    intlRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main style={{ background: BG_CREAM, fontFamily: POPPINS }}>

      {/* ══════════════════════════════════════════
          SECTION 1: HERO — TWO LARGE IMAGES + CENTERED TITLE OVERLAY (Sleeker Height & Le Grand Typography)
      ══════════════════════════════════════════ */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "52vh", minHeight: "360px" }}>
        <div className="relative overflow-hidden">
          <Image
            src={assets.heroLeft}
            alt={`${fullTitle} Left`}
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src={assets.heroRight}
            alt={`${fullTitle} Right`}
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Centered title spanning both columns */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <h1
            className="text-white tracking-[0.12em] uppercase font-normal"
            style={{
              fontFamily: LE_GRAND,
              fontSize: "clamp(26px, 5vw, 60px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.65)",
            }}
          >
            {genderTitle}
          </h1>
          <p
            className="text-[#F6F4E6]/90 tracking-[0.25em] text-xs sm:text-sm mt-3 uppercase font-medium"
            style={{ fontFamily: POPPINS, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            {pillarName} — {categoryTitle} COLLECTION
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2: AUTO-MOVING INFINITE MARQUEE CAROUSEL (Compact 16/9 Cards)
      ══════════════════════════════════════════ */}
      <section className="w-full py-8 md:py-10" style={{ background: BG_CREAM }}>
        <Marquee images={assets.marqueeImgs} speed={45} direction="right" />
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: FEATURED CARDS — THE HERITAGE & THE INTERNATIONAL (Compact Sleek 16/9 Cards & Theme Colors)
      ══════════════════════════════════════════ */}
      <section className="w-full flex flex-col items-center py-12 md:py-16 px-6 gap-14" style={{ background: BG_CREAM }}>

        {/* Block 1: THE HERITAGE */}
        <div ref={heritageRef} className="flex flex-col items-center text-center max-w-lg w-full">
          <div className="relative overflow-hidden w-full shadow-sm group cursor-pointer" style={{ aspectRatio: "16/9" }}>
            <Image
              src={assets.heritageImg}
              alt="The Heritage"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width:768px) 85vw, 480px"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <div className="absolute inset-0 flex items-end justify-center pb-5 md:pb-6">
              <h2
                className="text-white tracking-[0.25em] uppercase font-normal"
                style={{
                  fontFamily: LE_GRAND,
                  fontSize: "clamp(16px, 2.5vw, 26px)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                THE HERITAGE
              </h2>
            </div>
          </div>
          <p
            className="mt-5 uppercase tracking-[0.2em] font-medium"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(10px, 1vw, 12px)",
              color: "#4a3f35",
            }}
          >
            {assets.heritageSubtitle}
          </p>
          <div className="mt-4">
            <Link
              href={`/${pillarSlug}/${category}/${gender}/heritage`}
              className="inline-flex items-center justify-center px-9 py-2.5 border border-[#431717] text-xs tracking-[0.3em] font-medium uppercase text-[#431717] bg-transparent hover:bg-[#431717] hover:text-[#F6F4E6] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
              style={{ fontFamily: LE_GRAND }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

        {/* Block 2: THE INTERNATIONAL */}
        <div ref={intlRef} className="flex flex-col items-center text-center max-w-lg w-full">
          <div className="relative overflow-hidden w-full shadow-sm group cursor-pointer" style={{ aspectRatio: "16/9" }}>
            <Image
              src={assets.intlImg}
              alt="The International"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width:768px) 85vw, 480px"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <div className="absolute inset-0 flex items-end justify-center pb-5 md:pb-6">
              <h2
                className="text-white tracking-[0.25em] uppercase font-normal"
                style={{
                  fontFamily: LE_GRAND,
                  fontSize: "clamp(16px, 2.5vw, 26px)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                THE INTERNATIONAL
              </h2>
            </div>
          </div>
          <p
            className="mt-5 uppercase tracking-[0.2em] font-medium"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(10px, 1vw, 12px)",
              color: "#4a3f35",
            }}
          >
            {assets.intlSubtitle}
          </p>
          <div className="mt-4">
            <Link
              href={`/${pillarSlug}/${category}/${gender}/international`}
              className="inline-flex items-center justify-center px-9 py-2.5 border border-[#431717] text-xs tracking-[0.3em] font-medium uppercase text-[#431717] bg-transparent hover:bg-[#431717] hover:text-[#F6F4E6] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
              style={{ fontFamily: LE_GRAND }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          SECTION 4: CREATIONS CATALOG GRID (Theme Matching Colors & Typography)
      ══════════════════════════════════════════ */}
      <section className="w-full pb-24 px-6 border-t border-[#431717]/15 pt-12">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2
              className="font-le-grand text-xl sm:text-2xl uppercase tracking-widest"
              style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
            >
              {pillarName} {fullTitle} CREATIONS
            </h2>
            <Link
              href={`/${pillarSlug}/${category}`}
              className="text-xs uppercase tracking-widest border-b border-[#431717] pb-0.5 text-[#431717] hover:opacity-75"
              style={{ fontFamily: POPPINS }}
            >
              ← BACK TO {categoryTitle}
            </Link>
          </div>

          {loading ? (
            <p className="text-center text-xs uppercase tracking-widest text-[#431717]/70 py-12">
              Loading creations…
            </p>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-left">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  image={(p.images && p.images[0]) || "/images/placeholder.png"}
                  inStock={p.inStock}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-[#431717]/20 p-8 space-y-4">
              <p className="text-xs uppercase tracking-widest text-[#431717]">
                Creations available upon request. Contact our Client Advisors.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-2.5 text-xs uppercase tracking-[0.2em] bg-[#431717] text-white hover:bg-[#6F3D24] transition-colors"
                style={{ fontFamily: LE_GRAND }}
              >
                INQUIRE WITH CLIENT ADVISOR
              </Link>
            </div>
          )}

        </div>
      </section>

    </main>
  );
}
