"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// Organism: Hero
export default function Hero() {
  const [leftPaused, setLeftPaused] = useState(true);
  const [rightPaused, setRightPaused] = useState(true);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);

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

      {/* Centered Dlaven Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className=" px-8 py-4 md:px-12 md:py-6 shadow-2xl">
          <Image 
            src="/logos/logoText.svg" 
            alt="Dlaven"
            width={256}
            height={80}
            className="w-48 md:w-64 h-auto"
            priority
          />
        </div>
      </div>
    </section>
  );
}
