"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

const cities = [
  { name: "Mumbai", image: "/images/DPrimeOne.jpg" },
  { name: "Delhi", image: "/images/dl-destinations-2.jpg" },
  { name: "Varanasi", image: "/images/DPrimeTwo.jpg" },
];

export default function AnimatedCities() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cityElements = containerRef.current?.children;
    if (cityElements) {
      gsap.fromTo(
        cityElements,
        { opacity: 0, y: 20 }, // Start state
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2, // Delay between each city's animation
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
    >
      {cities.map((city) => (
        <div key={city.name} className="opacity-0">
          <div className="relative w-full aspect-[3/4] mb-4 overflow-hidden">
            <Image
              src={city.image}
              alt={`${city.name} boutique`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <h3 className="text-lg tracking-widest uppercase text-black/80 text-center">
            {city.name}
          </h3>
        </div>
      ))}
    </div>
  );
}
