export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

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

  console.log(
    "[api] →",
    options.method || "GET",
    url,
    safeBody ? { body: safeBody } : ""
  );
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
    throw new Error(
      "Network error: Failed to reach API. Check server and CORS."
    );
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
    const logPayload = {
      url,
      elapsedMs: elapsed,
      body: (data as unknown) ?? text,
    };
    if (expected401) {
      console.warn(
        "[api] 401 (expected when logged out)",
        res.statusText,
        logPayload
      );
    } else {
      console.error("[api] ✗", res.status, res.statusText, logPayload);
    }
    throw new Error(message);
  }
  console.log("[api] ✓", res.status, { url, elapsedMs: elapsed, body: data });
  return (data as T) ?? ({} as T);
}

export const api = {
  listProducts(params?: {
    category?: string;
    tag?: "normal-product" | "dl-limited" | "dl-prive" | "dl-barry";
    q?: string;
    limit?: number;
    skip?: number;
  }) {
    const search = new URLSearchParams();
    if (params?.category) search.set("category", params.category);
    if (params?.tag) search.set("tag", params.tag);
    if (params?.q) search.set("q", params.q);
    if (params?.limit !== undefined) search.set("limit", String(params.limit));
    if (params?.skip !== undefined) search.set("skip", String(params.skip));
    return request<{ items: unknown[] }>(`/api/products?${search.toString()}`);
  },
  verifyLimitedCode(code: string) {
    return request<{ ok: boolean }>("/api/codes/verify-limited", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
  verifyPriveCode(code: string) {
    return request<{ ok: boolean }>("/api/codes/verify-prive", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
  register(data: { email: string; password: string; name?: string }) {
    return request<{
      user: {
        id: string;
        email: string;
        name?: string;
        role?: "user" | "admin";
      };
    }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  login(data: { email: string; password: string }) {
    return request<{
      user: {
        id: string;
        email: string;
        name?: string;
        role?: "user" | "admin";
      };
    }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  me() {
    return request<{
      user: {
        id: string;
        email: string;
        name?: string;
        role?: "user" | "admin";
        address?: {
          fullName?: string;
          phone?: string;
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postalCode?: string;
          country?: string;
        };
      };
    }>("/api/auth/me");
  },
  logout() {
    return request<{ ok: boolean }>("/api/auth/logout", { method: "POST" });
  },
  forgotPassword(data: { email: string }) {
    return request<{ ok: boolean; resetToken?: string; expiresAt?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
  resetPassword(data: { token: string; password: string }) {
    return request<{ ok: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateProfile(data: { name?: string }) {
    return request<{
      user: {
        id: string;
        email: string;
        name?: string;
        role?: "user" | "admin";
        address?: {
          fullName?: string;
          phone?: string;
          line1?: string;
          line2?: string;
          city?: string;
          state?: string;
          postalCode?: string;
          country?: string;
        };
      };
    }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  getAddress() {
    return request<{
      address: null | {
        fullName?: string;
        phone?: string;
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    }>("/api/auth/address");
  },
  updateAddress(data: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  }) {
    return request<{
      address: null | {
        fullName?: string;
        phone?: string;
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
      };
    }>("/api/auth/address", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  // Addresses CRUD (multi-address support)
  listAddresses() {
    return request<{
      addresses: Array<{
        id: string;
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
      }>;
    }>("/api/auth/addresses");
  },
  createAddress(data: {
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
  }) {
    return request<{
      address: {
        id: string;
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
    }>("/api/auth/addresses", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateAddressById(
    id: string,
    data: {
      label?: string;
      fullName?: string;
      phone?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    }
  ) {
    return request<{
      address: {
        id: string;
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
    }>(`/api/auth/addresses/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
  deleteAddressById(id: string) {
    return request<{ ok: boolean }>(
      `/api/auth/addresses/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  },
  setDefaultAddress(id: string) {
    return request<{ ok: boolean }>(
      `/api/auth/addresses/${encodeURIComponent(id)}/default`,
      { method: "PATCH" }
    );
  },
  // Cart APIs
  getCart() {
    return request<{
      cart: {
        items: Array<{
          productSlug: string;
          name: string;
          price: number;
          currency: string;
          image: string;
          quantity: number;
          size?: string;
        }>;
      };
    }>("/api/cart");
  },
  addToCart(data: { productSlug: string; quantity?: number; size?: string }) {
    return request<{
      cart: {
        items: Array<{
          productSlug: string;
          name: string;
          price: number;
          currency: string;
          image: string;
          quantity: number;
          size?: string;
        }>;
      };
    }>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  updateCartItem(productSlug: string, quantity: number, size?: string) {
    return request<{
      cart: {
        items: Array<{
          productSlug: string;
          name: string;
          price: number;
          currency: string;
          image: string;
          quantity: number;
          size?: string;
        }>;
      };
    }>(`/api/cart/items/${encodeURIComponent(productSlug)}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity, size }),
    });
  },
  removeCartItem(productSlug: string, size?: string) {
    return request<{
      cart: {
        items: Array<{
          productSlug: string;
          name: string;
          price: number;
          currency: string;
          image: string;
          quantity: number;
          size?: string;
        }>;
      };
    }>(`/api/cart/items/${encodeURIComponent(productSlug)}`, {
      method: "DELETE",
      body: size ? JSON.stringify({ size }) : undefined,
    });
  },
  // Orders & Payments
  createOrder() {
    return request<{
      order: OrderDTO;
      razorpayOrder: RazorpayOrderDTO;
      key: string;
    }>("/api/orders/create", { method: "POST" });
  },
  verifyPayment(data: {
    orderId: string;
    paymentId: string;
    signature: string;
  }) {
    return request<{ order: OrderDTO }>("/api/orders/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  myOrders() {
    return request<{ items: OrderDTO[] }>("/api/orders/mine");
  },
  getOrderById(id: string) {
    return request<{ item: OrderDTO }>(`/api/orders/${encodeURIComponent(id)}`);
  },
  // Admin orders
  adminListOrders() {
    return request<{ items: OrderDTO[] }>("/api/orders/admin");
  },
  adminGetOrder(id: string) {
    return request<{ item: OrderDTO }>(
      `/api/orders/admin/${encodeURIComponent(id)}`
    );
  },
  adminUpdateOrderStatus(id: string, status: string) {
    return request<{ item: OrderDTO }>(
      `/api/orders/admin/${encodeURIComponent(id)}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    );
  },
  // Admin: Codes
  adminGenerateCodes(count: number) {
    return request<{ items: string[]; batch: number }>("/api/codes/generate", {
      method: "POST",
      body: JSON.stringify({ count }),
    });
  },
  adminGetCodeBatchHistory() {
    return request<{ items: BatchHistoryItem[] }>("/api/codes/history");
  },
  adminImportCodes(codes: string[]) {
    return request<{ items: string[]; batch: number }>("/api/codes/import", {
      method: "POST",
      body: JSON.stringify({ codes }),
    });
  },
  adminDeleteCodeBatch(batchNumber: number) {
    return request<{ ok: boolean }>(`/api/codes/batch/${batchNumber}`, {
      method: "DELETE",
    });
  },
};

// Types
export type BatchHistoryItem = {
  batch: number;
  count: number;
  createdAt: string;
};
export type OrderStatus =
  | "created"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled"
  | "shipped"
  | "delivered";
export type OrderItemDTO = {
  productSlug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  size?: string;
};
export type OrderAddressDTO = {
  label?: string;
  fullName?: string;
  phone?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};
export type OrderDTO = {
  id?: string;
  _id?: string;
  userId: string;
  items: OrderItemDTO[];
  address: OrderAddressDTO;
  subtotal: number;
  currency: string;
  status: OrderStatus;
  razorpay?: { orderId?: string; paymentId?: string; signature?: string };
  createdAt?: string;
};
export type RazorpayOrderDTO = { id: string; amount: number; currency: string };
