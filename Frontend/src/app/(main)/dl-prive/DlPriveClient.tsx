"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const POPPINS = `var(--font-poppins), sans-serif`;
const BG = "#f0ebe3";

export default function DlPriveClient() {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    let ctx = gsap.context(() => {
      // Loop across 33.33% of the container (since we have 3 identical sets)
      // Moving left to right (from -33.33% to 0)
      gsap.fromTo(marqueeRef.current, 
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
    <main style={{ background: BG, fontFamily: POPPINS }}>
      {/* ── Hero ── */}
      <section
        className="w-full flex flex-col items-center justify-center text-center py-24 px-6"
        style={{ background: "#c8c8c0", minHeight: "340px" }}
      >
        <p
          className="uppercase tracking-[0.25em] text-sm mb-8"
          style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
        >
          D&apos; LAVEN PRIVÉ
        </p>
        <h1
          className="uppercase leading-tight"
          style={{
            fontFamily: POPPINS,
            fontSize: "clamp(22px, 5vw, 52px)",
            letterSpacing: "0.08em",
            color: "#1a1a1a",
          }}
        >
          D&apos; LAVEN &nbsp;&nbsp; X &nbsp;&nbsp; DL PRIVÉ L&apos;ORDONNANCE
        </h1>
      </section>

      {/* ── Divider ── */}
      <div className="w-full border-t border-[#b0a898]" />

      {/* ── Quote ── */}
      <section
        className="w-full flex items-center justify-center px-6 py-16"
        style={{ background: "#f5f0e8" }}
      >
        <p
          className="max-w-2xl text-center leading-relaxed"
          style={{ fontFamily: POPPINS, fontSize: "clamp(13px, 1.6vw, 16px)", color: "#2a2a2a" }}
        >
          &ldquo;&nbsp;
          <span style={{ color: "#1a3a5c", fontWeight: 600 }}>DL PRIVÉ L&apos; ACCÈS</span>{" "}
          has been a key supporter and partner of our brand for many years. It is a privilege to now
          bring the entire world of{" "}
          <span style={{ color: "#1a3a5c", fontWeight: 600 }}>D&apos; LAVEN</span> to a dedicated
          space encompassing clothing, accessories and jewelry. This presentation marks a special
          moment where the best of{" "}
          <span style={{ color: "#1a3a5c", fontWeight: 600 }}>INDIA MEETS</span> &ldquo;{" "}
          <span style={{ color: "#1a3a5c", fontWeight: 600 }}>
            L&apos;INDE RENCONTRE L&apos;AUTORITÉ
          </span>{" "}
          &rdquo;&nbsp;&rdquo;
        </p>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 1 — 1 top-center + 3-image row
      ══════════════════════════════════════════ */}
      <section className="w-full py-16 px-4" style={{ background: BG }}>
        {/* Top center image */}
        <div className="flex justify-center mb-4">
          <div
            className="relative overflow-hidden group cursor-pointer"
            style={{ width: "clamp(180px, 26vw, 420px)", aspectRatio: "3/4" }}
          >
            <Image
              src="/images/dlprive_2.jpg"
              alt="DL Privé editorial 1"
              fill
              className="object-cover object-top"
              sizes="(max-width:768px) 80vw, 32vw"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>

        {/* 3-image row */}
        <div className="flex gap-6 justify-center mt-3">
          {[
            { src: "/images/dlprive_2.jpg", alt: "DL Privé Gold Editorial" },
            { src: "/images/dlprive_1.jpg", alt: "DL Privé Tiger Editorial" },
            { src: "/images/dlprive_3.jpg", alt: "DL Privé White Editorial" },
          ].map((img) => (
            <div
              key={img.src}
              className="relative overflow-hidden flex-1"
              style={{ maxWidth: "calc(24vw)", aspectRatio: "3/4" }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top"
                sizes="(max-width:768px) 33vw, 22vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — DL PRIVÉ HERITAGE
          cutout model center + label + EXPLORE + 4-image marquee
      ══════════════════════════════════════════ */}
      <section className="w-full py-24 px-4 text-center overflow-hidden" style={{ background: "#f5f0e8" }}>
        {/* Cutout/center image — no background box */}
        <div className="flex justify-center mb-8">
          <div
            className="relative"
            style={{ width: "clamp(180px, 28vw, 420px)", aspectRatio: "3.5/4" }}
          >
            <Image
              src="/images/heritage_hero.png"
              alt="DL Privé Heritage"
              fill
              className="object-contain object-bottom"
              sizes="(max-width:768px) 70vw, 28vw"
              priority
            />
          </div>
        </div>

        <p className="mt-8 uppercase tracking-[0.4em] text-sm font-semibold" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
          DL PRIVÉ HERITAGE
        </p>

        <div className="mt-8 flex justify-center mb-20">
          <Link
            href="/heritage-jewelry"
            className="inline-flex items-center justify-center px-12 py-4 border border-[#1a1a1a] text-xs tracking-[0.3em] font-semibold uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-500"
            style={{ fontFamily: POPPINS }}
          >
            EXPLORE
          </Link>
        </div>

        {/* 4-image Marquee strip — GSAP driven */}
        <div className="relative w-screen -mx-4 overflow-hidden py-6">
          <div 
            ref={marqueeRef}
            className="flex gap-6"
            style={{ width: "fit-content" }}
          >
            {[...Array(3)].map((_, setIdx) => (
              [
                { src: "/images/marquee_1.jpg", alt: "Heritage 1" },
                { src: "/images/marquee_2.jpg", alt: "Heritage 2" },
                { src: "/images/marquee_3.jpg", alt: "Heritage 3" },
                { src: "/images/marquee_4.jpg", alt: "Heritage 4" },
              ].map((img, idx) => (
                <div 
                  key={`${img.src}-${setIdx}-${idx}`} 
                  className="relative flex-shrink-0" 
                  style={{ width: "clamp(220px, 35vw, 450px)", aspectRatio: "16/9" }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover object-center grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                    sizes="(max-width:768px) 70vw, 30vw"
                  />
                </div>
              ))
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — DL PRIVÉ JEWELLERY
          centered product image + label + EXPLORE
      ══════════════════════════════════════════ */}
      <section className="w-full py-16 px-4 text-center" style={{ background: BG }}>
        <div className="flex justify-center">
          <div
            className="relative"
            style={{ width: "clamp(150px, 25vw, 400px)", aspectRatio: "3/4" }}
          >
            <Image
              src="/images/dlprive_end.png"
              alt="DL Privé Jewellery"
              fill
              className="object-contain"
              sizes="(max-width:768px) 60vw, 22vw"
            />
          </div>
        </div>

        <p
          className="mt-8 uppercase tracking-[0.3em] text-sm"
          style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
        >
          DL PRIVÉ JEWELLERY
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/heritage-jewelry"
            className="inline-flex items-center justify-center px-10 py-3 border border-[#9a9080] text-xs tracking-[0.25em] uppercase hover:bg-[#e0d8cc] transition-colors"
            style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
          >
            EXPLORE
          </Link>
        </div>
      </section>
    </main>
  );
}
