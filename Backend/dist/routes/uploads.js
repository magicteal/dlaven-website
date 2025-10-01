"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../utils/cloudinary");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB
// POST /api/uploads/image - admin only
router.post("/image", auth_1.requireAuth, auth_1.requireAdmin, upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: "No file provided" });
        const result = await (0, cloudinary_1.uploadImage)(file.buffer, file.originalname);
        res.status(201).json({ item: result });
    }
    catch (e) {
        res.status(400).json({ error: e?.message || "Upload failed" });
    }
});
exports.default = router;
