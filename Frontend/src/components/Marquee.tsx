"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

interface MarqueeProps {
  images: string[];
  speed?: number;
  direction?: "left" | "right";
}

export default function Marquee({ images, speed = 40, direction = "right" }: MarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    let ctx = gsap.context(() => {
      const xPercent = direction === "right" ? 0 : -33.33;
      const xPercentStart = direction === "right" ? -33.33 : 0;

      gsap.fromTo(marqueeRef.current, 
        { xPercent: xPercentStart },
        {
          xPercent: xPercent,
          ease: "none",
          duration: speed,
          repeat: -1,
        }
      );
    }, marqueeRef);

    return () => ctx.revert();
  }, [direction, speed]);

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div 
        ref={marqueeRef}
        className="flex gap-4 md:gap-8 min-w-max"
      >
        {[...Array(3)].map((_, setIdx) => (
          images.map((img, idx) => (
            <div 
              key={`${img}-${setIdx}-${idx}`} 
              className="relative flex-shrink-0" 
              style={{ width: "clamp(250px, 30vw, 450px)", aspectRatio: "3/4" }}
            >
              <Image
                src={img}
                alt={`Marquee image ${idx}`}
                fill
                className="object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-[1.02]"
                sizes="(max-width:768px) 60vw, 30vw"
              />
            </div>
          ))
        ))}
      </div>
    </div>
  );
}
