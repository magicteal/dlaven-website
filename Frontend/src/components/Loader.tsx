"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete?: () => void }) {
  const blackLayerRef = useRef<HTMLDivElement | null>(null);
  const greyLayerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);
  const [logoReady, setLogoReady] = useState(false);

  useEffect(() => {
    const fallbackTimer = window.setTimeout(() => setLogoReady(true), 1200);
    return () => window.clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    if (!logoReady) return;

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

    return () => {
      tl.kill();
    };
  }, [logoReady, onComplete]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={blackLayerRef}
        className="w-full h-screen bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={logoRef}
            className="will-change-transform mx-auto flex flex-col items-center justify-center text-center"
          >
            <img
              src="/logos/logo.svg"
              alt="D’ LAVÉN logo"
              width={280}
              height={140}
              decoding="sync"
              fetchPriority="high"
              onLoad={() => setLogoReady(true)}
              onError={() => setLogoReady(true)}
              className="h-auto w-[160px] max-w-[70vw] sm:w-[180px] lg:w-[220px]"
            />
            <p
              className="mt-6 text-[10px] sm:text-[8px] md:text-sm tracking-[0.4em] font-medium text-black text-center leading-relaxed px-4 whitespace-pre"
            >
              {"A JOURNEY FROM DIGITAL BEGINNINGS TO TIMELESS ADDRESSES"}
            </p>
          </div>
        </div>
      </div>

      <div
        ref={greyLayerRef}
        className="w-full absolute bottom-0 bg-white/20 backdrop-blur-md"
      />
    </div>
  );
}
