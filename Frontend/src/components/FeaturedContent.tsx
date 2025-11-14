import Image from "next/image";
import { Button } from "@/components/ui/button";

const BG_IMAGE_LEFT =
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=2400&q=80&ixlib=rb-4.0.3";
const BG_IMAGE_RIGHT =
  "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=2400&q=80&ixlib=rb-4.0.3";

// This is the new component for the "DL PRIVÉ EDITION" section
export default function FeaturedContent() {
  return (
    <section className="relative w-full text-white bg-black">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-1 opacity-60 pointer-events-none">
          <div className="relative h-full w-full">
            <Image
              src={BG_IMAGE_LEFT}
              alt="DL Privé background left"
              fill
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>
          <div className="relative h-full w-full">
            <Image
              src={BG_IMAGE_RIGHT}
              alt="DL Privé background right"
              fill
              sizes="50vw"
              className="object-cover object-center"
            />
          </div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-20 sm:py-24 md:py-48">
        <h2 
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-widest uppercase"
          data-reveal="scale"
          data-duration="1"
        >
          DL PRIVÉ EDITION
        </h2>
        <div data-reveal="slideUp" data-delay="0.3">
          <Button
            variant="outline"
            className="mt-8 rounded-none border-white bg-transparent text-white hover:bg-white hover:text-black"
            aria-label="Get Access"
          >
            Get Access
          </Button>
        </div>
      </div>
    </section>
  );
}
