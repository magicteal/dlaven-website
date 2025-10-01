import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { createOrder, verifyPayment, myOrders, getOrderById, adminGetOrder, adminListOrders, adminUpdateStatus } from "../controllers/ordersController";

const router = Router();

// Admin (place before generic "/:id" route to avoid conflicts)
router.get("/admin", requireAuth, requireAdmin, adminListOrders);
router.get("/admin/:id", requireAuth, requireAdmin, adminGetOrder);
router.patch("/admin/:id/status", requireAuth, requireAdmin, adminUpdateStatus);

// User
router.post("/create", requireAuth, createOrder);
router.post("/verify", requireAuth, verifyPayment);
router.get("/mine", requireAuth, myOrders);
router.get("/:id", requireAuth, getOrderById);

export default router;
