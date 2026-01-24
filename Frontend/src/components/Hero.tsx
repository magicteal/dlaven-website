"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Organism: Hero
export default function Hero() {
  const pathname = usePathname();
  const [leftPaused, setLeftPaused] = useState(true);
  const [rightPaused, setRightPaused] = useState(true);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Guard: wait until pathname is defined, then only enable on homepage
    if (typeof pathname === "undefined") return;
    if (pathname !== "/") return;
    gsap.registerPlugin(ScrollTrigger);

    const wrapper = logoWrapperRef.current;
    const box = logoBoxRef.current;
    if (!wrapper || !box) return;

    const setup = () => {
      const target = document.getElementById("navbar-logo-target");
      if (!target) return;

      const tRect = target.getBoundingClientRect();
      const tx = tRect.left + tRect.width / 2;
      const ty = tRect.top + tRect.height / 2;

      // compute current wrapper center (accounts for any existing CSS positioning)
      const wRect = wrapper.getBoundingClientRect();
      const wx = wRect.left + wRect.width / 2;
      const wy = wRect.top + wRect.height / 2;

      // delta to move wrapper center to target center
      const deltaX = tx - wx;
      const deltaY = ty - wy;

      const logoRect = box.getBoundingClientRect();
      // Compute a target dock width (px) for the navbar so the logo's "font" appears smaller
      const vw = window.innerWidth;
      let desiredDockWidth = 140;
      if (vw < 380) desiredDockWidth = 80;
      else if (vw < 480) desiredDockWidth = 100;
      else if (vw < 640) desiredDockWidth = 110;
      else if (vw < 768) desiredDockWidth = 120;
      else if (vw < 1024) desiredDockWidth = 130;
      else desiredDockWidth = 140;

      // Use the navbar target width if it's smaller than our desired dock width
      const finalDockWidth = Math.min(tRect.width || desiredDockWidth, desiredDockWidth);
      const scale = logoRect.width > 0 ? finalDockWidth / logoRect.width : 0.2;

        // Start with inverted (white) logo in hero
        // Use xPercent/yPercent to center via GSAP (avoid mixing CSS translate and GSAP transforms)
        gsap.set(wrapper, { x: 0, y: 0, scale: 1, xPercent: -50, yPercent: -50 });

      // Snap behavior with smooth tween both ways
      let settled = false;
      let tween: gsap.core.Tween | null = null;

      const animateDock = () => {
        tween?.kill();
        tween = gsap.to(wrapper, {
          x: deltaX,
          y: deltaY,
          scale,
          filter: "invert(1) brightness(1)",
          duration: 0.8,
          ease: "power2.out",
        });
      };

      const animateHome = () => {
        tween?.kill();
        tween = gsap.to(wrapper, {
          x: 0,
          y: 0,
          scale: 1,
          filter: "invert(0) brightness(1)",
          duration: 0.8,
          ease: "power2.out",
        });
      };

      const onSmallScroll = () => {
        if (window.scrollY > 8 && !settled) {
          settled = true;
          animateDock();
        } else if (window.scrollY <= 8 && settled) {
          settled = false;
          animateHome();
        }
      };
      window.addEventListener("scroll", onSmallScroll, { passive: true });

      return {
        kill: () => {
          window.removeEventListener("scroll", onSmallScroll);
          tween?.kill();
        },
      } as { kill: () => void };
    };

    let tl = setup();

    const onRefresh = () => {
      tl?.kill?.();
      tl = setup();
    };

    window.addEventListener("resize", onRefresh);
    ScrollTrigger.addEventListener("refreshInit", onRefresh);
    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("resize", onRefresh);
      ScrollTrigger.removeEventListener("refreshInit", onRefresh);
      tl?.kill?.();
    };
  }, [pathname]);

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
            <h2 className="text-2xl md:text-3xl mb-4 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Fashion & Accessories
            </h2>
            <Link 
              href="/categories/fashion-accessories"
              className="text-xs underline underline-offset-4 hover:opacity-75 transition-opacity"
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
            <h2 className="text-2xl md:text-3xl mb-4 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Fragrance & Beauty
            </h2>
            <Link 
              href="/fragrances"
              className="text-xs  underline underline-offset-4 hover:opacity-75 transition-opacity"
            >
              Shop now
            </Link>
          </div>

          
        </div>
      </div>

      {/* Moving Dlaven Logo (fixed at center, animates to navbar) */}
      <div
        ref={logoWrapperRef}
        className="fixed left-1/2 top-[49%] md:top-[35%] pointer-events-none z-[60]"
        aria-hidden
      >
        <div
          ref={logoBoxRef}
          className="w-[92vw] sm:w-[82vw] md:w-[72vw] lg:w-[62vw] max-w-[1080px]"
        >
          <Image
            src="/logos/logoText.svg"
            alt="Dlaven"
            width={1080}
            height={240}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
