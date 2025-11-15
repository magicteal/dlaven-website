"use client";

import Container from "@/components/Container";
import Image from "next/image";
import { shimmerBase64 } from "@/lib/shimmer";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, update, remove, subtotal, count } = useCart();
  const router = useRouter();

  return (
    <main className="pt-20 pb-16">
      <Container>
        <h1 className="text-2xl font-bold tracking-widest uppercase">Your Cart</h1>
        {(!cart || cart.items.length === 0) ? (
          <div className="mt-8 text-sm text-neutral-700">
            Your cart is empty. <Link href="/products" className="underline">Continue shopping</Link>.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const key = `${item.productSlug}:${item.size ?? "default"}`;
                const unit = new Intl.NumberFormat(undefined, { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(item.price);
                const lineTotal = new Intl.NumberFormat(undefined, { style: "currency", currency: item.currency, maximumFractionDigits: 0 }).format(item.price * item.quantity);
                return (
                  <div key={key} className="flex items-center justify-between gap-4 border-b pb-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="relative w-20 h-20 bg-gray-100 shrink-0">
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
                        <Link href={`/products/${item.productSlug}`} className="text-sm font-medium hover:underline truncate block">
                          {item.name}
                        </Link>
                        {item.size ? (
                          <div className="text-xs text-black/60 mt-0.5">Size: {item.size}</div>
                        ) : null}
                        <div className="text-xs text-black/60">{unit} each</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Decrease quantity"
                          onClick={() => {
                            const newQty = (item.quantity || 0) - 1;
                            if (newQty <= 0) {
                              remove(item.productSlug, item.size);
                            } else {
                              update(item.productSlug, newQty, item.size);
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          className="w-16 text-center text-black"
                          value={item.quantity}
                          onChange={(e) => {
                            const q = parseInt(e.target.value || "0", 10);
                            const next = isNaN(q) ? 0 : q;
                            if (next <= 0) {
                              remove(item.productSlug, item.size);
                            } else {
                              update(item.productSlug, next, item.size);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Increase quantity"
                          onClick={() => update(item.productSlug, (item.quantity || 0) + 1, item.size)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm font-medium w-24 text-right hidden sm:block">{lineTotal}</div>
                      <Button
                        variant="ghost"
                        aria-label="Remove item"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => remove(item.productSlug, item.size)}
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Items</span>
                  <span>{count}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span>Subtotal</span>
                  <span>{new Intl.NumberFormat(undefined, { style: "currency", currency: cart.items[0].currency, maximumFractionDigits: 0 }).format(subtotal)}</span>
                </div>
                <Button className="w-full mt-4 rounded-none" onClick={() => router.push("/checkout/address")}>Checkout</Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  );
}
