"use client";

import { useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import type { Product } from "@/data/products";
import Image from "next/image";

export default function DlavenLimitedPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await api.verifyLimitedCode(code);
      if (response.ok) {
        const productResponse = await api.listProducts({
          collection: "dlaven-limited",
        });
        setProducts(productResponse.items as Product[]);
        setUnlocked(true);
      } else {
        setError("Invalid or already used code.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center text-center text-white h-[50vh] min-h-[400px]">
        <div className="absolute inset-0">
          <Image
            src="/images/dl-service-bg.jpg" // Placeholder image
            alt="Dlaven Limited background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-widest uppercase">
            D'LAVÉN LIMITED
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/90">
            An exclusive collection for our most valued clientele.
          </p>
        </div>
      </section>

      <Container className="py-16 sm:py-24">
        {!unlocked ? (
          <div className="max-w-md mx-auto text-center">
            <h2 className="text-xl font-semibold tracking-wider uppercase">
              Enter Your Access Code
            </h2>
            <form
              onSubmit={handleVerifyCode}
              className="mt-6 flex flex-col gap-4"
            >
              <Input
                type="text"
                placeholder="DLPV..."
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="text-center tracking-widest"
                required
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className="rounded-none w-full"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Unlock Collection"}
              </Button>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold tracking-widest uppercase text-black text-center">
              Limited Collection
            </h2>
            {products.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard
                    key={p.slug}
                    slug={p.slug}
                    name={p.name}
                    price={p.price}
                    currency={p.currency}
                    image={
                      (p.images && p.images[0]) || "/images/placeholder.png"
                    }
                    inStock={p.inStock}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-8 text-center text-neutral-700">
                No limited products available at this moment.
              </p>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
