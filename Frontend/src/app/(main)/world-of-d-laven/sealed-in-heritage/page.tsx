"use client";

import Head from "next/head";
import Container from "@/components/Container";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export default function SealedInHeritagePage() {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>SEALED IN HERITAGE & SENT WITH LUXURY — World of D'LAVÉN</title>
      </Head>

      <main className="min-h-screen bg-white text-black">
        <Container>
          <div className="py-16 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold uppercase">
              SEALED IN HERITAGE &amp; SENT WITH LUXURY
            </h1>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-4xl mx-auto">
              <div className="relative h-56 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder1.jpg"
                  alt="pack-1"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-56 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder-square.jpg"
                  alt="video placeholder"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative h-56 w-full rounded overflow-hidden bg-gray-100">
                <Image
                  src="/images/placeholder2.jpg"
                  alt="pack-2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <p className="mt-8 text-sm text-black/70 max-w-3xl mx-auto">
              Our packaging is a ritual — each layer protects the creation and
              tells its story. Experience D'LAVÉN from the moment it arrives.
            </p>

            <div className="mt-10">
              {!loading && !user ? (
                <Link
                  href="/login"
                  className="inline-block px-6 py-2 border border-black text-xs uppercase tracking-wider hover:bg-black hover:text-white"
                >
                  Sign in or Register
                </Link>
              ) : (
                <p className="text-sm text-black/60">
                  You're signed in. Thank you.
                </p>
              )}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
