import type { Request, Response } from "express";
import { Category } from "../models/Category";

export async function listCategories(_req: Request, res: Response) {
  try {
    const items = await Category.find().sort({ name: 1 }).lean();
    return res.json({ items });
  } catch (err: any) {
    console.error("[categoriesController] listCategories error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch categories", items: [] });
  }
}

export async function getCategoryBySlug(req: Request, res: Response) {
  try {
    const item = await Category.findOne({ slug: req.params.slug }).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json({ item });
  } catch (err: any) {
    console.error("[categoriesController] getCategoryBySlug error:", err?.message || err);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
}

export async function createCategory(req: Request, res: Response) {
  const body = req.body as any;
  try {
    const created = await Category.create(body);
    const item = await Category.findById(created._id).lean();
    return res.status(201).json({ item });
  } catch (e: any) {
    console.error("[categoriesController] createCategory error:", e?.message || e);
    return res.status(400).json({ error: e?.message || "Failed to create" });
  }
}

export async function updateCategoryBySlug(req: Request, res: Response) {
  try {
    const updates = req.body as any;
    const item = await Category.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true }).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json({ item });
  } catch (err: any) {
    console.error("[categoriesController] updateCategoryBySlug error:", err?.message || err);
    return res.status(500).json({ error: "Failed to update category" });
  }
}

export async function deleteCategoryBySlug(req: Request, res: Response) {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug }).lean();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err: any) {
    console.error("[categoriesController] deleteCategoryBySlug error:", err?.message || err);
    return res.status(500).json({ error: "Failed to delete category" });
  }
}
