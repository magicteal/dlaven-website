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
import { useCart } from "@/components/providers/CartProvider";
import { ArrowLeft, Store, Truck, Lock, RefreshCcw, CreditCard, QrCode } from "lucide-react";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

async function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return;
  if (typeof (window as Window).Razorpay !== "undefined") return;
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

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
  const { cart, subtotal, refresh } = useCart();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new" | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("Mr.");
  const [company, setCompany] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [zipPlus, setZipPlus] = useState("");
  const [country, setCountry] = useState("United States");
  const [areaCode, setAreaCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [busy, setBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi">("card");
  const [paying, setPaying] = useState(false);
  const isLoggedIn = useMemo(() => !!user, [user]);
  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;
  const itemLabel = itemCount === 1 ? "ITEM" : "ITEMS";

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
        const fullName = [title, firstName, lastName].filter(Boolean).join(" ").trim();
        const zip = zipPlus ? `${postalCode}-${zipPlus}` : postalCode;
        const line2 = [address2, company].filter(Boolean).join(" · ") || undefined;
        const phone = [areaCode, phoneNumber].filter(Boolean).join(" ").trim();
        const created = await api.createAddress({
          fullName,
          phone,
          line1: address1,
          line2,
          city,
          state,
          postalCode: zip,
          country,
          isDefault: addresses.length === 0,
        });
        if (created.address?.id) await api.setDefaultAddress(created.address.id);
      } else {
        await api.setDefaultAddress(selectedId);
      }
      router.replace("/checkout/confirm");
    } finally {
      setBusy(false);
    }
  }

  async function onPayNow() {
    // Validate new address fields if needed
    if (selectedId === "new" || !selectedId) {
      if (!address1 || !firstName || !lastName || !phoneNumber || !city || !state || !postalCode) {
        alert("Please fill in all required address fields before proceeding.");
        return;
      }
    }

    // First save the address
    try {
      setPaying(true);
      if (selectedId === "new" || !selectedId) {
        const fullName = [title, firstName, lastName].filter(Boolean).join(" ").trim();
        const zip = zipPlus ? `${postalCode}-${zipPlus}` : postalCode;
        const line2 = [address2, company].filter(Boolean).join(" · ") || undefined;
        const phone = [areaCode, phoneNumber].filter(Boolean).join(" ").trim();
        const created = await api.createAddress({
          fullName,
          phone,
          line1: address1,
          line2,
          city,
          state,
          postalCode: zip,
          country,
          isDefault: true,
        });
        if (created.address?.id) await api.setDefaultAddress(created.address.id);
      } else {
        await api.setDefaultAddress(selectedId);
      }

      // Then process payment
      await refresh();

      if (!cart || !cart.items.length) {
        router.replace("/cart");
        return;
      }

      const { order, razorpayOrder, key } = await api.createOrder();
      await loadRazorpayScript();

      const rzp = new window.Razorpay({
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "DLaven",
        description: `Order ${order._id || order.id}`,
        order_id: razorpayOrder.id,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
        theme: { color: "#000000" },
        method: {
          card: paymentMethod === "card",
          upi: paymentMethod === "upi",
          netbanking: false,
          wallet: false,
          emi: false,
          paylater: false,
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await api.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            await refresh();
            const oid = verified.order._id || verified.order.id;
            router.replace(`/checkout/success/${encodeURIComponent(String(oid))}`);
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : "Payment verification failed";
            alert(msg);
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to process payment";
      alert(msg);
      setPaying(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#faf7f2] pt-24 pb-24">
      <Container>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase mb-6"
        >
          <ArrowLeft size={14} />
          Back
        </button>
        <CheckoutProgress current="checkout" />

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
          {/* LEFT */}
          <form onSubmit={onContinue} className="space-y-8">
            <section className="bg-white border border-black/10">
              <div className="px-8 py-5 border-b border-black/10 flex items-center justify-between text-xs tracking-[0.3em] uppercase">
                <span>Account</span>
                <span className="text-black/60 tracking-normal text-[11px] uppercase">{user?.email || ""}</span>
              </div>
            </section>

            <section className="bg-white border border-black/10">
              <div className="px-8 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase">Delivery</div>
              <div className="px-8 py-5 border-b border-black/10 grid grid-cols-2 text-center text-xs uppercase tracking-[0.2em]">
                <div className="flex flex-col items-center gap-2 border-b-2 border-black pb-3">
                  <Truck size={18} />
                  <span>Ship to an address</span>
                </div>
                <div className="flex flex-col items-center gap-2 text-black/40">
                  <Store size={18} />
                  <span>Collect in store</span>
                </div>
              </div>

              <div className="px-8 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs tracking-[0.25em] uppercase">Shipping address</h2>
                  <span className="text-[11px] text-black/50">* Required information</span>
                </div>

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

                {selectedId === "new" && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-6">
                        <SelectField
                          label="Location"
                          required
                          value={country}
                          onChange={setCountry}
                          options={["United States", "Canada", "United Kingdom", "United Arab Emirates"]}
                        />
                        <SelectField
                          label="Title"
                          required
                          value={title}
                          onChange={setTitle}
                          options={["Mr.", "Ms.", "Mrs.", "Mx."]}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TextField label="First name" required value={firstName} onChange={setFirstName} />
                        <TextField label="Last name" required value={lastName} onChange={setLastName} />
                      </div>

                      <TextField label="Company" value={company} onChange={setCompany} />
                      <TextField label="Address" required value={address1} onChange={setAddress1} />
                      <TextField label="Address continued" value={address2} onChange={setAddress2} />

                      <TextField label="City" required value={city} onChange={setCity} />

                      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-6">
                        <SelectField
                          label="State"
                          required
                          value={state}
                          onChange={setState}
                          options={["", "AL", "AK", "AZ", "CA", "FL", "NY", "TX"]}
                        />
                        <TextField label="Zip code" required value={postalCode} onChange={setPostalCode} />
                      </div>

                      <TextField label="Zip +" value={zipPlus} onChange={setZipPlus} />

                      <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-6 items-end">
                        <SelectField
                          label="Area code"
                          required
                          value={areaCode}
                          onChange={setAreaCode}
                          options={["+1", "+44", "+971", "+91"]}
                        />
                        <div>
                          <TextField label="Telephone number" required value={phoneNumber} onChange={setPhoneNumber} />
                          <div className="mt-2 text-[11px] text-black/50">
                            Expected format: phone number with 10 digits
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10 px-8 rounded-none uppercase tracking-[0.2em]"
                        onClick={() => router.back()}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={busy}
                        className="h-10 px-8 rounded-none bg-black text-white tracking-[0.2em] hover:bg-black/90"
                      >
                        {busy ? "Saving…" : "Save"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white border border-black/10 px-8 py-6">
              <h2 className="text-xs tracking-[0.25em] uppercase mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                {/* Credit Card Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-6 border-2 transition ${
                    paymentMethod === "card"
                      ? "border-black bg-black/5"
                      : "border-black/20 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card"
                        ? "border-black bg-black"
                        : "border-black/40"
                    }`}>
                      {paymentMethod === "card" && (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <CreditCard size={20} className="text-black/70" />
                      <div className="text-left">
                        <div className="text-sm font-medium">Credit/Debit Card</div>
                        <div className="text-[11px] text-black/50">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* UPI Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`w-full p-6 border-2 transition ${
                    paymentMethod === "upi"
                      ? "border-black bg-black/5"
                      : "border-black/20 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "upi"
                        ? "border-black bg-black"
                        : "border-black/40"
                    }`}>
                      {paymentMethod === "upi" && (
                        <div className="h-2 w-2 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <QrCode size={20} className="text-black/70" />
                      <div className="text-left">
                        <div className="text-sm font-medium">UPI</div>
                        <div className="text-[11px] text-black/50">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </section>

            <Button
              type="button"
              disabled={paying}
              className="w-full h-12 rounded-none bg-black text-white hover:bg-black/90 tracking-widest"
              onClick={onPayNow}
            >
              {paying ? "Processing…" : "COMPLETE PAYMENT"}
            </Button>
          </form>

          {/* RIGHT — SUMMARY */}
          <aside className="space-y-6">
            <div className="bg-white border border-black/10">
              <div className="px-6 py-5 border-b border-black/10 text-xs tracking-[0.3em] uppercase flex items-center justify-between">
                <span>Summary</span>
                <span className="text-black/50">▾</span>
              </div>
              <div className="px-6 py-6">
                <div className="text-xs tracking-[0.25em] uppercase mb-4">
                  You have {itemCount} {itemLabel} in your cart.
                </div>

                {cart?.items?.length ? (
                  <div className="space-y-4">
                    {cart.items.map((item) => {
                      const key = `${item.productSlug}:${item.size ?? "default"}`;
                      return (
                        <div key={key} className="flex items-center justify-between gap-4 text-sm">
                          <div className="min-w-0">
                            <div className="font-medium truncate">{item.name}</div>
                            <div className="text-black/60 text-xs mt-1">Qty {item.quantity}</div>
                          </div>
                          <div className="font-medium">{fmt(item.price * item.quantity)}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-black/60">Your cart is empty.</div>
                )}

                <div className="mt-6 space-y-4 text-sm">
                  <DetailRow label="Subtotal" value={fmt(subtotal)} />
                  <DetailRow label="Shipping" value="-" muted />
                  <div className="text-xs text-black/50">Shipping costs will be calculated during checkout</div>
                  <DetailRow label="Taxes" value="-" muted />
                  <div className="text-xs text-black/50">Taxes will be calculated during checkout</div>
                </div>

                <div className="mt-6 border-t border-black/10 pt-4">
                  <DetailRow label="Total" value={fmt(subtotal)} bold />
                </div>
              </div>
            </div>

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
        </div>
      </Container>
    </main>
  );
}

/* ---------------- components ---------------- */

function TextField({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] uppercase mb-1 text-black/60">
        {label}
        {required ? " *" : ""}
      </label>
      <input
        className="w-full border-b border-black/30 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] tracking-[0.2em] uppercase mb-1 text-black/60">
        {label}
        {required ? " *" : ""}
      </label>
      <select
        className="w-full border-b border-black/30 bg-transparent px-0 py-2 text-sm focus:outline-none focus:border-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt || "empty"} value={opt}>
            {opt || "Select"}
          </option>
        ))}
      </select>
    </div>
  );
}

/* helpers moved to shared components */
