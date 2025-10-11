import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { generateCodes, downloadCodeBatch, getBatchHistory, deleteBatch, verifyLimitedCode } from "../controllers/codeController";

const router = Router();

// Public facing code verification
router.post("/verify-limited", verifyLimitedCode);

// Admin routes
router.use(requireAuth, requireAdmin);

router.post("/generate", generateCodes);
router.get("/history", getBatchHistory);
router.get("/batch/:batch/download", downloadCodeBatch);
router.delete("/batch/:batch", deleteBatch);

export default router;
