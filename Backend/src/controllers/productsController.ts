// Backend/src/controllers/productsController.ts
import type { Request, Response } from "express";
import { Product } from "../models/Product";

/**
 * List products (supports optional query filters like ?category=slug or ?q=search)
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const { category, q, limit = "50", skip = "0", section, tag } = req.query as any;

    // Allowed site categories (hard-coded)
    const allowedCategories = [
      "fragrances",
      "mens-ready-to-wear",
      "heritage-jewelry",
    ];

    const allowedSections = ["prive", "dlaven-limited", "dl-barry"];

    const filter: any = {};
    if (category) filter.categorySlug = String(category);
    if (section) {
      if (!allowedSections.includes(String(section))) {
        return res.status(400).json({ error: `Invalid section` });
      }
      filter.section = String(section);
      // Ensure only allowed categories are returned for sections
      filter.categorySlug = { $in: allowedCategories };
    }
    if (tag) {
      // Only allow the known tags
      const allowedTags = ["normal-product", "dl-limited", "dl-prive", "dl-barry"];
      if (!allowedTags.includes(String(tag))) {
        return res.status(400).json({ error: `Invalid tag` });
      }
      filter.tags = String(tag);
    }
    if (q) filter.$text = { $search: String(q) };

    const items = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(parseInt(limit, 10) || 50, 200))
      .skip(Math.max(parseInt(skip, 10) || 0, 0))
      .lean();

    return res.json({ items });
  } catch (err) {
    console.error("listProducts error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const item = await Product.findOne({ slug }).lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json({ item });
  } catch (err) {
    console.error("getProductBySlug error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Create product (admin route)
 * Expect body to include: slug, name, price, currency, categorySlug, images (array), etc
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const body = req.body as Partial<{
      slug: string;
      name: string;
      price: number;
      currency: string;
      images: string[];
      categorySlug: string;
      description?: string;
      sizeOptions?: string[];
      details?: string[];
      materialCare?: string[];
      isLimited?: boolean;
      inStock?: boolean;
      section?: string;
      tags?: string[];
    }>;

    const allowedCategories = [
      "fragrances",
      "mens-ready-to-wear",
      "heritage-jewelry",
    ];

    if (!body?.slug || !body?.name || typeof body.price !== "number" || !body?.categorySlug) {
      return res.status(400).json({ error: "Missing required product fields" });
    }

    if (!allowedCategories.includes(body.categorySlug)) {
      return res.status(400).json({ error: `categorySlug must be one of: ${allowedCategories.join(", ")}` });
    }

    const allowedSections = ["prive", "dlaven-limited", "dl-barry"];
    if (body.section && !allowedSections.includes(body.section)) {
      return res.status(400).json({ error: `section must be one of: ${allowedSections.join(", ")}` });
    }

    const existing = await Product.findOne({ slug: body.slug }).lean();
    if (existing) return res.status(409).json({ error: "Product with this slug already exists" });

    const created = await Product.create({
      slug: body.slug,
      name: body.name,
      description: body.description ?? "",
      price: body.price,
      currency: body.currency ?? "USD",
      images: body.images ?? [],
      categorySlug: body.categorySlug,
      sizeOptions: body.sizeOptions ?? undefined,
      details: body.details ?? undefined,
      materialCare: body.materialCare ?? undefined,
      isLimited: !!body.isLimited,
      section: body.section ?? null,
      tags: body.tags ?? undefined,
      inStock: body.inStock !== undefined ? !!body.inStock : true,
    });

    return res.status(201).json({ item: created });
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Update product by slug (admin)
 */
export async function updateProductBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const updates = req.body as any;
    const updated = await Product.findOneAndUpdate({ slug }, updates, { new: true }).lean();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json({ item: updated });
  } catch (err) {
    console.error("updateProductBySlug error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Delete product by slug (admin)
 */
export async function deleteProductBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const deleted = await Product.findOneAndDelete({ slug }).lean();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("deleteProductBySlug error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
