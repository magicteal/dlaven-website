"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { api, type OrderDTO } from "@/lib/api";
import { fmt } from "@/lib/utils";
import { HiOutlinePencil } from "react-icons/hi2";
import Link from "next/link";

type Tab = "orders" | "profile" | "addresses" | "payments" | "reservations" | "saved" | "prive";

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
  { key: "orders", label: "Order History" },
  { key: "profile", label: "Profile Information" },
  { key: "addresses", label: "Address Book" },
  { key: "payments", label: "Payments" },
  { key: "reservations", label: "E-Reservations" },
  { key: "saved", label: "Saved Items" },
  { key: "prive", label: "DL Privé" },
];

function AccountPageContent() {
  const { user, loading, logout, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(tabParam || "profile");

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-black/70">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Welcome Banner */}
      <div className="bg-[#2c3e50] text-white py-3 px-4 text-center text-sm">
        Welcome back {user.name || "Guest"}! Great to see you again!
      </div>

      <div className="min-h-screen bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-12">
            {/* Left Sidebar */}
            <aside>
              <h1 className="text-2xl font-light tracking-[0.15em] uppercase text-[#2c3e50] mb-8">
                Account
              </h1>

              <nav className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleTabChange(item.key)}
                    className={`block w-full text-left py-3 text-sm uppercase tracking-[0.1em] transition-colors ${activeTab === item.key
                        ? "text-[#2c3e50] font-medium"
                        : "text-[#666] hover:text-[#2c3e50]"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              <div className="border-t border-[#ddd] mt-6 pt-6">
                <button
                  onClick={handleLogout}
                  className="text-sm uppercase tracking-[0.1em] text-[#666] hover:text-[#2c3e50] underline underline-offset-4"
                >
                  Sign-Out
                </button>
              </div>
            </aside>

            {/* Right Content */}
            <main className="bg-white border border-[#e5e5e5] p-6 sm:p-8 lg:p-10">
              {/* Profile Information Tab */}
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50]">
                      Profile Information
                    </h2>
                    {!editMode && (
                      <button
                        onClick={() => setEditMode(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Edit profile"
                      >
                        <HiOutlinePencil className="h-5 w-5 text-[#666]" />
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
                        <label className="block text-sm text-[#666] mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full border-b border-[#ccc] py-2 focus:outline-none focus:border-[#2c3e50] bg-transparent"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#666] mb-1">E-mail</label>
                        <input
                          type="email"
                          className="w-full border-b border-[#ccc] py-2 focus:outline-none bg-transparent text-[#999]"
                          value={email}
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#666] mb-1">
                          Telephone number
                        </label>
                        <input
                          type="tel"
                          className="w-full border-b border-[#ccc] py-2 focus:outline-none focus:border-[#2c3e50] bg-transparent"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#666] mb-1">
                          Date of birth
                        </label>
                        <input
                          type="date"
                          className="w-full border-b border-[#ccc] py-2 focus:outline-none focus:border-[#2c3e50] bg-transparent"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                        />
                      </div>

                      {error && <p className="text-sm text-red-600">{error}</p>}
                      {message && <p className="text-sm text-emerald-600">{message}</p>}

                      <div className="flex gap-4 pt-4">
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-6 py-2 bg-[#2c3e50] text-white text-sm uppercase tracking-wider disabled:opacity-60"
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
                          className="px-6 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-[#666] underline underline-offset-2">Name</p>
                        <p className="mt-1 text-[#333]">{name || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#666] underline underline-offset-2">E-mail</p>
                        <p className="mt-1 text-[#333]">{email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#666] underline underline-offset-2">
                          Telephone number
                        </p>
                        <p className="mt-1 text-[#333]">{phone || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#666] underline underline-offset-2">
                          Date of birth
                        </p>
                        <p className="mt-1 text-[#333]">{formatDate(dob)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#666] underline underline-offset-2">Password</p>
                        <p className="mt-1 text-[#333]">********</p>
                      </div>

                      <div className="pt-4">
                        <p className="text-sm text-[#888]">
                          You are subscribed to the D&apos;Laven newsletter.
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link
                          href="/forgot-password"
                          className="text-sm text-[#2c3e50] underline underline-offset-2 hover:no-underline"
                        >
                          Change Password
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Order History Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    Order History
                  </h2>

                  {orders === null ? (
                    <p className="text-sm text-[#666]">Loading orders…</p>
                  ) : orders.length === 0 ? (
                    <p className="text-sm text-[#666]">You have no orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((o) => (
                        <div
                          key={String(o._id || o.id)}
                          className="border border-[#e5e5e5] p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-[#333]">
                              Order #{String(o._id || o.id).slice(-8).toUpperCase()}
                            </div>
                            <div className="uppercase text-xs tracking-wider text-[#666]">
                              {o.status}
                            </div>
                          </div>
                          <div className="text-[#888] text-xs mt-1">
                            {new Date(o.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                          <div className="mt-3 flex items-center justify-between text-sm">
                            <div className="text-[#666]">
                              {o.items.length} item{o.items.length > 1 ? "s" : ""}
                            </div>
                            <div className="text-[#333] font-medium">
                              {fmt(o.subtotal)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Address Book Tab */}
              {activeTab === "addresses" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    Address Book
                  </h2>

                  {addresses === null ? (
                    <p className="text-sm text-[#666]">Loading addresses…</p>
                  ) : addresses.length === 0 && !addOpen ? (
                    <div>
                      <p className="text-sm text-[#666]">No saved addresses.</p>
                      <button
                        onClick={() => setAddOpen(true)}
                        className="mt-4 px-4 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((a) => (
                        <div key={a.id} className="border border-[#e5e5e5] p-4">
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
                            <div className="flex items-start justify-between">
                              <div className="text-sm text-[#333]">
                                <div className="font-medium flex items-center gap-2">
                                  {a.label || "Address"}
                                  {a.isDefault && (
                                    <span className="text-[10px] px-2 py-0.5 bg-[#2c3e50] text-white uppercase tracking-wider">
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1">{a.fullName}</div>
                                <div>{a.phone}</div>
                                <div>{a.line1}</div>
                                {a.line2 && <div>{a.line2}</div>}
                                <div>
                                  {[a.city, a.state, a.postalCode]
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                                <div>{a.country}</div>
                              </div>
                              <div className="flex flex-col gap-2">
                                {!a.isDefault && (
                                  <button
                                    className="px-3 py-1 border border-[#2c3e50] text-xs uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
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
                                  className="px-3 py-1 border border-[#2c3e50] text-xs uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
                                  onClick={() => {
                                    setEditId(a.id!);
                                    setEditAddr(a);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="px-3 py-1 border border-red-500 text-red-500 text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors"
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

                      {!addOpen ? (
                        <button
                          onClick={() => setAddOpen(true)}
                          className="mt-4 px-4 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
                        >
                          Add New Address
                        </button>
                      ) : (
                        <div className="border border-[#e5e5e5] p-4">
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

              {/* Payments Tab */}
              {activeTab === "payments" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    Payments
                  </h2>
                  <p className="text-sm text-[#666]">
                    No saved payment methods. Payment information is securely collected
                    during checkout.
                  </p>
                </div>
              )}

              {/* E-Reservations Tab */}
              {activeTab === "reservations" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    E-Reservations
                  </h2>
                  <p className="text-sm text-[#666]">
                    You have no active reservations.
                  </p>
                </div>
              )}

              {/* Saved Items Tab */}
              {activeTab === "saved" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    Saved Items
                  </h2>
                  <p className="text-sm text-[#666]">
                    You have no saved items yet. Browse our collections and save your favorites.
                  </p>
                  <Link
                    href="/categories"
                    className="inline-block mt-4 px-6 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
                  >
                    Browse Collections
                  </Link>
                </div>
              )}

              {/* DL Privé Tab */}
              {activeTab === "prive" && (
                <div>
                  <h2 className="text-lg uppercase tracking-[0.15em] text-[#2c3e50] mb-8">
                    DL Privé
                  </h2>
                  <p className="text-sm text-[#666] mb-4">
                    DL Privé is our exclusive membership program offering special benefits, early access to new collections, and personalized services.
                  </p>
                  <Link
                    href="/prive"
                    className="inline-block px-6 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider hover:bg-[#2c3e50] hover:text-white transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
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
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      <div className="flex gap-3 pt-2">
        <button
          onClick={async () => {
            setSaving(true);
            await onSave();
            setSaving(false);
          }}
          disabled={saving}
          className="px-4 py-2 bg-[#2c3e50] text-white text-sm uppercase tracking-wider disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-[#2c3e50] text-[#2c3e50] text-sm uppercase tracking-wider"
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
      <label className="block text-xs uppercase tracking-wider text-[#666]">
        {label}
      </label>
      <input
        className="mt-1 w-full border border-[#ccc] px-3 py-2 text-sm focus:outline-none focus:border-[#2c3e50]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-sm text-black/70">Loading...</p></div>}>
      <AccountPageContent />
    </Suspense>
  );
}
