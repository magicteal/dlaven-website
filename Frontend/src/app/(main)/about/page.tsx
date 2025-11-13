import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import RevealOnScroll from "@/components/RevealOnScroll";
import Apostrophe from "@/components/Apostrophe";

export default function AboutUsPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        {/* Image Collage Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-64 md:h-80">
          <RevealOnScroll>
            <div
              className="relative h-full w-full zoom-reveal"
              style={{ transitionDelay: "50ms" }}
            >
              <Image
                src="/images/rightVisual.png"
                alt="D'LAVÉN Lifestyle 1"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div
              className="relative h-full w-full zoom-reveal"
              style={{ transitionDelay: "150ms" }}
            >
              <Image
                src="/images/leftVisual.png"
                alt="D'LAVÉN Lifestyle 2"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </RevealOnScroll>
          <RevealOnScroll>
            <div
              className="relative h-full w-full zoom-reveal"
              style={{ transitionDelay: "250ms" }}
            >
              <Image
                src="/images/frangrence.png"
                alt="D'LAVÉN Fragrance"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </RevealOnScroll>
        </div>

        {/* About D'LAVÉN Section */}
        <div className="max-w-3xl mx-auto text-center mt-20 md:mt-24 py-6 md:py-8">
          <RevealOnScroll>
            <h1 className="zoom-reveal text-3xl font-bold tracking-widest uppercase text-black">
              ABOUT D<Apostrophe />LAVÉN
            </h1>
          </RevealOnScroll>
          <div className="mt-8 text-sm text-black/70 space-y-5">
            <RevealOnScroll>
              <p className="zoom-reveal" style={{ transitionDelay: "60ms" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </RevealOnScroll>
            <RevealOnScroll>
              <p className="zoom-reveal" style={{ transitionDelay: "120ms" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </RevealOnScroll>
            <RevealOnScroll>
              <p className="zoom-reveal" style={{ transitionDelay: "180ms" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry&apos;s standard
                dummy text ever since the 1500s.
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {/* May We Help You Section */}
        <div className="text-center mt-24 md:mt-28 py-16 md:py-20 bg-gray-50">
          <RevealOnScroll>
            <h2 className="zoom-reveal text-xl font-bold tracking-widest uppercase text-black">
              MAY WE HELP YOU?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <p
              className="zoom-reveal mt-4 text-sm text-black/70"
              style={{ transitionDelay: "90ms" }}
            >
              Find out everything you need to know about the D<Apostrophe />LAVÉN
            </p>
          </RevealOnScroll>
          <RevealOnScroll>
            <Link
              href="/contact"
              className="zoom-reveal mt-8 inline-block px-10 py-3.5 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
              style={{ transitionDelay: "180ms" }}
            >
              Contact Us
            </Link>
          </RevealOnScroll>
        </div>
      </Container>
    </main>
  );
}
