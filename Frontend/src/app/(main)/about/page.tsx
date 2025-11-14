import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import Apostrophe from "@/components/Apostrophe";

export default function AboutUsPage() {
  return (
    <main className="py-20 sm:py-28">
      <Container>
        {/* Image Collage Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-64 md:h-80" data-reveal="scale" data-stagger="0.15">
          <div className="relative h-full w-full">
            <Image
              src="/images/rightVisual.png"
              alt="D'LAVÉN Lifestyle 1"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-full w-full">
            <Image
              src="/images/leftVisual.png"
              alt="D'LAVÉN Lifestyle 2"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="relative h-full w-full">
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
          <h1 className="text-3xl font-bold tracking-widest uppercase text-black" data-reveal="slideUp">
            ABOUT D<Apostrophe />LAVÉN
          </h1>
          <div className="mt-8 text-sm text-black/70 space-y-5" data-reveal="slideUp" data-stagger="0.15" data-delay="0.2">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard
              dummy text ever since the 1500s.
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard
              dummy text ever since the 1500s.
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard
              dummy text ever since the 1500s.
            </p>
          </div>
        </div>

        {/* May We Help You Section */}
        <div className="text-center mt-24 md:mt-28 py-16 md:py-20 bg-gray-50">
          <h2 className="text-xl font-bold tracking-widest uppercase text-black" data-reveal="slideUp">
            MAY WE HELP YOU?
          </h2>
          <p className="mt-4 text-sm text-black/70" data-reveal="slideUp" data-delay="0.15">
            Find out everything you need to know about the D<Apostrophe />LAVÉN
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block px-10 py-3.5 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
            data-reveal="slideUp"
            data-delay="0.3"
          >
            Contact Us
          </Link>
        </div>
      </Container>
    </main>
  );
}
