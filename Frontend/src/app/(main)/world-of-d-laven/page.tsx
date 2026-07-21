import Head from "next/head";
import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";
import Apostrophe from "@/components/Apostrophe";

export default function WorldOfDlavenPage() {
  return (
    <>
      <Head>
        <title>World of D&apos;LAVÉN — D&apos;LAVÉN</title>
        <meta
          name="description"
          content="Explore the world of D'LAVÉN — heritage, craft and the present of luxury."
        />
      </Head>

      <main className="min-h-screen pb-24" style={{ backgroundColor: "#F6F4E6" }}>
        {/* Hero */}
        <section className="relative h-[75vh] sm:h-[85vh] min-h-[500px] w-full flex items-center justify-center text-center text-white overflow-hidden mb-16">
          <div className="absolute inset-0">
            <Image
              src="/images/dl-service-bg.jpg"
              alt="World of D'LAVÉN hero"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          </div>

          <div className="relative z-10 px-6 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-[#E2DDD7] font-medium" data-reveal="fade">
              Experience Unrivaled Heritage
            </p>

            <h1 className="mt-4 font-le-grand text-4xl sm:text-6xl font-normal tracking-widest uppercase leading-tight text-white" data-reveal="scale">
              WORLD OF D<Apostrophe />LAVÉN
            </h1>

            <p className="mt-6 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#E2DDD7]/90" data-reveal="fade" data-delay="0.4">
              An immersion into craft, provenance and the present of D&apos;LAVÉN.
            </p>

            <div className="mt-8 flex items-center justify-center gap-4 flex-wrap" data-reveal="slideUp" data-delay="0.6">
              <Link
                href="/products"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10">Explore Collections</span>
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
              </Link>

              <Link
                href="/contact"
                className="inline-block px-8 py-3.5 border border-white/80 text-xs uppercase tracking-[0.25em] font-medium text-white hover:bg-white hover:text-[#431717] transition-colors duration-300"
              >
                Contact an Advisor
              </Link>
            </div>
          </div>
        </section>

        {/* Sealed in Heritage */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase" style={{ color: "#431717" }} data-reveal="slideUp">
                SEALED IN HERITAGE SENT WITH LUXURY
              </h2>
              <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />
              <p className="mt-4 text-xs sm:text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.8 }} data-reveal="fade" data-delay="0.15">
                A filmic glimpse into the rituals and care that define D<Apostrophe />LAVÉN.
              </p>
            </div>

            <div className="mt-12 max-w-5xl mx-auto">
              {/* Image / Video tiles with captions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
                <Link
                  href="/world-of-d-laven/future-of-dlaven"
                  className="group block"
                  aria-label="Future of D'LAVÉN"
                >
                  <div className="h-64 border overflow-hidden relative" style={{ backgroundColor: "#EFECE0", borderColor: "rgba(67,23,23,0.15)" }}>
                    <Image
                      src="/images/frangrence.png"
                      alt="Future of D'LAVÉN"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 text-center font-le-grand text-sm uppercase tracking-widest" style={{ color: "#431717" }}>
                    Future of D<Apostrophe />LAVÉN
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/house-of-dl-creation"
                  className="group block"
                  aria-label="House of DL Creation"
                >
                  <div className="h-64 border overflow-hidden relative" style={{ backgroundColor: "#EFECE0", borderColor: "rgba(67,23,23,0.15)" }}>
                    <Image
                      src="/images/leftVisual.png"
                      alt="House of DL Creation"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 text-center font-le-grand text-sm uppercase tracking-widest" style={{ color: "#431717" }}>
                    House of DL Creation
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/packaging"
                  className="group block"
                  aria-label="Packaging"
                >
                  <div className="h-64 border overflow-hidden relative" style={{ backgroundColor: "#EFECE0", borderColor: "rgba(67,23,23,0.15)" }}>
                    <Image
                      src="/images/rightVisual.png"
                      alt="Packaging"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 text-center font-le-grand text-sm uppercase tracking-widest" style={{ color: "#431717" }}>
                    Packaging & Craft
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/sealed-in-heritage"
                  className="group block"
                  aria-label="Sealed in Heritage and Sent with Luxury"
                >
                  <div className="h-64 border overflow-hidden relative" style={{ backgroundColor: "#EFECE0", borderColor: "rgba(67,23,23,0.15)" }}>
                    <Image
                      src="/images/DPrimeOne.jpg"
                      alt="Sealed in Heritage"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3 text-center font-le-grand text-sm uppercase tracking-widest" style={{ color: "#431717" }}>
                    Sealed in Heritage
                  </div>
                </Link>
              </div>

              <div className="mt-12 flex justify-center">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center px-10 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                  style={{ backgroundColor: "#431717" }}
                >
                  <span className="relative z-10">Explore Collections</span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
