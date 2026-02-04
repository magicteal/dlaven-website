"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public/guest-friendly cart endpoints using cookie cartId or userId
router.get("/", auth_1.optionalAuth, cartController_1.getCart);
router.post("/items", auth_1.optionalAuth, cartController_1.addItem);
router.patch("/items/:productSlug", auth_1.optionalAuth, cartController_1.updateItem);
router.delete("/items/:productSlug", auth_1.optionalAuth, cartController_1.removeItem);
exports.default = router;
