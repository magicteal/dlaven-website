import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth";
import {
  createOrder,
  verifyPayment,
  myOrders,
  getOrderById,
  adminGetOrder,
  adminListOrders,
  adminUpdateStatus,
} from "../controllers/ordersController";
import { User } from "../models/User";

const router = Router();

// Admin (place before generic "/:id" route to avoid conflicts)
router.get("/admin", requireAuth, requireAdmin, adminListOrders);
router.get("/admin/:id", requireAuth, requireAdmin, adminGetOrder);
router.patch("/admin/:id/status", requireAuth, requireAdmin, adminUpdateStatus);

// User
router.post("/create", requireAuth, createOrder);
router.post("/verify", requireAuth, verifyPayment);
router.get("/mine", requireAuth, myOrders);
// Entitlement status (place before generic "/:id")
router.get("/me/entitlements", requireAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.sub;
    const u = await User.findById(userId)
      .select({ privePurchasesCount: 1, barryEntitlementsAvailable: 1 })
      .lean();
    return res.json({
      item: {
        privePurchasesCount: (u as any)?.privePurchasesCount || 0,
        barryEntitlementsAvailable: (u as any)?.barryEntitlementsAvailable || 0,
      },
    });
  } catch (e: any) {
    return res
      .status(400)
      .json({ error: e?.message || "Failed to get entitlements" });
  }
});
router.get("/:id", requireAuth, getOrderById);

export default router;
