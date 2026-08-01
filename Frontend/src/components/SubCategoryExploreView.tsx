"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const POPPINS = `var(--font-poppins), sans-serif`;
const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";

interface Props {
  pillarName: "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-barry" | "dl-prive";
  collection: "heritage" | "international" | "all";
  category: "jewellery" | "clothes" | "fragrances" | "all";
}

export interface AssetData {
  mensTitle: string;
  womensTitle: string;
  mensImg: string;
  womensImg: string;
  subtitle: string;
  description: string[];
}

// Media assets and dynamic titles mapping per category/collection
const SUB_ROUTE_ASSETS: Record<string, AssetData> = {
  "jewellery-heritage": {
    mensTitle: "MEN'S FINE JEWELLERY",
    womensTitle: "WOMEN'S FINE JEWELLERY",
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
    mensTitle: "MEN'S INTERNATIONAL JEWELLERY",
    womensTitle: "WOMEN'S INTERNATIONAL JEWELLERY",
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
    mensTitle: "MEN'S HERITAGE CLOTHING",
    womensTitle: "WOMEN'S HERITAGE COUTURE",
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
    mensTitle: "MEN'S INTERNATIONAL TAILORING",
    womensTitle: "WOMEN'S INTERNATIONAL READY-TO-WEAR",
    mensImg: "/images/fashion_hero.png",
    womensImg: "/images/oneImg.png",
    subtitle: "INTERNATIONAL READY TO WEAR & CONTEMPORARY CUTS",
    description: [
      "DL LIMITED INTERNATIONAL CLOTHES features minimalist draped trenches and structured virgin wool suits.",
      "Modern luxury defined by clean geometric lines and Italian super-150s wool.",
    ],
  },
  "fragrances-heritage": {
    mensTitle: "MEN'S HERITAGE PARFUM",
    womensTitle: "WOMEN'S HERITAGE PARFUM",
    mensImg: "/images/fragrance_hero.png",
    womensImg: "/images/frangrence.png",
    subtitle: "HERITAGE HAUTE PARFUMERIE & ARCHIVAL ELIXIRS",
    description: [
      "DL LIMITED HERITAGE FRAGRANCE encompasses rare vintage extracts and hand-blown crystal flacons.",
      "Infused with rare natural accords and aged extraits de parfum.",
    ],
  },
  "fragrances-international": {
    mensTitle: "MEN'S INTERNATIONAL PARFUM",
    womensTitle: "WOMEN'S INTERNATIONAL PARFUM",
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
  const [activeGender, setActiveGender] = useState<"all" | "mens" | "womens">("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const key = `${category}-${collection}`;
  const assetData: AssetData = SUB_ROUTE_ASSETS[key] || {
    mensTitle: `${category.toUpperCase()} — MEN'S`,
    womensTitle: `${category.toUpperCase()} — WOMEN'S`,
    mensImg: "/images/mens_heritage.jpg",
    womensImg: "/images/womens_heritage.jpg",
    subtitle: `${collection.toUpperCase()} ${category.toUpperCase()}`,
    description: [`Exclusive ${pillarName} ${collection} ${category} collection.`],
  };

  const displayTitle = `${pillarName} ${collection.toUpperCase()} ${category.toUpperCase()}`;

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
        console.error("[SubCategoryExploreView] Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [pillarSlug]);

  const filteredProducts = React.useMemo(() => {
    let list = [...products];
    if (category === "clothes") {
      list = list.filter((p) => p.categorySlug === "mens-ready-to-wear" || p.category?.toLowerCase().includes("wear"));
    } else if (category === "jewellery") {
      list = list.filter((p) => p.categorySlug === "heritage-jewelry" || p.category?.toLowerCase().includes("jewel"));
    } else if (category === "fragrances") {
      list = list.filter((p) => p.categorySlug === "fragrances" || p.category?.toLowerCase().includes("fragrance"));
    }

    if (activeGender === "mens") {
      list = list.filter((p) => p.categorySlug?.includes("mens") || p.name.toLowerCase().includes("men"));
    } else if (activeGender === "womens") {
      list = list.filter((p) => p.categorySlug?.includes("womens") || p.name.toLowerCase().includes("women"));
    }

    return list;
  }, [products, category, activeGender]);

  return (
    <main style={{ background: BG_CREAM, fontFamily: POPPINS }}>

      {/* ══════════════════════════════════════════
          1. TWO-COLUMN SPLIT HERO (Category Specific Titles & Media)
      ══════════════════════════════════════════ */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "80vh" }}>

        {/* LEFT COLUMN: MEN'S SELECTION FOR THIS CATEGORY */}
        <div
          onClick={() => setActiveGender(activeGender === "mens" ? "all" : "mens")}
          className={`relative overflow-hidden group cursor-pointer border-r border-[#431717]/10 ${activeGender === "mens" ? "ring-4 ring-inset ring-[#431717]" : ""
            }`}
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
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-20 text-white text-center px-4">
            <div className="flex flex-col items-center gap-2">
              <span
                className="uppercase tracking-[0.25em] font-light"
                style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 2.8vw, 34px)" }}
              >
                {assetData.mensTitle}
              </span>
              <span
                className="uppercase tracking-[0.2em] text-xs opacity-90 border-b border-white/40 group-hover:border-white transition-all pb-0.5"
                style={{ fontFamily: POPPINS }}
              >
                {activeGender === "mens" ? "FILTERING MEN'S CREATIONS" : "EXPLORE SELECTION"}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WOMEN'S SELECTION FOR THIS CATEGORY */}
        <div
          onClick={() => setActiveGender(activeGender === "womens" ? "all" : "womens")}
          className={`relative overflow-hidden group cursor-pointer ${activeGender === "womens" ? "ring-4 ring-inset ring-[#431717]" : ""
            }`}
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
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-20 text-white text-center px-4">
            <div className="flex flex-col items-center gap-2">
              <span
                className="uppercase tracking-[0.25em] font-light"
                style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 2.8vw, 34px)" }}
              >
                {assetData.womensTitle}
              </span>
              <span
                className="uppercase tracking-[0.2em] text-xs opacity-90 border-b border-white/40 group-hover:border-white transition-all pb-0.5"
                style={{ fontFamily: POPPINS }}
              >
                {activeGender === "womens" ? "FILTERING WOMEN'S CREATIONS" : "EXPLORE SELECTION"}
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════
          2. TIERED DESCRIPTION SECTION
      ══════════════════════════════════════════ */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-16 sm:py-24 text-center">
        <div className="max-w-3xl space-y-8">

          <h1
            className="font-le-grand text-3xl sm:text-5xl uppercase tracking-[0.15em] font-normal"
            style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
          >
            {displayTitle}
          </h1>

          <p className="text-xs uppercase tracking-[0.25em] text-[#6F3D24] font-medium">
            {assetData.subtitle}
          </p>

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
        </div>

        {/* Center Brand Logo Mark */}
        <div className="mt-14 flex justify-center">
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
        <div className="mt-10">
          <Link
            href={`/${pillarSlug}`}
            className="inline-flex items-center justify-center px-10 py-3 border border-[#1a1a1a] text-[10px] tracking-[0.25em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 shadow-sm"
            style={{ fontFamily: POPPINS }}
          >
            ← BACK TO {pillarName}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. PRODUCTS CATALOG GRID
      ══════════════════════════════════════════ */}
      <section className="w-full pb-24 px-6">
        <div className="max-w-7xl mx-auto border-t border-[#431717]/15 pt-12">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <h2
              className="font-le-grand text-xl sm:text-2xl uppercase tracking-widest"
              style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}
            >
              CREATIONS CATALOG
            </h2>
            <div className="flex items-center gap-3">
              {(["all", "mens", "womens"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGender(g)}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest transition-all border ${activeGender === g
                      ? "bg-[#431717] text-white border-[#431717]"
                      : "bg-transparent text-[#431717] border-[#431717]/30 hover:border-[#431717]"
                    }`}
                >
                  {g.toUpperCase()}
                </button>
              ))}
            </div>
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
