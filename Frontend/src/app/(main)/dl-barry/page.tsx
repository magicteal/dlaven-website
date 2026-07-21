"use client";

import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  slug: string;
  name: string;
  price: number;
  images: string[];
  inStock?: boolean;
};

export default function DlBarryPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [entitlements, setEntitlements] = useState<{
    privePurchasesCount: number;
    barryEntitlementsAvailable: number;
  } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await api.getMyEntitlements();
        if (!cancelled) setEntitlements(res.item);
      } catch (e: unknown) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Failed to load status");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingProducts(true);
      try {
        const res = await api.listProducts({ tag: "dl-barry" });
        if (!cancelled) setProducts((res.items as unknown as Product[]) ?? []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen pb-24" style={{ backgroundColor: "#F6F4E6" }}>
      <section className="relative w-full h-[75vh] sm:h-[85vh] min-h-[500px] flex items-center justify-center text-center text-white mb-16">
        <div className="absolute inset-0">
          <Image
            src="/images/hero_bg.png"
            alt="DL Barry background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 p-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-[#E2DDD7] font-medium mb-2">
            Bespoke Made-To-Measure
          </p>
          <h1 className="font-le-grand text-4xl sm:text-6xl font-normal tracking-widest uppercase text-white" data-reveal="scale">
            DL BARRY
          </h1>
          <p className="mt-4 text-xs sm:text-sm text-[#E2DDD7]/90 leading-relaxed" data-reveal="fade" data-delay="0.2">
            Bespoke made-to-measure tailoring — a service tailored to precision and luxury. Contact our advisors to book a consultation.
          </p>
        </div>
      </section>

      <Container className="pb-16 sm:pb-24">
        <div className="max-w-3xl mx-auto text-center p-8 sm:p-12 border" style={{ backgroundColor: "rgba(255,255,255,0.55)", borderColor: "rgba(67,23,23,0.12)" }}>
          <h2 className="font-le-grand text-2xl sm:text-3xl font-normal tracking-widest uppercase" style={{ color: "#431717" }} data-reveal="slideUp">
            Bespoke Tailoring & Privé Access
          </h2>
          <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: "rgba(111,61,36,0.3)" }} />

          <p className="mt-3 text-xs sm:text-sm leading-relaxed" style={{ color: "#431717", opacity: 0.8 }} data-reveal="fade" data-delay="0.15">
            DL Barry offers personalized fittings and handcrafted garments. Please get in touch with our Client Advisors to schedule a private fitting appointment.
          </p>

          <div className="mt-6 text-xs sm:text-sm uppercase tracking-wider" style={{ color: "#431717" }}>
            {user ? (
              <div className="p-4 border border-[#431717]/15 bg-[#F6F4E6]/60 inline-block text-left space-y-1.5">
                {loading ? (
                  <span>Checking your DL Barry access status…</span>
                ) : err ? (
                  <span className="text-red-700">{err}</span>
                ) : (
                  <>
                    <div>
                      Barry Entitlements Available:{" "}
                      <strong className="font-semibold text-[#6F3D24]">
                        {entitlements?.barryEntitlementsAvailable ?? 0}
                      </strong>
                    </div>
                    <div>
                      Privé Purchases Counted:{" "}
                      <strong className="font-semibold text-[#6F3D24]">{entitlements?.privePurchasesCount ?? 0}</strong>{" "}
                      <span className="text-[10px] opacity-70">(Earn 1 Barry access for every 11 Privé purchases)</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <span className="opacity-75">Sign in to view your bespoke DL Barry access status.</span>
            )}
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-md"
              style={{ backgroundColor: "#431717" }}
            >
              <span className="relative z-10">Contact an Advisor</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "#6F3D24" }} />
            </Link>
          </div>
        </div>

        <div className="mt-16">
          {loadingProducts ? (
            <p className="text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
              Loading DL Barry creations…
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
            <p className="text-center text-xs uppercase tracking-widest" style={{ color: "#431717", opacity: 0.7 }}>
              No DL Barry products are currently available.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
