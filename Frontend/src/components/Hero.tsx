"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Organism: Hero
export default function Hero() {
  const pathname = usePathname();

  useEffect(() => {
    // Only register ScrollTrigger on homepage
    if (typeof pathname === "undefined") return;
    if (pathname !== "/") return;
  }, [pathname]);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Two-column grid */}
      <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-2">

        {/* Left Section - Fashion & Accessories */}
        <div className="relative h-full w-full group cursor-pointer">
          <Image
            src="/images/fashion_hero.png"
            alt="Fashion & Accessories"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-white">
            <h2 className="text-2xl md:text-3xl mb-4 tracking-wide font-light">
              Fashion & Accessories
            </h2>
            <Link
              href="/categories/fashion-accessories"
              className="text-xs uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              Shop now
            </Link>
          </div>
        </div>

        {/* Right Section - Fragrance & Beauty */}
        <div className="relative h-full w-full group cursor-pointer">
          <Image
            src="/images/fragrance_hero.png"
            alt="Fragrance & Beauty"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/20 transition-colors duration-500" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-white">
            <h2 className="text-2xl md:text-3xl mb-4 tracking-wide font-light">
              Fragrance & Beauty
            </h2>
            <Link
              href="/fragrances"
              className="text-xs uppercase tracking-[0.2em] border-b border-white/40 pb-1 hover:border-white transition-colors"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
