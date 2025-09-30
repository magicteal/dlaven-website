"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

declare global {
  interface Window { Razorpay: new (options: Record<string, unknown>) => { open: () => void } }
}

async function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (typeof (window as Window).Razorpay !== "undefined") return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export default function CheckoutPayPage() {
  const { user, loading } = useAuth();
  const { cart, subtotal, refresh } = useCart();
  const router = useRouter();
  const isLoggedIn = useMemo(() => !!user, [user]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace("/login");
  }, [loading, isLoggedIn, router]);

  async function onPayNow() {
    try {
      setPaying(true);
      // 0) Ensure cart is fresh
      await refresh();
      if (!cart || !cart.items || cart.items.length === 0) {
        alert("Your cart is empty. Please add items before paying.");
        router.replace("/cart");
        return;
      }
      // 1) Create order on backend
      const { order, razorpayOrder, key } = await api.createOrder();
      // 2) Load checkout script
      await loadRazorpayScript();
      // 3) Open Razorpay Checkout
      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "DLaven",
        description: `Order ${order._id || order.id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#000000" },
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            const verified = await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            // Refresh cart so UI clears immediately
            await refresh();
            const oid = verified.order._id || verified.order.id;
            router.replace(`/checkout/success/${encodeURIComponent(String(oid))}`);
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Payment verification failed";
            alert(msg);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to start payment";
      // Provide a more guided recovery path
      if (/Unauthorized/i.test(msg)) {
        alert("Please sign in again to continue to payment.");
        router.replace("/login");
      } else if (/Cart is empty/i.test(msg)) {
        alert("Your cart appears empty. Please add items and try again.");
        router.replace("/cart");
      } else {
        alert(msg);
      }
    } finally {
      // If modal opened, paying will reset on close; keep as true during modal.
    }
  }

  return (
    <main className="pt-20 pb-16">
      <Container>
        <h1 className="text-2xl font-bold">Payment</h1>
        <div className="mt-6 max-w-md">
          <div className="text-sm text-black/70">Amount</div>
          <div className="text-xl font-semibold mt-1">{cart?.items[0] ? new Intl.NumberFormat(undefined, { style: "currency", currency: cart.items[0].currency, maximumFractionDigits: 0 }).format(subtotal) : "—"}</div>
          <Button className="mt-6 rounded-none" onClick={onPayNow} disabled={paying}>{paying ? "Processing…" : "Pay Now"}</Button>
        </div>
      </Container>
    </main>
  );
}
