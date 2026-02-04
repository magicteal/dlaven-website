"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const productsController_1 = require("../controllers/productsController");
const router = (0, express_1.Router)();
// List products (public) with optional filters
router.get("/", productsController_1.listProducts);
// Get by slug (public)
router.get("/:slug", productsController_1.getProductBySlug);
// Create (admin)
router.post("/", auth_1.requireAuth, auth_1.requireAdmin, productsController_1.createProduct);
// Update by slug (admin)
router.patch("/:slug", auth_1.requireAuth, auth_1.requireAdmin, productsController_1.updateProductBySlug);
// Delete by slug (admin)
router.delete("/:slug", auth_1.requireAuth, auth_1.requireAdmin, productsController_1.deleteProductBySlug);
exports.default = router;
