"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { useState, useRef } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Phone, Check, ShoppingBag, Heart } from "lucide-react";

type RelatedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const RELATED_PRODUCTS: RelatedProduct[] = [
  {
    id: "earrings",
    name: "Women's Earrings",
    price: 980,
    image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
    category: "Earrings",
  },
  {
    id: "set-necklace",
    name: "Women's set of necklace",
    price: 660,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
    category: "Necklaces",
  },
  {
    id: "ring",
    name: "Women's ring",
    price: 980,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
    category: "Rings",
  },
  {
    id: "single-necklace",
    name: "Women's single necklace",
    price: 220,
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
    category: "Necklaces",
  },
];

export default function DemoProductPage() {
  const [selectedSwatch, setSelectedSwatch] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [addedToCart, setAddedToCart] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setIsSizeOpen(true);
      return;
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3500);
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      
      {/* ── Top Hero Product Banner ── */}
      <section className="relative w-full h-[55vh] sm:h-[65vh] min-h-[420px] bg-[#3B2219] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
        <div className="relative w-full h-full max-w-[1200px] mx-auto px-4 flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200&auto=format&fit=crop"
            alt="Women's Bangles Featured Jewelry"
            fill
            className="object-contain object-center p-6 sm:p-12 transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>
      </section>

      {/* ── Main Details Showcase ── */}
      <Container className="pt-12 sm:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Title, Swatches, Accordions */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#6F3D24] mb-1">
                RING
              </p>
              <h1 className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-widest text-[#431717]">
                WOMEN&apos;S BANGLES
              </h1>
              <p className="mt-3 font-le-grand text-xl sm:text-2xl text-[#431717]">
                ₹560
              </p>
            </div>

            {/* Variation Selection */}
            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#431717] opacity-90">
                Variation: <span className="font-medium text-[#6F3D24]">dark brown leather</span>
              </p>
              <div className="flex items-center gap-3">
                {[1, 2, 3].map((swatchId) => (
                  <button
                    key={swatchId}
                    type="button"
                    onClick={() => setSelectedSwatch(swatchId)}
                    className={`relative w-11 h-11 border transition-all duration-300 overflow-hidden ${
                      selectedSwatch === swatchId
                        ? "border-[#431717] ring-1 ring-[#431717] scale-105"
                        : "border-[#431717]/20 hover:border-[#431717]/60"
                    }`}
                    aria-label={`Select variation ${swatchId}`}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=200&auto=format&fit=crop"
                      alt={`Swatch ${swatchId}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector Accordion */}
            <div className="border-t border-b border-[#431717]/15 py-4">
              <button
                type="button"
                onClick={() => setIsSizeOpen(!isSizeOpen)}
                className="w-full flex items-center justify-between text-xs uppercase tracking-[0.25em] text-[#431717] font-medium py-1"
              >
                <span>Size {selectedSize ? `: ${selectedSize}` : ""}</span>
                <span className="text-lg">{isSizeOpen ? "−" : "+"}</span>
              </button>

              {isSizeOpen && (
                <div className="mt-4 grid grid-cols-4 gap-3 animate-fadeIn">
                  {["S", "M", "L", "XL"].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => {
                        setSelectedSize(sz);
                        setIsSizeOpen(false);
                      }}
                      className={`py-2.5 text-xs tracking-widest uppercase transition-all duration-200 border ${
                        selectedSize === sz
                          ? "bg-[#431717] text-white border-[#431717]"
                          : "bg-transparent text-[#431717] border-[#431717]/30 hover:border-[#431717]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* PRODUCT DESCRIPTION */}
            <div className="space-y-4 pt-4">
              <h2 className="font-le-grand text-xl uppercase tracking-widest text-[#431717]">
                PRODUCT DESCRIPTION
              </h2>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6F3D24] font-medium">
                Style # 525313 A0A00 2717
              </p>
              <p className="text-xs sm:text-sm text-[#431717]/85 leading-relaxed font-normal">
                In the Fall Winter 2025 collection, D&apos;LAVÉN continues to feature archival symbols. For the latest collection, the Horsebit Hardware recalls the House&apos;s equestrian heritage. This pair of women&apos;s boots is crafted in supple leather and defined by a light gold-toned hardware.
              </p>
            </div>

            {/* ACCORDION SECTIONS */}
            <div className="space-y-3 pt-4 border-t border-[#431717]/15">
              
              {/* Product Details */}
              <div className="border-b border-[#431717]/15 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("details")}
                  className="w-full flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#431717] py-2 hover:opacity-80 transition-opacity"
                >
                  <span>Product Details</span>
                  <span className="text-lg">{openAccordion === "details" ? "−" : "+"}</span>
                </button>
                {openAccordion === "details" && (
                  <ul className="mt-3 space-y-2 text-xs text-[#431717]/80 pl-4 list-disc marker:text-[#6F3D24]">
                    <li>Supple dark brown premium leather</li>
                    <li>Light gold-toned handcrafted hardware</li>
                    <li>Signature D&apos;LAVÉN Horsebit detail</li>
                    <li>Handcrafted in Italy by master artisans</li>
                    <li>Width: 0.8&quot; / 20mm</li>
                  </ul>
                )}
              </div>

              {/* Materials & Care */}
              <div className="border-b border-[#431717]/15 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("materials")}
                  className="w-full flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#431717] py-2 hover:opacity-80 transition-opacity"
                >
                  <span>Materials & Care</span>
                  <span className="text-lg">{openAccordion === "materials" ? "−" : "+"}</span>
                </button>
                {openAccordion === "materials" && (
                  <p className="mt-3 text-xs text-[#431717]/80 leading-relaxed">
                    D&apos;LAVÉN products are crafted with carefully selected materials. Please handle with care for longer product life. Protect from direct light, heat, and liquids. Should it become wet, dry immediately with a soft cloth. Store in the provided luxury flannel bag or signature box.
                  </p>
                )}
              </div>

              {/* Our Commitment */}
              <div className="border-b border-[#431717]/15 pb-4">
                <button
                  type="button"
                  onClick={() => toggleAccordion("commitment")}
                  className="w-full flex items-center justify-between text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-[#431717] py-2 hover:opacity-80 transition-opacity"
                >
                  <span>Our Commitment</span>
                  <span className="text-lg">{openAccordion === "commitment" ? "−" : "+"}</span>
                </button>
                {openAccordion === "commitment" && (
                  <p className="mt-3 text-xs text-[#431717]/80 leading-relaxed">
                    D&apos;LAVÉN is committed to sustainable luxury and ethical sourcing. All precious metals and stones are certified conflict-free and created under strict heritage craftsmanship protocols.
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Stock Status, Select Size CTA & Assistance */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-36">
            <div className="p-8 border border-[#431717]/15 space-y-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}>
              
              {/* Stock Indicator */}
              <div className="text-right">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#6F3D24]">
                  JUST 1 IN STOCK! READY FOR DISPATCH
                </span>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-4 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 shadow-md relative overflow-hidden group"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {addedToCart ? (
                    <>
                      <Check size={16} /> ADDED TO BAG
                    </>
                  ) : selectedSize ? (
                    <>
                      <ShoppingBag size={16} /> ADD TO BAG
                    </>
                  ) : (
                    "SELECT SIZE"
                  )}
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6F3D24" }}
                />
              </button>

              {addedToCart && (
                <p className="text-center text-xs text-emerald-800 tracking-wider font-medium animate-fadeIn">
                  ✓ Item added to your D&apos;LAVÉN Shopping Bag
                </p>
              )}

              {/* Contact Advisors Assistance */}
              <div className="pt-4 border-t border-[#431717]/15 flex items-start gap-3 text-[#431717]">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#6F3D24]" />
                <div className="text-xs space-y-1">
                  <Link
                    href="/contact"
                    className="underline underline-offset-4 tracking-wider uppercase font-medium hover:text-[#6F3D24] transition-colors"
                  >
                    Contact Us
                  </Link>
                  <p className="opacity-80">
                    Our Client Advisors are available to help you.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </Container>

      {/* ── YOU MAY ALSO LIKE Section (Clean Cream Background - No White Boxes!) ── */}
      <section className="w-full pt-16 pb-20 border-t border-[#431717]/15" style={{ backgroundColor: "#F6F4E6" }}>
        <Container>
          
          <div className="flex items-center justify-between mb-10">
            <h2 className="font-le-grand text-2xl sm:text-3xl uppercase tracking-widest text-[#431717]">
              YOU MAY ALSO LIKE
            </h2>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                className="w-10 h-10 border border-[#431717]/30 flex items-center justify-center text-[#431717] hover:bg-[#431717] hover:text-white transition-colors"
                aria-label="Previous items"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                className="w-10 h-10 border border-[#431717]/30 flex items-center justify-center text-[#431717] hover:bg-[#431717] hover:text-white transition-colors"
                aria-label="Next items"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Carousel Grid */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-6 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
            {RELATED_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="w-[260px] sm:w-[300px] shrink-0 snap-start group flex flex-col justify-between"
              >
                {/* Image Container with matching Cream background (#F6F4E6 / #EFECE0) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#431717]/15" style={{ backgroundColor: "#EFECE0" }}>
                  <Image
                    src={prod.image}
                    alt={prod.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 260px, 300px"
                  />
                  <button
                    type="button"
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-[#431717] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                    aria-label="Wishlist"
                  >
                    <Heart size={14} />
                  </button>
                </div>

                {/* Details under image */}
                <div className="mt-4 pt-2">
                  <h3 className="font-le-grand text-sm sm:text-base font-normal tracking-wide text-[#431717] truncate group-hover:underline">
                    {prod.name}
                  </h3>
                  <p className="mt-1 font-le-grand text-xs sm:text-sm text-[#431717]">
                    ₹{prod.price}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Carousel Scroll Indicator Track */}
          <div className="mt-6 w-full max-w-[200px] mx-auto h-[2px] bg-[#431717]/15 relative overflow-hidden rounded-full">
            <div className="absolute left-0 top-0 h-full w-1/2 bg-[#431717]" />
          </div>

        </Container>
      </section>

    </main>
  );
}
