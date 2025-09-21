import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// This is the new component for the "DL PRIVÉ EDITION" section
export default function FeaturedContent() {
  return (
    <section className="relative w-full text-white bg-black">
      {/* Background Image Grid */}
      <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 opacity-60">
        <div className="relative h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1617127365659-3c74252c3f98?q=80&w=1974&auto=format&fit=crop"
            alt="DL Privé model 1"
            fill
            className="object-cover object-top"
          />
        </div>
        <div className="relative h-full w-full">
          <Image
            src="https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1974&auto=format&fit=crop"
            alt="DL Privé model 2"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Centered Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center py-32 md:py-48">
        <h2 className="text-5xl md:text-7xl font-bold tracking-widest uppercase">
          DL PRIVÉ EDITION
        </h2>
        <Button
          variant="outline"
          className="mt-8 rounded-none border-white bg-transparent text-white hover:bg-white hover:text-black"
        >
          Get Access
        </Button>
      </div>
    </section>
  );
}
