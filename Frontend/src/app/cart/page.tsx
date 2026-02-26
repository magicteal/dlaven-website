"use client";

import Container from "@/components/Container";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import CheckoutProgress from "@/components/CheckoutProgress";
import DetailRow from "@/components/DetailRow";
import { fmt } from "@/lib/utils";
import {
  Lock,
  Minus,
  Plus,
  RefreshCcw,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { cart, update, remove, subtotal, count } = useCart();
  const router = useRouter();
  const itemLabel = count === 1 ? "ITEM" : "ITEMS";
  const isEmpty = !cart || cart.items.length === 0;

  const infoAside = (
    <aside className="space-y-6">
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
  );

  return (
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-24">
      <Container>
        {/* Progress */}
        <CheckoutProgress current="cart" />

        <h1 className="mt-10 text-sm tracking-[0.25em] uppercase">
          {isEmpty ? "Your cart" : `You have ${count} ${itemLabel} in your cart.`}
        </h1>

        {isEmpty ? (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
            <section className="bg-white border border-black/10">
              <div className="px-8 py-12 sm:py-16 flex flex-col items-center text-center">
                <div className="h-10 w-10 rounded-full border border-black/15 grid place-items-center text-black/70">
                  <ShoppingBag size={18} />
                </div>
                <h2 className="mt-6 text-sm tracking-[0.25em] uppercase">Your cart is empty</h2>
                <p className="mt-3 text-sm text-black/60 max-w-md">
                  Explore the collection and return when you have found something you love.
                </p>
                <Button
                  className="mt-8 h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-[0.25em] uppercase"
                  onClick={() => router.push("/products")}
                >
                  Continue shopping
                </Button>
              </div>
            </section>

            {infoAside}
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
            {/* LEFT — CART */}
            <section className="space-y-8">
              <div className="bg-white border border-black/10">
                <div className="px-8 py-6 border-b border-black/10 text-xs tracking-[0.3em] uppercase">
                  You have {count} {itemLabel} in your cart.
                </div>

                <div className="px-8 py-6 space-y-8">
                  {cart.items.map((item) => {
                    const key = `${item.productSlug}:${item.size ?? "default"}`;
                    const unit = fmt(item.price);
                    const lineTotal = fmt(item.price * item.quantity);

                    return (
                      <div key={key} className="flex items-start justify-between gap-6 border-b border-black/10 pb-8">
                        <div className="flex gap-5 min-w-0">
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

                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.productSlug}`}
                              className="block text-sm font-medium hover:underline truncate"
                            >
                              {item.name}
                            </Link>
                            <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-black/60">
                              Ref: {item.productSlug}
                            </div>
                            {item.size && (
                              <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-black/60">
                                Size {item.size}
                              </div>
                            )}

                            <div className="mt-4 flex items-center gap-3">
                              <button
                                onClick={() => {
                                  const q = item.quantity - 1;
                                  if (q <= 0) remove(item.productSlug, item.size);
                                  else update(item.productSlug, q, item.size);
                                }}
                                className="h-8 w-8 border border-black/20 grid place-items-center hover:bg-black hover:text-white transition"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <div className="w-8 text-center text-sm">{item.quantity}</div>
                              <button
                                onClick={() => update(item.productSlug, item.quantity + 1, item.size)}
                                className="h-8 w-8 border border-black/20 grid place-items-center hover:bg-black hover:text-white transition"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => remove(item.productSlug, item.size)}
                              className="mt-3 text-[11px] uppercase tracking-[0.2em] text-black/60 hover:text-black transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-sm font-medium">{lineTotal}</div>
                      </div>
                    );
                  })}

                  <div className="space-y-4 text-sm">
                    <DetailRow label="Subtotal" value={fmt(subtotal)} />
                    <DetailRow label="Shipping" value="-" muted />
                    <div className="text-xs text-black/50">Shipping costs will be calculated during checkout</div>
                    <DetailRow label="Taxes" value="-" muted />
                    <div className="text-xs text-black/50">Taxes will be calculated during checkout</div>
                  </div>

                  <div className="border-t border-black/10 pt-4">
                    <DetailRow label="Total" value={fmt(subtotal)} bold />
                  </div>
                </div>
              </div>

              <div className="bg-white border border-black/10 px-8 py-5 flex items-center justify-between">
                <div className="text-xs tracking-[0.3em] uppercase">Gifting</div>
                <input
                  type="checkbox"
                  className="h-4 w-4 border border-black/40"
                  aria-label="Add gifting"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-[0.25em] uppercase"
                  onClick={() => router.push("/checkout/address")}
                >
                  Checkout
                </Button>
              </div>
            </section>

            {/* RIGHT — INFO */}
            {infoAside}
          </div>
        )}
      </Container>
    </main>
  );
}

/* helpers moved to shared components */
