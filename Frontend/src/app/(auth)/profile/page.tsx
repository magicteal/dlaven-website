"use client";

import Container from "@/components/Container";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading, refresh } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  type Address = { id?: string; label?: string; fullName?: string; phone?: string; line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string; isDefault?: boolean };
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editAddr, setEditAddr] = useState<Address>({});

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
    }
  }, [loading, user, router]);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await api.listAddresses();
        setAddresses(res.addresses);
      } catch {
        setAddresses([]);
      }
    }
    if (user) loadAddresses();
  }, [user]);

  async function onSave() {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await api.updateProfile({ name });
      await refresh();
      setMessage("Profile updated.");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      console.error("[profile] update failed", { name, error: e });
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">Edit Profile</h1>
        {loading ? (
          <p className="mt-4 text-sm text-black/70">Loading...</p>
        ) : user ? (
          <div className="mt-6 grid gap-10 max-w-4xl">
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs uppercase tracking-wider text-black/70">Name</label>
                <input
                  type="text"
                  className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-black/70">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full border border-black/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled
                />
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
              <button type="button" className="px-6 py-3 bg-black text-white text-sm uppercase tracking-wider disabled:opacity-60" onClick={onSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>

            <section>
              <h2 className="text-lg font-semibold">Addresses</h2>
              {addresses === null ? (
                <p className="mt-2 text-sm text-black/60">Loading addresses…</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {addresses.length === 0 ? (
                    <p className="text-sm text-black/60">No saved addresses.</p>
                  ) : (
                    addresses.map((a) => (
                      <div key={a.id} className="border border-black/10 p-3 flex items-start gap-3">
                        {editId === a.id ? (
                          <div className="flex-1">
                            <div className="grid grid-cols-1 gap-2">
                              <Text label="Label (optional)" value={editAddr.label || ""} onChange={(v) => setEditAddr((p) => ({ ...p, label: v }))} />
                              <Text label="Full Name" value={editAddr.fullName || ""} onChange={(v) => setEditAddr((p) => ({ ...p, fullName: v }))} />
                              <Text label="Phone" value={editAddr.phone || ""} onChange={(v) => setEditAddr((p) => ({ ...p, phone: v }))} />
                              <Text label="Address Line 1" value={editAddr.line1 || ""} onChange={(v) => setEditAddr((p) => ({ ...p, line1: v }))} />
                              <Text label="Address Line 2" value={editAddr.line2 || ""} onChange={(v) => setEditAddr((p) => ({ ...p, line2: v }))} />
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Text label="City" value={editAddr.city || ""} onChange={(v) => setEditAddr((p) => ({ ...p, city: v }))} />
                                <Text label="State" value={editAddr.state || ""} onChange={(v) => setEditAddr((p) => ({ ...p, state: v }))} />
                                <Text label="Postal Code" value={editAddr.postalCode || ""} onChange={(v) => setEditAddr((p) => ({ ...p, postalCode: v }))} />
                              </div>
                              <Text label="Country" value={editAddr.country || ""} onChange={(v) => setEditAddr((p) => ({ ...p, country: v }))} />
                            </div>
                            <div className="mt-2 flex gap-2">
                              <button className="px-3 py-1 bg-black text-white text-xs uppercase tracking-wider" onClick={async () => {
                                await api.updateAddressById(a.id!, editAddr);
                                const res = await api.listAddresses();
                                setAddresses(res.addresses);
                                setEditId(null);
                              }}>Save</button>
                              <button className="px-3 py-1 border border-black text-xs uppercase tracking-wider" onClick={() => { setEditId(null); setEditAddr({}); }}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 text-sm text-black/80">
                              <div className="font-medium">{a.label || (a.isDefault ? "Default" : "Address")}</div>
                              <div>{a.fullName}</div>
                              <div>{a.phone}</div>
                              <div>{a.line1}</div>
                              {a.line2 ? <div>{a.line2}</div> : null}
                              <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}</div>
                              <div>{a.country}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {!a.isDefault ? (
                                <button className="px-3 py-1 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white" onClick={async () => {
                                  await api.setDefaultAddress(a.id!);
                                  const res = await api.listAddresses();
                                  setAddresses(res.addresses);
                                }}>Set Default</button>
                              ) : (
                                <span className="text-xs px-2 py-1 bg-black text-white uppercase tracking-wider self-start">Default</span>
                              )}
                              <button className="px-3 py-1 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white" onClick={() => { setEditId(a.id!); setEditAddr(a); }}>Edit</button>
                              <button className="px-3 py-1 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white" onClick={async () => {
                                await api.deleteAddressById(a.id!);
                                const res = await api.listAddresses();
                                setAddresses(res.addresses);
                              }}>Delete</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              <div className="mt-4">
                {!addOpen ? (
                  <button className="px-4 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white" onClick={() => setAddOpen(true)}>Add New Address</button>
                ) : (
                  <form className="max-w-xl grid grid-cols-1 gap-3" onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    await api.createAddress({ ...newAddr, isDefault: !!(addresses && addresses.length === 0) });
                    const res = await api.listAddresses();
                    setAddresses(res.addresses);
                    setNewAddr({});
                    setAddOpen(false);
                  }}>
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
                    <div className="flex gap-2 mt-2">
                      <button type="submit" className="px-4 py-2 bg-black text-white text-sm uppercase tracking-wider">Save</button>
                      <button type="button" className="px-4 py-2 border border-black text-sm uppercase tracking-wider" onClick={() => { setAddOpen(false); setNewAddr({}); }}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </Container>
    </main>
  );
}

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-black/70">{label}</label>
      <input className="mt-1 w-full border border-black/20 px-3 py-2 text-sm" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
