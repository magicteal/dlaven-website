"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cartController_1 = require("../controllers/cartController");
const router = (0, express_1.Router)();
// Public/guest-friendly cart endpoints using cookie cartId or userId
router.get("/", cartController_1.getCart);
router.post("/items", cartController_1.addItem);
router.patch("/items/:productSlug", cartController_1.updateItem);
router.delete("/items/:productSlug", cartController_1.removeItem);
exports.default = router;
