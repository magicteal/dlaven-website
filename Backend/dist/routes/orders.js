"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const ordersController_1 = require("../controllers/ordersController");
const router = (0, express_1.Router)();
// Admin (place before generic "/:id" route to avoid conflicts)
router.get("/admin", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminListOrders);
router.get("/admin/:id", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminGetOrder);
router.patch("/admin/:id/status", auth_1.requireAuth, auth_1.requireAdmin, ordersController_1.adminUpdateStatus);
// User
router.post("/create", auth_1.requireAuth, ordersController_1.createOrder);
router.post("/verify", auth_1.requireAuth, ordersController_1.verifyPayment);
router.get("/mine", auth_1.requireAuth, ordersController_1.myOrders);
router.get("/:id", auth_1.requireAuth, ordersController_1.getOrderById);
exports.default = router;
