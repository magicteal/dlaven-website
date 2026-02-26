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
import { ArrowLeft, CreditCard, QrCode } from "lucide-react";

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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");

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
        method: {
          card: paymentMethod === "card",
          upi: paymentMethod === "upi",
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
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
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-20">
      <Container>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <CheckoutProgress current="confirm" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          {/* LEFT — PAYMENT METHOD */}
          <div className="space-y-8">
            <section className="bg-white border border-black/10 p-8">
              <h2 className="text-xs tracking-[0.25em] uppercase mb-8">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Credit Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-6 border-2 transition ${
                    paymentMethod === "card"
                      ? "border-black bg-black/5"
                      : "border-black/20 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card"
                        ? "border-black bg-black"
                        : "border-black/40"
                    }`}>
                      {paymentMethod === "card" && (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-black/70" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Credit/Debit Card</div>
                        <div className="text-[11px] text-black/50">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full p-6 border-2 transition ${
                    paymentMethod === "upi"
                      ? "border-black bg-black/5"
                      : "border-black/20 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "upi"
                        ? "border-black bg-black"
                        : "border-black/40"
                    }`}>
                      {paymentMethod === "upi" && (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <QrCode size={20} className="text-black/70" />
                      <div className="text-left">
                        <div className="text-sm font-medium">UPI</div>
                        <div className="text-[11px] text-black/50">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT — SUMMARY */}
          <aside className="space-y-6">
            <div className="bg-white border border-black/10">
              <div className="px-6 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase">
                Order Summary
              </div>
              <div className="px-6 py-6">
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Subtotal</span>
                    <span className="font-medium">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Shipping</span>
                    <span className="font-medium">—</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-black/60">Taxes</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[0.25em] uppercase font-medium">Total</span>
                    <span className="text-lg font-semibold">{fmt(subtotal)}</span>
                  </div>
                </div>

                <Button
                  className="w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
                  onClick={onPayNow}
                  disabled={paying}
                >
                  {paying ? "Processing…" : "Complete Payment"}
                </Button>
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-white border border-black/10 p-4 text-center">
              <div className="text-[10px] text-black/50 tracking-[0.2em] uppercase">Secure Payment</div>
              <div className="text-[10px] text-black/50 mt-1">Powered by Razorpay</div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
