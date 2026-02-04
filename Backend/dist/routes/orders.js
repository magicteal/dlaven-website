"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ordersController_1 = require("../controllers/ordersController");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Admin (place before generic "/:id" route to avoid conflicts)
router.get("/admin", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminListOrders);
router.get("/admin/:id", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminGetOrder);
router.patch("/admin/:id/status", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminUpdateStatus);
// User
router.post("/create", auth_1.requireAuth, ordersController_1.createOrder);
router.post("/verify", auth_1.requireAuth, ordersController_1.verifyPayment);
router.get("/mine", auth_1.requireAuth, ordersController_1.myOrders);
// Entitlement status (place before generic "/:id")
router.get("/me/entitlements", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user?.sub;
        const u = await User_1.User.findById(userId)
            .select({ privePurchasesCount: 1, barryEntitlementsAvailable: 1 })
            .lean();
        return res.json({
            item: {
                privePurchasesCount: u?.privePurchasesCount || 0,
                barryEntitlementsAvailable: u?.barryEntitlementsAvailable || 0,
            },
        });
    }
    catch (e) {
        return res
            .status(400)
            .json({ error: e?.message || "Failed to get entitlements" });
    }
});
router.get("/:id", auth_1.requireAuth, ordersController_1.getOrderById);
exports.default = router;
