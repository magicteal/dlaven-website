"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const POPPINS = `var(--font-poppins), sans-serif`;
const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";
const BRAND_GOLD = "#A47E53";

interface Props {
  pillarName: "DL FANTOME" | "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-fantome" | "dl-fantom" | "fantome" | "dl-barry" | "dl-berry" | "dl-prive";
  collection?: "heritage" | "international" | "all";
  category: "jewellery" | "clothes" | "fragrances" | "all";
  gender: "mens" | "womens";
}

// Tailored asset curation per gender & category
const GENDER_ASSETS: Record<
  string,
  {
    heroImage: string;
    heritageImg: string;
    heritageSubtitle: string;
    intlImg: string;
    intlSubtitle: string;
  }
> = {
  "mens-clothes": {
    heroImage: "/images/fashion_hero.png",
    heritageImg: "/images/menswear/IMG_9340.PNG",
    heritageSubtitle: "L' INDE ENTRE HÉRITAGE ET AUTORITÉ",
    intlImg: "/images/menswear/adornments_main.png",
    intlSubtitle: "LA OU L'INDE D'HIER DIALOGUE AVEC L'INDE D'AUJOURD'HUI",
  },
  "womens-clothes": {
    heroImage: "/images/womens_heritage.jpg",
    heritageImg: "/images/womenswear/adornments_1.png",
    heritageSubtitle: "L' ELEGANCE SANS FRONTIERES",
    intlImg: "/images/oneImg.png",
    intlSubtitle: "LE DIALOGUE CONTEMPORAIN ET L'ART DU DRAPÉ",
  },
  "mens-jewellery": {
    heroImage: "/images/prive_jewellery_cover.png",
    heritageImg: "/images/heritage/mens_adornments.jpg",
    heritageSubtitle: "ADORNMENTS ARCHIVAUX & FILIGRANE ROYALE",
    intlImg: "/images/prive_jewellery_cover.png",
    intlSubtitle: "HIGH JEWELLERY & MODERNIST PRECISION",
  },
  "womens-jewellery": {
    heroImage: "/images/womenswear/adornments_2.jpg",
    heritageImg: "/images/heritage/womens_adornments.jpg",
    heritageSubtitle: "L'ART DU BIJOU ET L'ÉCLAT ANCESTRAL",
    intlImg: "/images/womenswear/adornments_1.png",
    intlSubtitle: "PARURES CONTEMPORAINES ET CRÉATIONS PRIVÉES",
  },
  "mens-fragrances": {
    heroImage: "/images/frangrence.png",
    heritageImg: "/images/fragrance_hero.png",
    heritageSubtitle: "HAUTE PARFUMERIE & ESSENCES RARES",
    intlImg: "/images/frangrence.png",
    intlSubtitle: "ELIXIRS CONTEMPORAINS ET NOTES IMMORTELLES",
  },
  "womens-fragrances": {
    heroImage: "/images/fragrance_hero.png",
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

  let displayCategory = "CLOTHES";
  if (category === "jewellery") displayCategory = "JEWELLERY";
  if (category === "fragrances") displayCategory = "FRAGRANCE";

  const genderLabel = gender === "mens" ? "MENS" : "WOMENS";
  const heroHeading = `${genderLabel} ${displayCategory}`;
  const fullTitle = heroHeading;

  const isFantome = pillarSlug === "dl-fantome" || pillarSlug === "dl-fantom" || pillarSlug === "fantome" || pillarSlug === "dlaven-limited";
  const isBarry = pillarSlug === "dl-barry" || pillarSlug === "dl-berry";
  const isPrive = pillarSlug === "dl-prive";

  const baseSlug = isBarry ? "dl-berry" : isFantome ? "dl-fantome" : pillarSlug;

  const card1Title = "L’ HERITAGE";
  const card1Subtitle = null;

  let card2Title = "L’ FANTOME";
  let card2Subtitle = "LE SOUVERAIN DES CIMES DE SPITI";

  if (isPrive) {
    card2Title = "L’ PRIVÉ";
    card2Subtitle = "L'INDE RENCONTRE L'AUTORITÉ";
  } else if (isBarry) {
    card2Title = "L’ BÉRRY";
    card2Subtitle = "L'INNOVATION RENCONTRE L'HÉRITAGE";
  }

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const tagMap: Record<string, "dl-limited" | "dl-barry" | "dl-prive"> = {
          "dlaven-limited": "dl-limited",
          "dl-fantome": "dl-limited",
          "dl-fantom": "dl-limited",
          "fantome": "dl-limited",
          "dl-barry": "dl-barry",
          "dl-berry": "dl-barry",
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
          SECTION 1: HERO — SINGLE FULL-WIDTH IMAGE + CENTERED TITLE OVERLAY
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: "55vh", minHeight: "380px" }}>
        <Image
          src={assets.heroImage}
          alt={fullTitle}
          fill
          className="object-cover object-top"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />

        {/* Centered title overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 text-center">
          <h1
            className="text-white tracking-[0.14em] uppercase font-normal"
            style={{
              fontFamily: LE_GRAND,
              fontSize: "clamp(28px, 5.5vw, 64px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.65)",
            }}
          >
            {heroHeading}
          </h1>
          <p
            className="text-[#F6F4E6]/90 tracking-[0.25em] text-xs sm:text-sm mt-3 uppercase font-medium"
            style={{ fontFamily: POPPINS, textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            {pillarName} — {displayCategory} COLLECTION
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3: FEATURED CARDS — L’ HERITAGE & L’ FANTOME (Centered Typography & DISCOVER Buttons)
      ══════════════════════════════════════════ */}
      <section className="w-full flex flex-col items-center py-12 md:py-16 px-6 gap-14" style={{ background: BG_CREAM }}>

        {/* Block 1: L’ HERITAGE */}
        <div ref={heritageRef} className="flex flex-col items-center text-center max-w-lg w-full">
          <Link
            href={`/${baseSlug}/${category}/${gender}/heritage`}
            className="relative overflow-hidden w-full shadow-sm group cursor-pointer block"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={assets.heritageImg}
              alt={card1Title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width:768px) 85vw, 480px"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <h2
                className="text-white tracking-[0.25em] uppercase font-normal text-center"
                style={{
                  fontFamily: LE_GRAND,
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                {card1Title}
              </h2>
            </div>
          </Link>
          {card1Subtitle && (
            <p
              className="mt-5 uppercase tracking-[0.2em] font-medium text-center"
              style={{
                fontFamily: POPPINS,
                fontSize: "clamp(10px, 1vw, 12px)",
                color: "#4a3f35",
              }}
            >
              {card1Subtitle}
            </p>
          )}
          <div className="mt-5">
            <Link
              href={`/${baseSlug}/${category}/${gender}/heritage`}
              className="inline-flex items-center justify-center px-9 py-2.5 border border-[#431717] text-xs tracking-[0.3em] font-medium uppercase text-[#431717] bg-transparent hover:bg-[#431717] hover:text-[#F6F4E6] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
            </Link>
          </div>
        </div>

        {/* Block 2: L’ FANTOME */}
        <div ref={intlRef} className="flex flex-col items-center text-center max-w-lg w-full">
          <Link
            href={`/${baseSlug}/${category}/${gender}/international`}
            className="relative overflow-hidden w-full shadow-sm group cursor-pointer block"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={assets.intlImg}
              alt={card2Title}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width:768px) 85vw, 480px"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <h2
                className="text-white tracking-[0.25em] uppercase font-normal text-center"
                style={{
                  fontFamily: LE_GRAND,
                  fontSize: "clamp(18px, 2.5vw, 28px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                {card2Title}
              </h2>
            </div>
          </Link>
          {card2Subtitle && (
            <p
              className="mt-5 uppercase tracking-[0.2em] font-medium text-center px-2"
              style={{
                fontFamily: POPPINS,
                fontSize: "clamp(10px, 1vw, 12px)",
                color: "#4a3f35",
              }}
            >
              {card2Subtitle}
            </p>
          )}
          <div className="mt-4">
            <Link
              href={`/${baseSlug}/${category}/${gender}/international`}
              className="inline-flex items-center justify-center px-9 py-2.5 border border-[#431717] text-xs tracking-[0.3em] font-medium uppercase text-[#431717] bg-transparent hover:bg-[#431717] hover:text-[#F6F4E6] hover:scale-105 active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
              style={{ fontFamily: LE_GRAND }}
            >
              DISCOVER
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
              {pillarName} {heroHeading} CREATIONS
            </h2>
            <Link
              href={`/${baseSlug}/${category}`}
              className="text-xs uppercase tracking-widest border-b border-[#431717] pb-0.5 text-[#431717] hover:opacity-75"
              style={{ fontFamily: POPPINS }}
            >
              ← BACK TO {displayCategory}
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
