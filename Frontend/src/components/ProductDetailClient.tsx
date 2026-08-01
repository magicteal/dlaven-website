"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState, useRef } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { fmt } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Phone,
  Heart,
} from "lucide-react";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { add, loading: cartLoading, cart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const gallery = useMemo(
    () => (product.images && product.images.length > 0 ? product.images : ["/images/placeholder.png"]),
    [product]
  );

  const [selectedImage, setSelectedImage] = useState<string>(gallery[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [isSizeOpen, setIsSizeOpen] = useState<boolean>(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  // Sync image when product changes
  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage(gallery[0]);
    }
  }, [gallery]);

  // Set default size if sizeOptions exist
  useEffect(() => {
    if (product.sizeOptions && product.sizeOptions.length > 0) {
      setSelectedSize(product.sizeOptions[0]);
    } else {
      setSelectedSize(undefined);
    }
  }, [product.slug, product.sizeOptions]);

  const sizes = useMemo(() => {
    if (product.sizeOptions && product.sizeOptions.length > 0) {
      return product.sizeOptions;
    }
    return ["S", "M", "L", "XL"];
  }, [product.sizeOptions]);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleAddToCart = async () => {
    if (!selectedSize && sizes.length > 0) {
      setIsSizeOpen(true);
      return;
    }
    try {
      await add(product.slug, 1, selectedSize);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3500);
    } catch (e) {
      console.error("Failed to add to cart:", e);
    }
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      
      {/* ── 1. TOP HERO PRODUCT BANNER (Full Width, Pushed Down Below Navbar) ── */}
      <section className="relative w-full h-[70vh] sm:h-[85vh] min-h-[540px] bg-[#141414] overflow-hidden flex flex-col justify-end">
        {/* Dedicated top gradient overlay for navbar clearance */}
        <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-b from-black/95 via-black/70 to-transparent pointer-events-none z-10" />

        {/* Hero image container shifted down below top navbar */}
        <div className="relative w-full h-[calc(100%-4rem)] sm:h-[calc(100%-5rem)] mt-16 sm:mt-20 overflow-hidden">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
            priority
            sizes="100vw"
          />
        </div>
      </section>

      {/* ── 2. MAIN PRODUCT DETAILS SHOWCASE ── */}
      <Container className="pt-12 sm:pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Category, Title, Swatches, Size, Description, Accordions (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Header Info */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-[#6F3D24] mb-1">
                {product.categorySlug ? product.categorySlug.replace(/-/g, " ") : "D' LAVÉN CREATION"}
              </p>
              <h1 className="font-le-grand text-3xl sm:text-4xl md:text-5xl uppercase tracking-widest text-[#431717]">
                {product.name}
              </h1>
              <p className="mt-3 font-le-grand text-xl sm:text-2xl text-[#431717]">
                {fmt(product.price)}
              </p>
            </div>

            {/* Thumbnail Swatches (if gallery has multiple images) */}
            {gallery.length > 1 && (
              <div className="space-y-3 pt-2">
                <p className="text-xs uppercase tracking-[0.2em] text-[#431717] opacity-90">
                  Gallery Selection: <span className="font-medium text-[#6F3D24]">{gallery.indexOf(selectedImage) + 1} of {gallery.length}</span>
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {gallery.map((img, idx) => {
                    const isSel = img === selectedImage;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-12 h-12 border transition-all duration-300 overflow-hidden ${
                          isSel
                            ? "border-[#431717] ring-1 ring-[#431717] scale-105"
                            : "border-[#431717]/20 opacity-70 hover:opacity-100 hover:border-[#431717]"
                        }`}
                        aria-label={`Select thumbnail ${idx + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                  {sizes.map((sz) => (
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
                Style # {product.slug.toUpperCase()}
              </p>
              <p className="text-xs sm:text-sm text-[#431717]/85 leading-relaxed font-normal">
                {product.description ||
                  "In the latest collection, D'LAVÉN features archival symbols recalling the House's equestrian heritage. Crafted in supple materials and defined by light gold-toned hardware."}
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
                    {product.details && product.details.length > 0 ? (
                      product.details.map((detail, idx) => <li key={idx}>{detail}</li>)
                    ) : (
                      <>
                        <li>Supple premium leather & fine precious metals</li>
                        <li>Light gold-toned handcrafted hardware</li>
                        <li>Signature D&apos;LAVÉN heritage detail</li>
                        <li>Handcrafted by master artisans</li>
                      </>
                    )}
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
                  <div className="mt-3 text-xs text-[#431717]/80 leading-relaxed space-y-2">
                    {product.materialCare && product.materialCare.length > 0 ? (
                      product.materialCare.map((care, idx) => <p key={idx}>{care}</p>)
                    ) : (
                      <p>
                        D&apos;LAVÉN products are crafted with carefully selected materials. Please handle with care for longer product life. Protect from direct light, heat, and liquids. Store in the provided luxury flannel bag or signature box.
                      </p>
                    )}
                  </div>
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

          {/* RIGHT COLUMN: Stock Status, Select Size CTA & Assistance Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-36">
            <div className="p-8 border border-[#431717]/15 space-y-6" style={{ backgroundColor: "rgba(255, 255, 255, 0.45)" }}>
              
              {/* Stock Indicator */}
              <div className="text-right">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-[#6F3D24]">
                  {product.inStock !== false ? "JUST 1 IN STOCK! READY FOR DISPATCH" : "OUT OF STOCK"}
                </span>
              </div>

              {/* CTA Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={cartLoading || product.inStock === false}
                className="w-full py-4 text-xs sm:text-sm uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 shadow-md relative overflow-hidden group disabled:opacity-50"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {addedToCart ? (
                    <>
                      <Check size={16} /> ADDED TO BAG
                    </>
                  ) : !selectedSize && sizes.length > 0 ? (
                    "SELECT SIZE"
                  ) : (
                    <>
                      <ShoppingBag size={16} /> ADD TO BAG
                    </>
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

      {/* ── 3. YOU MAY ALSO LIKE Section (Clean Cream Background - No White Boxes) ── */}
      {related && related.length > 0 && (
        <section className="w-full pt-16 pb-20 border-t border-[#431717]/15" style={{ backgroundColor: "#F6F4E6" }}>
          <Container>
            
            <div className="flex items-center justify-between mb-10">
              <h2 className="font-le-grand text-2xl sm:text-3xl uppercase tracking-widest text-[#431717]">
                YOU MAY ALSO LIKE
              </h2>
              
              {/* Carousel Controls */}
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
              {related.map((item) => (
                <div
                  key={item.slug}
                  className="w-[260px] sm:w-[300px] shrink-0 snap-start group flex flex-col justify-between"
                >
                  <ProductCard
                    slug={item.slug}
                    name={item.name}
                    price={item.price}
                    image={(item.images && item.images[0]) || "/images/placeholder.png"}
                    inStock={item.inStock}
                  />
                </div>
              ))}
            </div>

            {/* Scroll Track Indicator */}
            <div className="mt-6 w-full max-w-[200px] mx-auto h-[2px] bg-[#431717]/15 relative overflow-hidden rounded-full">
              <div className="absolute left-0 top-0 h-full w-1/2 bg-[#431717]" />
            </div>

          </Container>
        </section>
      )}

    </main>
  );
}
