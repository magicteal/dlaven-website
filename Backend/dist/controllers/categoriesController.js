"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCategories = listCategories;
exports.getCategoryBySlug = getCategoryBySlug;
exports.createCategory = createCategory;
exports.updateCategoryBySlug = updateCategoryBySlug;
exports.deleteCategoryBySlug = deleteCategoryBySlug;
const Category_1 = require("../models/Category");
async function listCategories(_req, res) {
    const items = await Category_1.Category.find().sort({ name: 1 }).lean();
    return res.json({ items });
}
async function getCategoryBySlug(req, res) {
    const item = await Category_1.Category.findOne({ slug: req.params.slug }).lean();
    if (!item)
        return res.status(404).json({ error: "Not found" });
    return res.json({ item });
}
async function createCategory(req, res) {
    const body = req.body;
    try {
        const created = await Category_1.Category.create(body);
        const item = await Category_1.Category.findById(created._id).lean();
        return res.status(201).json({ item });
    }
    catch (e) {
        return res.status(400).json({ error: "Failed to create" });
    }
}
async function updateCategoryBySlug(req, res) {
    const updates = req.body;
    const item = await Category_1.Category.findOneAndUpdate({ slug: req.params.slug }, updates, { new: true }).lean();
    if (!item)
        return res.status(404).json({ error: "Not found" });
    return res.json({ item });
}
async function deleteCategoryBySlug(req, res) {
    const deleted = await Category_1.Category.findOneAndDelete({ slug: req.params.slug }).lean();
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    return res.json({ ok: true });
}
