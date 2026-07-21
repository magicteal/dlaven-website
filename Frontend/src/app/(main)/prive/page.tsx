"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";
import Image from "next/image";
import { Input } from "@/components/ui/input";

type Product = {
  slug: string;
  name: string;
  price: number;
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
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      {/* Hero */}
      <section className="relative w-full h-[75vh] sm:h-[85vh] min-h-[500px] flex items-center justify-center overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/prive-hero.jpg"
            alt="DL Privé Edition"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10 px-6 text-center w-full max-w-[1400px]">
          <p className="text-xs uppercase tracking-[0.35em] text-[#E2DDD7] font-medium mb-3">
            Invitation Only Access
          </p>
          <h1
            className="font-le-grand text-4xl sm:text-6xl md:text-7xl font-normal text-white uppercase tracking-widest leading-none"
            aria-label="DL PRIVÉ EDITION"
          >
            DL PRIVÉ EDITION
          </h1>

          <div className="mt-8 flex justify-center">
            <a
              href="#access"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/70 text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-[#431717] transition-all duration-300"
              style={{
                backdropFilter: 'blur(4px)',
              }}
            >
              Get Access
            </a>
          </div>
        </div>
      </section>

      <Container id="access" className="pb-16 sm:pb-24">
        {!unlocked ? (
          <div
            className="max-w-md mx-auto p-8 sm:p-12 border text-center"
            style={{
              backgroundColor: "rgba(255,255,255,0.55)",
              borderColor: "rgba(67,23,23,0.12)",
            }}
          >
            <h2 className="font-le-grand text-2xl font-normal tracking-widest uppercase" style={{ color: "#431717" }}>
              Enter Access Code
            </h2>
            <div className="h-px w-12 mx-auto my-3" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />
            <p className="mt-2 text-xs sm:text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.8 }}>
              Enter your exclusive D&apos;LAVÉN Privé code to access our most private collection.
            </p>
            <form onSubmit={onVerify} className="mt-6 flex flex-col sm:flex-row gap-3">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ENTER YOUR CODE"
                maxLength={16}
                required
                className="bg-transparent border-[#431717]/30 text-[#431717] text-xs uppercase tracking-widest placeholder:text-[#431717]/40 rounded-none h-12"
              />
              <button
                type="submit"
                disabled={verifying}
                className="px-8 h-12 text-xs uppercase tracking-[0.2em] font-medium text-white transition-colors duration-300 disabled:opacity-60 shrink-0"
                style={{ backgroundColor: "#431717" }}
              >
                {verifying ? "Verifying..." : "Unlock"}
              </button>
            </form>
            {verifyError ? (
              <p className="mt-3 text-center text-red-700 text-xs uppercase tracking-wider font-semibold">
                {verifyError}
              </p>
            ) : null}
            <p className="mt-6 text-[10px] uppercase tracking-wider leading-relaxed" style={{ color: "#6F3D24" }}>
              Note: Privé codes are single-use and assigned directly to registered client advisory profiles.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: "#6F3D24" }}>
                  Unlocked Privé Access
                </p>
                <h2 className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase" style={{ color: "#431717" }}>
                  Privé Collection
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setUnlocked(false);
                  try {
                    sessionStorage.removeItem(SESSION_KEY);
                  } catch {}
                }}
                className="px-6 py-2.5 text-xs uppercase tracking-wider border transition-colors"
                style={{ borderColor: "#431717", color: "#431717" }}
              >
                Lock Collection
              </button>
            </div>

            {loadingProducts ? (
              <p className="mt-8 text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
                Loading Privé creations...
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
                    image={
                      (p.images && p.images[0]) || "/images/placeholder.png"
                    }
                    inStock={p.inStock}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-8 text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
                No Privé products available at this moment.
              </p>
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
