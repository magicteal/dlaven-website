import type { Request, Response } from "express";
import { Cart, type ICartItem, type CartDoc } from "../models/Cart";
import { Product } from "../models/Product";
import crypto from "crypto";

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
    res.cookie("cartId", cartId, { httpOnly: true, sameSite: "lax", secure, maxAge: 30 * 24 * 60 * 60 * 1000, path: "/" });
  }
  let cartDoc = await Cart.findOne({ guestId: cartId }).exec();
  if (!cartDoc) {
    cartDoc = await Cart.create({ guestId: cartId, items: [] });
  }
  return cartDoc;
}

export async function getCart(req: Request, res: Response) {
  const cart = await getOrCreateCart(req, res);
  return res.json({ cart: cart.toObject() });
}

export async function addItem(req: Request, res: Response) {
  const { productSlug, quantity = 1, size } = req.body as { productSlug: string; quantity?: number; size?: string };
  if (!productSlug) return res.status(400).json({ error: "productSlug is required" });
  const qty = Math.max(1, parseInt(String(quantity)) || 1);

  const product = await Product.findOne({ slug: productSlug }).lean();
  if (!product) return res.status(404).json({ error: "Product not found" });

  const current = await getOrCreateCart(req, res);
  const items: ICartItem[] = (current.items ?? []) as ICartItem[];
  const itemIndex = items.findIndex((i: ICartItem) => i.productSlug === productSlug && ((i.size ?? null) === (size ?? null)));
  if (itemIndex >= 0) {
    items[itemIndex].quantity += qty;
  } else {
    items.push({
      productSlug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.images[0],
      quantity: qty,
      size: size,
    });
  }
  current.items = items;
  await current.save();
  return res.status(201).json({ cart: current.toObject() });
}

export async function updateItem(req: Request, res: Response) {
  const { productSlug } = req.params as { productSlug: string };
  const { quantity, size } = req.body as { quantity: number; size?: string };
  if (!productSlug) return res.status(400).json({ error: "productSlug is required" });
  const qty = Math.max(0, parseInt(String(quantity)) || 0);
  const current = await getOrCreateCart(req, res);
  const items: ICartItem[] = ([...((current.items ?? []) as ICartItem[])]);
  const idx = items.findIndex((i: ICartItem) => i.productSlug === productSlug && ((i.size ?? null) === (size ?? null)));
  if (idx < 0) return res.status(404).json({ error: "Item not in cart" });
  if (qty <= 0) {
    items.splice(idx, 1);
  } else {
    items[idx].quantity = qty;
  }
  current.items = items;
  await current.save();
  return res.json({ cart: current.toObject() });
}

export async function removeItem(req: Request, res: Response) {
  const { productSlug } = req.params as { productSlug: string };
  const size = (req.query.size as string | undefined) ?? (req.body as any)?.size as string | undefined;
  const current = await getOrCreateCart(req, res);
  const items: ICartItem[] = ((current.items ?? []) as ICartItem[]).filter((i: ICartItem) => {
    if (i.productSlug !== productSlug) return true;
    if (size == null) return false; // remove all sizes of this product
    return (i.size ?? null) !== (size ?? null);
  });
  current.items = items;
  await current.save();
  return res.json({ cart: current.toObject() });
}
