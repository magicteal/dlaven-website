import { Router } from "express";
import {
  addItem,
  getCart,
  removeItem,
  updateItem,
} from "../controllers/cartController";
import { optionalAuth } from "../middleware/auth";

const router = Router();

// Public/guest-friendly cart endpoints using cookie cartId or userId
router.get("/", optionalAuth, getCart);
router.post("/items", optionalAuth, addItem);
router.patch("/items/:productSlug", optionalAuth, updateItem);
router.delete("/items/:productSlug", optionalAuth, removeItem);

export default router;
