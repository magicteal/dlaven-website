"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Organism: Hero - Clean Single Image Banner without Text Overlay
export default function Hero() {
  const pathname = usePathname();

  useEffect(() => {
    // Only register ScrollTrigger on homepage
    if (typeof pathname === "undefined") return;
    if (pathname !== "/") return;
  }, [pathname]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#14161f]">
      {/* Single Full Width Pristine Hero Image */}
      <div className="relative h-full w-full group">
        <Image
          src="/images/hero_bg.png"
          alt="D' LAVÉN House of Luxury"
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          priority
          sizes="100vw"
        />
      </div>
    </section>
  );
}
