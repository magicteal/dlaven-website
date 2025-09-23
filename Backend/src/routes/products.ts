import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { listProducts, getProductBySlug, createProduct, updateProductBySlug, deleteProductBySlug } from "../controllers/productsController";

const router = Router();

// List products (public) with optional filters
router.get("/", listProducts);

// Get by slug (public)
router.get("/:slug", getProductBySlug);

// Create (admin)
router.post("/", requireAuth, requireAdmin, createProduct);

// Update by slug (admin)
router.patch("/:slug", requireAuth, requireAdmin, updateProductBySlug);

// Delete by slug (admin)
router.delete("/:slug", requireAuth, requireAdmin, deleteProductBySlug);

export default router;
