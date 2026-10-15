import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { uploadImage as uploadToCloudinary } from "../utils/cloudinary";

const router = Router();

// Storage location: uses VPS /var/www/media if present, or MEDIA_DIR env, or local media folder
export const MEDIA_DIR =
  process.env.MEDIA_DIR ||
  (fs.existsSync("/var/www/media") ? "/var/www/media" : path.resolve(process.cwd(), "media"));

// Ensure root and subdirectories exist
["products", "images", "videos"].forEach((sub) => {
  const dir = path.join(MEDIA_DIR, sub);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // ignore if exists or managed by system
    }
  }
});

// Configure Multer memory storage (allows up to 300MB for big videos and images)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB
});

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  const hash = crypto.randomBytes(4).toString("hex");
  return `${Date.now()}-${hash}-${base}${ext}`;
}

function resolveFolder(req: Request, file: Express.Multer.File): "products" | "images" | "videos" {
  const requested = ((req.body?.folder || req.query?.folder) as string)?.toLowerCase();
  if (requested === "videos" || requested === "images" || requested === "products") {
    return requested;
  }
  // Auto-detect by MIME type
  if (file.mimetype.startsWith("video/")) {
    return "videos";
  }
  return "products";
}

// POST /api/uploads/image - upload image or media (admin only)
router.post(
  "/image",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No file provided" });

      const storageDriver = (process.env.UPLOAD_STORAGE || "local").toLowerCase();

      // If explicitly configured for Cloudinary
      if (storageDriver === "cloudinary") {
        const result = await uploadToCloudinary(file.buffer, file.originalname);
        return res.status(201).json({ item: result });
      }

      // Default: save directly to 30GB VPS media disk
      const folder = resolveFolder(req, file);
      const targetDir = path.join(MEDIA_DIR, folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filename = sanitizeFilename(file.originalname);
      const filePath = path.join(targetDir, filename);

      await fs.promises.writeFile(filePath, file.buffer);

      const mediaUrl = `/media/${folder}/${filename}`;

      return res.status(201).json({
        item: {
          url: mediaUrl,
          public_id: filename,
          folder,
          filename,
          size: file.size,
          mimetype: file.mimetype,
          storage: "local-disk",
        },
      });
    } catch (e: any) {
      console.error("[uploads] Upload error:", e);
      return res.status(500).json({ error: e?.message || "Upload failed" });
    }
  }
);

// POST /api/uploads/video - dedicated video upload endpoint (admin only)
router.post(
  "/video",
  requireAuth,
  requireAdmin,
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No video provided" });

      const targetDir = path.join(MEDIA_DIR, "videos");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const filename = sanitizeFilename(file.originalname);
      const filePath = path.join(targetDir, filename);

      await fs.promises.writeFile(filePath, file.buffer);

      const mediaUrl = `/media/videos/${filename}`;

      return res.status(201).json({
        item: {
          url: mediaUrl,
          filename,
          size: file.size,
          mimetype: file.mimetype,
          storage: "local-disk",
        },
      });
    } catch (e: any) {
      console.error("[uploads/video] Upload error:", e);
      return res.status(500).json({ error: e?.message || "Video upload failed" });
    }
  }
);

// GET /api/uploads/disk-info - view 30GB media disk usage (admin only)
router.get("/disk-info", requireAuth, requireAdmin, (_req: Request, res: Response) => {
  try {
    const stat = (fs as any).statfsSync ? (fs as any).statfsSync(MEDIA_DIR) : null;
    if (!stat) {
      return res.json({ available: false, path: MEDIA_DIR });
    }

    const totalBytes = Number(stat.blocks) * Number(stat.bsize);
    const freeBytes = Number(stat.bavail) * Number(stat.bsize);
    const usedBytes = totalBytes - freeBytes;

    const toGB = (bytes: number) => (bytes / (1024 * 1024 * 1024)).toFixed(2);

    return res.json({
      path: MEDIA_DIR,
      totalBytes,
      usedBytes,
      freeBytes,
      totalGB: `${toGB(totalBytes)} GB`,
      usedGB: `${toGB(usedBytes)} GB`,
      freeGB: `${toGB(freeBytes)} GB`,
      percentUsed: `${((usedBytes / totalBytes) * 100).toFixed(1)}%`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || "Failed to read disk stats" });
  }
});

export default router;
