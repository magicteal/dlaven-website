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
  currency: string;
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
    <main>
      <section className="relative w-full flex items-center justify-center text-center text-white h-[40vh] min-h-[280px]">
        <div className="absolute inset-0">
          <Image
            src="/images/dl-service-bg.jpg"
            alt="DL Barry background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div className="relative z-10 p-4">
          <h1 className="text-4xl font-bold tracking-widest uppercase">
            DL Barry
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-white/90">
            Bespoke made-to-measure tailoring — a service tailored to precision
            and luxury. Contact our advisors to book a consultation.
          </p>
        </div>
      </section>

      <Container className="py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold">Bespoke Tailoring</h2>
          <p className="mt-4 text-sm text-black/70">
            DL Barry offers personalized fittings and handcrafted garments.
            Please get in touch with our Client Advisors to schedule an
            appointment.
          </p>
          <div className="mt-6 text-sm text-black/80">
            {user ? (
              <div>
                {loading ? (
                  <span>Checking your DL Barry access…</span>
                ) : err ? (
                  <span className="text-red-600">{err}</span>
                ) : (
                  <div className="space-y-1">
                    <div>
                      Barry entitlements available:{" "}
                      <strong>
                        {entitlements?.barryEntitlementsAvailable ?? 0}
                      </strong>
                    </div>
                    <div>
                      Privé purchases counted:{" "}
                      <strong>{entitlements?.privePurchasesCount ?? 0}</strong>{" "}
                      (earn 1 Barry access every 11)
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <span>Sign in to view your DL Barry access.</span>
            )}
          </div>
          <div className="mt-6">
            <Link
              href="/contact"
              className="inline-block px-6 py-3 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white"
            >
              Contact an Advisor
            </Link>
          </div>
        </div>
        <div className="mt-12">
          {loadingProducts ? (
            <p className="text-center text-neutral-700">
              Loading DL Barry products…
            </p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  currency={p.currency}
                  image={(p.images && p.images[0]) || "/images/placeholder.png"}
                  inStock={p.inStock}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-neutral-700">
              No DL Barry products are currently available.
            </p>
          )}
        </div>
      </Container>
    </main>
  );
}
