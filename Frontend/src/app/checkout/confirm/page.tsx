"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { api } from "@/lib/api";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CheckoutProgress from "@/components/CheckoutProgress";
import DetailRow from "@/components/DetailRow";
import { fmt } from "@/lib/utils";

type Address = {
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export default function CheckoutConfirmPage() {
  const { user, loading } = useAuth();
  const { cart, subtotal } = useCart();
  const router = useRouter();
  const [addr, setAddr] = useState<Address>({});
  const isLoggedIn = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace("/login");
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getAddress();
        setAddr(res.address || {});
      } catch {}
    }
    if (isLoggedIn) load();
  }, [isLoggedIn]);

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Container>
        <CheckoutProgress current="confirm" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          {/* LEFT */}
          <div className="space-y-14 max-w-2xl">
            {/* ADDRESS */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs tracking-[0.25em] uppercase">Shipping address</h2>
                <button
                  onClick={() => router.push("/checkout/address")}
                  className="text-xs underline underline-offset-4"
                >
                  Edit
                </button>
              </div>
              <div className="text-sm leading-relaxed">
                <div className="font-medium">{addr.fullName}</div>
                <div>{addr.line1}</div>
                {addr.line2 && <div>{addr.line2}</div>}
                <div>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}</div>
                <div>{addr.country}</div>
                {addr.phone && <div className="mt-1">{addr.phone}</div>}
              </div>
            </section>

            {/* ITEMS */}
            <section>
              <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Items</h2>
              <div className="space-y-6">
                {cart?.items.map((item) => {
                  const key = `${item.productSlug}:${item.size ?? "default"}`;
                  return (
                    <div key={key} className="flex items-center justify-between gap-6">
                      <div className="flex gap-4 min-w-0">
                        <div className="relative w-20 h-24 bg-neutral-100 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL={shimmerBase64(8, 8)}
                          />
                        </div>
                        <div className="min-w-0 text-sm">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="text-black/60 mt-1">
                            Qty {item.quantity}
                            {item.size ? ` · Size ${item.size}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {new Intl.NumberFormat(undefined, {
                          style: "currency",
                          currency: item.currency,
                          maximumFractionDigits: 0,
                        }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT — SUMMARY */}
          <aside className="sticky top-28 h-fit border border-black/10 p-8 bg-[#f7f4ef]">
            <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Summary</h2>

            <div className="space-y-4 text-sm">
              <DetailRow label="Subtotal" value={fmt(subtotal, cart?.items[0]?.currency || "USD")} />
              <DetailRow label="Shipping" value="FedEx – Ground" muted />
              <DetailRow label="Taxes" value="Calculated at checkout" muted />
            </div>

            <div className="mt-6 border-t border-black/10 pt-6">
              <DetailRow label="Total" value={fmt(subtotal, cart?.items[0]?.currency || "USD")} bold />
            </div>

            <Button
              className="mt-10 w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
              onClick={() => router.push("/checkout/pay")}
            >
              PROCEED TO PAYMENT
            </Button>
          </aside>
        </div>
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
