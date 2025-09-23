import { Router, Request } from "express";
import multer from "multer";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { uploadImage } from "../utils/cloudinary";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/uploads/image - admin only
router.post("/image", requireAuth, requireAdmin, upload.single("file"), async (req: Request, res) => {
  try {
    const file = (req as any).file as { buffer: Buffer; originalname: string } | undefined;
    if (!file) return res.status(400).json({ error: "No file provided" });
    const result = await uploadImage(file.buffer, file.originalname);
    res.status(201).json({ item: result });
  } catch (e: any) {
    res.status(400).json({ error: e?.message || "Upload failed" });
  }
});

export default router;
