"use client";

import Container from "@/components/Container";
import Link from "next/link";
import Apostrophe from "@/components/Apostrophe";
import { useRef, useState } from "react";

const cities = [
  { name: "Mumbai", videoUrl: "/videos/location.mp4" },
  { name: "Delhi", videoUrl: "/videos/location.mp4" },
  { name: "Varanasi", videoUrl: "/videos/location.mp4" },
];

function VideoCard({ name, videoUrl }: { name: string; videoUrl: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="relative w-full h-52 sm:h-64 md:h-full overflow-hidden cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-reveal="slideUp"
    >
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-500 ${
          isHovered ? "opacity-0" : "opacity-70"
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <h3
          className={`text-white text-3xl md:text-5xl font-bold tracking-wider uppercase transition-opacity duration-500 ${
            isHovered ? "opacity-0" : "opacity-100"
          }`}
        >
          {name}
        </h3>
      </div>
    </div>
  );
}

export default function WorldOfSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      {/* Full-width joined videos (hero) */}
      <div className="w-[95%] mx-auto overflow-hidden">
        <div className="w-full flex flex-col md:flex-row md:h-[640px] lg:h-[780px]">
          {cities.map((city) => (
            <div key={city.name} className="w-full md:flex-1 min-w-0">
              <VideoCard name={city.name} videoUrl={city.videoUrl} />
            </div>
          ))}
        </div>
      </div>

      <Container>
        {/* Small centered label */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-black/70">
            WORLD OF D<Apostrophe /> LAVÉN
          </p>
        </div>

        {/* Center: headline + paragraph + upcoming locations */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest uppercase leading-tight" 
            data-reveal="slideUp" 
            data-delay="0.2"
          >
            FROM INDIA<Apostrophe />S SOUL TO THE WORLD STAGE
          </h2>
          
          <div className="mt-8" data-reveal="fade" data-delay="0.3">
            <p className="text-xs uppercase tracking-widest text-black/80 mb-3">
              Upcoming Locations
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                Mumbai 
              </div>
              <div className="flex items-center gap-2">
                Varanasi 
              </div>
              <div className="flex items-center gap-2">
                Delhi 
              </div>
            </div>
          </div>

          <p 
            className="mt-6 text-sm text-black/70 max-w-2xl mx-auto" 
            data-reveal="fade" 
            data-delay="0.4"
          >
            D<Apostrophe />LAVÉN destinations where heritage meets modern luxury.
            A journey from digital beginnings to timeless addresses. Our
            boutiques will soon open doors in iconic cities, bringing
            heritage craftsmanship and modern luxury under one roof.
          </p>

          <Link
            href="/world-of-d-laven"
            className="mt-8 inline-block text-[10px] uppercase tracking-wider border border-black/10 px-6 py-3 hover:bg-black hover:text-white transition-colors duration-300"
            data-reveal="slideUp"
            data-delay="0.6"
          >
            Discover Our Universe
          </Link>
        </div>
      </Container>
    </section>
  );
}
