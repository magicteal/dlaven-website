"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const categoriesController_1 = require("../controllers/categoriesController");
const router = (0, express_1.Router)();
// List categories (public)
router.get("/", categoriesController_1.listCategories);
// Get category by slug (public)
router.get("/:slug", categoriesController_1.getCategoryBySlug);
// Create (admin)
router.post("/", auth_1.requireAuth, auth_1.requireAdmin, categoriesController_1.createCategory);
// Update by slug (admin)
router.patch("/:slug", auth_1.requireAuth, auth_1.requireAdmin, categoriesController_1.updateCategoryBySlug);
// Delete by slug (admin)
router.delete("/:slug", auth_1.requireAuth, auth_1.requireAdmin, categoriesController_1.deleteCategoryBySlug);
exports.default = router;
