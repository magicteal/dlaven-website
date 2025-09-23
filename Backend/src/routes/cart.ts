import { Router } from "express";
import { addItem, getCart, removeItem, updateItem } from "../controllers/cartController";

const router = Router();

// Public/guest-friendly cart endpoints using cookie cartId or userId
router.get("/", getCart);
router.post("/items", addItem);
router.patch("/items/:productSlug", updateItem);
router.delete("/items/:productSlug", removeItem);

export default router;
