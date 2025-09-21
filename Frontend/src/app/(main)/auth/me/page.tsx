"use client";

import Container from "@/components/Container";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If not logged in, send to login
  useEffect(() => {
    if (!loading && !user) router.replace("/auth/login");
  }, [loading, user, router]);

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
              <h2 className="text-sm uppercase tracking-wider text-black/70">Orders</h2>
              <p className="mt-2 text-sm text-black/60">You have no recent orders.</p>
            </section>
          </div>
        ) : null}
      </Container>
    </main>
  );
}
