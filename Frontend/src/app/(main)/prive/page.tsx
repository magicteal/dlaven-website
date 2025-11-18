"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Product = {
  slug: string;
  name: string;
  price: number;
  currency: string;
  images: string[];
  inStock?: boolean;
};

const SESSION_KEY = "prive_unlocked";

export default function DlavenPrivePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState<boolean>(false);

  useEffect(() => {
    // Restore unlocked state from session storage
    try {
      const v = sessionStorage.getItem(SESSION_KEY);
      setUnlocked(v === "1");
    } catch {}
  }, []);

  useEffect(() => {
    if (!unlocked) return;
    async function load() {
      setLoadingProducts(true);
      setError(null);
      try {
        const res = await api.listProducts({ tag: "dl-prive" });
        setProducts((res.items ?? []) as Product[]);
      } catch (e: unknown) {
        setError(
          e instanceof Error ? e.message : "Failed to load Prive products"
        );
      } finally {
        setLoadingProducts(false);
      }
    }
    load();
  }, [unlocked]);

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setVerifying(true);
    try {
      const res = await api.verifyPriveCode(code.trim());
      if (res?.ok) {
        setUnlocked(true);
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      } else {
        setVerifyError("Invalid code");
      }
    } catch (err: unknown) {
      setVerifyError(
        err instanceof Error ? err.message : "Failed to verify code"
      );
    } finally {
      setVerifying(false);
    }
  };

  return (
    <main>
      {/* Hero (updated to match DL PRIVÉ EDITION design) */}
      <section className="relative w-full h-[72vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/prive-hero.jpg"
            alt="DL Privé Edition"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(0,0,0,0.25)]" />
        </div>

        <div className="relative z-10 px-6 text-center w-full max-w-[1400px]">
          <h1
            className="mx-auto text-white leading-[0.85] uppercase"
            style={{
              fontFamily: `Georgia, 'Times New Roman', serif`,
              fontSize: 'clamp(48px, 9vw, 120px)',
              letterSpacing: '0.04em',
            }}
            aria-label="DL PRIVÉ EDITION"
          >
            DL PRIVÉ EDITION
          </h1>

          <div className="mt-6 flex justify-center">
            <a
              href="#access"
              className="inline-flex items-center justify-center px-6 py-2 border border-white/70 text-white text-xs tracking-widest uppercase hover:bg-white/10 transition-all"
              style={{
                backdropFilter: 'blur(4px)',
              }}
            >
              GET ACCESS
            </a>
          </div>
        </div>
      </section>

      <Container className="py-16 sm:py-24">
        {!unlocked ? (
          <div className="max-w-md mx-auto">
            <h2 className="text-center text-xl font-semibold">
              Enter Access Code
            </h2>
            <p className="mt-2 text-center text-sm text-black/70">
              Enter your exclusive D&#39;LAVÉN Privé code to access our most
              exclusive collection.
            </p>
            <form onSubmit={onVerify} className="mt-6 flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your code"
                maxLength={16}
                required
              />
              <Button type="submit" disabled={verifying}>
                {verifying ? "Verifying..." : "Unlock"}
              </Button>
            </form>
            {verifyError ? (
              <p className="mt-3 text-center text-red-600 text-sm">
                {verifyError}
              </p>
            ) : null}
            <p className="mt-6 text-xs text-center text-black/60">
              Note: D&#39;LAVÉN Privé codes are single-use and tied to your
              account. Each code can only be used once and access is verified
              against our records.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-widest uppercase text-black">
                Prive Collection
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setUnlocked(false);
                  try {
                    sessionStorage.removeItem(SESSION_KEY);
                  } catch {}
                }}
              >
                Lock
              </Button>
            </div>
            {loadingProducts ? (
              <p className="mt-8 text-center text-neutral-700">
                Loading products...
              </p>
            ) : error ? (
              <p className="mt-8 text-center text-red-600">{error}</p>
            ) : products.length > 0 ? (
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
                No Prive products available at this moment.
              </p>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
