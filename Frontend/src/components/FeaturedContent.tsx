import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BG_IMAGE_LEFT =
  "/images/oneImg.png";
const BG_IMAGE_RIGHT =
  "/images/twoImg.png";

// This is the new component for the "DL PRIVÉ EDITION" section
export default function FeaturedContent() {
  return (
    <section className="relative w-full h-[70vh] text-white overflow-hidden my-40">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-1 sm:grid-cols-2 max-w-[95%] mx-auto">
        <div className="relative h-full w-full ">
          <Image
            src={BG_IMAGE_LEFT}
            alt="DL Privé background left"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative h-full w-full">
          <Image
            src={BG_IMAGE_RIGHT}
            alt="DL Barry background right"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Per-column clickable overlays with heading + button at bottom */}
      <div className="absolute inset-0 max-w-[95%] mx-auto grid grid-cols-1 sm:grid-cols-2 z-10">
        {/* Left box - DL PRIVE */}
        <Link
          href="/dl-prive"
          className="relative h-full w-full group overflow-hidden"
          aria-label="Go to DL Privé"
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-12">
            <h3
              className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-[0.2em] uppercase mb-4 sm:mb-6"
              style={{ letterSpacing: "0.15em" }}
            >
              DL PRIVÉ
            </h3>
            <div data-reveal="slideUp" data-delay="0.3">
              <span className="inline-block mt-4 px-6 py-2 text-xs sm:px-8 sm:py-3 sm:text-sm tracking-widest uppercase rounded-none border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                GET ACCESS
              </span>
            </div>
          </div>
        </Link>

        {/* Right box - DL BARRY */}
        <Link
          href="/dl-barry"
          className="relative h-full w-full group overflow-hidden"
          aria-label="Go to DL Barry"
        >
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-12">
            <h3
              className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-[0.2em] uppercase mb-4 sm:mb-6"
              style={{ letterSpacing: "0.15em" }}
            >
              DL BÉRRY
            </h3>
            <div data-reveal="slideUp" data-delay="0.3">
              <span className="inline-block mt-4 px-6 py-2 text-xs sm:px-8 sm:py-3 sm:text-sm tracking-widest uppercase rounded-none border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                GET ACCESS
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
