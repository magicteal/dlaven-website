import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
  return (
    <main className="py-12 sm:py-16">
      <Container>
        {/* Image Collage Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-64 md:h-80">
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
        <div className="max-w-3xl mx-auto text-center mt-16">
          <h1 className="text-3xl font-bold tracking-widest uppercase text-black">
            ABOUT D&apos;LAVÉN
          </h1>
          <div className="mt-6 text-sm text-black/70 space-y-4">
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry&apos;s standard dummy
              text ever since the 1500s.
            </p>
          </div>
        </div>

        {/* May We Help You Section */}
        <div className="text-center mt-20 py-12 bg-gray-50">
          <h2 className="text-xl font-bold tracking-widest uppercase text-black">
            MAY WE HELP YOU?
          </h2>
          <p className="mt-3 text-sm text-black/70">
            Find out everything you need to know about the D&apos;LAVÉN
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block px-8 py-3 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
          >
            Contact Us
          </Link>
        </div>
      </Container>
    </main>
  );
}
