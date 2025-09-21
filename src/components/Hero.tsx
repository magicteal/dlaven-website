"use client";

import Image from "next/image";
import BrandText from "@/components/BrandText";

// Organism: Hero
export default function Hero() {
  return (
    <section className="relative w-full">
      {/* Background split - replace with your actual hero images if desired */}
      <div className="relative h-[70vh] min-h-[520px] w-full grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-full w-full">
          <Image
            src="/hero/left.jpg"
            alt="Left visual"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative hidden md:block h-full w-full">
          <Image
            src="/hero/right.jpg"
            alt="Right visual"
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Centered Brand Text */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <BrandText className="w-[72vw] max-w-[1000px] drop-shadow-[0_2px_20px_rgba(0,0,0,0.4)]" />
      </div>
    </section>
  );
}
