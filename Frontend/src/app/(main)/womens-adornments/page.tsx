import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "WomensWear | D' LAVÉN Heritage",
  description: "D' LAVÉN Womens Adornments — Heritage meets authority.",
};

const BG = "#F6F4E6";

export default function WomensAdornmentsPage() {
  return (
    <main className="min-h-screen pb-24" style={{ background: BG }}>

      {/* Hero: two large images + label centered */}
      <section className="relative w-full grid grid-cols-2 mb-12" style={{ height: "75vh", minHeight: "500px" }}>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage/womens_heritage.jpg"
            alt="WomensWear Left"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage/womens_adornments.jpg"
            alt="WomensWear Right"
            fill
            className="object-cover object-center"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Centered label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-[#E2DDD7] font-medium mb-2">
            D&apos; LAVÉN CREATION
          </p>
          <h1
            className="font-le-grand text-white tracking-[0.2em] text-center uppercase"
            style={{
              fontSize: "clamp(32px, 6vw, 76px)",
              textShadow: "0 2px 20px rgba(0,0,0,0.6)",
            }}
          >
            WomensWear
          </h1>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="w-full pb-10" style={{ background: BG }}>
        <Marquee
          images={[
            "/images/womenswear/adornments_1.png",
            "/images/womenswear/adornments_2.jpg",
            "/images/heritage/mesh_woman.jpg",
            "/images/heritage/womens_heritage.jpg",
            "/images/womenswear/adornments_1.png",
            "/images/womenswear/adornments_2.jpg",
          ]}
          speed={45}
          direction="right"
        />
      </section>

      {/* Feature blocks: THE HERITAGE & THE INTERNATIONAL */}
      <section className="w-full flex flex-col items-center py-16 px-6 gap-24" style={{ background: BG }}>

        {/* Block 1: THE HERITAGE */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-full border border-[#431717]/15" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/images/womenswear/adornments_1.png"
              alt="The Heritage"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 90vw, 800px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <h2
                className="font-le-grand text-white tracking-[0.3em] uppercase"
                style={{
                  fontSize: "clamp(20px, 3.5vw, 38px)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                THE HERITAGE
              </h2>
            </div>
          </div>
          <p
            className="mt-8 uppercase tracking-[0.25em] text-xs sm:text-sm font-medium"
            style={{ color: "#431717" }}
          >
            L&apos; INDE ENTER HÉRITAGE ET AUTORITÉ
          </p>
          <div className="mt-6">
            <Link
              href="/heritage-jewelry"
              className="group relative inline-flex items-center justify-center px-12 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
              style={{ backgroundColor: "#431717" }}
            >
              <span className="relative z-10">EXPLORE</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
            </Link>
          </div>
        </div>

        {/* Block 2: THE INTERNATIONAL */}
        <div className="flex flex-col items-center text-center max-w-4xl w-full">
          <div className="relative overflow-hidden w-full border border-[#431717]/15" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/images/womenswear/adornments_2.jpg"
              alt="The International"
              fill
              className="object-cover object-center"
              sizes="(max-width:1024px) 90vw, 800px"
            />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <h2
                className="font-le-grand text-white tracking-[0.3em] uppercase"
                style={{
                  fontSize: "clamp(20px, 3.5vw, 38px)",
                  textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                }}
              >
                THE INTERNATIONAL
              </h2>
            </div>
          </div>
          <p
            className="mt-8 uppercase tracking-[0.25em] text-xs sm:text-sm font-medium"
            style={{ color: "#431717" }}
          >
            LA OU L&apos;INDE D&apos;HIER DIALOGUE AVEC L&apos;INDE D&apos;AUJOURD&apos;HUI
          </p>
          <div className="mt-6">
            <Link
              href="/womens-ready-to-wear"
              className="group relative inline-flex items-center justify-center px-12 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
              style={{ backgroundColor: "#431717" }}
            >
              <span className="relative z-10">EXPLORE</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}
