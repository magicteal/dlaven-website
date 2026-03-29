import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "WomensWear | D' LAVÉN Heritage",
  description: "D' LAVÉN Womens Adornments — Heritage meets authority.",
};

const SERIF = `Georgia, 'Times New Roman', serif`;
const POPPINS = `var(--font-poppins), sans-serif`;
const BG = "#f5f0e8";

export default function WomensAdornmentsPage() {
  return (
    <main style={{ background: BG }}>

      {/* ── Hero: two large images + label centered ── */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "65vh", minHeight: "400px" }}>
        <div className="relative overflow-hidden">
          <Image
            src="/images/womenswear/IMG_9339.JPEG"
            alt="WomensWear Left"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/womenswear/IMG_9341.JPEG"
            alt="WomensWear Right"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Centered label spanning both columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            className="text-white tracking-[0.05em] text-center"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(28px, 6vw, 72px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              fontWeight: 600,
            }}
          >
            WomensWear
          </h1>
        </div>
      </section>

      {/* ── Marquee Section ── */}
      <section className="w-full pb-10" style={{ background: BG }}>
        <Marquee
          images={[
            "/images/womenswear/IMG_9666.JPEG",
            "/images/womenswear/IMG_9667.JPEG",
            "/images/womenswear/IMG_9668.JPEG",
            "/images/womenswear/IMG_9669.JPEG",
            "/images/womenswear/IMG_9670.JPEG",
            "/images/womenswear/IMG_9347.JPEG",
          ]}
          speed={45}
          direction="right"
        />
      </section>

      {/* ── Feature blocks: THE HERITAGE & THE INTERNATIONAL ── */}
      <section className="w-full flex flex-col items-center py-20 px-6 gap-24" style={{ background: BG }}>

        {/* Block 1: THE HERITAGE */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/images/womenswear/IMG_9343.JPEG"
              alt="The Heritage"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 90vw, 800px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <h2
                className="text-white tracking-[0.3em] uppercase"
                style={{
                  fontFamily: POPPINS,
                  fontSize: "clamp(18px, 3.5vw, 36px)",
                  fontWeight: 400,
                  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                THE HERITAGE
              </h2>
            </div>
          </div>
          <p
            className="mt-8 uppercase tracking-[0.2em]"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(10px, 1.2vw, 13px)",
              color: "#4a3f35",
              fontWeight: 500
            }}
          >
            L&apos; INDE ENTER HÉRITAGE ET AUTORITÉ
          </p>
          <div className="mt-6">
            <Link
              href="/heritage-jewelry"
              className="inline-flex items-center justify-center px-12 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

        {/* Block 2: THE INTERNATIONAL */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/images/womenswear/IMG_9345.JPEG"
              alt="The International"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 90vw, 800px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <h2
                className="text-white tracking-[0.3em] uppercase"
                style={{
                  fontFamily: POPPINS,
                  fontSize: "clamp(18px, 3.5vw, 36px)",
                  fontWeight: 400,
                  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                THE INTERNATIONAL
              </h2>
            </div>
          </div>
          <p
            className="mt-8 uppercase tracking-[0.2em]"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(10px, 1.2vw, 13px)",
              color: "#4a3f35",
              fontWeight: 500
            }}
          >
            LA OU L&apos;INDE D&apos;HIER DIALOGUE AVEC L&apos;INDE D&apos;AUJOURD&apos;HUI
          </p>
          <div className="mt-6">
            <Link
              href="/womens-ready-to-wear"
              className="inline-flex items-center justify-center px-12 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
