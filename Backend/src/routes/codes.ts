import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { generateCodes } from "../controllers/codeController";

const router = Router();

// Admin-only codes routes
router.use(requireAuth, requireAdmin);

router.post("/generate", generateCodes);

export default router;
