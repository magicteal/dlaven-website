import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Heritage Privé | D' LAVÉN",
  description: "A return to the highest form of Indian craftsmanship — D' LAVÉN Heritage Privé.",
};

const POPPINS = `var(--font-poppins), sans-serif`;
const BG = "#f5f0e8";

export default function HeritagePrivePage() {
  return (
    <main style={{ background: BG }}>

      {/* ── Section 0: Split Hero ── */}
      <section className="relative w-full grid grid-cols-2" style={{ height: "65vh", minHeight: "400px" }}>
        <div className="relative overflow-hidden border-r border-black/5">
          <Image
            src="/images/heritage/prive_left.jpg"
            alt="Heritage Privé Left"
            fill
            className="object-cover object-center grayscale"
            sizes="50vw"
            priority
          />
        </div>
        <div className="relative overflow-hidden">
          <Image
            src="/images/heritage/prive_right.jpg"
            alt="Heritage Privé Right"
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
            L&apos; INDE enter heritage et autorite jewellery is a return to the highest form of Indian craftsmanship. It is a commitment to conserving and celebrating India&apos;s ancient jewellery crafts and techniques.
          </p>
        </div>
      </section>

      {/* ── Section 1: The Deconstructed Universe Necklace ── */}
      <section className="w-full flex flex-col items-center py-20 px-6 gap-12 sm:gap-16">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 w-full max-w-6xl">
          <div className="relative w-[300px] h-[350px] sm:w-[400px] sm:h-[500px]">
             <Image
                src="/images/heritage/necklace_velvet.png"
                alt="Velvet Necklace"
                fill
                className="object-contain"
             />
          </div>
          <div className="relative w-[300px] h-[350px] sm:w-[400px] sm:h-[500px] overflow-hidden">
             <Image
                src="/images/heritage/mesh_woman.jpg"
                alt="Mesh Woman"
                fill
                className="object-cover object-center"
             />
          </div>
        </div>

        <div className="max-w-3xl text-center space-y-6">
            <h2 className="uppercase tracking-[0.2em] text-[15px] sm:text-[18px] font-medium" style={{ fontFamily: POPPINS }}>
                THE DECONSTRUCTED UNIVERSE NECKLACE
            </h2>
            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS }}>
                D&apos; LAVEN reinterprets the royal jadau necklaces of India. These historic handcrafted necklaces adorned the ancient royals and aristocrats. The threaded rope clasp or &lsquo;sarafa&rsquo; has been transformed into a broad sash in D&apos; LAVEN iconic printed velvets. While a more contemporary frame layers together precious gemstones with handcrafted techniques and legacy crafts.
            </p>
            <div className="pt-4">
                <button className="px-10 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[10px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: POPPINS }}>
                    EXPLORE
                </button>
            </div>
        </div>
      </section>

      {/* ── Section 2: Reinterpreting Jadau ── */}
      <section className="w-full flex flex-col items-center py-24 px-6 bg-white/5">
        <div className="relative w-[320px] h-[320px] sm:w-[500px] sm:h-[500px]">
           <Image
              src="/images/heritage/jadau_circular.png"
              alt="Jadau Necklace"
              fill
              className="object-contain"
           />
        </div>
        <div className="max-w-3xl text-center space-y-6 mt-12">
            <h2 className="uppercase tracking-[0.2em] text-[15px] sm:text-[18px] font-medium" style={{ fontFamily: POPPINS }}>
                REINTERPRETING JADAU
            </h2>
            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS }}>
                There is something so rustic yet sophisticated about jadau that it lends itself to the traditional, as much as the contemporary. An age-old craft, jadau was introduced to India by the Mughals, and perfected by the artisans of Rajasthan. A painstaking artisanal endeavour, setting a single stone can begin at sunrise and end at sunset.
            </p>
            <div className="pt-4">
                <button className="px-10 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[10px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: POPPINS }}>
                    EXPLORE
                </button>
            </div>
        </div>
      </section>

      {/* ── Section 3: Fine Bengal Filigree ── */}
      <section className="w-full flex flex-col items-center py-24 px-6">
        <div className="grid grid-cols-2 gap-4 max-w-4xl w-full">
            <div className="relative aspect-square">
                <Image src="/images/heritage/filigree_1.jpg" alt="Filigree Editorial 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-square">
                <Image src="/images/heritage/filigree_2.jpg" alt="Filigree Editorial 2" fill className="object-cover" />
            </div>
        </div>
        <div className="max-w-xl text-center space-y-6 mt-12 mx-auto">
            <h2 className="uppercase tracking-[0.2em] text-[15px] sm:text-[18px] font-medium" style={{ fontFamily: POPPINS }}>
                FINE BENGAL FILIGREE
            </h2>
            <p className="text-[12px] sm:text-[13px] leading-[1.8] opacity-80" style={{ fontFamily: POPPINS }}>
                An ancient traditional craft form, fine Bengal filigree has been passed down from one generation to the next. The practice is not just a lifetime commitment but a way of life.
            </p>
            <div className="pt-4">
                <button className="px-10 py-3 bg-[#ccc] hover:bg-[#bbb] transition-colors text-[10px] tracking-[0.2em] uppercase font-medium" style={{ fontFamily: POPPINS }}>
                    EXPLORE
                </button>
            </div>
        </div>
      </section>

      {/* ── Section 4: Vertical Grid ── */}
      <section className="w-full px-4 sm:px-12 py-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-7xl mx-auto">
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/heritage/editorial_1.jpg" alt="Editorial Grid 1" fill className="object-cover" />
            </div>
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/heritage/editorial_2.jpg" alt="Editorial Grid 2" fill className="object-cover" />
            </div>
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image src="/images/heritage/editorial_3.jpg" alt="Editorial Grid 3" fill className="object-cover" />
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
