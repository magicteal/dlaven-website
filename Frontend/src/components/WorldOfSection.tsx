"use client";

import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";
import Apostrophe from "@/components/Apostrophe";

const cities = [
  { name: "Mumbai", imageSrc: "/images/mumbai.svg" },
  { name: "Delhi", imageSrc: "/images/delhi.svg" },
  { name: "Varanasi", imageSrc: "/images/varanasi.svg" },
];

function CityCard({ name, imageSrc }: { name: string; imageSrc: string }) {
  return (
    <div className="relative w-full aspect-[1874/3356] overflow-hidden cursor-pointer group">
      <Image
        src={imageSrc}
        alt={`${name} Destination`}
        fill
        unoptimized
        priority
        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    </div>
  );
}

export default function WorldOfSection() {
  return (
    <section className="pb-16 sm:pb-20" style={{ backgroundColor: "#6F3D24" }}>
      {/* Inset padded images — full aspect ratio with no cropping */}
      <div className="px-[2.5%] pt-8 sm:pt-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-[95%] mx-auto">
          {cities.map((city) => (
            <div key={city.name} className="w-full min-w-0 overflow-hidden">
              <CityCard name={city.name} imageSrc={city.imageSrc} />
            </div>
          ))}
        </div>
      </div>

      <Container>
        {/* Small centered label */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest mt-10" style={{ color: "#F6F4E6", opacity: 0.7 }}>
            D<Apostrophe /> LAVÉN D ESTINATIONS, WHERE HERITAGE MEETS MODERN LUXURY
          </p>
        </div>

        {/* Center: headline + paragraph + upcoming locations */}
        <div className="mt-10 max-w-full mx-auto text-center">
          <h2
            className="font-le-grand text-3xl md:text-4xl lg:text-5xl font-normal tracking-widest uppercase leading-tight"
            style={{ color: "#F6F4E6" }}
          >
            A JOURNEY FROM DIGITAL BEGINNINGS TO TIMELESS ADDRESSES
          </h2>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#F6F4E6", opacity: 0.8 }}>
              Upcoming Locations
            </p>
            <div className="flex items-center justify-center gap-6 text-sm" style={{ color: "#F6F4E6" }}>
              <div className="flex items-center gap-2">Mumbai</div>
              <div className="flex items-center gap-2">Varanasi</div>
              <div className="flex items-center gap-2">Delhi</div>
            </div>
          </div>

          <p
            className="mt-6 text-sm max-w-2xl mx-auto"
            style={{ color: "#F6F4E6", opacity: 0.75 }}
          >
            FROM INDIA<Apostrophe />S SOUL TO THE WORLD STAGE, D LAVÉN IS EXPANDING ITS UNIVERSE. SOON, OUR BOUTIQUES WILL OPEN DOORS IN ICONIC CITIES, BRINGING HERITAGE CRAFTSMANSHIP AND MODERN LUXURY UNDER ONE ROOF.
          </p>

          <Link
            href="/world-of-d-laven"
            className="mt-8 inline-block text-[10px] uppercase tracking-wider px-6 py-3 transition-colors duration-300 border border-[#F6F4E6] text-[#F6F4E6] hover:bg-[#F6F4E6] hover:text-[#6F3D24]"
          >
            Discover Our Universe
          </Link>
        </div>
      </Container>
    </section>
  );
}
