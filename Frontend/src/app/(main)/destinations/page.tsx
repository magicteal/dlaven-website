"use client";
import Container from "@/components/Container";
import Image from "next/image";
import AnimatedCities from "@/components/AnimatedCities";
import Apostrophe from "@/components/Apostrophe";
import Link from "next/link";

export default function DestinationsPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-36 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center text-center text-white mb-16">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 h-[55vh] min-h-[380px]">
          <div className="relative h-full w-full">
            <Image
              src="/images/DPrimeOne.jpg"
              alt="D'LAVÉN Destination 1"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative h-full w-full hidden md:block">
            <Image
              src="/images/DPrimeTwo.jpg"
              alt="D'LAVÉN Destination 2"
              fill
              className="object-cover object-center"
              sizes="50vw"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 h-[55vh] min-h-[380px] bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        <div className="relative z-10 p-6 h-[55vh] min-h-[380px] flex flex-col items-center justify-center">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E2DDD7] mb-2 font-medium">
            Flagship Boutiques & Salons
          </p>
          <h1 className="font-le-grand text-3xl sm:text-5xl md:text-6xl font-normal tracking-widest uppercase text-white" data-reveal="scale">
            D<Apostrophe />LAVÉN DESTINATIONS
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xs sm:text-sm text-[#E2DDD7]/90 leading-relaxed" data-reveal="fade" data-delay="0.2">
            Explore our exclusive private boutiques and curated luxury experiences around the world.
          </p>
        </div>
      </section>

      {/* Content and Cities Section */}
      <div className="pb-16 sm:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase"
              style={{ color: "#431717" }}
              data-reveal="slideUp"
            >
              A World of Luxury
            </h2>
            <div className="h-px w-16 mx-auto my-6" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />
            <div className="mt-6 text-xs sm:text-sm leading-relaxed space-y-4" style={{ color: "#431717", opacity: 0.8 }} data-reveal="fade" data-delay="0.2">
              <p>
                Each D<Apostrophe />LAVÉN destination is more than just a store; it is an immersion into a world of unparalleled craftsmanship and timeless elegance. Discover our architectural marvels and the stories they tell.
              </p>
              <p>
                Our private client advisors await to offer you a personalized journey through our collections in our iconic locations.
              </p>
            </div>
          </div>

          {/* Cities List using animated component */}
          <div className="max-w-6xl mx-auto text-center mt-20">
            <h2
              className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase mb-12"
              style={{ color: "#431717" }}
              data-reveal="slideUp"
            >
              Iconic Locations
            </h2>
            <AnimatedCities />
          </div>
        </Container>
      </div>

      {/* Parallax Section - Stacking Effect */}
      <section className="relative h-[300vh] w-full">
        {/* Section 1 - Image Left, Content Right */}
        <div className="sticky top-0 h-screen w-full flex flex-col lg:grid lg:grid-cols-12 z-10">
          <div className="lg:col-span-6 h-1/2 lg:h-full w-full relative">
            <Image
              src="/images/DPrimeOne.jpg"
              alt="Luxury Experience"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full" style={{ backgroundColor: "#F6F4E6" }}>
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase mb-6" style={{ color: "#431717" }}>
                Unparalleled Craftsmanship
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-8" style={{ color: "#431717", opacity: 0.8 }}>
                Step into a world where every detail is meticulously crafted. Our boutiques showcase the finest collections, where traditional artistry meets contemporary design. Experience luxury that transcends time.
              </p>
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10">Explore Collections</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2 - Content Left, Image Right */}
        <div className="sticky top-0 h-screen w-full flex flex-col lg:grid lg:grid-cols-12 z-20">
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full" style={{ backgroundColor: "#EFECE0" }}>
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase mb-6" style={{ color: "#431717" }}>
                Timeless Elegance
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-8" style={{ color: "#431717", opacity: 0.8 }}>
                Discover architectural marvels that house our most exclusive pieces. Each location tells a unique story, blending local heritage with global sophistication. Immerse yourself in an atmosphere of refined luxury.
              </p>
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10">Visit Our Salons</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 h-1/2 lg:h-full w-full relative">
            <Image
              src="/images/DPrimeOne.jpg"
              alt="Timeless Design"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Section 3 - Image Left, Content Right */}
        <div className="sticky top-0 h-screen w-full flex flex-col lg:grid lg:grid-cols-12 z-30">
          <div className="lg:col-span-6 h-1/2 lg:h-full w-full relative">
            <Image
              src="/images/DPrimeTwo.jpg"
              alt="Personalized Service"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full" style={{ backgroundColor: "#F6F4E6" }}>
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase mb-6" style={{ color: "#431717" }}>
                Personalized Journey
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed mb-8" style={{ color: "#431717", opacity: 0.8 }}>
                Our dedicated client advisors await to guide you through a bespoke experience. From custom creations to exclusive collections, discover pieces that resonate with your unique style and vision.
              </p>
              <Link
                href="/contact"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10">Book Appointment</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator CTA */}
      <div className="py-16 sm:py-20" style={{ backgroundColor: "rgba(255,255,255,0.45)", borderTop: "1px solid rgba(67,23,23,0.12)" }}>
        <Container>
          <div className="text-center">
            <h3 className="font-le-grand text-xl sm:text-2xl font-normal tracking-widest uppercase" style={{ color: "#431717" }}>
              Find a Boutique
            </h3>
            <p className="mt-3 text-xs sm:text-sm" style={{ color: "#431717", opacity: 0.75 }}>
              Locate your nearest D<Apostrophe />LAVÉN store to experience our world in person.
            </p>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center mt-6 px-8 py-3 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
              style={{ backgroundColor: "#431717" }}
            >
              <span className="relative z-10">Store Locator</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
            </Link>
          </div>
        </Container>
      </div>
    </main>
  );
}
