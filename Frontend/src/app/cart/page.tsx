"use client";

import Container from "@/components/Container";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import CheckoutProgress from "@/components/CheckoutProgress";
import DetailRow from "@/components/DetailRow";
import { fmt } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, update, remove, subtotal, count } = useCart();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white pt-24 pb-20">
      <Container>
        {/* Progress */}
        <CheckoutProgress current="cart" />

        <h1 className="mt-10 text-sm tracking-[0.25em] uppercase">You have {count} item in your cart</h1>

        {!cart || cart.items.length === 0 ? (
          <div className="mt-12 text-sm text-neutral-600">
            Your cart is empty.{" "}
            <Link href="/products" className="underline underline-offset-4">
              Continue shopping
            </Link>
            .
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16">
            {/* LEFT — ITEMS */}
            <div className="space-y-10">
              {cart.items.map((item) => {
                const key = `${item.productSlug}:${item.size ?? "default"}`;
                const unit = new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: item.currency,
                  maximumFractionDigits: 0,
                }).format(item.price);
                const lineTotal = new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: item.currency,
                  maximumFractionDigits: 0,
                }).format(item.price * item.quantity);

                return (
                  <div key={key} className="flex items-start justify-between gap-6 border-b border-black/10 pb-10">
                    <div className="flex gap-6 min-w-0">
                      <div className="relative w-24 h-28 bg-neutral-100 shrink-0">
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

                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="block text-sm font-medium hover:underline truncate"
                        >
                          {item.name}
                        </Link>
                        {item.size && (
                          <div className="mt-1 text-xs uppercase tracking-wider text-black/60">
                            Size {item.size}
                          </div>
                        )}
                        <div className="mt-2 text-xs text-black/60">{unit} each</div>

                        <div className="mt-6 flex items-center gap-4">
                          <button
                            onClick={() => {
                              const q = item.quantity - 1;
                              if (q <= 0) remove(item.productSlug, item.size);
                              else update(item.productSlug, q, item.size);
                            }}
                            className="h-9 w-9 border border-black/20 grid place-items-center hover:bg-black hover:text-white transition"
                          >
                            <Minus size={14} />
                          </button>
                          <div className="w-10 text-center text-sm">{item.quantity}</div>
                          <button
                            onClick={() => update(item.productSlug, item.quantity + 1, item.size)}
                            className="h-9 w-9 border border-black/20 grid place-items-center hover:bg-black hover:text-white transition"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <div className="text-sm font-medium">{lineTotal}</div>
                      <button
                        onClick={() => remove(item.productSlug, item.size)}
                        className="text-black/50 hover:text-black transition"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — SUMMARY */}
            <aside className="sticky top-28 h-fit border border-black/10 p-8 bg-[#f7f4ef]">
              <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Summary</h2>

              <div className="space-y-4 text-sm">
                <DetailRow label="Subtotal" value={fmt(subtotal, cart.items[0].currency)} />
                <DetailRow label="Shipping" value="Calculated at checkout" muted />
                <DetailRow label="Taxes" value="Calculated at checkout" muted />
              </div>

              <div className="mt-6 border-t border-black/10 pt-6">
                <DetailRow label="Total" value={fmt(subtotal, cart.items[0].currency)} bold />
              </div>

              <Button
                className="mt-10 w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
                onClick={() => router.push("/checkout/address")}
              >
                CHECKOUT
              </Button>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
