"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductBySlug = getProductBySlug;
exports.createProduct = createProduct;
exports.updateProductBySlug = updateProductBySlug;
exports.deleteProductBySlug = deleteProductBySlug;
const Product_1 = require("../models/Product");
/**
 * List products (supports optional query filters like ?category=slug or ?q=search)
 */
async function listProducts(req, res) {
    try {
        const { category, q, limit = "50", skip = "0", tag } = req.query;
        // Allowed site categories (hard-coded)
        const allowedCategories = [
            "fragrances",
            "mens-ready-to-wear",
            "heritage-jewelry",
        ];
        const filter = {};
        if (category)
            filter.categorySlug = String(category);
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
        if (q)
            filter.$text = { $search: String(q) };
        const items = await Product_1.Product.find(filter)
            .sort({ createdAt: -1 })
            .limit(Math.min(parseInt(limit, 10) || 50, 200))
            .skip(Math.max(parseInt(skip, 10) || 0, 0))
            .lean();
        return res.json({ items });
    }
    catch (err) {
        console.error("listProducts error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * Get single product by slug
 */
async function getProductBySlug(req, res) {
    try {
        const slug = req.params.slug;
        const item = await Product_1.Product.findOne({ slug }).lean();
        if (!item)
            return res.status(404).json({ error: "Not found" });
        return res.json({ item });
    }
    catch (err) {
        console.error("getProductBySlug error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * Create product (admin route)
 * Expect body to include: slug, name, price, currency, categorySlug, images (array), etc
 */
async function createProduct(req, res) {
    try {
        const body = req.body;
        const allowedCategories = [
            "fragrances",
            "mens-ready-to-wear",
            "heritage-jewelry",
        ];
        if (!body?.slug ||
            !body?.name ||
            typeof body.price !== "number" ||
            !body?.categorySlug) {
            return res.status(400).json({ error: "Missing required product fields" });
        }
        if (!allowedCategories.includes(body.categorySlug)) {
            return res.status(400).json({
                error: `categorySlug must be one of: ${allowedCategories.join(", ")}`,
            });
        }
        // Prefer tags for classification; no section/type enforcement
        const existing = await Product_1.Product.findOne({ slug: body.slug }).lean();
        if (existing)
            return res
                .status(409)
                .json({ error: "Product with this slug already exists" });
        const created = await Product_1.Product.create({
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
            tags: body.tags ?? undefined,
            inStock: body.inStock !== undefined ? !!body.inStock : true,
        });
        return res.status(201).json({ item: created });
    }
    catch (err) {
        console.error("createProduct error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * Update product by slug (admin)
 */
async function updateProductBySlug(req, res) {
    try {
        const slug = req.params.slug;
        const updates = req.body;
        const updated = await Product_1.Product.findOneAndUpdate({ slug }, updates, {
            new: true,
        }).lean();
        if (!updated)
            return res.status(404).json({ error: "Not found" });
        return res.json({ item: updated });
    }
    catch (err) {
        console.error("updateProductBySlug error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
/**
 * Delete product by slug (admin)
 */
async function deleteProductBySlug(req, res) {
    try {
        const slug = req.params.slug;
        const deleted = await Product_1.Product.findOneAndDelete({ slug }).lean();
        if (!deleted)
            return res.status(404).json({ error: "Not found" });
        return res.json({ ok: true });
    }
    catch (err) {
        console.error("deleteProductBySlug error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
