"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { api } from "@/lib/api";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Address = { fullName?: string; phone?: string; line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string };

export default function CheckoutConfirmPage() {
  const { user, loading } = useAuth();
  const { cart, subtotal } = useCart();
  const router = useRouter();
  const [addr, setAddr] = useState<Address>({});
  const isLoggedIn = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace("/auth/login");
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
    <main className="pt-20 pb-16">
      <Container>
        <h1 className="text-2xl font-bold">Confirm Order</h1>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="mt-2 text-sm text-black/80">
                <div>{addr.fullName}</div>
                <div>{addr.phone}</div>
                <div>{addr.line1}</div>
                {addr.line2 ? <div>{addr.line2}</div> : null}
                <div>{[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}</div>
                <div>{addr.country}</div>
              </div>
              <Button variant="link" className="px-0 mt-2" onClick={() => router.push("/checkout/address")}>Change address</Button>
            </section>

            <section>
              <h2 className="text-lg font-semibold">Items</h2>
              <div className="mt-2 space-y-3">
                {cart?.items.map((item) => {
                  const key = `${item.productSlug}:${item.size ?? "default"}`;
                  return (
                    <div key={key} className="flex items-center gap-3">
                      <div className="relative w-14 h-14 bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-black/60">Qty {item.quantity}{item.size ? ` • Size ${item.size}` : ""}</div>
                      </div>
                      <div className="text-sm">
                        {new Intl.NumberFormat(undefined, { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <div>
            <div className="border p-4">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal</span>
                <span>{cart?.items[0] ? new Intl.NumberFormat(undefined, { style: "currency", currency: cart.items[0].currency, maximumFractionDigits: 0 }).format(subtotal) : "—"}</span>
              </div>
              <Button className="w-full mt-4 rounded-none" onClick={() => router.push("/checkout/pay")}>Proceed to Pay</Button>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
