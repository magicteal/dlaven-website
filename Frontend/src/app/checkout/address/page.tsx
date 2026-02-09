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
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [newAddr, setNewAddr] = useState<Address>({});
  const [busy, setBusy] = useState(false);
  const isLoggedIn = useMemo(() => !!user, [user]);

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
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Container>
        <CheckoutProgress current="checkout" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
          {/* LEFT */}
          <form onSubmit={onContinue} className="space-y-12 max-w-2xl">
            <section>
              <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Delivery</h2>

              {/* <div className="flex border border-black/20 divide-x divide-black/20 mb-8">
                <div className="flex-1 text-center py-4 text-sm font-medium">Ship to an address</div>
                <div className="flex-1 text-center py-4 text-sm text-black/40">Collect in store</div>
              </div> */}

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
            </section>

            {selectedId === "new" && (
              <section>
                <h2 className="text-xs tracking-[0.25em] uppercase mb-6">New address</h2>
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
              </section>
            )}

            <Button
              type="submit"
              disabled={busy}
              className="mt-6 h-12 px-12 rounded-none bg-black text-white tracking-widest hover:bg-black/90"
            >
              {busy ? "Saving…" : "Continue"}
            </Button>
          </form>

          {/* RIGHT — SUMMARY */}
          <aside className="sticky top-28 h-fit border border-black/10 p-8 bg-[#f7f4ef]">
            <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Summary</h2>
            <div className="space-y-4 text-sm">
              <DetailRow label="Subtotal" value={fmt(0, "USD")} />
              <DetailRow label="Shipping" value="Calculated at checkout" muted />
              <DetailRow label="Taxes" value="Calculated at checkout" muted />
            </div>
            <div className="mt-6 border-t border-black/10 pt-6">
              <DetailRow label="Total" value={fmt(0, "USD")} bold />
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
      <label className="block text-xs tracking-wider uppercase mb-1">{label}</label>
      <input
        className="w-full border border-black/20 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/* helpers moved to shared components */
