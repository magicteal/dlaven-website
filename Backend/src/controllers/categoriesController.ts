import type { Request, Response } from "express";
import { Category } from "../models/Category";

export async function listCategories(_req: Request, res: Response) {
  const items = await Category.find().sort({ name: 1 }).lean();
  return res.json({ items });
}

export async function getCategoryBySlug(req: Request, res: Response) {
  const item = await Category.findOne({ slug: req.params.slug }).lean();
  if (!item) return res.status(404).json({ error: "Not found" });
  return res.json({ item });
}

export async function createCategory(req: Request, res: Response) {
  const body = req.body as any;
  try {
    const created = await Category.create(body);
    const item = await Category.findById(created._id).lean();
    return res.status(201).json({ item });
  } catch (e) {
    return res.status(400).json({ error: "Failed to create" });
  }
}

export async function updateCategoryBySlug(req: Request, res: Response) {
  const updates = req.body as any;
  const item = await Category.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true }).lean();
  if (!item) return res.status(404).json({ error: "Not found" });
  return res.json({ item });
}

export async function deleteCategoryBySlug(req: Request, res: Response) {
  const deleted = await Category.findOneAndDelete({ slug: req.params.slug }).lean();
  if (!deleted) return res.status(404).json({ error: "Not found" });
  return res.json({ ok: true });
}
