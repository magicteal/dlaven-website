"use client";

import Image from "next/image";
import BrandText from "@/components/BrandText";

// Organism: Hero
export default function Hero() {
  return (
  <section className="relative w-full ">
      {/* Background split - replace with your actual hero images if desired */}
  <div className="relative h-96 md:h-screen w-full grid grid-cols-2 pointer-events-none">
        <div className="relative h-full w-full">
          <Image
            src="/images/leftVisual.png"
            alt="Left visual"
            fill
            className="object-cover object-top"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full w-full">
          <Image
            src="/images/rightVisual.png"
            alt="Right visual"
            fill
            className="object-cover object-top"
            sizes="50vw"
            
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
    </div>

    {/* Full-hero black film (50% opacity) - sits above images but below the BrandText/button */}
    <div className="absolute inset-0 bg-black/50 pointer-events-none" />

  {/* Centered Brand Text + CTA Button */}
  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-6 translate-y-12">
        <div data-reveal="scale" data-duration="1.2" data-delay="0.3">
          <BrandText className="w-[82vw] md:w-[40vw]  drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]" />
        </div>

        {/* CTA button - pointer-events-auto so it can be clicked despite parent being pointer-events-none */}
        <button
          type="button"
          aria-label="Explore collections"
          onClick={() => {
            const el = document.getElementById("main");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
          data-reveal="slideUp"
          data-duration="0.8"
          data-delay="0.8"
          className="pointer-events-auto inline-flex items-center justify-center bg-white text-black px-10 py-3 rounded-none text-sm md:text-base font-medium shadow-lg hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          Explore
        </button>
      </div>
    </section>
  );
}
