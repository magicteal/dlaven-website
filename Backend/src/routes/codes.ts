import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { generateCodes, downloadCodeBatch, getBatchHistory, deleteBatch } from "../controllers/codeController";

const router = Router();

router.use(requireAuth, requireAdmin);

router.post("/generate", generateCodes);
router.get("/history", getBatchHistory);
router.get("/batch/:batch/download", downloadCodeBatch);
router.delete("/batch/:batch", deleteBatch); // <-- Naya delete route

export default router;