"use client";

import Image from "next/image";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { fmt } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronRight, Heart, Phone, ShieldCheck, Truck } from "lucide-react";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const { add, loading: cartLoading, cart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const gallery = useMemo(
    () => (product.images && product.images.length > 0 ? product.images : ["/images/placeholder.png"]),
    [product]
  );
  const [selectedImage, setSelectedImage] = useState<string>(gallery[0]);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (product.sizeOptions && product.sizeOptions.length > 0) {
      setSelectedSize(product.sizeOptions[0]);
    } else {
      setSelectedSize(undefined);
    }
  }, [product.slug, product.sizeOptions]);

  const alreadyInCart = useMemo(() => {
    if (!cart) return false;
    return cart.items.some(
      (i) => i.productSlug === product.slug && ((i.size ?? null) === (selectedSize ?? null))
    );
  }, [cart, product.slug, selectedSize]);

  return (
    <main className="min-h-screen pt-36 sm:pt-44 lg:pt-48 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      {/* ── Main Product Display Grid ── */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Featured Large Image Showcase (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EFECE0] shadow-sm border border-[#431717]/10">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
            </div>

            {/* Thumbnail selector */}
            {gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-3 pt-2">
                {gallery.map((img, i) => {
                  const isActive = img === selectedImage;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square overflow-hidden transition-all border ${
                        isActive ? "border-[#431717] ring-1 ring-[#431717]" : "border-[#431717]/20 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Specs, Details & Action Panel (5 cols) */}
          <div className="lg:col-span-5 space-y-7 pt-2">
            
            {/* New Badge & Title */}
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium" style={{ color: "#6F3D24" }}>
                New
              </span>
              <h1
                className="font-le-grand text-3xl sm:text-4xl lg:text-5xl font-normal tracking-wider uppercase leading-tight mt-1"
                style={{ color: "#431717" }}
              >
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3">
                <span className="font-le-grand text-2xl sm:text-3xl font-normal" style={{ color: "#431717" }}>
                  {fmt(product.price)}
                </span>
              </div>

              {/* Variation / Style tag */}
              <div className="mt-4 text-xs tracking-wide" style={{ color: "#431717", opacity: 0.8 }}>
                <span className="opacity-60">Variation: </span>
                <span className="font-medium">dark brown leather</span>
              </div>
            </div>

            {/* Size Selector with Expected Delivery Hint */}
            <div className="pt-2 border-t border-[#431717]/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                <span style={{ color: "#431717", opacity: 0.7 }}>
                  Select the size of the item to see the expected delivery date.
                </span>
              </div>

              {/* Size dropdown or trigger button matching reference */}
              <div className="relative">
                {product.sizeOptions && product.sizeOptions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.sizeOptions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2.5 text-xs uppercase tracking-wider transition-all border ${
                          selectedSize === s
                            ? "bg-[#431717] text-[#F6F4E6] border-[#431717]"
                            : "bg-transparent text-[#431717] border-[#431717]/30 hover:border-[#431717]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-3.5 border border-[#431717]/30 text-xs uppercase tracking-widest text-[#431717] hover:border-[#431717] transition-colors"
                  >
                    <span>Size</span>
                    <span className="text-base font-light">+</span>
                  </button>
                )}
              </div>

              {/* Primary Action Button: Select Size / Add to Cart */}
              <button
                type="button"
                onClick={async () => {
                  if (!user) {
                    router.push(`/login?next=${encodeURIComponent(`/products/${product.slug}`)}`);
                    return;
                  }
                  try {
                    await add(product.slug, 1, selectedSize);
                  } catch {}
                }}
                disabled={cartLoading || !product.inStock || authLoading}
                className="w-full py-4 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 disabled:opacity-60 overflow-hidden shadow-sm hover:opacity-90"
                style={{ backgroundColor: "#5D2B1C" }}
              >
                {alreadyInCart ? "In Bag" : "Select Size"}
              </button>
            </div>

            {/* Client Advisors / Contact Us Assistance */}
            <div className="pt-2 border-t border-[#431717]/10">
              <a
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider underline underline-offset-4 hover:opacity-80 transition-opacity"
                style={{ color: "#431717" }}
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Contact Us</span>
              </a>
              <p className="mt-1 text-xs" style={{ color: "#431717", opacity: 0.7 }}>
                Our Client Advisors are available to help you.
              </p>
            </div>

            {/* PRODUCT DESCRIPTION BLOCK */}
            <div className="pt-6 border-t border-[#431717]/15 space-y-2">
              <h2
                className="font-le-grand text-lg uppercase tracking-widest font-normal"
                style={{ color: "#431717" }}
              >
                Product Description
              </h2>
              <p className="text-[11px] uppercase tracking-wider opacity-60" style={{ color: "#431717" }}>
                Style ‎849565 AAEA4 2270
              </p>
              <p className="text-xs leading-relaxed pt-2" style={{ color: "#431717", opacity: 0.85 }}>
                {product.description ||
                  "In the Fall Winter 2025 collection, D' Lavén continues to feature archival symbols. For the latest collection, the signature hardware recalls the House's equestrian heritage. This pair of women's piece is crafted in supple leather and defined by light gold-toned hardware."}
              </p>
            </div>

            {/* ACCORDIONS SECTION (Product Details, Materials & Care, Our Commitment) */}
            <div className="pt-2 border-t border-[#431717]/15">
              <Accordion type="single" collapsible className="w-full space-y-0 divide-y divide-[#431717]/15">
                {/* 1. Product Details */}
                <AccordionItem value="details" className="border-b-0">
                  <AccordionTrigger className="text-xs uppercase tracking-[0.2em] font-medium py-4 hover:no-underline" style={{ color: "#431717" }}>
                    Product Details
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed pb-4" style={{ color: "#431717", opacity: 0.85 }}>
                    {product.details && product.details.length > 0 ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.details.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                      </ul>
                    ) : (
                      <ul className="space-y-1.5">
                        <li>• Light gold-toned hardware</li>
                        <li>• Signature D&apos; Lavén emblem detailing</li>
                        <li>• Handcrafted in Italy</li>
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* 2. Materials & Care */}
                <AccordionItem value="materials" className="border-b-0">
                  <AccordionTrigger className="text-xs uppercase tracking-[0.2em] font-medium py-4 hover:no-underline" style={{ color: "#431717" }}>
                    Materials & Care
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed pb-4" style={{ color: "#431717", opacity: 0.85 }}>
                    {product.materialCare && product.materialCare.length > 0 ? (
                      <ul className="space-y-1.5 list-disc list-inside">
                        {product.materialCare.map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>
                        D&apos; Lavén products are made with carefully selected materials. Please handle with care for longer product life. Protect from direct light, heat and rain. Clean with a soft, dry cloth.
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* 3. Our Commitment */}
                <AccordionItem value="commitment" className="border-b-0">
                  <AccordionTrigger className="text-xs uppercase tracking-[0.2em] font-medium py-4 hover:no-underline" style={{ color: "#431717" }}>
                    Our Commitment
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed pb-4" style={{ color: "#431717", opacity: 0.85 }}>
                    <p>
                      At D&apos; Lavén, sustainability and ethical craftsmanship are at the heart of our creations. We ensure standard fair-wage production and eco-conscious sourcing for all luxury components.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

          </div>
        </div>
      </section>

      {/* ── YOU MAY ALSO LIKE SECTION ── */}
      {related && related.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-16 border-t border-[#431717]/15">
          <div className="text-center mb-12">
            <h2
              className="font-le-grand text-2xl sm:text-4xl font-normal tracking-[0.2em] uppercase"
              style={{ color: "#431717" }}
            >
              You May Also Like
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {related.slice(0, 4).map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                price={p.price}
                image={p.images[0]}
                rating={p.rating}
                reviewsCount={p.reviewsCount}
                inStock={p.inStock}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
