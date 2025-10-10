"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const cities = ["Mumbai", "Delhi", "Varanasi"];

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
      className="grid grid-cols-3 gap-x-4 gap-y-6 text-black/80"
    >
      {cities.map((city) => (
        <div key={city} className="text-lg tracking-widest uppercase opacity-0">
          {city}
        </div>
      ))}
    </div>
  );
}
