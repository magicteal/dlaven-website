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
      icon: <ShieldCheck className="h-7 w-7 text-[#431717]" />,
    },
    {
      name: "DL Prive",
      description:
        "Access our members-only collection for a premium and personalized styling experience.",
      icon: <Crown className="h-7 w-7 text-[#431717]" />,
    },
    {
      name: "DL Barry",
      description:
        "Experience bespoke tailoring with our made-to-measure service for a perfect fit.",
      icon: <Scissors className="h-7 w-7 text-[#431717]" />,
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

      <main className="min-h-screen pt-28 sm:pt-32 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
        {/* Full-screen Hero Section */}
        <section className="relative h-[65vh] min-h-[420px] w-full flex items-center justify-center text-center text-white overflow-hidden mb-16">
          <div className="absolute inset-0">
            <Image
              src="/images/hero_bg.png"
              alt="D'LAVÉN Bespoke Services background"
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
              placeholder="blur"
              blurDataURL={shimmerBase64(32, 18)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          </div>

          <div className="relative z-10 px-6 max-w-4xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#E2DDD7] font-medium" data-reveal="fade">
              Unparalleled Luxury and Care
            </p>

            <h1 className="mt-4 font-le-grand text-4xl sm:text-6xl font-normal tracking-widest uppercase leading-tight text-white" data-reveal="scale">
              DL SERVICES
            </h1>

            <div className="mt-6">
              <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-[#E2DDD7]/90" data-reveal="fade" data-delay="0.4">
                SEALED IN HERITAGE, SENT WITH LUXURY
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
          </div>
        </section>

        {/* The Art of Gifting Section */}
        <section className="py-16 sm:py-20">
          <Container>
            <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 border" style={{ backgroundColor: "rgba(255,255,255,0.55)", borderColor: "rgba(67,23,23,0.12)" }}>
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase" style={{ color: "#431717" }} data-reveal="slideUp">
                The Art of Gifting
              </h2>
              <div className="h-px w-16 mx-auto my-4" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />

              <p className="mt-4 text-xs sm:text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.8 }} data-reveal="fade" data-delay="0.15">
                A D<Apostrophe />LAVÉN gift is a timeless gesture. Each creation is impeccably presented in our signature orange box packaging, a promise of an unforgettable experience. Our Client Advisors are available to help you choose the perfect gift for any occasion.
              </p>

              <div className="mt-8 flex justify-center" data-reveal="slideUp" data-delay="0.3">
                <Link
                  href="/products"
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
                  style={{ backgroundColor: "#431717" }}
                >
                  <span className="relative z-10">View Collections</span>
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* Video Banner Section */}
        <section className="relative h-80 sm:h-96 w-full overflow-hidden my-16 border-y" style={{ borderColor: "rgba(67,23,23,0.12)" }}>
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
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center z-10 text-center px-4">
            <p className="font-le-grand text-white uppercase text-sm sm:text-lg tracking-[0.25em]">
              Experience Unrivaled Luxury and Care
            </p>
          </div>
        </section>

        {/* Our Collections Section */}
        <section className="py-12 sm:py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase" style={{ color: "#431717" }} data-reveal="slideUp">
                Our Bespoke Services & Tiers
              </h2>
              <p className="mt-4 text-xs sm:text-sm max-w-2xl mx-auto" style={{ color: "#431717", opacity: 0.75 }} data-reveal="fade" data-delay="0.15">
                Explore our exclusive tiers of luxury, each crafted to provide a unique and unforgettable D<Apostrophe />LAVÉN experience.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
              {ourCollections.map((service) => {
                const href =
                  service.name === "DL Limited"
                    ? "/dlaven-limited"
                    : service.name === "DL Prive"
                    ? "/prive"
                    : "/dl-barry";

                return (
                  <Link key={service.name} href={href} className="block group">
                    <div
                      className="text-center p-8 border transition-all duration-300 group-hover:-translate-y-1 shadow-sm"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.55)",
                        borderColor: "rgba(67,23,23,0.12)",
                      }}
                    >
                      <div className="flex items-center justify-center h-14 w-14 rounded-full border mx-auto" style={{ backgroundColor: "#F6F4E6", borderColor: "rgba(67,23,23,0.2)" }}>
                        {service.icon}
                      </div>
                      <h3 className="font-le-grand mt-6 text-xl font-normal tracking-wider uppercase" style={{ color: "#431717" }}>
                        {service.name}
                      </h3>
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.75 }}>
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
