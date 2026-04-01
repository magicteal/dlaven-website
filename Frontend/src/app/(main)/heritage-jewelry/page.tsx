import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heritage Jewelry | D' LAVÉN",
  description:
    "D' LAVÉN Heritage — jewellery grounded in heritage, yet articulated for a global context.",
};

const POPPINS = `var(--font-poppins), sans-serif`;

export default function HeritageJewelryPage() {
  return (
    <main style={{ background: "#f5f0e8", fontFamily: POPPINS }}>

      {/* ── Two-column hero ── */}
      <section className="w-full grid grid-cols-2" style={{ minHeight: "80vh" }}>
        {/* MENSWEAR */}
        <div className="relative overflow-hidden group">
          <Image
            src="/images/mens_heritage.jpg"
            alt="Menswear Heritage"
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-20 text-white text-center">
            <Link href="/mens-adornments" className="flex flex-col items-center gap-1">
              <span
                className="uppercase tracking-[0.3em]"
                style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 3vw, 36px)" }}
              >
                MENSWEAR
              </span>
              <span
                className="uppercase tracking-[0.2em] text-[10px] sm:text-[12px] opacity-80 border-b border-white/0 group-hover:border-white/60 transition-all"
                style={{ fontFamily: POPPINS }}
              >
                EXPLORE
              </span>
            </Link>
          </div>
        </div>

        {/* WOMENSWEAR */}
        <div className="relative overflow-hidden group">
          <Image
            src="/images/womens_heritage.jpg"
            alt="Womenswear Heritage"
            fill
            className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/55 group-hover:bg-black/45 transition-colors duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 sm:pb-20 text-white text-center">
            <Link href="/womens-adornments" className="flex flex-col items-center gap-1">
              <span
                className="uppercase tracking-[0.3em]"
                style={{ fontFamily: POPPINS, fontSize: "clamp(18px, 3vw, 36px)" }}
              >
                WOMENSWEAR
              </span>
              <span
                className="uppercase tracking-[0.2em] text-[10px] sm:text-[12px] opacity-80 border-b border-white/0 group-hover:border-white/60 transition-all"
                style={{ fontFamily: POPPINS }}
              >
                EXPLORE
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Description (Tiered Structure) ── */}
      <section
        className="w-full flex flex-col items-center justify-center px-6 py-20 sm:py-28 text-center"
        style={{ background: "#f5f0e8" }}
      >
        <div className="max-w-2xl space-y-8">
          <p style={{ fontFamily: POPPINS, fontSize: "14px", color: "#1a1a1a" }}>
            D&apos;LAVÉN operates through a tiered structure.
          </p>

          <div className="space-y-6">
            <p style={{ fontFamily: POPPINS, fontSize: "13px", color: "#2a2a2a", lineHeight: 1.8 }}>
              DL PRIVÉ functions as a controlled division within the house. <br />
              Entry is enabled through a registered PRIVÉ identification number.
            </p>

            <p style={{ fontFamily: POPPINS, fontSize: "13px", color: "#2a2a2a", lineHeight: 1.8 }}>
              Each verified purchase advances the holder through a fixed sequence. <br />
              Upon completion of eleven validated transactions, <br />
              the system authorizes a value-based release credited directly to the holder.
            </p>

            <p style={{ fontFamily: POPPINS, fontSize: "13px", color: "#2a2a2a", lineHeight: 1.8 }}>
              Access to DL BERRY is permitted only through PRIVÉ classification <br />
              and remains selectively allocated under internal limitation.
            </p>

            <p style={{ fontFamily: POPPINS, fontSize: "13px", color: "#2a2a2a", lineHeight: 1.8 }}>
              DL LIMITED exists independently, defined by quantity and closure.
            </p>
          </div>
        </div>

        {/* Logo */}
        <div className="mt-16 flex justify-center">
          <div className="relative" style={{ width: 100, height: 70 }}>
            <Image
              src="/logos/logoBlack.png"
              alt="D' LAVÉN"
              fill
              className="object-contain"
              sizes="100px"
            />
          </div>
        </div>

        {/* Back CTA */}
        <div className="mt-14">
          <Link
            href="/dl-prive"
            className="inline-flex items-center justify-center px-10 py-3 border border-[#1a1a1a] text-[10px] tracking-[0.25em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
            style={{ fontFamily: POPPINS }}
          >
            ← BACK TO DL PRIVÉ
          </Link>
        </div>
      </section>
    </main>
  );
}
