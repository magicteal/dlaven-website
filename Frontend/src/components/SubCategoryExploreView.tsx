"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const POPPINS = `var(--font-poppins), sans-serif`;
const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

interface Props {
  pillarName: "DL FANTOME" | "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-fantome" | "dl-fantom" | "fantome" | "dl-barry" | "dl-berry" | "dl-prive";
  collection?: "heritage" | "international" | "all";
  category: "jewellery" | "clothes" | "fragrances" | "all";
}

export interface AssetData {
  mensTitle: string;
  womensTitle: string;
  mensSubtitle?: string;
  womensSubtitle?: string;
  mensImg: string;
  womensImg: string;
  subtitle: string;
  description: string[];
}

// Media assets and dynamic titles mapping per category/collection
const SUB_ROUTE_ASSETS: Record<string, AssetData> = {
  "clothes-all": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Clothes",
    womensSubtitle: "Women Clothes",
    mensImg: "/images/fashion_hero.png",
    womensImg: "/images/oneImg.png",
    subtitle: "DISCOVER ALL CREATION",
    description: ["NE DU ELUSIVE PREDATOR"],
  },
  "jewellery-all": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Jewellery",
    womensSubtitle: "Women Jewellery",
    mensImg: "/images/prive_jewellery_cover.png",
    womensImg: "/images/womenswear/adornments_2.jpg",
    subtitle: "DISCOVER ALL CREATION",
    description: ["NE DU ELUSIVE PREDATOR"],
  },
  "fragrances-all": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Fragrance",
    womensSubtitle: "Women Fragrance",
    mensImg: "/images/frangrence.png",
    womensImg: "/images/fragrance_hero.png",
    subtitle: "DISCOVER ALL CREATION",
    description: ["NE DU ELUSIVE PREDATOR"],
  },
  "jewellery-heritage": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Jewellery",
    womensSubtitle: "Women Jewellery",
    mensImg: "/images/mens_heritage.jpg",
    womensImg: "/images/womens_heritage.jpg",
    subtitle: "HERITAGE FINE JEWELLERY & ARCHIVAL FILIGREE",
    description: [
      "DL LIMITED HERITAGE JEWELLERY reflects centuries of archival goldsmithing.",
      "Each masterwork is forged from certified 22k gold, rare gemstones, and hand-bent filigree.",
      "Releases are strictly quantity-restricted and individually numbered for collectors.",
    ],
  },
  "jewellery-international": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Jewellery",
    womensSubtitle: "Women Jewellery",
    mensImg: "/images/prive_jewellery_cover.png",
    womensImg: "/images/womenswear/adornments_2.jpg",
    subtitle: "INTERNATIONAL FINE JEWELLERY & MODERNIST LATTICE",
    description: [
      "DL LIMITED INTERNATIONAL JEWELLERY bridges archival heritage with modern sculptural dialogue.",
      "Architectural silhouettes and diamond geometric lattices defined for global connoisseurs.",
      "Crafted under strict limitation for international allocation.",
    ],
  },
  "clothes-heritage": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Clothes",
    womensSubtitle: "Women Clothes",
    mensImg: "/images/mensReady.png",
    womensImg: "/images/womenswear/adornments_1.png",
    subtitle: "HERITAGE COUTURE & SARTORIAL ATTIRE",
    description: [
      "DL LIMITED HERITAGE CLOTHES brings bespoke embroidery and royal weaves to modern silhouettes.",
      "Hand-loomed brocades, silk velvet coats, and tailored heritage ensembles.",
      "Created in small batch sartorial workshops.",
    ],
  },
  "clothes-international": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Clothes",
    womensSubtitle: "Women Clothes",
    mensImg: "/images/fashion_hero.png",
    womensImg: "/images/oneImg.png",
    subtitle: "INTERNATIONAL READY TO WEAR & CONTEMPORARY CUTS",
    description: [
      "DL LIMITED INTERNATIONAL CLOTHES features minimalist draped trenches and structured virgin wool suits.",
      "Modern luxury defined by clean geometric lines and Italian super-150s wool.",
    ],
  },
  "fragrances-heritage": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Fragrance",
    womensSubtitle: "Women Fragrance",
    mensImg: "/images/fragrance_hero.png",
    womensImg: "/images/frangrence.png",
    subtitle: "HERITAGE HAUTE PARFUMERIE & ARCHIVAL ELIXIRS",
    description: [
      "DL LIMITED HERITAGE FRAGRANCE encompasses rare vintage extracts and hand-blown crystal flacons.",
      "Infused with rare natural accords and aged extraits de parfum.",
    ],
  },
  "fragrances-international": {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: "Mens Fragrance",
    womensSubtitle: "Women Fragrance",
    mensImg: "/images/frangrence.png",
    womensImg: "/images/fragrance_hero.png",
    subtitle: "INTERNATIONAL HAUTE PARFUMERIE & CONTEMPORARY NOIR",
    description: [
      "DL LIMITED INTERNATIONAL FRAGRANCE presents bold olfactory compositions for modern luxury connoisseurs.",
    ],
  },
};

export default function SubCategoryExploreView({
  pillarName,
  pillarSlug,
  collection = "heritage",
  category = "jewellery",
}: Props) {

  let catName = "Creations";
  if (category === "clothes") catName = "Clothes";
  if (category === "jewellery") catName = "Jewellery";
  if (category === "fragrances") catName = "Fragrance";

  const defaultMensSubtitle = `Mens ${catName}`;
  const defaultWomensSubtitle = `Women ${catName}`;

  const key = `${category}-${collection}`;
  const assetData: AssetData = SUB_ROUTE_ASSETS[key] || {
    mensTitle: "MEN",
    womensTitle: "WOMEN",
    mensSubtitle: defaultMensSubtitle,
    womensSubtitle: defaultWomensSubtitle,
    mensImg: "/images/mens_heritage.jpg",
    womensImg: "/images/womens_heritage.jpg",
    subtitle: `${collection.toUpperCase()} ${category.toUpperCase()}`,
    description: [`Exclusive ${pillarName} ${collection} ${category} collection.`],
  };

  const mensSubtitle = assetData.mensSubtitle || defaultMensSubtitle;
  const womensSubtitle = assetData.womensSubtitle || defaultWomensSubtitle;

  const isBarry = pillarSlug === "dl-barry" || pillarSlug === "dl-berry";
  const isFantome = pillarSlug === "dl-fantome" || pillarSlug === "dl-fantom" || pillarSlug === "fantome" || pillarSlug === "dlaven-limited";
  const baseSlug = isBarry ? "dl-berry" : isFantome ? "dl-fantome" : pillarSlug;

  const isAll = collection === "all";
  const displayTitle = isAll
    ? (pillarSlug === "dl-prive" ? "DL PRIVÉ CREATION" : isBarry ? "DL BÉRRY CREATION" : "DL FANTOME CREATION")
    : `${pillarName} ${collection.toUpperCase()} ${category.toUpperCase()}`;
  const displaySubtitle = isAll ? "DISCOVER ALL CREATION" : assetData.subtitle;
  const displayTagline = assetData.description && assetData.description[0];



  return (
    <main style={{ background: BG_CREAM, fontFamily: POPPINS }}>

      {/* ══════════════════════════════════════════
          1. TWO-COLUMN SPLIT HERO (Category Specific Titles & Media)
      ══════════════════════════════════════════ */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "80vh" }}>

        {/* LEFT COLUMN: MEN'S SELECTION FOR THIS CATEGORY */}
        <Link
          href={`/${baseSlug}/${category}/mens`}
          className="relative overflow-hidden group cursor-pointer border-r border-[#431717]/10 block"
          style={{ minHeight: "450px" }}
        >
          <Image
            src={assetData.mensImg}
            alt={assetData.mensTitle}
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
          
          {/* Centered Heading Only */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h2
              className="font-le-grand uppercase tracking-[0.25em] font-normal text-white text-center"
              style={{
                fontFamily: LE_GRAND,
                fontSize: "clamp(26px, 3.8vw, 48px)",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {assetData.mensTitle}
            </h2>
          </div>

          {/* Bottom Subtitle & Discover Button */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-10 sm:pb-16 text-white text-center px-4 gap-3 sm:gap-4">
            <span
              className="uppercase tracking-[0.22em] text-xs sm:text-sm font-light text-white/90"
              style={{ fontFamily: POPPINS }}
            >
              {mensSubtitle}
            </span>
            <span
              className="inline-block px-8 py-2.5 uppercase tracking-[0.2em] text-xs font-medium border border-white text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-sm"
              style={{ fontFamily: POPPINS }}
            >
              DISCOVER
            </span>
          </div>
        </Link>

        {/* RIGHT COLUMN: WOMEN'S SELECTION FOR THIS CATEGORY */}
        <Link
          href={`/${baseSlug}/${category}/womens`}
          className="relative overflow-hidden group cursor-pointer block"
          style={{ minHeight: "450px" }}
        >
          <Image
            src={assetData.womensImg}
            alt={assetData.womensTitle}
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
          
          {/* Centered Heading Only */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h2
              className="font-le-grand uppercase tracking-[0.25em] font-normal text-white text-center"
              style={{
                fontFamily: LE_GRAND,
                fontSize: "clamp(26px, 3.8vw, 48px)",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {assetData.womensTitle}
            </h2>
          </div>

          {/* Bottom Subtitle & Discover Button */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-10 sm:pb-16 text-white text-center px-4 gap-3 sm:gap-4">
            <span
              className="uppercase tracking-[0.22em] text-xs sm:text-sm font-light text-white/90"
              style={{ fontFamily: POPPINS }}
            >
              {womensSubtitle}
            </span>
            <span
              className="inline-block px-8 py-2.5 uppercase tracking-[0.2em] text-xs font-medium border border-white text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-sm"
              style={{ fontFamily: POPPINS }}
            >
              DISCOVER
            </span>
          </div>
        </Link>

      </section>

      {/* ══════════════════════════════════════════
          2. TIERED DESCRIPTION SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-14 sm:py-20 text-center">
        <div className="max-w-3xl space-y-4">

          <h1
            className="font-le-grand text-3xl sm:text-5xl uppercase tracking-[0.18em] font-normal"
            style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
          >
            {displayTitle}
          </h1>

          <p className="text-xs uppercase tracking-[0.25em] text-[#6F3D24] font-medium">
            {displaySubtitle}
          </p>

          <div className="w-48 mx-auto border-t border-[#431717]/30 my-4" />

          <p
            className="text-xs sm:text-sm uppercase tracking-[0.22em] text-[#431717] font-normal"
            style={{ fontFamily: POPPINS }}
          >
            {displayTagline}
          </p>

          {/* Description paragraphs for non-all collection views */}
          {!isAll && assetData.description && assetData.description.length > 1 && (
            <div className="space-y-4 pt-4 border-t border-[#431717]/15">
              {assetData.description.map((line, idx) => (
                <p
                  key={idx}
                  style={{ fontFamily: POPPINS, fontSize: "13px", color: "#2a2a2a", lineHeight: 1.8 }}
                >
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Center Brand Logo Mark */}
        <div className="mt-12 flex justify-center">
          <div className="relative" style={{ width: 120, height: 40 }}>
            <Image
              src="/logos/logo.svg"
              alt="D' LAVÉN"
              fill
              className="object-contain"
              style={{ filter: "brightness(0) saturate(100%) invert(13%) sepia(29%) saturate(2250%) hue-rotate(336deg) brightness(92%) contrast(92%)" }}
              sizes="120px"
            />
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link
            href={`/${baseSlug}`}
            className="inline-flex items-center justify-center px-10 py-3 border border-[#1a1a1a] text-[10px] tracking-[0.25em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 shadow-sm"
            style={{ fontFamily: POPPINS }}
          >
            ← BACK TO {pillarName}
          </Link>
        </div>
      </section>


    </main>
  );
}
