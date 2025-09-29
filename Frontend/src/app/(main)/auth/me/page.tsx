"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function MePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  type Address = { id?: string; label?: string; fullName?: string; phone?: string; line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string; isDefault?: boolean };
  const [addresses, setAddresses] = useState<Address[] | null>(null);

  // If not logged in, send to login
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
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

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase text-black">My Account</h1>

        {loading ? (
          <p className="mt-4 text-sm text-black/70">Loading...</p>
        ) : user ? (
          <div className="mt-6 grid gap-6 max-w-3xl">
            <section className="border border-black/10 p-4 sm:p-6">
              <h2 className="text-sm uppercase tracking-wider text-black/70">Profile</h2>
              <div className="mt-3 text-sm">
                <p><span className="text-black/60">Name:</span> {user.name || "—"}</p>
                <p className="mt-1"><span className="text-black/60">Email:</span> {user.email}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <Link href="/auth/profile" className="px-4 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white">Edit Profile</Link>
                <Link href="/auth/forgot-password" className="px-4 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white">Reset Password</Link>
              </div>
            </section>

            <section className="border border-black/10 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-wider text-black/70">Addresses</h2>
                <Link href="/auth/profile" className="text-xs px-3 py-1 border border-black uppercase tracking-wider hover:bg-black hover:text-white">Manage</Link>
              </div>
              {addresses === null ? (
                <p className="mt-3 text-sm text-black/60">Loading addresses…</p>
              ) : addresses.length === 0 ? (
                <div className="mt-3">
                  <p className="text-sm text-black/60">No saved addresses.</p>
                  <Link href="/auth/profile" className="mt-3 inline-block px-3 py-2 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white">Add Address</Link>
                </div>
              ) : (
                <div className="mt-3 grid gap-3">
                  {addresses.map((a) => (
                    <div key={a.id} className="border border-black/10 p-3 sm:p-4 flex items-start gap-3">
                      <div className="flex-1 text-sm text-black/80">
                        <div className="font-medium flex items-center gap-2">
                          <span>{a.label || (a.isDefault ? "Default" : "Address")}</span>
                          {a.isDefault ? <span className="text-[10px] px-2 py-0.5 bg-black text-white uppercase tracking-wider">Default</span> : null}
                        </div>
                        <div className="mt-1">{a.fullName}</div>
                        <div>{a.phone}</div>
                        <div>{a.line1}</div>
                        {a.line2 ? <div>{a.line2}</div> : null}
                        <div>{[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}</div>
                        <div>{a.country}</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link href="/auth/profile" className="px-3 py-1 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white">Edit</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="border border-black/10 p-4 sm:p-6">
              <h2 className="text-sm uppercase tracking-wider text-black/70">Orders</h2>
              <p className="mt-2 text-sm text-black/60">You have no recent orders.</p>
            </section>
          </div>
        ) : null}
      </Container>
    </main>
  );
}
