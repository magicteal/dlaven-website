"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Filter, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const LE_GRAND = `var(--font-le-grand), serif`;
const MANROPE = `var(--font-manrope), sans-serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";
const BRAND_BRONZE = "#6F3D24";

export type CollectionType = "all" | "heritage" | "international";
export type ProductCategoryType = "all" | "clothes" | "jewellery" | "fragrances";
export type GenderType = "all" | "mens" | "womens";

interface Props {
  pillarName: "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-barry" | "dl-prive";
  initialCollection?: CollectionType;
  initialCategory?: ProductCategoryType;
  initialGender?: GenderType;
}

// Fallback curated creations if specific tag/category has few DB items
const DEMO_COLLECTION_PRODUCTS: Record<string, Array<{ slug: string; name: string; price: number; image: string }>> = {
  heritage: [
    {
      slug: "heritage-royal-embroidered-sherwani",
      name: "Heritage Royal Embroidered Coat",
      price: 185000,
      image: "/images/womenswear/adornments_1.png",
    },
    {
      slug: "heritage-[#431717]-gold-woven-adornment",
      name: "Heritage Gold Filigree Adornment",
      price: 240000,
      image: "/images/womenswear/adornments_2.jpg",
    },
    {
      slug: "heritage-archival-parfum-elixir",
      name: "D' LAVÉN Heritage Parfum Elixir",
      price: 45000,
      image: "/images/fragrance_hero.png",
    },
    {
      slug: "heritage-silk-couture-gown",
      name: "Heritage Silk Hand-Woven Gown",
      price: 160000,
      image: "/images/heritage/womens_heritage.jpg",
    },
  ],
  international: [
    {
      slug: "international-architectural-suit",
      name: "International Sculptural Wool Suit",
      price: 145000,
      image: "/images/mensReady.png",
    },
    {
      slug: "international-modernist-diamond-cuff",
      name: "International Diamond Lattice Cuff",
      price: 290000,
      image: "/images/prive_jewellery_cover.png",
    },
    {
      slug: "international-modern-eau-de-parfum",
      name: "International Noir Extrait de Parfum",
      price: 38000,
      image: "/images/frangrence.png",
    },
    {
      slug: "international-minimalist-draped-coat",
      name: "International Draped Silk Trench",
      price: 125000,
      image: "/images/oneImg.png",
    },
  ],
};

export default function CollectionExplorerView({
  pillarName,
  pillarSlug,
  initialCollection = "all",
  initialCategory = "all",
  initialGender = "all",
}: Props) {
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>(initialCollection);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<GenderType>(initialGender);
  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if props change (e.g. via sub-routes)
  useEffect(() => {
    setSelectedCollection(initialCollection);
    setSelectedCategory(initialCategory);
    setSelectedGender(initialGender);
  }, [initialCollection, initialCategory, initialGender]);

  useEffect(() => {
    let cancelled = false;
    async function fetchProducts() {
      setLoading(true);
      try {
        const tagMap: Record<string, "dl-limited" | "dl-barry" | "dl-prive"> = {
          "dlaven-limited": "dl-limited",
          "dl-barry": "dl-barry",
          "dl-prive": "dl-prive",
        };
        const tag = tagMap[pillarSlug];
        const res = await api.listProducts({ tag });
        if (!cancelled) {
          setDbProducts((res.items as unknown as Product[]) || []);
        }
      } catch (err) {
        console.error("[CollectionExplorerView] Error loading products:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [pillarSlug]);

  // Combine DB products & curated showcase items filtered by criteria
  const filteredProducts = React.useMemo(() => {
    let list: Product[] = [...dbProducts];

    // Filter by Category
    if (selectedCategory === "clothes") {
      list = list.filter((p) => p.categorySlug === "mens-ready-to-wear" || p.category?.toLowerCase().includes("wear") || p.category?.toLowerCase().includes("cloth"));
    } else if (selectedCategory === "jewellery") {
      list = list.filter((p) => p.categorySlug === "heritage-jewelry" || p.category?.toLowerCase().includes("jewel") || p.category?.toLowerCase().includes("adornment"));
    } else if (selectedCategory === "fragrances") {
      list = list.filter((p) => p.categorySlug === "fragrances" || p.category?.toLowerCase().includes("fragrance") || p.category?.toLowerCase().includes("parfum"));
    }

    // Filter by Gender
    if (selectedGender === "mens") {
      list = list.filter((p) => p.categorySlug?.includes("mens") || p.name.toLowerCase().includes("men"));
    } else if (selectedGender === "womens") {
      list = list.filter((p) => p.categorySlug?.includes("womens") || p.name.toLowerCase().includes("women"));
    }

    // If few or no DB items match, fallback to high-end curated collection showcase items
    if (list.length === 0) {
      const fallbackSet =
        selectedCollection === "heritage"
          ? DEMO_COLLECTION_PRODUCTS.heritage
          : selectedCollection === "international"
          ? DEMO_COLLECTION_PRODUCTS.international
          : [...DEMO_COLLECTION_PRODUCTS.heritage, ...DEMO_COLLECTION_PRODUCTS.international];

      return fallbackSet.map((item) => ({
        slug: item.slug,
        name: item.name,
        price: item.price,
        images: [item.image],
        inStock: true,
      })) as Product[];
    }

    return list;
  }, [dbProducts, selectedCategory, selectedGender, selectedCollection]);

  return (
    <section className="w-full py-12 md:py-16 px-4 md:px-8" style={{ background: BG_CREAM }}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* ── Breadcrumb & Exploration Header ── */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6F3D24]">
            <Link href={`/${pillarSlug}`} className="hover:underline font-medium">
              {pillarName}
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#431717]">
              {selectedCollection === "all" ? "COLLECTION EXPLORER" : `${selectedCollection.toUpperCase()} COLLECTION`}
            </span>
          </div>
          <h2
            className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-wide uppercase text-[#431717]"
            style={{ fontFamily: LE_GRAND }}
          >
            {pillarName} &nbsp;—&nbsp; {selectedCollection === "all" ? "HERITAGE & INTERNATIONAL" : selectedCollection.toUpperCase()}
          </h2>
          <p className="text-xs sm:text-sm text-[#431717]/80 max-w-2xl mx-auto leading-relaxed font-light">
            Discover bespoke creations categorized by heritage craftsmanship, modern international dialogue, sartorial attire, fine jewellery, and haute parfumerie.
          </p>
        </div>

        {/* ── 1. COLLECTION CHOICE: HERITAGE vs INTERNATIONAL ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* HERITAGE COLLECTION CARD */}
          <div
            onClick={() => setSelectedCollection(selectedCollection === "heritage" ? "all" : "heritage")}
            className={`group relative overflow-hidden cursor-pointer border transition-all duration-500 shadow-sm ${
              selectedCollection === "heritage"
                ? "border-[#431717] ring-2 ring-[#431717]/20 scale-[1.01]"
                : "border-[#431717]/15 hover:border-[#431717]"
            }`}
            style={{ height: "320px" }}
          >
            <Image
              src="/images/womenswear/adornments_1.png"
              alt="Heritage Collection"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                selectedCollection === "heritage" ? "bg-black/40" : "bg-black/55 group-hover:bg-black/45"
              }`}
            />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white">
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#E2DDD7] mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#E2DDD7]" />
                COLLECTION 01
              </span>
              <h3 className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase mb-2">
                HERITAGE COLLECTION
              </h3>
              <p className="text-xs text-white/80 tracking-wider uppercase font-light mb-4">
                L&apos;Inde entre héritage et autorité — Timeless Archival Craftsmanship
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-6 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                    selectedCollection === "heritage"
                      ? "bg-[#431717] text-white border border-[#431717]"
                      : "bg-white/20 backdrop-blur-md text-white border border-white/40 group-hover:bg-white group-hover:text-black"
                  }`}
                >
                  {selectedCollection === "heritage" ? "SELECTED — VIEW BELOW" : "EXPLORE HERITAGE"}
                </span>
              </div>
            </div>
          </div>

          {/* INTERNATIONAL COLLECTION CARD */}
          <div
            onClick={() => setSelectedCollection(selectedCollection === "international" ? "all" : "international")}
            className={`group relative overflow-hidden cursor-pointer border transition-all duration-500 shadow-sm ${
              selectedCollection === "international"
                ? "border-[#431717] ring-2 ring-[#431717]/20 scale-[1.01]"
                : "border-[#431717]/15 hover:border-[#431717]"
            }`}
            style={{ height: "320px" }}
          >
            <Image
              src="/images/womenswear/adornments_2.jpg"
              alt="International Collection"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div
              className={`absolute inset-0 transition-colors duration-500 ${
                selectedCollection === "international" ? "bg-black/40" : "bg-black/55 group-hover:bg-black/45"
              }`}
            />
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 text-white">
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#E2DDD7] mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#E2DDD7]" />
                COLLECTION 02
              </span>
              <h3 className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase mb-2">
                INTERNATIONAL COLLECTION
              </h3>
              <p className="text-xs text-white/80 tracking-wider uppercase font-light mb-4">
                Là où l&apos;Inde d&apos;hier dialogue avec l&apos;Inde d&apos;aujourd&apos;hui — Contemporary Dialogue
              </p>
              <div className="flex items-center gap-2">
                <span
                  className={`px-6 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                    selectedCollection === "international"
                      ? "bg-[#431717] text-white border border-[#431717]"
                      : "bg-white/20 backdrop-blur-md text-white border border-white/40 group-hover:bg-white group-hover:text-black"
                  }`}
                >
                  {selectedCollection === "international" ? "SELECTED — VIEW BELOW" : "EXPLORE INTERNATIONAL"}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ── 2. CATEGORY & GENDER FILTER TOOLBAR ── */}
        <div
          className="p-6 border space-y-6"
          style={{ backgroundColor: "rgba(255,255,255,0.65)", borderColor: "rgba(67,23,23,0.12)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-[#431717]/10">
            
            {/* Category Tabs: Clothes, Jewellery, Fragrances */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#431717] mr-2 flex items-center gap-1.5">
                <Filter size={14} className="text-[#6F3D24]" />
                CATEGORY:
              </span>
              {[
                { id: "all", label: "ALL CATEGORIES" },
                { id: "clothes", label: "CLOTHES (READY TO WEAR)" },
                { id: "jewellery", label: "JEWELLERY (ADORNMENTS)" },
                { id: "fragrances", label: "FRAGRANCES (HAUTE PARFUMERIE)" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as ProductCategoryType)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-200 border ${
                    selectedCategory === cat.id
                      ? "bg-[#431717] text-white border-[#431717] font-medium"
                      : "bg-transparent text-[#431717] border-[#431717]/20 hover:border-[#431717]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gender Filter: Men's vs Women's */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#431717] mr-2">
                SELECTION:
              </span>
              {[
                { id: "all", label: "ALL" },
                { id: "womens", label: "WOMEN'S" },
                { id: "mens", label: "MEN'S" },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGender(g.id as GenderType)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.15em] transition-all duration-200 border ${
                    selectedGender === g.id
                      ? "bg-[#6F3D24] text-white border-[#6F3D24] font-medium"
                      : "bg-transparent text-[#431717] border-[#431717]/20 hover:border-[#6F3D24]"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

          </div>

          {/* Active Filter Summary Indicator */}
          <div className="flex items-center justify-between text-xs text-[#431717]/80 uppercase tracking-widest pt-1">
            <div>
              SHOWING:{" "}
              <span className="font-semibold text-[#431717]">
                {selectedCollection.toUpperCase()} COLLECTION &nbsp;|&nbsp; {selectedCategory.toUpperCase()} &nbsp;|&nbsp; {selectedGender.toUpperCase()}
              </span>
            </div>
            <div className="font-medium text-[#6F3D24]">
              {filteredProducts.length} CREATION{filteredProducts.length === 1 ? "" : "S"} AVAILABLE
            </div>
          </div>

        </div>

        {/* ── 3. PRODUCT CREATIONS GRID ── */}
        <div className="pt-4">
          {loading ? (
            <p className="text-center text-xs uppercase tracking-widest text-[#431717]/70 py-12">
              Loading {pillarName} creations…
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
              <p className="text-sm uppercase tracking-widest text-[#431717]">
                No creations found for the selected combination.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCollection("all");
                  setSelectedCategory("all");
                  setSelectedGender("all");
                }}
                className="px-6 py-2.5 text-xs uppercase tracking-[0.2em] bg-[#431717] text-white hover:bg-[#6F3D24] transition-colors"
              >
                RESET FILTERS
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
