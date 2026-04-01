import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Mens Adornments | D' LAVÉN PRIVÉ",
  description: "Exclusive D' LAVÉN Mens Adornments collection — Luxe et Autorité.",
};

const POPPINS = `var(--font-poppins), sans-serif`;
const BG = "#f5f0e8";

export default function PriveMensAdornmentsPage() {
  return (
    <main style={{ background: BG }}>

      {/* ── Hero: two large images + label centered ── */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "65vh", minHeight: "400px" }}>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage/mens_adornments.jpg"
            alt="Mens Adornments Left"
            fill
            className="object-cover object-top"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage/womens_adornments.jpg"
            alt="Mens Adornments Right"
            fill
            className="object-cover object-top"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Centered label spanning both columns */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1
            className="text-white tracking-[0.1em] text-center uppercase"
            style={{
              fontFamily: POPPINS,
              fontSize: "clamp(24px, 5vw, 64px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              fontWeight: 600,
            }}
          >
            MENS ADORNMENTS
          </h1>
        </div>
      </section>

      {/* ── Marquee Section ── */}
      <section className="w-full pb-10" style={{ background: BG }}>
        <Marquee
          images={[
            "/images/menswear/IMG_9338.JPEG",
            "/images/menswear/IMG_9706.JPEG",
            "/images/menswear/IMG_9691.PNG",
            "/images/menswear/IMG_9345.JPEG",
            "/images/menswear/IMG_9757.JPEG",
          ]}
          speed={45}
          direction="right"
        />
      </section>

      {/* ── Feature blocks: THE HERITAGE & THE INTERNATIONAL ── */}
      <section className="w-full flex flex-col items-center py-20 px-6 gap-24" style={{ background: BG }}>

        {/* Block 1: THE HERITAGE */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-[clamp(280px,80vw,550px)]" style={{ aspectRatio: "4/5" }}>
            <Image
              src="/images/menswear/IMG_9705.JPEG"
              alt="The Heritage"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 80vw, 550px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2
                className="text-white tracking-[0.3em] uppercase"
                style={{
                  fontFamily: POPPINS,
                  fontSize: "clamp(20px, 4vw, 36px)",
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
              href="/heritage-prive"
              className="inline-flex items-center justify-center px-12 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

        {/* Block 2: ADORNMENTS */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-[clamp(280px,80vw,550px)]" style={{ aspectRatio: "4/5" }}>
            <Image
              src="/images/menswear/adornments_main.png"
              alt="Adornments"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 80vw, 550px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <h2
                className="text-white tracking-[0.3em] uppercase"
                style={{
                  fontFamily: POPPINS,
                  fontSize: "clamp(20px, 4vw, 36px)",
                  fontWeight: 400,
                  textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                ADORNMENTS
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
             L&apos; INDE ENTER HERITAGE ET AUTORITE
          </p>
          <div className="mt-6">
            <Link
              href="/adornments-prive"
              className="inline-flex items-center justify-center px-12 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[11px] tracking-[0.3em] uppercase"
              style={{ fontFamily: POPPINS, color: "#2a2a2a" }}
            >
              EXPLORE
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/prive-jewellery"
            className="inline-flex items-center justify-center px-10 py-3 border border-black/10 text-[9px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500"
            style={{ fontFamily: POPPINS }}
          >
            ← BACK TO PRIVÉ JEWELLERY
          </Link>
        </div>

      </section>
    </main>
  );
}
