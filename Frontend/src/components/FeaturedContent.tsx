import Image from "next/image";
import { Button } from "@/components/ui/button";

const BG_IMAGE_LEFT =
  "/images/oneImg.png";
const BG_IMAGE_RIGHT =
  "/images/twoImg.png";

// This is the new component for the "DL PRIVÉ EDITION" section
export default function FeaturedContent() {
  return (
    <section className="relative w-full h-[400px] md:min-h-[900px] text-white  overflow-hidden">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-2 mx-[1%]">
        <div className="relative h-full w-full ">
          <Image
            src={BG_IMAGE_LEFT}
            alt="DL Privé background left"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative h-full w-full">
          <Image
            src={BG_IMAGE_RIGHT}
            alt="DL Privé background right"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50 mx-[1%]"></div>

      {/* Centered Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-4 pb-20 sm:pb-24 md:pb-32">
        <h2 
          className="mt-6 text-5xl sm:text-6xl md:text-4xl lg:text-6xl font-serif tracking-[0.2em] uppercase mb-8"
          data-reveal="scale"
          data-duration="1"
          style={{ letterSpacing: '0.15em' }}
        >
          DL PRIVÉ EDITION
        </h2>
        <div data-reveal="slideUp" data-delay="0.3">
          <Button
            variant="outline"
            className="mt-4 px-8 py-6 text-sm tracking-widest uppercase rounded-none border-2 border-white bg-transparent text-white hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Get Access"
          >
            GET ACCESS
          </Button>
        </div>
      </div>
    </section>
  );
}
