"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import { api, type OrderDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/CartProvider";
import { fmt } from "@/lib/utils";

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

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Container>
        <div className="max-w-3xl">
          {loading ? (
            <div className="text-sm text-black/70">Loading your order…</div>
          ) : error ? (
            <div>
              <h1 className="text-xl tracking-wide uppercase">Order</h1>
              <p className="mt-4 text-red-600">{error}</p>
              <Button className="mt-6 rounded-none" onClick={() => router.push("/")}>
                Go home
              </Button>
            </div>
          ) : !order ? (
            <div>
              <h1 className="text-xl tracking-wide uppercase">Order</h1>
              <p className="mt-4">Order not found.</p>
              <Button className="mt-6 rounded-none" onClick={() => router.push("/")}>
                Go home
              </Button>
            </div>
          ) : (
            <div>
              <h1 className="text-xl tracking-[0.2em] uppercase">Thank you</h1>
              <p className="mt-3 text-black/70">
                Your order has been confirmed. A confirmation is available in your account.
              </p>

              <div className="mt-12 grid gap-10 md:grid-cols-2">
                <Info label="Order ID" value={order._id || order.id || "—"} />
                <Info
                  label="Date"
                  value={order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}
                />
                <Info label="Status" value={order.status} />
                <Info label="Total" value={fmt(order.subtotal)} />
              </div>

              <div className="mt-14">
                <h2 className="text-xs tracking-[0.25em] uppercase mb-4">Shipping address</h2>
                <div className="text-sm leading-relaxed">
                  <div className="font-medium">{order.address?.fullName || order.address?.label || "—"}</div>
                  <div>{order.address?.line1}</div>
                  {order.address?.line2 && <div>{order.address?.line2}</div>}
                  <div>
                    {[order.address?.city, order.address?.state, order.address?.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                  <div>{order.address?.country}</div>
                  {order.address?.phone && <div className="mt-1">Phone: {order.address.phone}</div>}
                </div>
              </div>

              <div className="mt-14">
                <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Items</h2>
                <div className="divide-y border border-black/10">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="p-5 flex justify-between gap-6">
                      <div className="text-sm">
                        <div className="font-medium">{it.name}</div>
                        <div className="text-black/60 mt-1">
                          Qty {it.quantity}
                          {it.size ? ` · Size ${it.size}` : ""}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {fmt(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-between text-sm font-semibold">
                  <span>Subtotal</span>
                  <span>{fmt(order.subtotal)}</span>
                </div>
              </div>

              <div className="mt-16 flex gap-4">
                <Button
                  className="rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
                  onClick={() => router.push("/")}
                >
                  Continue shopping
                </Button>
                <Button
                  variant="outline"
                  className="rounded-none tracking-widest"
                  onClick={() => router.push("/me")}
                >
                  View my orders
                </Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}

/* ---------------- components ---------------- */

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs tracking-wider uppercase text-black/60 mb-1">{label}</div>
      <div className="text-sm font-medium break-all">{value}</div>
    </div>
  );
}
