import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { listCategories, getCategoryBySlug, createCategory, updateCategoryBySlug, deleteCategoryBySlug } from "../controllers/categoriesController";

const router = Router();

// List categories (public)
router.get("/", listCategories);

// Get category by slug (public)
router.get("/:slug", getCategoryBySlug);

// Create (admin)
router.post("/", requireAuth, requireAdmin, createCategory);

// Update by slug (admin)
router.patch("/:slug", requireAuth, requireAdmin, updateCategoryBySlug);

// Delete by slug (admin)
router.delete("/:slug", requireAuth, requireAdmin, deleteCategoryBySlug);

export default router;
