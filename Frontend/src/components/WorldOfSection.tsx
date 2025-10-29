import Image from "next/image";
import Container from "@/components/Container";
import Link from "next/link";

export default function WorldOfSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container>
        {/* small centered label */}
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-widest text-black/70">
            WORLD OF D&apos; LAVÉN
          </p>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-8 items-center">
          {/* Left: large image (col 1-6) */}
          <div className="col-span-12 md:col-span-6">
            <div className="max-w-[560px] mx-auto md:mx-0">
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                <Image
                  src="/images/placeholder1.jpg"
                  alt="World left"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Center: headline + paragraph (col 7-10) */}
          <div className="col-span-12 md:col-span-4 flex justify-center">
            <div className="max-w-[420px] text-center md:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-widest uppercase leading-tight">
                FROM INDIA&apos;S SOUL TO THE
                <br /> WORLD STAGE
              </h2>
              <p className="mt-4 text-sm text-black/70">
                D&apos;LAVÉN destinations where heritage meets modern luxury. A
                journey from digital beginnings to timeless addresses. Our
                boutiques will soon open doors in iconic cities, bringing
                heritage craftsmanship and modern luxury under one roof.
              </p>

              <Link
                href="/world-of-d-laven"
                className="mt-6 inline-block text-[10px] uppercase tracking-wider border border-black/10 px-3 py-2"
              >
                Discover Our Universe
              </Link>
            </div>
          </div>

          {/* Right: Upcoming locations vertical (col 11-12) */}
          <div className="col-span-12 md:col-span-2 hidden md:flex items-start justify-end">
            <div className="text-right">
              <p className="text-sm uppercase tracking-widest">
                Upcoming Locations
              </p>
              <ul className="mt-4 text-xs space-y-2">
                <li className="flex items-center justify-end gap-2">
                  Mumbai <span className="inline-block h-2 w-2 bg-black" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  Varanasi <span className="inline-block h-2 w-2 bg-black" />
                </li>
                <li className="flex items-center justify-end gap-2">
                  Delhi <span className="inline-block h-2 w-2 bg-black" />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
