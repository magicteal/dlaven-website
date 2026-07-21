import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import Apostrophe from "@/components/Apostrophe";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen pt-32 sm:pt-36 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        {/* Image Collage Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-64 md:h-80" data-reveal="scale" data-stagger="0.15">
          <div className="relative h-full w-full border border-[#431717]/10 overflow-hidden">
            <Image
              src="/images/rightVisual.png"
              alt="D'LAVÉN Lifestyle 1"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-full w-full border border-[#431717]/10 overflow-hidden">
            <Image
              src="/images/leftVisual.png"
              alt="D'LAVÉN Lifestyle 2"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-full w-full border border-[#431717]/10 overflow-hidden">
            <Image
              src="/images/frangrence.png"
              alt="D'LAVÉN Fragrance"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        </div>

        {/* About D'LAVÉN Section */}
        <div className="max-w-3xl mx-auto text-center mt-20 md:mt-24 py-6 md:py-8">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: "#6F3D24" }}>
            The House of D&apos; Lavén
          </p>
          <h1
            className="font-le-grand text-3xl sm:text-5xl font-normal tracking-widest uppercase"
            style={{ color: "#431717" }}
            data-reveal="slideUp"
          >
            ABOUT D<Apostrophe />LAVÉN
          </h1>
          <div
            className="h-px w-16 mx-auto my-6"
            style={{ backgroundColor: "rgba(111,61,36,0.3)" }}
          />
          <div
            className="mt-6 text-xs sm:text-sm leading-relaxed space-y-5"
            style={{ color: "#431717", opacity: 0.8 }}
            data-reveal="slideUp"
            data-stagger="0.15"
            data-delay="0.2"
          >
            <p>
              D&apos; Lavén represents the intersection of timeless heritage craftsmanship and modern luxury design. Born from a passion for refined aesthetics, our house creates pieces that transcend seasonal trends.
            </p>
            <p>
              Each garment, jewelry piece, and fragrance is meticulously crafted using exceptional materials sourced from global artisans. From our private Privé editions to everyday adornments, we uphold the highest standards of luxury.
            </p>
            <p>
              Welcome to an invitation-only experience of elegance, bespoke services, and enduring sophistication.
            </p>
          </div>
        </div>

        {/* May We Help You Section */}
        <div
          className="text-center mt-20 md:mt-24 py-16 md:py-20 p-8 transition-all"
          style={{
            backgroundColor: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(67,23,23,0.12)",
          }}
        >
          <h2
            className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase"
            style={{ color: "#431717" }}
            data-reveal="slideUp"
          >
            MAY WE HELP YOU?
          </h2>
          <p
            className="mt-4 text-xs sm:text-sm max-w-md mx-auto"
            style={{ color: "#431717", opacity: 0.75 }}
            data-reveal="slideUp"
            data-delay="0.15"
          >
            Find out everything you need to know about D<Apostrophe />LAVÉN services and client care.
          </p>
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center mt-8 px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
            style={{ backgroundColor: "#431717" }}
            data-reveal="slideUp"
            data-delay="0.3"
          >
            <span className="relative z-10">Contact Us</span>
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "#6F3D24" }}
            />
          </Link>
        </div>
      </Container>
    </main>
  );
}
