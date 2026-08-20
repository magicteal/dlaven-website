"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { api, type OrderDTO } from "@/lib/api";
import { fmt } from "@/lib/utils";
import { HiOutlinePencil } from "react-icons/hi2";
import Link from "next/link";
import { X } from "lucide-react";

type Tab = "orders" | "profile" | "addresses" | "payments" | "reservations" | "prive";

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

const menuItems: { key: Tab; label: string }[] = [
  { key: "orders", label: "ORDER HISTORY" },
  { key: "profile", label: "PROFILE INFORMATION" },
  { key: "addresses", label: "ADDRESS BOOK" },
  { key: "payments", label: "PAYMENTS" },
  { key: "reservations", label: "E-RESERVATIONS" },
  { key: "prive", label: "DL PRIVÉ" },
];

function AccountPageContent() {
  const { user, loading, logout, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "orders");
  const [showBanner, setShowBanner] = useState(true);

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Addresses state
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<Address>({});
  const [editId, setEditId] = useState<string | null>(null);
  const [editAddr, setEditAddr] = useState<Address>({});

  // Orders state
  const [orders, setOrders] = useState<OrderDTO[] | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
      setPhone((user as { phone?: string }).phone || "");
      setDob((user as { dob?: string }).dob || "");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (tabParam && menuItems.some((m) => m.key === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await api.listAddresses();
        setAddresses(res.addresses);
      } catch {
        setAddresses([]);
      }
    }
    async function loadOrders() {
      try {
        const res = await api.myOrders();
        setOrders(res.items);
      } catch {
        setOrders([]);
      }
    }
    if (user) {
      loadAddresses();
      loadOrders();
    }
  }, [user]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    router.push(`/account?tab=${tab}`, { scroll: false });
  };

  async function onSaveProfile() {
    setError(null);
    setMessage(null);
    setSaving(true);
    try {
      await api.updateProfile({ name, phone, dob });
      await refresh();
      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to update";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // ignore
    }
    router.push("/");
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6F4E6]">
        <p className="text-xs uppercase tracking-[0.2em] text-black/60 font-light">Loading account...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F6F4E6] [font-family:var(--font-manrope)] pt-28 sm:pt-32 md:pt-36 pb-24">
      {/* Hermès-Style Welcome Message Banner */}
      {showBanner && (
        <div className="w-full py-3 px-6 sm:px-12 flex items-center justify-between text-xs tracking-wider text-black/80 mb-6 sm:mb-8">
          <div className="w-6" /> {/* spacer */}
          <p className="text-center font-normal tracking-[0.08em] text-xs sm:text-[13px]">
            Welcome back <span className="font-medium">{user.name || "Client"}</span>! Great to see you again!
          </p>
          <button
            type="button"
            onClick={() => setShowBanner(false)}
            className="text-black/50 hover:text-black p-1 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Account 2-Column Grid */}
      <div className="max-w-[90%] lg:max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-14 items-start">
          {/* Left Column: Account Navigation */}
          <aside className="pt-1">
            <h1 className="text-xl sm:text-2xl font-normal tracking-[0.18em] uppercase text-black mb-8">
              ACCOUNT
            </h1>

            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key)}
                    className={`text-left text-xs uppercase tracking-[0.15em] transition-colors py-0.5 ${
                      isActive
                        ? "text-black font-semibold"
                        : "text-black/60 hover:text-black font-normal"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-left text-xs uppercase tracking-[0.15em] font-semibold text-[#431717] hover:underline pt-3 border-t border-black/10 mt-2"
                >
                  ✦ ADMIN DASHBOARD
                </Link>
              )}

              <div className="pt-6">
                <button
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-[0.15em] text-black hover:text-black/70 underline underline-offset-4"
                >
                  SIGN-OUT
                </button>
              </div>
            </nav>
          </aside>

          {/* Right Column: Hermès White Card Content Box */}
          <main className="bg-white border border-[#e5e5e5] p-6 sm:p-10 lg:p-12 min-h-[400px]">
            {/* ORDER HISTORY TAB */}
            {activeTab === "orders" && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black border-b border-[#e5e5e5] pb-3 mb-8">
                  ORDER HISTORY
                </h2>

                {orders === null ? (
                  <p className="text-xs uppercase tracking-wider text-black/60 py-6">Loading orders…</p>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 space-y-6">
                    <p className="text-sm sm:text-base text-black/85 font-normal tracking-wide">
                      Nothing&apos;s tickled your fancy yet?
                    </p>
                    <div>
                      <Link
                        href="/products"
                        className="inline-block px-10 py-3.5 border-2 border-black bg-transparent text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-white transition-all duration-300"
                      >
                        CONTINUE SHOPPING
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div
                        key={String(o._id || o.id)}
                        className="border border-[#e5e5e5] p-5 bg-white hover:border-black/30 transition-all"
                      >
                        <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-3">
                          <div>
                            <div className="font-semibold text-xs tracking-wider uppercase text-black">
                              ORDER #{String(o._id || o.id).slice(-8).toUpperCase()}
                            </div>
                            <div className="text-[11px] text-black/50 mt-0.5">
                              {new Date(o.createdAt || Date.now()).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>
                          <span className="uppercase text-[10px] tracking-[0.18em] px-3 py-1 bg-black text-white font-medium">
                            {o.status}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="text-black/60">
                            {o.items.length} item{o.items.length > 1 ? "s" : ""}
                          </div>
                          <div className="text-sm font-semibold text-black">
                            {fmt(o.subtotal)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE INFORMATION TAB */}
            {activeTab === "profile" && (
              <div>
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3 mb-8">
                  <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
                    PROFILE INFORMATION
                  </h2>
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-1 hover:bg-black/5 rounded-full transition-colors"
                      aria-label="Edit profile"
                    >
                      <HiOutlinePencil className="h-4 w-4 text-black/70" />
                    </button>
                  )}
                </div>

                {editMode ? (
                  <form
                    className="space-y-6 max-w-md"
                    onSubmit={(e) => {
                      e.preventDefault();
                      onSaveProfile();
                    }}
                  >
                    <div>
                      <label className="block text-xs text-black/60 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full border-b border-black/30 py-2 focus:outline-none focus:border-black bg-transparent text-sm text-black"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-black/60 mb-1">E-mail</label>
                      <input
                        type="email"
                        className="w-full border-b border-black/20 py-2 focus:outline-none bg-transparent text-black/40 text-sm cursor-not-allowed"
                        value={email}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-black/60 mb-1">Telephone number</label>
                      <input
                        type="tel"
                        className="w-full border-b border-black/30 py-2 focus:outline-none focus:border-black bg-transparent text-sm text-black"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-black/60 mb-1">Date of birth</label>
                      <input
                        type="date"
                        className="w-full border-b border-black/30 py-2 focus:outline-none focus:border-black bg-transparent text-sm text-black"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>

                    {error && <p className="text-xs text-red-600 tracking-wider">{error}</p>}
                    {message && <p className="text-xs text-emerald-700 tracking-wider">{message}</p>}

                    <div className="flex gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-2.5 bg-black text-white text-xs uppercase tracking-[0.18em] hover:bg-black/80 transition-all disabled:opacity-60"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditMode(false);
                          setName(user.name || "");
                          setPhone((user as { phone?: string }).phone || "");
                          setDob((user as { dob?: string }).dob || "");
                        }}
                        className="px-8 py-2.5 border border-black text-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6 max-w-lg">
                    <div>
                      <p className="text-xs text-black/60 underline underline-offset-2">Name</p>
                      <p className="mt-1 text-sm text-black font-normal">{name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/60 underline underline-offset-2">E-mail</p>
                      <p className="mt-1 text-sm text-black font-normal">{email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/60 underline underline-offset-2">Telephone number</p>
                      <p className="mt-1 text-sm text-black font-normal">{phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/60 underline underline-offset-2">Date of birth</p>
                      <p className="mt-1 text-sm text-black font-normal">{formatDate(dob)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-black/60 underline underline-offset-2">Password</p>
                      <p className="mt-1 text-sm text-black font-normal">********</p>
                    </div>

                    <div className="pt-4">
                      <p className="text-xs text-black/50">
                        You are subscribed to the D&apos;LAVÉN newsletter.
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/forgot-password"
                        className="text-xs text-black underline underline-offset-2 hover:no-underline"
                      >
                        Change Password
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ADDRESS BOOK TAB */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-3 mb-8">
                  <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black">
                    ADDRESS BOOK
                  </h2>
                  {!addOpen && (
                    <button
                      onClick={() => setAddOpen(true)}
                      className="px-4 py-1.5 border border-black text-black text-xs uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all"
                    >
                      Add New Address
                    </button>
                  )}
                </div>

                {addresses === null ? (
                  <p className="text-xs uppercase tracking-wider text-black/60 py-6">Loading addresses…</p>
                ) : addresses.length === 0 && !addOpen ? (
                  <div className="py-8">
                    <p className="text-sm text-black/70">No saved addresses.</p>
                    <button
                      onClick={() => setAddOpen(true)}
                      className="mt-4 px-6 py-2.5 border border-black text-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((a) => (
                      <div key={a.id} className="border border-[#e5e5e5] p-5">
                        {editId === a.id ? (
                          <AddressForm
                            address={editAddr}
                            onChange={setEditAddr}
                            onSave={async () => {
                              await api.updateAddressById(a.id!, editAddr);
                              const res = await api.listAddresses();
                              setAddresses(res.addresses);
                              setEditId(null);
                            }}
                            onCancel={() => {
                              setEditId(null);
                              setEditAddr({});
                            }}
                          />
                        ) : (
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div className="text-xs text-black space-y-1">
                              <div className="font-semibold text-sm flex items-center gap-2">
                                {a.label || "Address"}
                                {a.isDefault && (
                                  <span className="text-[9px] px-2 py-0.5 bg-black text-white uppercase tracking-[0.15em]">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="pt-1">{a.fullName}</div>
                              <div className="text-black/70">{a.phone}</div>
                              <div className="text-black/80">{a.line1}</div>
                              {a.line2 && <div className="text-black/80">{a.line2}</div>}
                              <div className="text-black/80">
                                {[a.city, a.state, a.postalCode].filter(Boolean).join(", ")}
                              </div>
                              <div className="text-black/80">{a.country}</div>
                            </div>
                            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
                              {!a.isDefault && (
                                <button
                                  className="px-3 py-1 border border-black text-[10px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                  onClick={async () => {
                                    await api.setDefaultAddress(a.id!);
                                    const res = await api.listAddresses();
                                    setAddresses(res.addresses);
                                  }}
                                >
                                  Set Default
                                </button>
                              )}
                              <button
                                className="px-3 py-1 border border-black text-[10px] uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                                onClick={() => {
                                  setEditId(a.id!);
                                  setEditAddr(a);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="px-3 py-1 border border-red-600 text-red-600 text-[10px] uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors"
                                onClick={async () => {
                                  await api.deleteAddressById(a.id!);
                                  const res = await api.listAddresses();
                                  setAddresses(res.addresses);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {addOpen && (
                      <div className="border border-[#e5e5e5] p-5">
                        <AddressForm
                          address={newAddr}
                          onChange={setNewAddr}
                          onSave={async () => {
                            await api.createAddress({
                              ...newAddr,
                              isDefault: !!(addresses && addresses.length === 0),
                            });
                            const res = await api.listAddresses();
                            setAddresses(res.addresses);
                            setNewAddr({});
                            setAddOpen(false);
                          }}
                          onCancel={() => {
                            setAddOpen(false);
                            setNewAddr({});
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PAYMENTS TAB */}
            {activeTab === "payments" && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black border-b border-[#e5e5e5] pb-3 mb-8">
                  PAYMENTS
                </h2>
                <p className="text-xs sm:text-sm text-black/70 leading-relaxed max-w-lg">
                  No saved payment methods. Payment information is securely collected during checkout.
                </p>
              </div>
            )}

            {/* E-RESERVATIONS TAB */}
            {activeTab === "reservations" && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black border-b border-[#e5e5e5] pb-3 mb-8">
                  E-RESERVATIONS
                </h2>
                <p className="text-xs sm:text-sm text-black/70 mb-6">
                  You have no active reservations.
                </p>
                <Link
                  href="/destinations"
                  className="inline-block px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all"
                >
                  DISCOVER BOUTIQUES
                </Link>
              </div>
            )}

            {/* DL PRIVÉ TAB */}
            {activeTab === "prive" && (
              <div>
                <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-black border-b border-[#e5e5e5] pb-3 mb-8">
                  DL PRIVÉ
                </h2>
                <p className="text-xs sm:text-sm text-black/75 leading-relaxed mb-6 max-w-lg">
                  DL Privé is our exclusive membership program offering special benefits, early access to new collections, and personalized services.
                </p>
                <Link
                  href="/dl-prive"
                  className="inline-block px-8 py-3 border border-black text-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all"
                >
                  LEARN MORE
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function AddressForm({
  address,
  onChange,
  onSave,
  onCancel,
}: {
  address: Address;
  onChange: (a: Address) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextInput
          label="Label (optional)"
          value={address.label || ""}
          onChange={(v) => onChange({ ...address, label: v })}
        />
        <TextInput
          label="Full Name"
          value={address.fullName || ""}
          onChange={(v) => onChange({ ...address, fullName: v })}
        />
      </div>
      <TextInput
        label="Phone"
        value={address.phone || ""}
        onChange={(v) => onChange({ ...address, phone: v })}
      />
      <TextInput
        label="Address Line 1"
        value={address.line1 || ""}
        onChange={(v) => onChange({ ...address, line1: v })}
      />
      <TextInput
        label="Address Line 2"
        value={address.line2 || ""}
        onChange={(v) => onChange({ ...address, line2: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TextInput
          label="City"
          value={address.city || ""}
          onChange={(v) => onChange({ ...address, city: v })}
        />
        <TextInput
          label="State"
          value={address.state || ""}
          onChange={(v) => onChange({ ...address, state: v })}
        />
        <TextInput
          label="Postal Code"
          value={address.postalCode || ""}
          onChange={(v) => onChange({ ...address, postalCode: v })}
        />
      </div>
      <TextInput
        label="Country"
        value={address.country || ""}
        onChange={(v) => onChange({ ...address, country: v })}
      />
      <div className="flex gap-3 pt-3">
        <button
          onClick={async () => {
            setSaving(true);
            await onSave();
            setSaving(false);
          }}
          disabled={saving}
          className="px-6 py-2 bg-black text-white text-xs uppercase tracking-[0.18em] hover:bg-black/80 transition-all disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-black text-black text-xs uppercase tracking-[0.18em] hover:bg-black hover:text-white transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.15em] text-black/60 mb-1">
        {label}
      </label>
      <input
        className="w-full border-b border-black/30 py-1.5 text-sm bg-transparent text-black focus:outline-none focus:border-black"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F6F4E6]"><p className="text-xs uppercase tracking-[0.2em] text-black/60 font-light">Loading account...</p></div>}>
      <AccountPageContent />
    </Suspense>
  );
}
