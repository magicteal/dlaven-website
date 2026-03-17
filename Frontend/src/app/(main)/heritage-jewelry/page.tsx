import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heritage Jewelry | D' LAVÉN",
  description:
    "D' LAVÉN Heritage — jewellery grounded in heritage, yet articulated for a global context.",
};

const SERIF = `Georgia, 'Times New Roman', serif`;

export default function HeritageJewelryPage() {
  return (
    <main style={{ background: "#f5f0e8" }}>

      {/* ── Two-column hero ── */}
      <section className="w-full grid grid-cols-2" style={{ minHeight: "65vh" }}>
        {/* MENS ADORNMENTS */}
        <div className="relative overflow-hidden" style={{ minHeight: "65vh" }}>
          <Image
            src="/images/mensReady.png"
            alt="Mens Adornments"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/mens-adornments"
                className="uppercase text-white tracking-[0.25em] text-center hover:opacity-75 transition-opacity"
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(16px, 2.6vw, 34px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                MENS &nbsp;ADORNMENTS
              </Link>
          </div>
        </div>

        {/* WOMENS ADORNMENTS */}
        <div className="relative overflow-hidden" style={{ minHeight: "65vh" }}>
          <Image
            src="/images/leftVisual.png"
            alt="Womens Adornments"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="/womens-adornments"
                className="uppercase text-white tracking-[0.25em] text-center hover:opacity-75 transition-opacity"
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(16px, 2.6vw, 34px)",
                  textShadow: "0 2px 12px rgba(0,0,0,0.6)",
                }}
              >
                WOMENS &nbsp;ADORNMENTS
              </Link>
          </div>
        </div>
      </section>

      {/* ── Description ── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-14 sm:py-20 text-center"
        style={{ background: "#f5f0e8" }}
      >
        <div className="max-w-2xl space-y-4">
          {[
            "Our jewellery is grounded in heritage, yet articulated for a global context.",
            "We work in carefully considered gold compositions chosen for durability, structural integrity, and long‑term wearability — allowing form, proportion, and craftsmanship to take precedence over excess materiality.",
            "Each creation is developed through time‑honoured techniques, informed by historical reference, and refined through contemporary discipline. Heritage, in our work, is not aesthetic nostalgia; it is a framework for permanence.",
            "Select pieces incorporate precision‑cut moissanite, valued for its clarity, brilliance, and ethical consistency — used not as substitution, but as deliberate design choice.",
            "These are objects conceived with longevity in mind — intended to endure in relevance, to be collected with discernment, and to carry forward the continuity of craft.",
          ].map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(12px, 1.3vw, 14px)",
                color: "#2a2a2a",
                lineHeight: 1.9,
              }}
            >
              {line}
            </p>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="mt-12 uppercase tracking-[0.25em]"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(12px, 1.5vw, 16px)",
            color: "#2a2a2a",
          }}
        >
          D&apos; LAVEN WHERE HERITAGE MEETS MODERN LUXURY
        </p>

        {/* Logo */}
        <div className="mt-5 flex justify-center">
          <div className="relative" style={{ width: 80, height: 56 }}>
            <Image
              src="/logos/logoBlack.png"
              alt="D' LAVÉN"
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-10">
          <Link
            href="/dl-prive"
            className="inline-flex items-center justify-center px-8 py-3 border border-[#9a9080] text-xs tracking-[0.25em] uppercase hover:bg-[#e0d8cc] transition-colors"
            style={{ fontFamily: SERIF, color: "#2a2a2a" }}
          >
            ← BACK TO DL PRIVÉ
          </Link>
        </div>
      </section>
    </main>
  );
}
