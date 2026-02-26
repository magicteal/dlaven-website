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
import { ArrowLeft, Lock, RefreshCcw, Truck, CreditCard, QrCode } from "lucide-react";

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
  const { cart, subtotal, refresh } = useCart();
  const router = useRouter();
  const [addr, setAddr] = useState<Address>({});
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [paying, setPaying] = useState(false);
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
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to start payment";
      alert(msg);
      setPaying(false);
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
          {/* LEFT */}
          <div className="space-y-14 max-w-2xl">
            {/* ADDRESS */}
            <section className="bg-white border border-black/10 p-8">
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
            <section className="bg-white border border-black/10 p-8">
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
                        {fmt(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* PAYMENT METHOD */}
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
              <div className="px-6 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase flex items-center justify-between">
                <span>Summary</span>
                <span className="text-black/50">▾</span>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-4 text-sm">
                  <DetailRow label="Subtotal" value={fmt(subtotal)} />
                  <DetailRow label="Shipping" value="FedEx – Ground" muted />
                  <DetailRow label="Taxes" value="Calculated at checkout" muted />
                </div>

                <div className="mt-6 border-t border-black/10 pt-4">
                  <DetailRow label="Total" value={fmt(subtotal)} bold />
                </div>

                <Button
                  className="mt-8 w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
                  onClick={onPayNow}
                  disabled={paying}
                >
                  {paying ? "Processing…" : "COMPLETE PAYMENT"}
                </Button>
              </div>
            </div>

            <div className="bg-white border border-black/10 p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">The Orange Box</h2>
              <div className="mt-5 flex gap-4">
                <div className="relative h-16 w-16 bg-orange-500 shrink-0">
                  <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black/70" />
                  <span className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-black/70" />
                  <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-black" />
                </div>
                <p className="text-sm text-black/70">
                  Orders arrive in our signature box with a Dlaven ribbon.
                </p>
              </div>
            </div>

            <div className="bg-white border border-black/10 p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">Customer Service</h2>
              <div className="mt-4 text-sm text-black/70">Monday to Saturday 10am - 9pm EST</div>
              <div className="mt-2 text-sm underline underline-offset-4">800-441-4488</div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.2em] text-black/70">
                <div className="flex flex-col items-center gap-2">
                  <Truck size={18} />
                  <span>Free standard delivery</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <RefreshCcw size={18} />
                  <span>Returns & exchanges</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Lock size={18} />
                  <span>Shop securely</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
