"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function requireAuth(req, res, next) {
    try {
        const token = req.cookies?.token;
        if (!token)
            return res.status(401).json({ error: "Unauthorized" });
        const secret = process.env.JWT_SECRET || "dev-secret";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
function requireAdmin(req, res, next) {
    const user = req.user;
    if (!user)
        return res.status(401).json({ error: "Unauthorized" });
    if (user.role !== "admin")
        return res.status(403).json({ error: "Forbidden" });
    return next();
}
// Optional auth: if a token cookie exists, decode it and set req.user; do not fail when missing/invalid.
function optionalAuth(req, _res, next) {
    try {
        const token = req.cookies?.token;
        if (!token)
            return next();
        const secret = process.env.JWT_SECRET || "dev-secret";
        const payload = jsonwebtoken_1.default.verify(token, secret);
        req.user = payload;
    }
    catch {
        // ignore token errors for optional auth
    }
    // Call next once after processing optional auth
    return next();
}
