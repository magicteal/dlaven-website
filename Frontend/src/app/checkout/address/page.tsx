"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Address = { id?: string; label?: string; fullName?: string; phone?: string; line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string; isDefault?: boolean };

export default function CheckoutAddressPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [newAddr, setNewAddr] = useState<Address>({});
  const [busy, setBusy] = useState(false);
  const isLoggedIn = useMemo(() => !!user, [user]);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.replace("/auth/login");
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
        // Ensure default is set to the created address
        if (created.address?.id) await api.setDefaultAddress(created.address.id);
      } else {
        // Set selected as default
        await api.setDefaultAddress(selectedId);
      }
      router.replace("/checkout/confirm");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="pt-20 pb-16">
      <Container>
        <h1 className="text-2xl font-bold">Shipping Address</h1>
        <form onSubmit={onContinue} className="mt-6 grid grid-cols-1 gap-6 max-w-3xl">
          {addresses.length > 0 && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-black/70">Choose saved address</h2>
              <div className="mt-3 space-y-3">
                {addresses.map((a) => (
                  <label key={a.id} className="flex gap-3 items-start border border-black/10 p-3 cursor-pointer">
                    <input type="radio" name="address" className="mt-1" checked={selectedId === String(a.id)} onChange={() => setSelectedId(String(a.id))} />
                    <div className="text-sm">
                      <div className="font-medium">{a.label || (a.isDefault ? "Default" : "Address")}</div>
                      <div>{a.fullName}</div>
                      <div>{a.phone}</div>
                      <div>{a.line1}</div>
                      {a.line2 ? <div>{a.line2}</div> : null}
                      <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}</div>
                      <div>{a.country}</div>
                    </div>
                  </label>
                ))}
                <label className="flex gap-3 items-center cursor-pointer">
                  <input type="radio" name="address" checked={selectedId === "new"} onChange={() => setSelectedId("new")} />
                  <span className="text-sm">Use a new address</span>
                </label>
              </div>
            </section>
          )}

          {selectedId === "new" && (
            <section>
              <h2 className="text-sm uppercase tracking-wider text-black/70">New address</h2>
              <div className="mt-3 grid grid-cols-1 gap-3 max-w-xl">
                <Text label="Label (optional)" value={newAddr.label || ""} onChange={(v) => setNewAddr((p) => ({ ...p, label: v }))} />
                <Text label="Full Name" value={newAddr.fullName || ""} onChange={(v) => setNewAddr((p) => ({ ...p, fullName: v }))} />
                <Text label="Phone" value={newAddr.phone || ""} onChange={(v) => setNewAddr((p) => ({ ...p, phone: v }))} />
                <Text label="Address Line 1" value={newAddr.line1 || ""} onChange={(v) => setNewAddr((p) => ({ ...p, line1: v }))} />
                <Text label="Address Line 2" value={newAddr.line2 || ""} onChange={(v) => setNewAddr((p) => ({ ...p, line2: v }))} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Text label="City" value={newAddr.city || ""} onChange={(v) => setNewAddr((p) => ({ ...p, city: v }))} />
                  <Text label="State" value={newAddr.state || ""} onChange={(v) => setNewAddr((p) => ({ ...p, state: v }))} />
                  <Text label="Postal Code" value={newAddr.postalCode || ""} onChange={(v) => setNewAddr((p) => ({ ...p, postalCode: v }))} />
                </div>
                <Text label="Country" value={newAddr.country || ""} onChange={(v) => setNewAddr((p) => ({ ...p, country: v }))} />
              </div>
            </section>
          )}

          <div>
            <Button type="submit" className="rounded-none" disabled={busy}>{busy ? "Saving…" : "Continue"}</Button>
          </div>
        </form>
      </Container>
    </main>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input className="mt-1 w-full border border-black/20 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
