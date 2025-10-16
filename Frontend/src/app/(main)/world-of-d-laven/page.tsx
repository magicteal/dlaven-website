import Head from "next/head";
import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";

export default function WorldOfDlavenPage() {
  return (
    <>
      <Head>
        <title>World of D'LAVÉN — D'LAVÉN</title>
        <meta
          name="description"
          content="Explore the world of D'LAVÉN — heritage, craft and the present of luxury."
        />
      </Head>

      <main className="text-gray-900">
        {/* Hero */}
        <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/dl-service-bg.jpg"
              alt="World of D'LAVÉN hero"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/30" />
          </div>

          <div className="relative z-10 px-6 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] opacity-90">
              EXPERIENCE UNRIVALED HERITAGE
            </p>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest uppercase leading-tight">
              WORLD OF D'LAVÉN
            </h1>

            <p className="mt-8 text-sm uppercase tracking-wider text-white/90">
              An immersion into craft, provenance and the present of D'LAVÉN.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-block px-8 py-3 border border-white text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-300"
              >
                Explore Collections
              </Link>

              <Link
                href="/contact"
                className="inline-block px-6 py-3 border border-white/80 text-xs uppercase tracking-wider hover:bg-white/90 hover:text-black transition-colors duration-300"
              >
                Contact an Advisor
              </Link>
            </div>
          </div>

          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
            <div className="h-0.5 w-36 bg-white/40 rounded" />
          </div>
        </section>

        {/* Sealed in Heritage (video placeholder) */}
        <section className="py-16 sm:py-24 bg-white text-black">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-widest uppercase">
                SEALED IN HERITAGE SENT WITH LUXURY
              </h2>
              <p className="mt-6 text-sm text-black/70">
                A filmic glimpse into the rituals and care that define D'LAVÉN —
                coming soon.
              </p>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-200 rounded-lg relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10 rounded-lg" />
                {/* Play icon */}
                <div className="z-10">
                  <svg
                    width="96"
                    height="96"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="11"
                      stroke="white"
                      strokeWidth="1.5"
                      fill="rgba(255,255,255,0.1)"
                    />
                    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="white" />
                  </svg>
                </div>
              </div>

              {/* Image tiles (4) with captions */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                <Link
                  href="/world-of-d-laven/future-of-dlaven"
                  className="group block"
                  aria-label="Future of D'LAVÉN"
                >
                  <div className="h-56 bg-black rounded overflow-hidden">
                    <div className="h-full w-full bg-[url('/images/placeholder1.jpg')] bg-center bg-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 text-center text-sm uppercase tracking-wider">
                    Future of D'LAVÉN
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/house-of-dl-creation"
                  className="group block"
                  aria-label="House of DL Creation"
                >
                  <div className="h-56 bg-black rounded overflow-hidden">
                    <div className="h-full w-full bg-[url('/images/placeholder2.jpg')] bg-center bg-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 text-center text-sm uppercase tracking-wider">
                    House of DL Creation
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/packaging"
                  className="group block"
                  aria-label="Packaging"
                >
                  <div className="h-56 bg-black rounded overflow-hidden">
                    <div className="h-full w-full bg-[url('/images/placeholder3.jpg')] bg-center bg-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 text-center text-sm uppercase tracking-wider">
                    Packaging
                  </div>
                </Link>

                <Link
                  href="/world-of-d-laven/sealed-in-heritage"
                  className="group block"
                  aria-label="Sealed in Heritage and Sent with Luxury"
                >
                  <div className="h-56 bg-black rounded overflow-hidden">
                    <div className="h-full w-full bg-[url('/images/placeholder-square.jpg')] bg-center bg-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="mt-3 text-center text-sm uppercase tracking-wider">
                    SEALED IN HERITAGE &amp; SENT WITH LUXURY
                  </div>
                </Link>
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href="/products"
                  className="inline-block px-8 py-2 bg-black text-white text-xs uppercase tracking-wider border border-black/40 hover:opacity-90"
                >
                  Explore Collections
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Present of D'LAVÉN gallery */}
        <section className="py-16 sm:py-24 bg-gray-50 text-gray-900">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold tracking-widest uppercase">
                PRESENT OF D LAVEN
              </h2>
              <p className="mt-4 text-sm text-gray-700">
                A selection of present-day moments and crafted pieces from our
                ateliers.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-square bg-white overflow-hidden">
                  <div className="h-full w-full bg-[url('/images/placeholder-square.jpg')] bg-center bg-cover" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
