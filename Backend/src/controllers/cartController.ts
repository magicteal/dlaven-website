import type { Request, Response } from "express";
import { Cart, type ICartItem, type CartDoc } from "../models/Cart";
import { Product } from "../models/Product";
import { User } from "../models/User";
import crypto from "crypto";

function stripCurrencyFromCart(cart: CartDoc | Record<string, unknown>) {
  const obj = typeof (cart as CartDoc).toObject === "function" ? (cart as CartDoc).toObject() : { ...(cart as any) };
  if (Array.isArray((obj as any).items)) {
    (obj as any).items = (obj as any).items.map((it: any) => {
      if (!it || typeof it !== "object") return it;
      const { currency, ...rest } = it as any;
      return rest;
    });
  }
  return obj;
}

function getAuthUser(req: Request): { sub: string } | undefined {
  return (req as any).user as { sub: string } | undefined;
}

async function getOrCreateCart(req: Request, res: Response): Promise<CartDoc> {
  const auth = getAuthUser(req);
  if (auth) {
    let cartDoc = await Cart.findOne({ userId: auth.sub }).exec();
    if (!cartDoc) {
      cartDoc = await Cart.create({ userId: auth.sub, items: [] });
    }
    return cartDoc;
  }
  // Guest via cookie
  let cartId = req.cookies["cartId"] as string | undefined;
  if (!cartId) {
    cartId = crypto.randomUUID();
    const secure = false; // set true behind HTTPS/prod
    res.cookie("cartId", cartId, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/",
    });
  }
  let cartDoc = await Cart.findOne({ guestId: cartId }).exec();
  if (!cartDoc) {
    cartDoc = await Cart.create({ guestId: cartId, items: [] });
  }
  return cartDoc;
}

export async function getCart(req: Request, res: Response) {
  const cart = await getOrCreateCart(req, res);
  return res.json({ cart: stripCurrencyFromCart(cart) });
}

export async function addItem(req: Request, res: Response) {
  const {
    productSlug,
    quantity = 1,
    size,
  } = req.body as { productSlug: string; quantity?: number; size?: string };
  if (!productSlug)
    return res.status(400).json({ error: "productSlug is required" });
  const qty = Math.max(1, parseInt(String(quantity)) || 1);

  const product = await Product.findOne({ slug: productSlug }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });

  const current = await getOrCreateCart(req, res);
  // Enforce entitlement for DL Barry items at cart level
  const isBarry =
    Array.isArray((product as any).tags) &&
    (product as any).tags.includes("dl-barry");
  if (isBarry) {
    const auth = getAuthUser(req);
    if (!auth?.sub) {
      return res
        .status(401)
        .json({ error: "Please sign in to add DL Barry items" });
    }
    const user = await User.findById(auth.sub)
      .select({ barryEntitlementsAvailable: 1 })
      .lean();
    const available = (user as any)?.barryEntitlementsAvailable || 0;
    const existingBarryQty = (current.items || []).reduce(
      (sum, it) => sum + (it.productSlug === productSlug ? it.quantity : 0),
      0
    );
    const requestedBarryQty = existingBarryQty + qty;
    if (requestedBarryQty > available) {
      return res
        .status(403)
        .json({
          error: `You can add up to ${Math.max(
            available - existingBarryQty,
            0
          )} more DL Barry item(s) based on your entitlements.`,
        });
    }
  }
  const items: ICartItem[] = (current.items ?? []) as ICartItem[];
  const itemIndex = items.findIndex(
    (i: ICartItem) =>
      i.productSlug === productSlug && (i.size ?? null) === (size ?? null)
  );
  if (itemIndex >= 0) {
    items[itemIndex].quantity += qty;
  } else {
    items.push({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: qty,
      size: size,
    });
  }
  current.items = items;
  await current.save();
  return res.status(201).json({ cart: stripCurrencyFromCart(current) });
}

export async function updateItem(req: Request, res: Response) {
  const { productSlug } = req.params as { productSlug: string };
  const { quantity, size } = req.body as { quantity: number; size?: string };
  if (!productSlug)
    return res.status(400).json({ error: "productSlug is required" });
  const qty = Math.max(0, parseInt(String(quantity)) || 0);
  const current = await getOrCreateCart(req, res);
  const items: ICartItem[] = [...((current.items ?? []) as ICartItem[])];
  const idx = items.findIndex(
    (i: ICartItem) =>
      i.productSlug === productSlug && (i.size ?? null) === (size ?? null)
  );
  if (idx < 0) return res.status(404).json({ error: "Item not in cart" });
  if (qty <= 0) {
    items.splice(idx, 1);
  } else {
    items[idx].quantity = qty;
  }
  current.items = items;
  await current.save();
  return res.json({ cart: stripCurrencyFromCart(current) });
}

export async function removeItem(req: Request, res: Response) {
  const { productSlug } = req.params as { productSlug: string };
  const size =
    (req.query.size as string | undefined) ??
    ((req.body as any)?.size as string | undefined);
  const current = await getOrCreateCart(req, res);
  const items: ICartItem[] = ((current.items ?? []) as ICartItem[]).filter(
    (i: ICartItem) => {
      if (i.productSlug !== productSlug) return true;
      if (size == null) return false; // remove all sizes of this product
      return (i.size ?? null) !== (size ?? null);
    }
  );
  current.items = items;
  await current.save();
  return res.json({ cart: stripCurrencyFromCart(current) });
}
