"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter } from "next/navigation";

type UserRaw = { _id?: string; id?: string; email: string; name?: string; role?: "user" | "admin" };
type User = { id: string; email: string; name?: string; role?: "user" | "admin" };

function normalize(u: UserRaw): User {
  return { id: String(u._id || u.id || ""), email: u.email, name: u.name, role: u.role };
}

function uniqById(list: User[]): User[] {
  const seen = new Set<string>();
  const out: User[] = [];
  for (const u of list) {
    if (!u.id) continue;
    if (seen.has(u.id)) continue;
    seen.add(u.id);
    out.push(u);
  }
  return out;
}

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      if (loading) return;
      if (!user || user.role !== "admin") return;
      try {
        const res = await apiAdmin.listUsers();
        setUsers(uniqById(res.users.map(normalize)));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load users");
      }
    }
    load();
  }, [loading, user]);

  async function onToggleRole(u: User) {
    const uid = u.id;
    setBusyId(uid || null);
    try {
      const nextRole = u.role === "admin" ? "user" : "admin";
      const res = await apiAdmin.updateUser(uid, { role: nextRole });
      const updated = normalize(res.user);
      setUsers((prev) => uniqById(prev.map((x) => (x.id === uid ? updated : x))));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to update user");
    } finally {
      setBusyId(null);
    }
  }

  async function onDelete(u: User) {
    if (!confirm(`Delete user ${u.email}?`)) return;
    const uid = u.id;
    setBusyId(uid || null);
    try {
      await apiAdmin.deleteUser(uid);
      setUsers((prev) => prev.filter((x) => x.id !== uid));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Users</h1>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left border-b border-black/10">
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Role</th>
              <th className="py-2 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-black/5">
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.name || "—"}</td>
                <td className="py-2 pr-4">
                  <span className="inline-block rounded px-2 py-0.5 text-xs border border-black/20">
                    {u.role || "user"}
                  </span>
                </td>
                <td className="py-2 pr-4 flex gap-2">
                  <button
                    className="px-3 py-1 border border-black text-xs hover:bg-black hover:text-white disabled:opacity-60"
                    onClick={() => onToggleRole(u)}
                    disabled={busyId === u.id}
                  >
                    Make {u.role === "admin" ? "User" : "Admin"}
                  </button>
                  <button
                    className="px-3 py-1 border border-red-600 text-red-600 text-xs hover:bg-red-600 hover:text-white disabled:opacity-60"
                    onClick={() => onDelete(u)}
                    disabled={busyId === u.id}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const apiAdmin = {
  async listUsers(): Promise<{ users: User[] }> {
    return requestAdmin<{ users: User[] }>("/api/auth/users");
  },
  async updateUser(id: string, data: { name?: string; role?: "user" | "admin" }): Promise<{ user: User }> {
    return requestAdmin<{ user: User }>(`/api/auth/users/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  async deleteUser(id: string): Promise<{ ok: boolean }> {
    return requestAdmin<{ ok: boolean }>(`/api/auth/users/${id}`, { method: "DELETE" });
  },
};

async function requestAdmin<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { API_BASE } = await import("@/lib/api");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
