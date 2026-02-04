"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const codeController_1 = require("../controllers/codeController");
const router = (0, express_1.Router)();
// Public facing code verification
router.post("/verify-limited", codeController_1.verifyLimitedCode);
router.post("/verify-prive", auth_1.requireAuth, codeController_1.verifyPriveCode);
// Admin routes
router.use(auth_1.requireAuth, auth_1.requireAdmin);
router.post("/generate", codeController_1.generateCodes);
router.post("/import", codeController_1.importCodes);
router.get("/history", codeController_1.getBatchHistory);
router.get("/batch/:batch/download", codeController_1.downloadCodeBatch);
router.delete("/batch/:batch", codeController_1.deleteBatch);
exports.default = router;
