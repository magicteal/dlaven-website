"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CheckoutProgress from "@/components/CheckoutProgress";
import { fmt } from "@/lib/utils";
import { api } from "@/lib/api";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
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
      await refresh();

      if (!cart || !cart.items.length) {
        router.replace("/cart");
        return;
      }

      const { order, razorpayOrder, key } = await api.createOrder();
      await loadRazorpayScript();

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
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
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
      alert(msg);
    }
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Container>
        <CheckoutProgress current="confirm" />

        <div className="mt-16 max-w-xl">
          <h1 className="text-xs tracking-[0.25em] uppercase mb-6">Payment</h1>

          <div className="border border-black/10 p-10 bg-[#f7f4ef]">
            <div className="text-sm text-black/60 mb-1">Amount</div>
            <div className="text-2xl font-semibold">
              {cart?.items[0] ? fmt(subtotal, cart.items[0].currency) : "—"}
            </div>

            <Button
              className="mt-10 w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
              onClick={onPayNow}
              disabled={paying}
            >
              {paying ? "Processing…" : "Pay now"}
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
