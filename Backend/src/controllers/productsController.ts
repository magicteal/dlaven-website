// Backend/src/controllers/productsController.ts
import type { Request, Response } from "express";
import { Product } from "../models/Product";

/**
 * List products (supports optional query filters like ?category=slug or ?q=search)
 */
export async function listProducts(req: Request, res: Response) {
  try {
    const { category, q, limit = "50", skip = "0", tag } = req.query as any;

    // Allowed site categories (hard-coded)
    const allowedCategories = [
      "fragrances",
      "mens-ready-to-wear",
      "heritage-jewelry",
    ];

    const filter: any = {};
    if (category) filter.categorySlug = String(category);
    if (tag) {
      const allowedTags = [
        "normal-product",
        "dl-limited",
        "dl-prive",
        "dl-barry",
      ];
      if (!allowedTags.includes(String(tag))) {
        return res.status(400).json({ error: `Invalid tag` });
      }
      filter.tags = String(tag);
      // For these special collections we constrain to allowed categories
      filter.categorySlug = { $in: allowedCategories };
    }
    if (q) filter.$text = { $search: String(q) };

    const items = await Product.find(filter)
      .select({ currency: 0 })
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
    const item = await Product.findOne({ slug })
      .select({ currency: 0 })
      .lean();
    if (!item) return res.status(404).json({ error: "Not found" });
    return res.json({ item });
  } catch (err) {
    console.error("getProductBySlug error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Create product (admin route)
 * Expect body to include: slug, name, price, categorySlug, images (array), etc
 */
export async function createProduct(req: Request, res: Response) {
  try {
    const body = req.body as Partial<{
      slug: string;
      name: string;
      price: number;
      images: string[];
      categorySlug: string;
      description?: string;
      sizeOptions?: string[];
      details?: string[];
      materialCare?: string[];
      inStock?: boolean;
      tags?: string[];
    }>;

    const allowedCategories = [
      "fragrances",
      "mens-ready-to-wear",
      "heritage-jewelry",
    ];

    if (
      !body?.slug ||
      !body?.name ||
      typeof body.price !== "number" ||
      !body?.categorySlug
    ) {
      return res.status(400).json({ error: "Missing required product fields" });
    }

    if (!allowedCategories.includes(body.categorySlug)) {
      return res.status(400).json({
        error: `categorySlug must be one of: ${allowedCategories.join(", ")}`,
      });
    }

    // Prefer tags for classification; no section/type enforcement

    const existing = await Product.findOne({ slug: body.slug }).lean();
    if (existing)
      return res
        .status(409)
        .json({ error: "Product with this slug already exists" });

    const created = await Product.create({
      slug: body.slug,
      name: body.name,
      description: body.description ?? "",
      price: body.price,
      images: body.images ?? [],
      categorySlug: body.categorySlug,
      sizeOptions: body.sizeOptions ?? undefined,
      details: body.details ?? undefined,
      materialCare: body.materialCare ?? undefined,
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
    const updated = await Product.findOneAndUpdate({ slug }, updates, {
      new: true,
    }).lean();
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
