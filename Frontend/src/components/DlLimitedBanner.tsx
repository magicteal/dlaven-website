import Image from "next/image";
import Link from "next/link";

export default function DlLimitedBanner() {
  return (
    <section className="relative w-full bg-white py-12 sm:py-16 md:py-20 px-4 md:px-8">
      <div className="max-w-[95%] mx-auto">
        <Link
          href="/dlaven-limited"
          className="relative group overflow-hidden w-full h-[40vh] md:h-[50vh] min-h-[300px] block shadow-sm border border-gray-100"
          aria-label="Go to DL Limited"
        >
          <Image
            src="/images/DPrimeOne.jpg"
            alt="DL Limited"
            fill
            sizes="100vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
          <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-8 md:pb-12 text-white">
            <span className="text-xs md:text-sm uppercase tracking-[0.35em] font-light text-white/90 mb-2">
              LIMITED EDITIONS
            </span>
            <h2 className="font-le-grand text-4xl sm:text-6xl md:text-7xl font-normal tracking-[0.15em] uppercase mb-4 sm:mb-6">
              DL LIMITED
            </h2>
            <div>
              <span className="inline-block px-8 py-3 text-xs sm:px-10 sm:py-3.5 sm:text-sm tracking-widest uppercase border border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300">
                EXPLORE LIMITED
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
