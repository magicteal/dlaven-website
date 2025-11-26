"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Organism: Hero
export default function Hero() {
  const [leftPaused, setLeftPaused] = useState(true);
  const [rightPaused, setRightPaused] = useState(true);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = logoWrapperRef.current;
    const box = logoBoxRef.current;
    if (!wrapper || !box) return;

    const setup = () => {
      const target = document.getElementById("navbar-logo-target");
      if (!target) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cx = vw / 2;
      const cy = vh / 2; // center of viewport

      const tRect = target.getBoundingClientRect();
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;
      const deltaX = tx - cx;
      const deltaY = ty - cy;

      const logoRect = box.getBoundingClientRect();
      const scale = tRect.width > 0 ? tRect.width / logoRect.width : 0.5;

      gsap.set(wrapper, { x: 0, y: 0, scale: 1, filter: "invert(1)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: 0,
          end: 80,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(wrapper, { x: deltaX, y: deltaY, scale, ease: "none" }, 0)
        .to(wrapper, { filter: "invert(0) brightness(0)", ease: "none" }, 0);

      return tl;
    };

    let tl = setup();

    const onRefresh = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();
      tl = setup();
    };

    window.addEventListener("resize", onRefresh);
    ScrollTrigger.addEventListener("refreshInit", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onRefresh);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Two-column grid */}
      <div className="relative h-full w-full grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Section - Fashion & Accessories */}
        <div 
          className="relative h-full w-full group cursor-pointer"
          onMouseEnter={() => {
            if (leftVideoRef.current && leftPaused) {
              leftVideoRef.current.play();
              setLeftPaused(false);
            }
          }}
          onMouseLeave={() => {
            if (leftVideoRef.current && !leftPaused) {
              leftVideoRef.current.pause();
              setLeftPaused(true);
            }
          }}
        >
          <video
            ref={leftVideoRef}
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/dummyVideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/80 group-hover:bg-transparent transition-colors duration-300" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-white">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-wide">
              Fashion & Accessories
            </h2>
            <Link 
              href="/categories/fashion-accessories"
              className="text-sm md:text-base underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              Shop now
            </Link>
          </div>

          
        </div>

        {/* Right Section - Fragrance & Beauty */}
        <div 
          className="relative h-full w-full group cursor-pointer"
          onMouseEnter={() => {
            if (rightVideoRef.current && rightPaused) {
              rightVideoRef.current.play();
              setRightPaused(false);
            }
          }}
          onMouseLeave={() => {
            if (rightVideoRef.current && !rightPaused) {
              rightVideoRef.current.pause();
              setRightPaused(true);
            }
          }}
        >
          <video
            ref={rightVideoRef}
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/dummyVideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/80 group-hover:bg-transparent transition-colors duration-300" />
          
          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 md:pb-24 text-white">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 tracking-wide">
              Fragrance & Beauty
            </h2>
            <Link 
              href="/fragrances"
              className="text-sm md:text-base underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              Shop now
            </Link>
          </div>

          
        </div>
      </div>

      {/* Moving Dlaven Logo (fixed at center, animates to navbar) */}
      <div
        ref={logoWrapperRef}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[60]"
        aria-hidden
      >
        <div ref={logoBoxRef} className="w-[360px] md:w-[520px]">
          <Image
            src="/logos/logoText.svg"
            alt="Dlaven"
            width={256}
            height={80}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
