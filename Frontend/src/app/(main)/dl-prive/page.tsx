import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "D' LAVEN PRIVÉ | D' LAVEN × DL PRIVÉ L'ORDONNANCE",
  description:
    "DL PRIVÉ L'ACCÈS — A dedicated space encompassing clothing, accessories and jewelry. India meets L'inde rencontre L'autorité.",
};

const SERIF = `Georgia, 'Times New Roman', serif`;
const BG = "#f0ebe3";

export default function DlPrivePage() {
  return (
    <main style={{ background: BG }}>
      {/* ── Hero ── */}
      <section
        className="w-full flex flex-col items-center justify-center text-center py-24 px-6"
        style={{ background: "#c8c8c0", minHeight: "340px" }}
      >
        <p
          className="uppercase tracking-[0.25em] text-sm mb-8"
          style={{ fontFamily: SERIF, color: "#2a2a2a" }}
        >
          D&apos; LAVEN PRIVÉ
        </p>
        <h1
          className="uppercase leading-tight"
          style={{
            fontFamily: SERIF,
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
          style={{ fontFamily: SERIF, fontSize: "clamp(13px, 1.6vw, 16px)", color: "#2a2a2a" }}
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
            className="relative overflow-hidden"
            style={{ width: "clamp(180px, 26vw, 420px)", aspectRatio: "3/4" }}
          >
            <Image
              src="/images/DPrimeOne.jpg"
              alt="DL Privé editorial 1"
              fill
              className="object-cover object-top"
              sizes="(max-width:768px) 80vw, 32vw"
            />
          </div>
        </div>

        {/* 3-image row */}
        <div className="flex gap-6 justify-center mt-3">
          {[
            { src: "/images/DPrimeTwo.jpg", alt: "DL Privé editorial 2" },
            { src: "/images/leftVisual.png", alt: "DL Privé editorial 3" },
            { src: "/images/rightVisual.png", alt: "DL Privé editorial 4" },
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
          cutout model center + label + EXPLORE + 4-image strip
      ══════════════════════════════════════════ */}
      <section className="w-full py-16 px-4 text-center" style={{ background: BG }}>
        {/* Cutout/center image — no background box */}
        <div className="flex justify-center">
          <a
            href="/images/heritage.png"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div
              className="relative"
              style={{ width: "clamp(140px, 22vw, 360px)", aspectRatio: "3/4" }}
            >
              <Image
                src="/images/heritage.png"
                alt="DL Privé Heritage"
                fill
                className="object-contain object-bottom"
                sizes="(max-width:768px) 70vw, 28vw"
              />
            </div>
          </a>
        </div>

        <p className="mt-6 uppercase tracking-[0.3em] text-sm" style={{ fontFamily: SERIF, color: "#2a2a2a" }}>
          <a href="/images/heritage.png" target="_blank" rel="noopener noreferrer" className="inline-block">
            DL PRIVÉ HERITAGE
          </a>
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/heritage-jewelry"
            className="inline-flex items-center justify-center px-10 py-3 border border-[#9a9080] text-xs tracking-[0.25em] uppercase hover:bg-[#e0d8cc] transition-colors"
            style={{ fontFamily: SERIF, color: "#2a2a2a" }}
          >
            EXPLORE
          </Link>
        </div>

        {/* 4-image strip — full width, with gaps */}
        <div className="mt-10 grid grid-cols-4 gap-4 w-full">
          {[
            { src: "/images/oneImg.png", alt: "Heritage 1" },
            { src: "/images/twoImg.png", alt: "Heritage 2" },
            { src: "/images/mensReady.png", alt: "Heritage 3" },
            { src: "/images/DPrimeOne.jpg", alt: "Heritage 4" },
          ].map((img) => (
            <div key={img.src} className="relative" style={{ aspectRatio: "4/5" }}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover object-top"
                sizes="25vw"
              />
            </div>
          ))}
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
            style={{ width: "clamp(120px, 18vw, 300px)", aspectRatio: "1/1" }}
          >
            <Image
              src="/images/frangrence.png"
              alt="DL Privé Jewellery"
              fill
              className="object-contain"
              sizes="(max-width:768px) 60vw, 22vw"
            />
          </div>
        </div>

        <p
          className="mt-8 uppercase tracking-[0.3em] text-sm"
          style={{ fontFamily: SERIF, color: "#2a2a2a" }}
        >
          DL PRIVÉ JEWELLERY
        </p>

        <div className="mt-5 flex justify-center">
          <Link
            href="/heritage-jewelry"
            className="inline-flex items-center justify-center px-10 py-3 border border-[#9a9080] text-xs tracking-[0.25em] uppercase hover:bg-[#e0d8cc] transition-colors"
            style={{ fontFamily: SERIF, color: "#2a2a2a" }}
          >
            EXPLORE
          </Link>
        </div>
      </section>
    </main>
  );
}
