import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DL Privé Jewellery | D' LAVÉN",
  description:
    "Explore the exclusive DL Privé Jewellery collection — where heritage meets modern luxury.",
};

const POPPINS = `var(--font-poppins), sans-serif`;

export default function PriveJewelleryPage() {
  return (
    <main style={{ background: "#f5f0e8", fontFamily: POPPINS }}>

      {/* ── Two-column hero ── */}
      <section className="w-full grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "80vh" }}>
        {/* MENS ADORNMENTS */}
        <div className="relative overflow-hidden group h-[50vh] md:h-auto">
          <Image
            src="/images/heritage/mens_adornments.jpg"
            alt="Mens Adornments"
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-24 text-white text-center">
              <Link href="/prive-mens-adornments" className="flex flex-col items-center">
                <span 
                  className="uppercase tracking-[0.4em] font-light"
                  style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 3.5vw, 32px)" }}
                >
                  MENS ADORNMENTS
                </span>
                <span 
                  className="uppercase tracking-[0.2em] text-[10px] mt-2 opacity-70 border-b border-white/0 group-hover:border-white/60 transition-all duration-500"
                  style={{ fontFamily: POPPINS }}
                >
                  EXPLORE
                </span>
              </Link>
          </div>
        </div>

        {/* WOMENS ADORNMENTS */}
        <div className="relative overflow-hidden group h-[50vh] md:h-auto border-l border-white/10">
          <Image
            src="/images/heritage/womens_adornments.jpg"
            alt="Womens Adornments"
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/45 group-hover:bg-black/35 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-24 text-white text-center">
              <Link href="/prive-womens-adornments" className="flex flex-col items-center">
                <span 
                  className="uppercase tracking-[0.4em] font-light"
                  style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 3.5vw, 32px)" }}
                >
                  WOMENS ADORNMENTS
                </span>
                <span 
                  className="uppercase tracking-[0.2em] text-[10px] mt-2 opacity-70 border-b border-white/0 group-hover:border-white/60 transition-all duration-500"
                  style={{ fontFamily: POPPINS }}
                >
                  EXPLORE
                </span>
              </Link>
          </div>
        </div>
      </section>

      {/* ── Brand Message Section (Same as Reference) ── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-24 sm:py-32 text-center"
        style={{ background: "#f5f0e8" }}
      >
        <div className="max-w-4xl space-y-12">
          {/* Main Title */}
          <p className="text-[14px] sm:text-[15px] leading-relaxed tracking-[0.02em]" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
            Our jewellery is grounded in heritage, yet articulated for a global context.
          </p>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
              We work in carefully considered gold compositions chosen for durability, structural integrity, and long-term wearability allowing form, proportion, and craftsmanship to take precedence over excess materiality.
            </p>

            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
              Each creation is developed through time-honoured techniques, informed by historical reference, and refined through contemporary discipline. Heritage, in our work, is not aesthetic nostalgia; it is a framework for permanence.
            </p>

            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
              Select pieces incorporate precision-cut moissanite, valued for its clarity, brilliance, and ethical consistency used not as substitution, but as deliberate design choice.
            </p>

            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
              These are objects conceived with longevity in mind intended to endure in relevance, to be collected with discernment, and to carry forward the continuity of craft.
            </p>
          </div>

          {/* Tagline */}
          <div className="pt-8">
            <p className="uppercase tracking-[0.2em] text-[14px] sm:text-[16px] font-light" style={{ fontFamily: POPPINS, color: "#1a1a1a" }}>
              D&apos; LAVEN WHERE HERITAGE MEETS MODERN LUXURY
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-12 flex justify-center">
          <div className="relative opacity-90" style={{ width: 120, height: 80 }}>
            <Image
              src="/logos/logoBlack.png"
              alt="D' LAVÉN"
              fill
              className="object-contain"
              sizes="120px"
            />
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-20">
          <Link
            href="/dl-prive"
            className="inline-flex items-center justify-center px-10 py-3 border border-black/10 text-[9px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500"
            style={{ fontFamily: POPPINS }}
          >
            ← BACK TO DL PRIVÉ
          </Link>
        </div>
      </section>
    </main>
  );
}
