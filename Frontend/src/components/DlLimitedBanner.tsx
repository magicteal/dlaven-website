import Image from "next/image";
import Link from "next/link";

export default function DlLimitedBanner() {
  return (
    <section className="relative w-full bg-white py-8 sm:py-14 md:py-18 px-4 md:px-8">
      <div className="max-w-[95%] mx-auto">
        <Link
          href="/dl-fantome"
          className="relative group overflow-hidden w-full block shadow-sm border border-gray-100 bg-black"
          style={{ aspectRatio: "3966 / 1586", minHeight: "180px" }}
          aria-label="Go to DL Fantome"
        >
          <Image
            src="/images/fathom.svg"
            alt="DL Fantome"
            fill
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 group-hover:from-black/60 group-hover:via-black/15 transition-colors duration-500" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-4 sm:pb-8 md:pb-12 text-white">
            <h2 className="font-le-grand text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-normal tracking-[0.15em] uppercase mb-2 sm:mb-4 md:mb-6">
              DL FANTOME
            </h2>
            <div>
              <span className="inline-block px-5 py-2 sm:px-8 sm:py-3 md:px-10 md:py-3.5 text-[11px] sm:text-xs md:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                DISCOVER DL FANTOME
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
