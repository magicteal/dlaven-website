"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api, type OrderDTO } from "@/lib/api";
import { fmt } from "@/lib/utils";

export default function AdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
  if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/");
      else load();
    }
    async function load() {
      try {
        const res = await api.adminListOrders();
        setOrders(res.items);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load orders");
        setOrders([]);
      }
    }
  }, [loading, user, router]);

  return (
    <div>
      <h1 className="text-xl font-semibold">Orders</h1>
      {orders === null ? (
        <p className="mt-4 text-sm text-black/70">Loading…</p>
      ) : error ? (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="mt-4 text-sm text-black/70">No orders yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[720px] w-full border border-black/10 text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="text-left p-2">Order</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const amount = fmt(o.subtotal || 0);
                return (
                  <tr key={String(o._id || o.id)} className="border-t border-black/10">
                    <td className="p-2 align-top">
                      <div className="font-medium">{String(o._id || o.id)}</div>
                      <div className="text-black/60 text-xs">{new Date(o.createdAt || Date.now()).toLocaleString()}</div>
                    </td>
                    <td className="p-2 align-top">
                      <div>{o.address?.fullName || "—"}</div>
                      <div className="text-black/60 text-xs">{[o.address?.city, o.address?.country].filter(Boolean).join(", ")}</div>
                    </td>
                    <td className="p-2 align-top">{amount}</td>
                    <td className="p-2 align-top uppercase text-xs tracking-wider">{o.status}</td>
                    <td className="p-2 align-top">
                      {/* Minimal: status quick actions */}
                      <div className="flex flex-wrap gap-2">
                        {(["paid","failed","refunded","cancelled","shipped","delivered"] as const).map((s) => (
                          <button key={s} className="px-2 py-1 border border-black text-xs hover:bg-black hover:text-white" onClick={async () => {
                            try {
                              await api.adminUpdateOrderStatus(String(o._id || o.id), s);
                              const res = await api.adminListOrders();
                              setOrders(res.items);
                            } catch (e: unknown) {
                              alert(e instanceof Error ? e.message : "Failed to update");
                            }
                          }}>{s}</button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
