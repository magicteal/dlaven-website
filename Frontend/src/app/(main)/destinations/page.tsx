"use client";
import Container from "@/components/Container";
import Image from "next/image";
import AnimatedCities from "@/components/AnimatedCities";
import Apostrophe from "@/components/Apostrophe";

export default function DestinationsPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 h-[60vh] min-h-[400px]">
          <div className="relative h-full w-full">
            <Image
              src="/images/DL Destinations.jpg"
              alt="D'LAVÉN Destination 1"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="relative h-full w-full hidden md:block">
            <Image
              src="/images/dl-destinations-2.jpg"
              alt="D'LAVÉN Destination 2"
              fill
              className="object-cover object-center"
              sizes="50vw"
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 h-[60vh] min-h-[400px] bg-black/40" />
        <div className="relative z-10 p-4 h-[60vh] min-h-[400px] flex flex-col items-center justify-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest uppercase" data-reveal="scale" data-duration="1">
            D<Apostrophe />LAVÉN DESTINATIONS
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/90" data-reveal="fade" data-delay="0.2">
            Explore our exclusive boutiques and curated experiences around the
            world.
          </p>
        </div>
      </section>

      {/* Content and Cities Section */}
      <div className="py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold tracking-wider uppercase text-black" data-reveal="slideUp">
              A World of Luxury
            </h2>
            <div className="mt-6 text-sm text-black/70 space-y-4" data-reveal="fade" data-delay="0.2">
              <p>
                Each D<Apostrophe />LAVÉN destination is more than just a store; it is
                an immersion into a world of unparalleled craftsmanship and
                timeless elegance. Discover our architectural marvels and the
                stories they tell.
              </p>
              <p>
                Our client advisors await to offer you a personalized journey
                through our collections in our iconic locations.
              </p>
            </div>
          </div>

      {/* Cities List using the new animated component */}
          <div className="max-w-6xl mx-auto text-center mt-20">
            <h2 className="text-2xl font-semibold tracking-wider uppercase text-black mb-12" data-reveal="slideUp">
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
          <div className="lg:col-span-6 bg-white flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full">
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-wider uppercase mb-6">
                Unparalleled Craftsmanship
              </h2>
              <p className="text-base text-black/70 leading-relaxed mb-8">
                Step into a world where every detail is meticulously crafted. Our boutiques showcase
                the finest collections, where traditional artistry meets contemporary design. Experience
                luxury that transcends time.
              </p>
              <button className="px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300">
                Explore Collections
              </button>
            </div>
          </div>
        </div>

        {/* Section 2 - Content Left, Image Right */}
        <div className="sticky top-0 h-screen w-full flex flex-col lg:grid lg:grid-cols-12 z-20">
          <div className="lg:col-span-6 bg-[#F5F5F5] flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full">
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-wider uppercase mb-6">
                Timeless Elegance
              </h2>
              <p className="text-base text-black/70 leading-relaxed mb-8">
                Discover architectural marvels that house our most exclusive pieces. Each location
                tells a unique story, blending local heritage with global sophistication. Immerse yourself
                in an atmosphere of refined luxury.
              </p>
              <button className="px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300">
                Visit Our Stores
              </button>
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
          <div className="lg:col-span-6 bg-white flex flex-col items-center justify-center p-8 lg:p-16 h-1/2 lg:h-full w-full">
            <div className="max-w-lg w-full flex flex-col items-center text-center">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-wider uppercase mb-6">
                Personalized Journey
              </h2>
              <p className="text-base text-black/70 leading-relaxed mb-8">
                Our dedicated client advisors await to guide you through a bespoke experience.
                From custom creations to exclusive collections, discover pieces that resonate with
                your unique style and vision.
              </p>
              <button className="px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300">
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locator CTA */}
      <div className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="text-center">
            <h3 className="text-xl font-bold tracking-widest uppercase text-black">
              Find a Boutique
            </h3>
            <p className="mt-3 text-sm text-black/70">
              Locate your nearest D<Apostrophe />LAVÉN store to experience our world in
              person.
            </p>
            <button className="mt-6 inline-block px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white">
              Store Locator
            </button>
          </div>
        </Container>
      </div>
    </main>
  );
}
