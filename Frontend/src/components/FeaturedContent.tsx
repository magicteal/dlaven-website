import Image from "next/image";
import Link from "next/link";

const BG_IMAGE_LEFT = "/images/oneImg.png";
const BG_IMAGE_RIGHT = "/images/twoImg.png";

export default function FeaturedContent() {
  return (
    <section className="relative w-full text-white" style={{ backgroundColor: "#6F3D24" }}>
      {/* Inset padded grid — background shows as frame */}
      <div className="px-[2.5%] pt-10 pb-10 grid grid-cols-2 gap-1" style={{ height: "80vh" }}>

        {/* Left — DL PRIVÉ */}
        <Link href="/dl-prive" className="relative group overflow-hidden" aria-label="Go to DL Privé">
          <Image
            src={BG_IMAGE_LEFT}
            alt="DL Privé"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-10">
            <h3 className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.15em] uppercase mb-4 sm:mb-6">
              DL PRIVÉ
            </h3>
            <div data-reveal="slideUp" data-delay="0.3">
              <span className="inline-block mt-2 px-6 py-2 text-xs sm:px-8 sm:py-3 sm:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                GET ACCESS
              </span>
            </div>
          </div>
        </Link>

        {/* Right — DL BÉRRY */}
        <Link href="/dl-barry" className="relative group overflow-hidden" aria-label="Go to DL Barry">
          <Image
            src={BG_IMAGE_RIGHT}
            alt="DL Barry"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-10">
            <h3 className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-[0.15em] uppercase mb-4 sm:mb-6">
              DL BÉRRY
            </h3>
            <div data-reveal="slideUp" data-delay="0.3">
              <span className="inline-block mt-2 px-6 py-2 text-xs sm:px-8 sm:py-3 sm:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                GET ACCESS
              </span>
            </div>
          </div>
        </Link>

      </div>
    </section>
  );
}
