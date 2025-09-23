import type { Request, Response } from "express";
import { Product } from "../models/Product";

export async function listProducts(req: Request, res: Response) {
  const { q, category, limit = 50, offset = 0 } = req.query as { q?: string; category?: string; limit?: string | number; offset?: string | number };
  const where: any = {};
  if (q) where.name = { $regex: q, $options: "i" };
  if (category) where.categorySlug = category;
  const lim = Math.min(Math.max(parseInt(String(limit)) || 50, 1), 100);
  const off = Math.max(parseInt(String(offset)) || 0, 0);
  const [items, total] = await Promise.all([
    Product.find(where).sort({ createdAt: -1 }).skip(off).limit(lim).lean(),
    Product.countDocuments(where),
  ]);
  return res.json({ items, total, limit: lim, offset: off });
}

export async function getProductBySlug(req: Request, res: Response) {
  const item = await Product.findOne({ slug: req.params.slug }).lean();
  if (!item) return res.status(404).json({ error: "Not found" });
  return res.json({ item });
}

export async function createProduct(req: Request, res: Response) {
  const body = req.body as any;
  try {
    const created = await Product.create(body);
    const item = await Product.findById(created._id).lean();
    return res.status(201).json({ item });
  } catch (e) {
    return res.status(400).json({ error: "Failed to create" });
  }
}

export async function updateProductBySlug(req: Request, res: Response) {
  const updates = req.body as any;
  const item = await Product.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true }).lean();
  if (!item) return res.status(404).json({ error: "Not found" });
  return res.json({ item });
}

export async function deleteProductBySlug(req: Request, res: Response) {
  const deleted = await Product.findOneAndDelete({ slug: req.params.slug }).lean();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  return res.json({ ok: true });
}
