"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import { api, type OrderDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
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
    // Keep cart UI in sync (should be empty after successful order)
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

  function fmtMoney(amount: number, currency: string) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
    } catch {
      return `${currency} ${amount.toFixed(0)}`;
    }
  }

  return (
    <main className="pt-20 pb-16">
      <Container>
        <div className="max-w-3xl">
          {loading ? (
            <div className="text-sm text-black/70">Loading your order…</div>
          ) : error ? (
            <div>
              <h1 className="text-2xl font-bold">Order</h1>
              <p className="mt-2 text-red-600">{error}</p>
              <Button className="mt-4 rounded-none" onClick={() => router.push("/")}>Go home</Button>
            </div>
          ) : !order ? (
            <div>
              <h1 className="text-2xl font-bold">Order</h1>
              <p className="mt-2">Order not found.</p>
              <Button className="mt-4 rounded-none" onClick={() => router.push("/")}>Go home</Button>
            </div>
          ) : (
            <div>
              <h1 className="text-2xl font-bold">Thank you! Your order is placed.</h1>
              <p className="mt-2 text-black/70">Review your order details below. A confirmation has been recorded in your account orders.</p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="text-sm text-black/70">Order ID</div>
                  <div className="font-medium break-all">{order._id || order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-black/70">Date</div>
                  <div className="font-medium">{order.createdAt ? new Date(order.createdAt).toLocaleString() : "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-black/70">Status</div>
                  <div className="font-medium capitalize">{order.status}</div>
                </div>
                <div>
                  <div className="text-sm text-black/70">Total</div>
                  <div className="font-medium">{fmtMoney(order.subtotal, order.currency)}</div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold">Shipping address</h2>
                <div className="mt-2 text-sm leading-relaxed">
                  <div className="font-medium">{order.address?.fullName || order.address?.label || "—"}</div>
                  <div>{order.address?.line1}</div>
                  {order.address?.line2 ? <div>{order.address?.line2}</div> : null}
                  <div>{[order.address?.city, order.address?.state, order.address?.postalCode].filter(Boolean).join(", ")}</div>
                  <div>{order.address?.country}</div>
                  {order.address?.phone ? <div className="mt-1">Phone: {order.address.phone}</div> : null}
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold">Items</h2>
                <div className="mt-3 divide-y border">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="p-3 grid grid-cols-[1fr_auto] gap-3">
                      <div>
                        <div className="font-medium">{it.name}</div>
                        <div className="text-sm text-black/70">{it.productSlug}</div>
                        <div className="text-sm text-black/70">Qty: {it.quantity}{it.size ? ` · Size: ${it.size}` : ""}</div>
                      </div>
                      <div className="text-right font-medium">{fmtMoney(it.price * it.quantity, it.currency)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between font-semibold">
                  <div>Subtotal</div>
                  <div>{fmtMoney(order.subtotal, order.currency)}</div>
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <Button className="rounded-none" onClick={() => router.push("/")}>Continue shopping</Button>
                <Button variant="outline" className="rounded-none" onClick={() => router.push("/me")}>View my orders</Button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
