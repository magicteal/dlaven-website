import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Womens Adornments | D' LAVÉN Heritage",
  description: "D' LAVÉN Womens Adornments — L'Inde entre héritage et autorité.",
};

const SERIF = `Georgia, 'Times New Roman', serif`;
const BG = "#f5f0e8";

export default function WomensAdornmentsPage() {
  return (
    <main style={{ background: BG }}>

      {/* ── Hero: two large images + label centered ── */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "55vh", minHeight: "320px" }}>
        <div className="relative overflow-hidden">
          <Image
            src="/images/leftVisual.png"
            alt="Womens Adornments Left"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage.png"
            alt="Womens Adornments Right"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Centered label spanning both columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            className="uppercase text-white tracking-[0.25em] text-center"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(18px, 3vw, 42px)",
              textShadow: "0 2px 14px rgba(0,0,0,0.65)",
            }}
          >
            WOMENS &nbsp; ADORNMENTS
          </h1>
        </div>
      </section>

      {/* ── Gallery row — 6 images ── */}
      <section className="w-full px-4 py-10" style={{ background: BG }}>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            "/images/leftVisual.png",
            "/images/rightVisual.png",
            "/images/twoImg.png",
            "/images/oneImg.png",
            "/images/DPrimeTwo.jpg",
            "/images/frangrence.png",
          ].map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={src}
                alt={`Womens adornment ${i + 1}`}
                fill
                className="object-cover object-top"
                sizes="(max-width:640px) 33vw, 16vw"
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature block: center image + label + subtitle + EXPLORE ── */}
      <section
        className="w-full flex flex-col items-center justify-center py-14 px-6 text-center"
        style={{ background: BG }}
      >
        {/* Center image with overlay label */}
        <div
          className="relative overflow-hidden"
          style={{ width: "clamp(200px, 28vw, 440px)", aspectRatio: "3/4" }}
        >
          <Image
            src="/images/heritage.png"
            alt="Womens Adornments feature"
            fill
            className="object-cover object-center"
            sizes="(max-width:768px) 70vw, 28vw"
          />
          <div className="absolute inset-0 bg-black/25" />
          <div className="absolute inset-0 flex items-end justify-center pb-6">
            <p
              className="uppercase text-white tracking-[0.3em]"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(12px, 1.4vw, 18px)",
                textShadow: "0 1px 6px rgba(0,0,0,0.6)",
              }}
            >
              ADORNMENTS
            </p>
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="mt-8 uppercase tracking-[0.2em]"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(11px, 1.2vw, 14px)",
            color: "#4a3f35",
          }}
        >
          L&apos; INDE ENTER HÉRITAGE ET AUTORITÉ
        </p>

        {/* Explore CTA */}
        <div className="mt-6">
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
