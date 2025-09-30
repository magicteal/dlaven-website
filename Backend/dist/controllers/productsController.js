"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProducts = listProducts;
exports.getProductBySlug = getProductBySlug;
exports.createProduct = createProduct;
exports.updateProductBySlug = updateProductBySlug;
exports.deleteProductBySlug = deleteProductBySlug;
const Product_1 = require("../models/Product");
async function listProducts(req, res) {
    const { q, category, limit = 50, offset = 0 } = req.query;
    const where = {};
    if (q)
        where.name = { $regex: q, $options: "i" };
    if (category)
        where.categorySlug = category;
    const lim = Math.min(Math.max(parseInt(String(limit)) || 50, 1), 100);
    const off = Math.max(parseInt(String(offset)) || 0, 0);
    const [items, total] = await Promise.all([
        Product_1.Product.find(where).sort({ createdAt: -1 }).skip(off).limit(lim).lean(),
        Product_1.Product.countDocuments(where),
    ]);
    return res.json({ items, total, limit: lim, offset: off });
}
async function getProductBySlug(req, res) {
    const item = await Product_1.Product.findOne({ slug: req.params.slug }).lean();
    if (!item)
        return res.status(404).json({ error: "Not found" });
    return res.json({ item });
}
async function createProduct(req, res) {
    const body = req.body;
    try {
        const created = await Product_1.Product.create(body);
        const item = await Product_1.Product.findById(created._id).lean();
        return res.status(201).json({ item });
    }
    catch (e) {
        return res.status(400).json({ error: "Failed to create" });
    }
}
async function updateProductBySlug(req, res) {
    const updates = req.body;
    const item = await Product_1.Product.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true }).lean();
    if (!item)
        return res.status(404).json({ error: "Not found" });
    return res.json({ item });
}
async function deleteProductBySlug(req, res) {
    const deleted = await Product_1.Product.findOneAndDelete({ slug: req.params.slug }).lean();
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
}
