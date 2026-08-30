"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";

const MANROPE = `var(--font-manrope), sans-serif`;
const LE_GRAND = `var(--font-le-grand), serif`;
const BG_CREAM = "#F6F4E6";
const BRAND_DARK = "#431717";
const BRAND_BODY = "#4a3f35";
const BRAND_TERRACOTTA = "#854A2D";

interface Props {
  pillarName: "DL LIMITED" | "DL BÉRRY" | "DL PRIVÉ";
  pillarSlug: "dlaven-limited" | "dl-barry" | "dl-prive";
  collection: "heritage" | "international";
  category: "jewellery" | "clothes" | "fragrances" | "all";
  gender: "mens" | "womens";
}

const COLLECTION_HEADER_DATA: Record<
  string,
  { leftBanner: string; rightBanner: string; title: string; subtitle: string }
> = {
  heritage: {
    leftBanner: "/images/heritage/mens_heritage.jpg",
    rightBanner: "/images/womenswear/adornments_2.jpg",
    title: "THE HERITAGE",
    subtitle: "L' INDE ENTRE HÉRITAGE ET AUTORITÉ",
  },
  international: {
    leftBanner: "/images/menswear/adornments_main.png",
    rightBanner: "/images/oneImg.png",
    title: "THE INTERNATIONAL",
    subtitle: "LA OU L'INDE D'HIER DIALOGUE AVEC L'INDE D'AUJOURD'HUI",
  },
};

const SHOWCASE_CREATIONS = [
  {
    slug: "la-voie-lactee",
    name: "LA VOIE LACTÉE",
    description: "Inspired by the iconic Calcutta promenade where the decorative coexists with the pragmatic.",
    price: 16000.0,
    mainImage: "/images/couture_sequin_dress.png",
    cards: {
      modelFull: "/images/voie_lactee_full_model.png",
      gridThumbnails: [
        "/images/womenswear/adornments_1.png",
        "/images/womenswear/adornments_2.jpg",
        "/images/couture_sequin_dress.png",
        "/images/voie_lactee_full_model.png",
      ],
      cutoutWithWatermark: "/images/couture_sequin_dress.png",
      outdoorLifestyle: "/images/voie_lactee_outdoor_selfie.png",
      detailCloseup: "/images/voie_lactee_lounge_selfie.png",
      resortShot: "/images/voie_lactee_resort_shot.png",
    },
  },
  {
    slug: "royal-heritage-couture",
    name: "L'ÉDITION COUTURE HERITAGE",
    description: "Crafted with archival zardozi threadwork and precious hand-loomed silk, embodying sovereign authority.",
    price: 24500.0,
    mainImage: "/images/luxury_mens_sherwani.png",
    cards: {
      modelFull: "/images/menswear/IMG_9691.PNG",
      gridThumbnails: [
        "/images/menswear/IMG_9691.PNG",
        "/images/menswear/IMG_9340.PNG",
        "/images/luxury_mens_sherwani.png",
        "/images/heritage/mens_heritage.jpg",
      ],
      cutoutWithWatermark: "/images/luxury_mens_sherwani.png",
      outdoorLifestyle: "/images/menswear/IMG_9340.PNG",
      detailCloseup: "/images/menswear/adornments_main.png",
      resortShot: "/images/DPrimeOne.jpg",
    },
  },
];

export default function CollectionProductsView({
  pillarName,
  pillarSlug,
  collection = "heritage",
  category = "clothes",
  gender = "mens",
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const headerInfo = COLLECTION_HEADER_DATA[collection] || COLLECTION_HEADER_DATA.heritage;

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
        console.error("[CollectionProductsView] Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [pillarSlug]);

  return (
    <main style={{ background: BG_CREAM, fontFamily: MANROPE, scrollBehavior: "smooth" }}>

      {/* 1. TOP 2-IMAGE SPLIT BANNER — Tall Portrait Hero Banner (Sabyasachi Editorial Style) */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "65vh", minHeight: "480px" }}>
        <div className="relative overflow-hidden">
          <Image src={headerInfo.leftBanner} alt={`${headerInfo.title} Left`} fill className="object-cover object-center" sizes="50vw" priority />
        </div>
        <div className="relative overflow-hidden">
          <Image src={headerInfo.rightBanner} alt={`${headerInfo.title} Right`} fill className="object-cover object-center" sizes="50vw" priority />
        </div>
      </section>

      {/* 2. HEADER TITLE & LOGO */}
      <section className="w-full text-center py-10 md:py-14 px-4 border-b border-[#431717]/10" style={{ background: BG_CREAM }}>
        <h1 className="font-le-grand text-2xl sm:text-3xl md:text-4xl uppercase tracking-[0.2em] font-normal mb-3 text-[#431717]" style={{ fontFamily: LE_GRAND }}>
          {headerInfo.title}
        </h1>
        <p className="uppercase tracking-[0.25em] text-xs sm:text-sm font-light mb-8" style={{ fontFamily: MANROPE, color: BRAND_BODY }}>
          {headerInfo.subtitle}
        </p>
        <div className="flex justify-center items-center">
          <Image src="/logos/logo.svg" alt="D'LAVÉN Logo" width={110} height={40} className="h-10 w-auto object-contain" style={{ filter: "brightness(0.2)" }} />
        </div>
      </section>

      {/* 3. NORMAL SCROLL — each product is a full-screen block */}
      <section className="w-full">
        {SHOWCASE_CREATIONS.map((item, index) => (
          <div
            key={item.slug}
            className="w-full min-h-screen flex flex-col items-center pt-16 pb-16 px-4 md:px-8"
            style={{ borderTop: index > 0 ? `1px solid ${BRAND_DARK}20` : "none" }}
          >

              {/* Upper: Main Cutout Image (Tall Portrait Cutout) + Title + Explore */}
              <div className="flex flex-col items-center text-center w-full">
                <div className="relative w-full h-[42vh] max-h-[380px] flex items-center justify-center mb-6">
                  <Image src={item.mainImage} alt={item.name} fill className="object-contain object-center hover:scale-105 transition-transform duration-700" sizes="400px" priority={index === 0} style={{ mixBlendMode: "multiply" }} />
                </div>
                <h2 className="font-le-grand text-xl sm:text-2xl uppercase tracking-[0.2em] font-normal mb-2" style={{ fontFamily: LE_GRAND, color: BRAND_DARK }}>
                  {item.name}
                </h2>
                <p className="max-w-lg text-[12px] sm:text-sm leading-relaxed font-light mb-4 px-4" style={{ fontFamily: MANROPE, color: BRAND_BODY }}>
                  {item.description}
                </p>
                <Link
                  href={`/products/${item.slug}`}
                  className="inline-flex items-center justify-center px-8 py-2 border text-[11px] tracking-[0.3em] font-medium uppercase bg-transparent hover:scale-105 active:scale-95 transition-all duration-300"
                  style={{ fontFamily: LE_GRAND, borderColor: BRAND_DARK, color: BRAND_DARK }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = BRAND_DARK; (e.currentTarget as HTMLElement).style.color = BG_CREAM; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; (e.currentTarget as HTMLElement).style.color = BRAND_DARK; }}
                >
                  EXPLORE
                </Link>
              </div>

              {/* Divider between upper and lower — padded */}
              <div className="w-full my-8 px-16 md:px-24 lg:px-32">
                <div style={{ height: "1px", backgroundColor: `${BRAND_DARK}20` }} />
              </div>

              {/* Lower: 6-Card Gallery Row (All Portrait 3:4 Cards - Sabyasachi Style) */}
              <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-stretch w-full">

                  {/* Card 1: Full Body Studio Model (Portrait 3:4) */}
                  <div className="relative overflow-hidden w-full rounded-2xl md:rounded-3xl shadow-sm border border-[#431717]/10 bg-white" style={{ aspectRatio: "3/4" }}>
                    <Image src={item.cards.modelFull} alt={`${item.name} Model`} fill className="object-cover object-center hover:scale-105 transition-transform duration-500" sizes="18vw" />
                  </div>

                  {/* Card 2: 4 Individual Distinct Image Boxes (2x2 Grid, No Outer Box, No Logo) */}
                  <div className="w-full grid grid-cols-2 grid-rows-2 gap-1.5 sm:gap-2" style={{ aspectRatio: "3/4" }}>
                    {item.cards.gridThumbnails.slice(0, 4).map((gImg, gIdx) => (
                      <div key={gIdx} className="relative overflow-hidden rounded-xl md:rounded-2xl w-full h-full shadow-sm border border-[#431717]/10 bg-white">
                        <Image src={gImg} alt={`${item.name} Detail ${gIdx + 1}`} fill className="object-cover object-center hover:scale-105 transition-transform duration-500" sizes="100px" />
                      </div>
                    ))}
                  </div>

                  {/* Card 3: Cutout + Title + Watermark (Portrait 3:4) */}
                  <div className="relative w-full rounded-2xl md:rounded-3xl shadow-sm border border-[#431717]/10 bg-white flex flex-col items-center justify-between p-2.5 sm:p-3 text-center" style={{ aspectRatio: "3/4" }}>
                    <div className="relative w-full h-[65%]">
                      <Image src={item.cards.cutoutWithWatermark} alt={`${item.name} Cutout`} fill className="object-contain object-center" sizes="18vw" />
                    </div>
                    <div className="flex flex-col items-center justify-end pb-1 w-full">
                      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#431717] font-medium mb-1 line-clamp-1" style={{ fontFamily: LE_GRAND }}>
                        {item.name}
                      </p>
                      <Image src="/logos/logo.svg" alt="D'LAVÉN" width={45} height={14} className="h-3 sm:h-3.5 w-auto object-contain opacity-75" style={{ filter: "brightness(0.2)" }} />
                    </div>
                  </div>

                  {/* Card 4: Outdoor Lifestyle (Portrait 3:4) */}
                  <div className="relative overflow-hidden w-full rounded-2xl md:rounded-3xl shadow-sm border border-[#431717]/10" style={{ aspectRatio: "3/4" }}>
                    <Image src={item.cards.outdoorLifestyle} alt={`${item.name} Outdoor`} fill className="object-cover object-center hover:scale-105 transition-transform duration-500" sizes="18vw" />
                  </div>

                  {/* Card 5: Lounge Selfie (Portrait 3:4) */}
                  <div className="relative overflow-hidden w-full rounded-2xl md:rounded-3xl shadow-sm border border-[#431717]/10" style={{ aspectRatio: "3/4" }}>
                    <Image src={item.cards.detailCloseup} alt={`${item.name} Lounge`} fill className="object-cover object-center hover:scale-105 transition-transform duration-500" sizes="18vw" />
                  </div>

                  {/* Card 6: Top 2 Side-by-Side Image Boxes + Bottom Terracotta Price Card (Matching User Design) */}
                  <div className="w-full flex flex-col gap-1.5 sm:gap-2" style={{ aspectRatio: "3/4" }}>
                    {/* Top Row: 2 Side-by-Side Image Boxes */}
                    <div className="grid grid-cols-2 gap-1.5 sm:gap-2 w-full h-[52%] flex-shrink-0">
                      {/* Box 1 (Left): Model Portrait */}
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-sm border border-[#431717]/10 bg-white">
                        <Image
                          src={item.cards.outdoorLifestyle}
                          alt={`${item.name} Model Crop`}
                          fill
                          className="object-cover object-center hover:scale-105 transition-transform duration-500"
                          sizes="10vw"
                        />
                      </div>

                      {/* Box 2 (Right): Flatlay / Cutout */}
                      <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-sm border border-[#431717]/10 bg-white p-1">
                        <Image
                          src={item.cards.cutoutWithWatermark}
                          alt={`${item.name} Flatlay`}
                          fill
                          className="object-contain object-center hover:scale-105 transition-transform duration-500"
                          sizes="10vw"
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Terracotta Price & Description Card */}
                    <div
                      className="w-full flex-1 overflow-hidden shadow-sm flex flex-col justify-center items-center text-center text-[#F6F4E6] p-2.5 sm:p-3"
                      style={{ backgroundColor: BRAND_TERRACOTTA }}
                    >
                      <p
                        className="text-[9px] sm:text-[10.5px] tracking-wider italic font-normal mb-1"
                        style={{ fontFamily: LE_GRAND }}
                      >
                        D&apos;LAVÉN &nbsp;×&nbsp; Stella Élégance
                      </p>
                      <h3
                        className="text-[10px] sm:text-[11.5px] uppercase tracking-[0.14em] font-normal mb-0.5 text-[#F6F4E6] line-clamp-1"
                        style={{ fontFamily: LE_GRAND }}
                      >
                        {item.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#F6F4E6] mb-1">
                        Price ₹{item.price.toLocaleString("en-IN")}.00
                      </p>
                      <p
                        className="text-[7.5px] sm:text-[8px] leading-tight opacity-90 line-clamp-2 font-light max-w-[95%]"
                        style={{ fontFamily: MANROPE }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

          </div>
        ))}
      </section>

    </main>
  );
}
