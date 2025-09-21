"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type CarouselContextType = {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  scrollNext: () => void;
  scrollPrev: () => void;
};

const CarouselContext = React.createContext<CarouselContextType | null>(null);

export function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel components must be used within <Carousel>");
  return ctx;
}

export function Carousel({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null);

  const scrollByAmount = React.useCallback((dir: 1 | -1) => {
    const el = viewportRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.9; // scroll by ~1 viewport
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }, []);

  const value: CarouselContextType = React.useMemo(
    () => ({ viewportRef, scrollNext: () => scrollByAmount(1), scrollPrev: () => scrollByAmount(-1) }),
    [scrollByAmount]
  );

  return (
    <CarouselContext.Provider value={value}>
      <div className={cn("relative", className)}>{children}</div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const { viewportRef } = useCarousel();
  return (
    <div
      ref={viewportRef}
      className={cn(
        "overflow-x-auto scroll-smooth",
        "[scrollbar-width:none] [-ms-overflow-style:none]",
        "[&::-webkit-scrollbar]:hidden",
        "snap-x snap-mandatory",
        "flex gap-4 sm:gap-6",
        className
      )}
    >
      {/* wrapper ensures no wrapping */}
      {children}
    </div>
  );
}

export function CarouselItem({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("snap-start shrink-0", className)}>
      {children}
    </div>
  );
}

export function CarouselPrevious({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const { scrollPrev } = useCarousel();
  return (
    <button
      type="button"
      aria-label="Previous"
      onClick={scrollPrev}
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 z-10",
        "px-3 py-2 bg-white/90 text-black hover:bg-white shadow-sm",
        "select-none",
        className
      )}
    >
      {children ?? "‹"}
    </button>
  );
}

export function CarouselNext({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  const { scrollNext } = useCarousel();
  return (
    <button
      type="button"
      aria-label="Next"
      onClick={scrollNext}
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 z-10",
        "px-3 py-2 bg-white/90 text-black hover:bg-white shadow-sm",
        "select-none",
        className
      )}
    >
      {children ?? "›"}
    </button>
  );
}
