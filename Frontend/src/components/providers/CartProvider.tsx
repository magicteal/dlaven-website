"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export type CartItem = {
  productSlug: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  size?: string;
};

export type Cart = {
  items: CartItem[];
};

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  add: (productSlug: string, quantity?: number, size?: string) => Promise<void>;
  update: (
    productSlug: string,
    quantity: number,
    size?: string
  ) => Promise<void>;
  remove: (productSlug: string, size?: string) => Promise<void>;
  refresh: () => Promise<void>;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    try {
      const res = await api.getCart();
      setCart(res.cart ?? { items: [] });
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const add = async (productSlug: string, quantity = 1, size?: string) => {
    try {
      const res = await api.addToCart({ productSlug, quantity, size });
      setCart(res.cart ?? { items: [] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to add to cart";
      // Friendly mapping for entitlement-related responses
      if (/Barry/i.test(msg) || /entitlement/i.test(msg)) {
        toast.error(msg);
      } else if (/Unauthorized/i.test(msg)) {
        toast.error("Please sign in to add this item.");
      } else {
        toast.error(msg);
      }
      throw e; // preserve behavior for callers that want to handle
    }
  };

  const update = async (
    productSlug: string,
    quantity: number,
    size?: string
  ) => {
    try {
      const res = await api.updateCartItem(productSlug, quantity, size);
      setCart(res.cart ?? { items: [] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to update item";
      if (/Barry/i.test(msg) || /entitlement/i.test(msg)) {
        toast.error(msg);
      } else if (/Unauthorized/i.test(msg)) {
        toast.error("Please sign in to update this item.");
      } else {
        toast.error(msg);
      }
      throw e;
    }
  };

  const remove = async (productSlug: string, size?: string) => {
    try {
      const res = await api.removeCartItem(productSlug, size);
      setCart(res.cart ?? { items: [] });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unable to remove item";
      toast.error(msg);
      throw e;
    }
  };

  const count = useMemo(
    () => cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0,
    [cart]
  );
  const subtotal = useMemo(
    () => cart?.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0,
    [cart]
  );

  const value = useMemo(
    () => ({ cart, loading, add, update, remove, refresh, count, subtotal }),
    [cart, loading, count, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
