"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Container from "@/components/Container";
import { api, type OrderDTO } from "@/lib/api";
import { useCart } from "@/components/providers/CartProvider";

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const { refresh: refreshCart } = useCart();
  const orderId = useMemo(() => {
    const raw = params?.id;
    return typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  }, [params]);

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshCart().catch(() => {});
  }, [refreshCart]);

  useEffect(() => {
    async function load() {
      if (!orderId) return;
      setLoading(true);
      try {
        const res = await api.getOrderById(orderId);
        setOrder(res.item);
        setError(null);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Failed to load order.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const customerLine = useMemo(() => {
    const fullName = order?.address?.fullName?.trim();
    if (!fullName) return "ORDER CONFIRMATION";
    const upper = fullName.toUpperCase();
    if (/^(MR\.|MR\s|MRS\.|MRS\s|MS\.|MS\s|M\.|M\s)/.test(upper)) return upper;
    return `MR. ${upper}`;
  }, [order]);

  const orderNumber = useMemo(() => {
    if (order?.orderNumber) return order.orderNumber;
    const raw = order?._id || order?.id || "";
    // fallback: derive a stable-ish 10-digit number from the id
    const hex = raw.replace(/[^0-9a-f]/gi, "").slice(-10);
    if (!hex) return "";
    const n = parseInt(hex, 16);
    const digits = String(Math.abs(n) % 10_000_000_000).padStart(10, "0");
    return digits;
  }, [order]);

  const money = useMemo(() => {
    return (amount: number) => {
      try {
        return new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      } catch {
        return `₹${amount.toFixed(2)}`;
      }
    };
  }, []);

  const storePickup = {
    deliveryLabel: "Store pickup – ₹0.00",
    storeLine: "Store: Hermès – Faubourg Saint-Honoré",
    name: "Hermès Paris Faubourg Saint-Honoré",
    address1: "24, rue du Faubourg Saint-Honoré",
    address2: "75008 Paris, France",
    phone: "+33 (0)1 40 17 46 00",
  };

  return (
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-20">
      <Container>
        <div className="mx-auto max-w-4xl">
          {loading ? (
            <div className="text-sm text-black/70">Loading your order…</div>
          ) : error ? (
            <div className="bg-white border border-black/10 p-8">
              <div className="text-xs tracking-[0.25em] uppercase text-black/60">Order</div>
              <div className="mt-3 text-sm text-red-600">{error}</div>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-6 inline-flex border border-black px-6 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                Back to home
              </button>
            </div>
          ) : !order ? (
            <div className="bg-white border border-black/10 p-8">
              <div className="text-xs tracking-[0.25em] uppercase text-black/60">Order</div>
              <div className="mt-3 text-sm">Order not found.</div>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="mt-6 inline-flex border border-black px-6 py-3 text-[10px] tracking-[0.25em] uppercase hover:bg-black hover:text-white transition-colors"
              >
                Back to home
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Top confirmation panel */}
              <section className="bg-white border border-black/10 px-6 sm:px-10 py-10 sm:py-12 text-center">
                <div className="text-xs tracking-[0.35em] uppercase">{customerLine}</div>

                <div className="mt-8 text-sm tracking-[0.18em] uppercase">Order Confirmation</div>
                <div className="mt-3 text-sm text-black/70">Thank you for your order</div>

                <div className="mt-8 text-sm leading-relaxed text-black/80">
                  <div>
                    Your order No. {orderNumber || "—"} is being processed.
                  </div>
                  <div>A confirmation will be sent to you shortly by email.</div>
                </div>

                <div className="mt-10 font-holiday text-5xl sm:text-6xl tracking-wide">
                  GRAZIE!
                </div>
              </section>

              {/* Order summary */}
              <section className="bg-white border border-black/10">
                <div className="px-6 sm:px-10 py-6 border-b border-black/10">
                  <div className="text-xs tracking-[0.35em] uppercase">Order Summary</div>
                </div>

                <div className="divide-y divide-black/10">
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="px-6 sm:px-10 py-8">
                      <div className="grid gap-6 sm:grid-cols-[140px_1fr_auto] items-start">
                        <div className="relative aspect-square w-[120px] sm:w-[140px] border border-black/10 bg-[#faf7f2] overflow-hidden">
                          {it.image ? (
                            <Image
                              src={it.image}
                              alt={it.name}
                              fill
                              className="object-cover"
                              sizes="140px"
                            />
                          ) : null}
                        </div>

                        <div className="text-sm">
                          <div className="text-xs tracking-[0.25em] uppercase text-black/60">Product</div>
                          <div className="mt-2 text-sm tracking-wide uppercase">{it.name}</div>

                          <div className="mt-5 grid gap-2">
                            <Detail label="Color" value={(order as any)?.color || "Noir"} />
                            <Detail label="Reference" value={(order as any)?.reference || "H082060CC89"} />
                            <Detail label="Quantity" value={String(it.quantity)} />
                          </div>
                        </div>

                        <div className="text-sm tracking-wide">
                          {money(it.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-6 sm:px-10 py-8 border-t border-black/10">
                  <div className="space-y-4 text-sm">
                    <Row label="Subtotal" value={money(order.subtotal)} />
                    <Row label="Delivery" value={storePickup.deliveryLabel} />
                    <div className="text-xs tracking-[0.15em] uppercase text-black/60">
                      {storePickup.storeLine}
                    </div>
                    <div className="pt-4 border-t border-black/10" />
                    <Row label="Total" value={money(order.subtotal)} strong />
                  </div>
                </div>
              </section>

              {/* Delivery details */}
              <section className="bg-white border border-black/10 px-6 sm:px-10 py-10">
                <div className="text-xs tracking-[0.35em] uppercase">Delivery Details</div>

                <div className="mt-8 grid gap-10 md:grid-cols-2">
                  <div>
                    <div className="text-xs tracking-[0.25em] uppercase text-black/60">
                      Store Pickup Location
                    </div>
                    <div className="mt-4 text-sm leading-relaxed">
                      <div className="font-medium">{storePickup.name}</div>
                      <div>{storePickup.address1}</div>
                      <div>{storePickup.address2}</div>
                      <div className="mt-2">Phone: {storePickup.phone}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs tracking-[0.25em] uppercase text-black/60">
                      Collected By
                    </div>
                    <div className="mt-4 text-sm leading-relaxed">
                      <div className="font-medium">
                        {order.address?.fullName || order.address?.label || "—"}
                      </div>
                      <div>{order.address?.phone || "—"}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <div className={strong ? "text-sm tracking-[0.25em] uppercase" : "text-sm tracking-[0.18em] uppercase"}>
        {label}
      </div>
      <div className={strong ? "text-sm font-semibold" : "text-sm"}>{value}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-4 text-sm">
      <div className="text-black/60">{label}:</div>
      <div>{value}</div>
    </div>
  );
}
