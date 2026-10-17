import Image from "next/image";
import Link from "next/link";

const BG_IMAGE_LEFT = "/images/prive.png";
const BG_IMAGE_RIGHT = "/images/berry.png";

export default function FeaturedContent() {
  return (
    <section className="relative w-full bg-white pb-12 sm:pb-16 md:pb-20 px-4 md:px-8 text-white">
      <div className="max-w-[95%] mx-auto">
        {/* Inset padded grid — width exactly matches DL Limited */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-h-[700px] md:min-h-0 md:h-[65vh] lg:h-[75vh]">

          {/* Left — DL PRIVÉ */}
          <Link
            href="/dl-prive"
            className="relative group overflow-hidden h-[360px] sm:h-[450px] md:h-full block shadow-sm border border-gray-100 bg-black"
            aria-label="Go to DL Privé"
          >
            <Image
              src={BG_IMAGE_LEFT}
              alt="DL Privé"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 group-hover:from-black/70 group-hover:via-black/25 transition-colors duration-500" />
            <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-8 md:pb-12 text-white">
              <h3 className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.15em] uppercase mb-4 sm:mb-6">
                DL PRIVÉ
              </h3>
              <div data-reveal="slideUp" data-delay="0.3">
                <span className="inline-block px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                  GET ACCESS
                </span>
              </div>
            </div>
          </Link>

          {/* Right — DL BÉRRY */}
          <Link
            href="/dl-berry"
            className="relative group overflow-hidden h-[360px] sm:h-[450px] md:h-full block shadow-sm border border-gray-100 bg-black"
            aria-label="Go to DL Bérry"
          >
            <Image
              src={BG_IMAGE_RIGHT}
              alt="DL Bérry"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-[center_60%] group-hover:scale-105 transition-transform duration-700 ease-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20 group-hover:from-black/70 group-hover:via-black/25 transition-colors duration-500" />
            <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-8 md:pb-12 text-white">
              <h3 className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.15em] uppercase mb-4 sm:mb-6">
                DL BÉRRY
              </h3>
              <div data-reveal="slideUp" data-delay="0.3">
                <span className="inline-block px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                  GET ACCESS
                </span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
