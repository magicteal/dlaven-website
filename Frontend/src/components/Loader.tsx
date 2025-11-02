"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const blackLayerRef = useRef<HTMLDivElement | null>(null);
  const greyLayerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (typeof onComplete === "function") onComplete();
      },
    });

    // 1) Logo appears small -> big
    tl.from(logoRef.current, {
      scale: 0.6,
      opacity: 0,
      delay: 0.4,
      duration: 1,
      ease: "power3.out",
    })
      // 2) Black layer collapses to reveal page
      .to(blackLayerRef.current, {
        height: 0,
        duration: 2,
        ease: "circ.inOut",
      })
      // 3) Grey sweep layer expands then collapses for a loading sweep effect
      .to(
        greyLayerRef.current,
        {
          height: "100%",
          duration: 2,
          ease: "circ.inOut",
        },
        "-=2"
      )
      .to(
        greyLayerRef.current,
        {
          height: "0%",
          duration: 1,
          ease: "circ.inOut",
        },
        "-=0.3"
      )
      // hide logo and layers immediately before the onComplete callback so nothing lingers
      .set(logoRef.current, { autoAlpha: 0 })
      .set(blackLayerRef.current, { display: "none" })
      .set(greyLayerRef.current, { display: "none" });
  }, [onComplete]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={blackLayerRef}
        className="w-full h-screen bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div ref={logoRef} className="will-change-transform inline-block">
            <Image
              src="/logos/logoBlack.svg"
              alt="D’ LAVÉN logo"
              width={480}
              height={480}
              priority
              className="w-[42vw] max-w-[480px] h-auto"
            />
          </div>
        </div>
      </div>

      <div
        ref={greyLayerRef}
        className="w-full absolute bottom-0 bg-[#9ca3af]"
      />
    </div>
  );
}
