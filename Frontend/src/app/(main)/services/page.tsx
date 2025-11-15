// pages/services.jsx
import Head from "next/head";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Crown, Scissors } from "lucide-react";
import Apostrophe from "@/components/Apostrophe";
import LazyVideo from "@/components/ui/LazyVideo";
import { shimmerBase64 } from "@/lib/shimmer";

export default function ServicesPage() {
  const ourCollections = [
    {
      name: "DL Limited",
      description:
        "Discover exclusive, limited-edition pieces released in select quantities.",
      icon: <ShieldCheck className="h-8 w-8 text-black" />,
    },
    {
      name: "DL Prive",
      description:
        "Access our members-only collection for a premium and personalized styling experience.",
      icon: <Crown className="h-8 w-8 text-black" />,
    },
    {
      name: "DL Barry",
      description:
        "Experience bespoke tailoring with our made-to-measure service for a perfect fit.",
      icon: <Scissors className="h-8 w-8 text-black" />,
    },
  ];

  return (
    <>
      <Head>
        <title>DL Services — D&apos;LAVÉN</title>
        <meta
          name="description"
          content="D'LAVÉN — Experience Unrivaled Luxury and Care. Sealed in heritage, sent with luxury."
        />
      </Head>

      <main className="text-gray-900">
        {/* =========================
            1. Full-screen Hero Section
           ========================= */}
        <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
          {/* Background image with Next/Image fill mode */}
          <div className="absolute inset-0">
            <Image
              src="/images/dl-service-bg.jpg"
              alt="D'LAVÉN Bespoke Services background"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={shimmerBase64(32, 18)}
            />
            {/* subtle gradient/dark overlay for readable text */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40" />
          </div>

          {/* Foreground content */}
          <div className="relative z-10 px-6 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.22em] opacity-90" data-reveal="fade">
              Unparalleled Luxury and Care
            </p>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest uppercase leading-tight" data-reveal="scale" data-duration="1" data-delay="0.2">
              DL SERVICES
            </h1>

            {/* PDF tagline (pulled from your PDF) */}
            <div className="mt-10">
              <p className="text-sm uppercase tracking-wider" data-reveal="fade" data-delay="0.4">
                SEALED IN HERITAGE, SENT WITH LUXURY
              </p>

              <div className="mt-8 flex items-center justify-center gap-4" data-reveal="slideUp" data-delay="0.6">
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

            <p className="mt-12 text-sm uppercase tracking-wider opacity-90" data-reveal="fade" data-delay="0.8">
              The Present of D<Apostrophe />LAVÉN
            </p>
          </div>

          {/* subtle bottom decorative stripe */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
            <div className="h-0.5 w-36 bg-white/40 rounded" />
          </div>
        </section>

        {/* =========================
            2. The Art of Gifting Section
           ========================= */}
        <section className="py-16 sm:py-24 bg-white text-black">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-widest uppercase" data-reveal="slideUp">
                The Art of Gifting
              </h2>

              <p className="mt-6 text-sm text-black/70" data-reveal="fade" data-delay="0.15">
                A D<Apostrophe />LAVÉN gift is a timeless gesture. Each creation is
                impeccably presented in our signature packaging, a promise of an
                unforgettable experience. Our Client Advisors are available to
                help you choose the perfect gift for any occasion.
              </p>

              <div className="mt-8 flex justify-center" data-reveal="slideUp" data-delay="0.3">
                <Link
                  href="/collections"
                  className="inline-block px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
                >
                  View Collections
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* =========================
            3. Full-width Video Section
           ========================= */}
        <section className="relative h-96 w-full overflow-hidden">
          {/* Lazy-loaded video with poster fallback */}
          <LazyVideo
            poster="/images/dl-service-video-poster.jpg"
            src="/videos/dummyVideo.mp4"
            className="h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="none"
          />

          {/* slight overlay */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <p className="text-white/90 uppercase text-sm tracking-widest">
              Experience Unrivaled Luxury and Care
            </p>
          </div>
        </section>

        {/* =========================
            4. Our Collections Section (NEW)
           ========================= */}
        <section className="py-16 sm:py-24 bg-gray-100 text-gray-900">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-widest uppercase" data-reveal="slideUp">
                Our Collections
              </h2>
              <p className="mt-6 text-sm text-gray-700 max-w-2xl mx-auto" data-reveal="fade" data-delay="0.15">
                Explore our exclusive tiers of luxury, each crafted to provide a
                unique and unforgettable D<Apostrophe />LAVÉN experience.
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
              {ourCollections.map((service) => {
                const href =
                  service.name === "DL Limited"
                    ? "/dlaven-limited"
                    : service.name === "DL Prive"
                    ? "/prive"
                    : "/dl-barry";

                return (
                  <Link key={service.name} href={href} className="block">
                    <div className="text-center p-8 border border-gray-300 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-200 mx-auto">
                        {service.icon}
                      </div>
                      <h3 className="mt-6 text-xl font-bold tracking-wider uppercase">
                        {service.name}
                      </h3>
                      <p className="mt-4 text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
