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
  ArrowRight,
  Gift,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, update, remove, subtotal, count } = useCart();
  const router = useRouter();
  const itemLabel = count === 1 ? "ITEM" : "ITEMS";
  const isEmpty = !cart || cart.items.length === 0;

  const infoAside = (
    <aside className="space-y-6">
      {/* Packaging Box */}
      <div
        className="p-8 transition-all"
        style={{
          backgroundColor: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(67,23,23,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <h3
          className="font-le-grand text-sm uppercase tracking-[0.2em] mb-4"
          style={{ color: "#431717" }}
        >
          The Orange Box
        </h3>
        <div className="flex gap-4 items-center">
          <div className="relative h-14 w-14 bg-orange-500 shrink-0 border border-black/20 shadow-sm">
            <span className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black/70" />
            <span className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 bg-black/70" />
            <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 bg-black" />
          </div>
          <p className="text-xs leading-relaxed" style={{ color: "#431717", opacity: 0.85 }}>
            Every order arrives in our signature box with a D&apos; Lavén ribbon.
          </p>
        </div>
      </div>

      {/* Customer Service & Guarantees */}
      <div
        className="p-8 transition-all space-y-6"
        style={{
          backgroundColor: "rgba(255,255,255,0.55)",
          border: "1px solid rgba(67,23,23,0.12)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Headphones className="h-4 w-4" style={{ color: "#6F3D24" }} />
            <h3
              className="font-le-grand text-xs uppercase tracking-[0.2em]"
              style={{ color: "#431717" }}
            >
              Client Assistance
            </h3>
          </div>
          <p className="text-xs" style={{ color: "#431717", opacity: 0.7 }}>
            Monday to Saturday: 9 AM – 11 PM (EST)
          </p>
          <a
            href="tel:+18774822430"
            className="inline-block mt-2 text-xs font-semibold uppercase tracking-widest underline underline-offset-4"
            style={{ color: "#6F3D24" }}
          >
            +1 (877) 482-2430
          </a>
        </div>

        <div className="pt-6 border-t border-[#431717]/10 grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center gap-2">
            <Truck className="h-5 w-5" style={{ color: "#6F3D24" }} />
            <span className="text-[10px] uppercase tracking-wider leading-tight" style={{ color: "#431717", opacity: 0.8 }}>
              Express Shipping
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshCcw className="h-5 w-5" style={{ color: "#6F3D24" }} />
            <span className="text-[10px] uppercase tracking-wider leading-tight" style={{ color: "#431717", opacity: 0.8 }}>
              Complimentary Returns
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="h-5 w-5" style={{ color: "#6F3D24" }} />
            <span className="text-[10px] uppercase tracking-wider leading-tight" style={{ color: "#431717", opacity: 0.8 }}>
              Secure Payment
            </span>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen py-24 sm:py-32" style={{ backgroundColor: "#F6F4E6" }}>
      <Container>
        {/* Progress Stepper */}
        <CheckoutProgress current="cart" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1
            className="font-le-grand text-3xl sm:text-5xl font-normal tracking-widest uppercase mb-3"
            style={{ color: "#431717" }}
          >
            Shopping Bag
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em]" style={{ color: "#6F3D24" }}>
            {isEmpty ? "Your bag is currently empty" : `${count} ${itemLabel} SELECTED`}
          </p>
        </div>

        {isEmpty ? (
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            <section
              className="p-12 sm:p-16 text-center flex flex-col items-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.55)",
                border: "1px solid rgba(67,23,23,0.12)",
                boxShadow: "0 15px 35px -10px rgba(67,23,23,0.05)",
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "rgba(67,23,23,0.06)", color: "#431717" }}
              >
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h2
                className="font-le-grand text-2xl uppercase tracking-widest mb-3"
                style={{ color: "#431717" }}
              >
                Your Bag Is Empty
              </h2>
              <p className="text-xs sm:text-sm max-w-md leading-relaxed mb-8" style={{ color: "#431717", opacity: 0.7 }}>
                Explore our latest creations, heritage jewelry, and signature fragrances to select your pieces.
              </p>
              <button
                onClick={() => router.push("/products")}
                className="group relative inline-flex items-center gap-3 px-10 py-4 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Collections <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6F3D24" }}
                />
              </button>
            </section>

            {infoAside}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-start">
            {/* LEFT — CART ITEMS LIST */}
            <section className="space-y-6">
              <div
                className="p-6 sm:p-8"
                style={{
                  backgroundColor: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(67,23,23,0.12)",
                  boxShadow: "0 15px 35px -10px rgba(67,23,23,0.05)",
                }}
              >
                <div
                  className="pb-6 mb-8 border-b flex items-center justify-between"
                  style={{ borderColor: "rgba(67,23,23,0.12)" }}
                >
                  <span
                    className="font-le-grand text-sm uppercase tracking-[0.2em]"
                    style={{ color: "#431717" }}
                  >
                    Items Summary
                  </span>
                  <span className="text-xs uppercase tracking-wider" style={{ color: "#6F3D24" }}>
                    {count} {itemLabel}
                  </span>
                </div>

                <div className="space-y-8">
                  {cart.items.map((item) => {
                    const key = `${item.productSlug}:${item.size ?? "default"}`;
                    const lineTotal = fmt(item.price * item.quantity);

                    return (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-8 border-b last:border-b-0 last:pb-0"
                        style={{ borderColor: "rgba(67,23,23,0.1)" }}
                      >
                        <div className="flex gap-5 min-w-0 w-full sm:w-auto">
                          {/* Image */}
                          <div className="relative w-24 h-28 bg-[#F6F4E6] shrink-0 border border-[#431717]/10 overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={shimmerBase64(8, 8)}
                            />
                          </div>

                          {/* Details */}
                          <div className="min-w-0 flex-1">
                            <Link
                              href={`/products/${item.productSlug}`}
                              className="font-le-grand text-base sm:text-lg hover:underline truncate block"
                              style={{ color: "#431717" }}
                            >
                              {item.name}
                            </Link>
                            <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: "#6F3D24" }}>
                              REF: {item.productSlug}
                            </p>
                            {item.size && (
                              <p className="text-[10px] uppercase tracking-[0.15em] mt-1" style={{ color: "#431717", opacity: 0.6 }}>
                                Size: {item.size}
                              </p>
                            )}

                            {/* Quantity Controls */}
                            <div className="mt-4 flex items-center gap-4">
                              <div className="flex items-center border" style={{ borderColor: "rgba(67,23,23,0.25)" }}>
                                <button
                                  onClick={() => {
                                    const q = item.quantity - 1;
                                    if (q <= 0) remove(item.productSlug, item.size);
                                    else update(item.productSlug, q, item.size);
                                  }}
                                  className="h-8 w-8 flex items-center justify-center transition-colors hover:bg-[#431717] hover:text-white"
                                  style={{ color: "#431717" }}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="w-8 text-center text-xs font-semibold" style={{ color: "#431717" }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => update(item.productSlug, item.quantity + 1, item.size)}
                                  className="h-8 w-8 flex items-center justify-center transition-colors hover:bg-[#431717] hover:text-white"
                                  style={{ color: "#431717" }}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() => remove(item.productSlug, item.size)}
                                className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] transition-opacity hover:opacity-100"
                                style={{ color: "#c0392b" }}
                              >
                                <Trash2 className="h-3 w-3" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="sm:text-right w-full sm:w-auto flex sm:block justify-between items-center border-t sm:border-t-0 pt-3 sm:pt-0" style={{ borderColor: "rgba(67,23,23,0.1)" }}>
                          <span className="sm:hidden text-xs uppercase tracking-wider text-[#431717]/60">Total:</span>
                          <span className="font-le-grand text-lg font-normal" style={{ color: "#431717" }}>
                            {lineTotal}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal & Breakdown */}
                <div
                  className="mt-10 pt-6 border-t space-y-3"
                  style={{ borderColor: "rgba(67,23,23,0.12)" }}
                >
                  <DetailRow label="Subtotal" value={fmt(subtotal)} />
                  <DetailRow label="Standard Shipping" value="Complimentary" />
                  <DetailRow label="Estimated Taxes" value="Calculated at checkout" muted />
                </div>

                <div
                  className="mt-6 pt-4 border-t"
                  style={{ borderColor: "rgba(67,23,23,0.2)" }}
                >
                  <DetailRow label="Estimated Total" value={fmt(subtotal)} bold />
                </div>
              </div>

              {/* Gift Wrap Toggle */}
              <div
                className="p-6 flex items-center justify-between transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.55)",
                  border: "1px solid rgba(67,23,23,0.12)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Gift className="h-4 w-4" style={{ color: "#6F3D24" }} />
                  <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: "#431717" }}>
                    Include Complimentary Gift Ribbon & Card
                  </span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 accent-[#431717] cursor-pointer"
                  aria-label="Add gift packaging"
                />
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={() => router.push("/checkout/address")}
                className="group relative w-full flex items-center justify-center gap-3 py-5 text-xs uppercase tracking-[0.25em] font-medium text-white transition-all duration-300 overflow-hidden shadow-lg"
                style={{ backgroundColor: "#431717" }}
              >
                <span className="relative z-10 flex items-center gap-3">
                  Proceed To Checkout <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <span
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: "#6F3D24" }}
                />
              </button>
            </section>

            {/* RIGHT — INFO SIDEBAR */}
            {infoAside}
          </div>
        )}
      </Container>
    </main>
  );
}
