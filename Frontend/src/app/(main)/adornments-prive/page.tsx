import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Marquee from "@/components/Marquee";

export const metadata: Metadata = {
  title: "Adornments Privé | D' LAVÉN",
  description: "A refined exploration of D' LAVÉN Adornments — where heritage meets authority.",
};

const POPPINS = `var(--font-poppins), sans-serif`;
const BG = "#f5f0e8";

export default function AdornmentsPrivePage() {
  return (
    <main style={{ background: BG }}>

      {/* ── Split Hero: Two Black and White images ── */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "65vh", minHeight: "400px" }}>
        <div className="relative overflow-hidden border-r border-black/5">
          <Image
            src="/images/prive-adornments/hero_left.jpg"
            alt="Adornments Privé Left"
            fill
            className="object-cover object-center grayscale"
            sizes="50vw"
            priority
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/prive-adornments/hero_right.jpg"
            alt="Adornments Privé Right"
            fill
            className="object-cover object-center grayscale"
            sizes="50vw"
            priority
          />
        </div>
      </section>

      {/* ── Mission Statement Section ── */}
      <section className="w-full flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-3xl">
          <p className="text-[13px] sm:text-[14px] leading-[2] tracking-[0.02em] text-[#1a1a1a] opacity-90 mx-auto" style={{ fontFamily: POPPINS, maxWidth: "700px" }}>
            L&apos; INDE enter heritage et autorite adornments represent a return to the highest form of Indian craftsmanship. It is a commitment to conserving and celebrating India&apos;s ancient adornment crafts and techniques.
          </p>
        </div>
      </section>

       {/* ── Featured Medallion Section ── */}
       <section className="w-full flex flex-col items-center py-24 px-6 bg-white/5">
        <div className="relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px]">
           <Image
              src="/images/prive-adornments/medallion.png"
              alt="Adornments Medallion"
              fill
              className="object-contain"
           />
        </div>
        <div className="max-w-3xl text-center space-y-6 mt-12">
            <h2 className="uppercase tracking-[0.2em] text-[15px] sm:text-[18px] font-medium" style={{ fontFamily: POPPINS }}>
                ROYAL ADORNMENTS
            </h2>
            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS }}>
                There is something so rustic yet sophisticated about Indian adornments that it lends itself to the traditional, as much as the contemporary. An age-old craft, these pieces were introduced to India through historical exchange and perfected by regional artisans. A painstaking artisanal endeavour, crafting a single medallion can begin at sunrise and end at sunset.
            </p>
            <div className="pt-4">
                <button className="px-10 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[10px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: POPPINS }}>
                    EXPLORE
                </button>
            </div>
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

      {/* ── Editorial Grid ── */}
      <section className="w-full px-4 sm:px-12 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/prive-adornments/editorial_1.jpg" alt="Editorial 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/prive-adornments/editorial_2.jpg" alt="Editorial 2" fill className="object-cover" />
            </div>
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/prive-adornments/editorial_3.jpg" alt="Editorial 3" fill className="object-cover" />
            </div>
        </div>
      </section>

      {/* ── Final Branding ── */}
      <section className="flex flex-col items-center pb-32">
          <div className="relative mx-auto" style={{ width: 140, height: 100 }}>
              <Image src="/logos/logoBlack.png" alt="D' LAVÉN" fill className="object-contain" />
          </div>
          <p className="uppercase tracking-[0.3em] text-[8px] mt-2 opacity-60" style={{ fontFamily: POPPINS }}>
              SINCE 2023
          </p>
          <div className="mt-20">
            <Link
                href="/prive-jewellery"
                className="inline-flex items-center justify-center px-10 py-3 border border-black/10 text-[9px] tracking-[0.3em] uppercase hover:bg-black hover:text-white transition-all duration-500"
                style={{ fontFamily: POPPINS }}
            >
                ← BACK TO COLLECTIONS
            </Link>
          </div>
      </section>
    </main>
  );
}
