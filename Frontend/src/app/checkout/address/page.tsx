"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import CheckoutProgress from "@/components/CheckoutProgress";
import DetailRow from "@/components/DetailRow";
import { fmt } from "@/lib/utils";
import { useCart } from "@/components/providers/CartProvider";
import { Store, Truck, Lock, RefreshCcw } from "lucide-react";

type Address = {
  id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
};

export default function CheckoutAddressPage() {
  const { user, loading } = useAuth();
  const { cart, subtotal } = useCart();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [newAddr, setNewAddr] = useState<Address>({});
  const [busy, setBusy] = useState(false);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const itemLabel = itemCount === 1 ? "ITEM" : "ITEMS";

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace("/login");
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.listAddresses();
        const list = res.addresses || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        setSelectedId(def ? String(def.id) : "new");
      } catch {
        setAddresses([]);
        setSelectedId("new");
      }
    }
    if (isLoggedIn) load();
  }, [isLoggedIn]);

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (selectedId === "new" || !selectedId) {
        const created = await api.createAddress({ ...newAddr, isDefault: addresses.length === 0 });
        if (created.address?.id) await api.setDefaultAddress(created.address.id);
      } else {
        await api.setDefaultAddress(selectedId);
      }
      router.replace("/checkout/confirm");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-24">
      <Container>
        <CheckoutProgress current="checkout" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          {/* LEFT */}
          <form onSubmit={onContinue} className="space-y-8">
            <section className="bg-white border border-black/10">
              <div className="px-8 py-5 border-b border-black/10 flex items-center justify-between text-xs tracking-[0.3em] uppercase">
                <span>Account</span>
                <span className="text-black/60 tracking-normal text-[11px] uppercase">{user?.email || ""}</span>
              </div>
            </section>

            <section className="bg-white border border-black/10">
              <div className="px-8 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase">Delivery</div>
              <div className="px-8 py-5 border-b border-black/10 grid grid-cols-2 text-center text-xs uppercase tracking-[0.2em]">
                <div className="flex flex-col items-center gap-2">
                  <Truck size={18} />
                  <span>Ship to an address</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-black/40">
                  <Store size={18} />
                  <span>Collect in store</span>
                </div>
              </div>

              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs tracking-[0.25em] uppercase">Shipping address</h2>
                  <span className="text-[11px] text-black/50">* Required information</span>
                </div>

                {addresses.length > 0 && (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className="flex items-start gap-4 border border-black/10 p-5 cursor-pointer hover:border-black transition"
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedId === String(a.id)}
                          onChange={() => setSelectedId(String(a.id))}
                          className="mt-1"
                        />
                        <div className="text-sm leading-relaxed">
                          <div className="font-medium">{a.fullName}</div>
                          <div>{a.line1}</div>
                          {a.line2 && <div>{a.line2}</div>}
                          <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}</div>
                          <div>{a.country}</div>
                          {a.phone && <div className="mt-1">{a.phone}</div>}
                        </div>
                      </label>
                    ))}

                    <label className="flex items-center gap-3 text-sm cursor-pointer">
                      <input type="radio" name="address" checked={selectedId === "new"} onChange={() => setSelectedId("new")} />
                      Use a new address
                    </label>
                  </div>
                )}

                {selectedId === "new" && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 gap-4 max-w-xl">
                      <Text label="Full name" value={newAddr.fullName || ""} onChange={(v) => setNewAddr((p) => ({ ...p, fullName: v }))} />
                      <Text label="Phone" value={newAddr.phone || ""} onChange={(v) => setNewAddr((p) => ({ ...p, phone: v }))} />
                      <Text label="Address line 1" value={newAddr.line1 || ""} onChange={(v) => setNewAddr((p) => ({ ...p, line1: v }))} />
                      <Text label="Address line 2" value={newAddr.line2 || ""} onChange={(v) => setNewAddr((p) => ({ ...p, line2: v }))} />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Text label="City" value={newAddr.city || ""} onChange={(v) => setNewAddr((p) => ({ ...p, city: v }))} />
                        <Text label="State" value={newAddr.state || ""} onChange={(v) => setNewAddr((p) => ({ ...p, state: v }))} />
                        <Text label="Postal code" value={newAddr.postalCode || ""} onChange={(v) => setNewAddr((p) => ({ ...p, postalCode: v }))} />
                      </div>
                      <Text label="Country" value={newAddr.country || ""} onChange={(v) => setNewAddr((p) => ({ ...p, country: v }))} />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white border border-black/10 px-8 py-6">
              <div className="text-xs tracking-[0.25em] uppercase">Payment</div>
            </section>

            <Button
              type="submit"
              disabled={busy}
              className="h-12 px-12 rounded-none bg-black text-white tracking-widest hover:bg-black/90"
            >
              {busy ? "Saving…" : "Continue"}
            </Button>
          </form>

          {/* RIGHT — SUMMARY */}
          <aside className="space-y-6">
            <div className="bg-white border border-black/10">
              <div className="px-6 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase flex items-center justify-between">
                <span>Summary</span>
                <span className="text-black/50">▾</span>
              </div>
              <div className="px-6 py-6">
                <div className="text-xs tracking-[0.25em] uppercase mb-4">
                  You have {itemCount} {itemLabel} in your cart.
                </div>

                {cart?.items?.length ? (
                  <div className="space-y-4">
                    {cart.items.map((item) => {
                      const key = `${item.productSlug}:${item.size ?? "default"}`;
                      return (
                        <div key={key} className="flex items-center justify-between gap-4 text-sm">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-black/60 text-xs mt-1">Qty {item.quantity}</div>
                          </div>
                          <div className="font-medium">{fmt(item.price * item.quantity)}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-black/60">Your cart is empty.</div>
                )}

                <div className="mt-6 space-y-4 text-sm">
                  <DetailRow label="Subtotal" value={fmt(subtotal)} />
                  <DetailRow label="Shipping" value="-" muted />
                  <div className="text-xs text-black/50">Shipping costs will be calculated during checkout</div>
                  <DetailRow label="Taxes" value="-" muted />
                  <div className="text-xs text-black/50">Taxes will be calculated during checkout</div>
                </div>

                <div className="mt-6 border-t border-black/10 pt-4">
                  <DetailRow label="Total" value={fmt(subtotal)} bold />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 p-6">
              <h2 className="text-xs tracking-[0.3em] uppercase">Gift from Dlaven</h2>
              <div className="mt-5 flex gap-4">
                <div className="relative h-16 w-16 bg-orange-500 shrink-0">
                  <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black/70" />
                  <span className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-black/70" />
                  <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 bg-black" />
                </div>
                <p className="text-sm text-black/70">Gift from Dlaven.</p>
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

/* ---------------- components ---------------- */

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] uppercase mb-1 text-black/60">{label}</label>
      <input
        className="w-full border-b border-black/30 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* helpers moved to shared components */
