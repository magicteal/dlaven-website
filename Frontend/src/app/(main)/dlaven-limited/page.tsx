"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import type { Product } from "@/types/product";
import Image from "next/image";

export default function DlavenLimitedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLimitedProducts() {
      try {
        const productResponse = await api.listProducts({ tag: "dl-limited" });
        setProducts(productResponse.items as Product[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchLimitedProducts();
  }, []);

  return (
    <main className="min-h-screen pt-28 sm:pt-32 pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[380px] flex items-center justify-center text-center text-white mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/dl-service-bg.jpg"
            alt="Dlaven Limited background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 p-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#E2DDD7] font-medium mb-2">
            Rare & Numbered Editions
          </p>
          <h1 className="font-le-grand text-4xl sm:text-6xl font-normal tracking-widest uppercase text-white" data-reveal="scale">
            D&apos;LAVÉN LIMITED
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#E2DDD7]/90 leading-relaxed" data-reveal="fade" data-delay="0.2">
            An exclusive collection released in limited quantities for our most valued clientele.
          </p>
        </div>
      </section>

      <Container className="pb-16 sm:pb-24">
        <div>
          <div className="text-center mb-12">
            <h2 className="font-le-grand text-2xl sm:text-4xl font-normal tracking-widest uppercase" style={{ color: "#431717" }} data-reveal="slideUp">
              Limited Collection
            </h2>
            <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />
          </div>

          {loading ? (
            <p className="mt-8 text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
              Loading limited edition creations...
            </p>
          ) : error ? (
            <p className="mt-8 text-center text-xs text-red-700 uppercase tracking-widest">{error}</p>
          ) : products.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  image={(p.images && p.images[0]) || "/images/placeholder.png"}
                  inStock={p.inStock}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
              No limited products available at this moment.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
