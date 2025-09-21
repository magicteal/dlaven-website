"use client";

import Image from "next/image";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { Product } from "@/data/products";
import { useMemo, useState } from "react";

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetailClient({ product, related }: Props) {
  const gallery = useMemo(() => product.images, [product]);
  const [selectedImage, setSelectedImage] = useState<string>(gallery[0]);

  return (
    <main>
      {/* Header Hero Image */}
      <section className="relative w-full">
        <div className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
          <Image
            src={selectedImage}
            alt={product.name}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </section>

      {/* Details */}
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            {/* Gallery thumbnails */}
            <div className="grid grid-cols-3 gap-3 order-2 lg:order-1">
              {gallery.map((img, i) => {
                const isActive = img === selectedImage;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`bg-gray-100 aspect-square overflow-hidden border ${isActive ? "border-black" : "border-transparent"}`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="order-1 lg:order-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-black">{product.name}</h1>
              <div className="mt-2 text-xl text-black/80">{new Intl.NumberFormat(undefined, { style: "currency", currency: product.currency, maximumFractionDigits: 0 }).format(product.price)}</div>
              <p className="mt-4 text-sm text-neutral-700">{product.description}</p>

              <div className="mt-6 flex items-center gap-4 text-sm">
                {typeof product.rating === "number" ? (
                  <span className="text-black/70">{product.rating.toFixed(1)} ★{product.reviewsCount ? ` (${product.reviewsCount})` : ""}</span>
                ) : null}
                <span className={product.inStock ? "text-emerald-600" : "text-red-600"}>
                  {product.inStock ? "In stock" : "Sold out"}
                </span>
              </div>

              {/* Action row */}
              <div className="mt-8 flex items-center gap-3">
                <button className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider">Add to Cart</button>
                <button className="px-6 py-3 border border-black text-black text-sm uppercase tracking-wider">Buy Now</button>
              </div>

              {/* Size options for jewelry/clothing if available */}
              {product.sizeOptions && product.sizeOptions.length > 0 ? (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-black/80">Select Size</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.sizeOptions.map((s) => (
                      <button key={s} className="px-3 py-2 border border-black text-sm uppercase tracking-wide hover:bg-black hover:text-white">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* Product details and material & care */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-black/80">Product Details</h3>
                  {product.details && product.details.length > 0 ? (
                    <ul className="mt-3 list-disc list-inside text-sm text-neutral-700 space-y-1">
                      {product.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-neutral-600">No additional details available.</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wider uppercase text-black/80">Material & Care</h3>
                  {product.materialCare && product.materialCare.length > 0 ? (
                    <ul className="mt-3 list-disc list-inside text-sm text-neutral-700 space-y-1">
                      {product.materialCare.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-neutral-600">Follow standard care instructions.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* You may also like */}
      <section className="py-8 sm:py-12 border-t border-neutral-200">
        <Container>
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-bold tracking-widest uppercase text-black">You may also like</h2>
            <span className="text-xs text-black/60">Recommended</span>
          </div>
          <div className="mt-6">
            <Carousel>
              <CarouselPrevious />
              <CarouselContent>
                {related.slice(0, 8).map((p) => (
                  <CarouselItem key={p.slug} className="basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <ProductCard
                      slug={p.slug}
                      name={p.name}
                      price={p.price}
                      currency={p.currency}
                      image={p.images[0]}
                      rating={p.rating}
                      reviewsCount={p.reviewsCount}
                      inStock={p.inStock}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext />
            </Carousel>
          </div>
        </Container>
      </section>
    </main>
  );
}
