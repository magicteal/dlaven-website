export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const start = Date.now();
  const safeBody = (() => {
    try {
      if (!options.body) return undefined;
      const obj = JSON.parse(String(options.body));
      if (obj?.password) obj.password = "***";
      if (obj?.token) obj.token = "***";
      return obj;
    } catch {
      return undefined;
    }
  })();

  console.log("[api] →", options.method || "GET", url, safeBody ? { body: safeBody } : "");
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  } catch (networkErr) {
    console.error("[api] ✗ Network error", { url, err: networkErr });
    throw new Error("Network error: Failed to reach API. Check server and CORS.");
  }

  const elapsed = Date.now() - start;
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Not JSON
  }

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    if (data && typeof data === "object") {
      const d = data as Record<string, unknown>;
      if (typeof d.error === "string") message = d.error;
    }
    const expected401 = res.status === 401 && path === "/api/auth/me";
    const logPayload = { url, elapsedMs: elapsed, body: (data as unknown) ?? text };
    if (expected401) {
      console.warn("[api] 401 (expected when logged out)", res.statusText, logPayload);
    } else {
      console.error("[api] ✗", res.status, res.statusText, logPayload);
    }
    throw new Error(message);
  }
  console.log("[api] ✓", res.status, { url, elapsedMs: elapsed, body: data });
  return (data as T) ?? ({} as T);
}

export const api = {
  register(data: { email: string; password: string; name?: string }) {
    return request<{ user: { id: string; email: string; name?: string; role?: "user" | "admin" } }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login(data: { email: string; password: string }) {
    return request<{ user: { id: string; email: string; name?: string; role?: "user" | "admin" } }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  me() {
    return request<{ user: { id: string; email: string; name?: string; role?: "user" | "admin" } }>("/api/auth/me");
  },
  logout() {
    return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },
  forgotPassword(data: { email: string }) {
    return request<{ ok: boolean; resetToken?: string; expiresAt?: string }>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  resetPassword(data: { token: string; password: string }) {
    return request<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateProfile(data: { name?: string }) {
    return request<{ user: { id: string; email: string; name?: string; role?: "user" | "admin" } }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  // Cart APIs
  getCart() {
    return request<{ cart: { items: Array<{ productSlug: string; name: string; price: number; currency: string; image: string; quantity: number; size?: string }> } }>("/api/cart");
  },
  addToCart(data: { productSlug: string; quantity?: number; size?: string }) {
    return request<{ cart: { items: Array<{ productSlug: string; name: string; price: number; currency: string; image: string; quantity: number; size?: string }> } }>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateCartItem(productSlug: string, quantity: number, size?: string) {
    return request<{ cart: { items: Array<{ productSlug: string; name: string; price: number; currency: string; image: string; quantity: number; size?: string }> } }>(`/api/cart/items/${encodeURIComponent(productSlug)}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, size }),
    });
  },
  removeCartItem(productSlug: string, size?: string) {
    return request<{ cart: { items: Array<{ productSlug: string; name: string; price: number; currency: string; image: string; quantity: number; size?: string }> } }>(`/api/cart/items/${encodeURIComponent(productSlug)}`, {
      method: "DELETE",
      body: size ? JSON.stringify({ size }) : undefined,
    });
  },
};
