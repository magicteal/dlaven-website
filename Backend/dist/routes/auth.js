"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
// Check if email exists (for login/register flow)
router.post("/check-email", async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ error: "Email is required" });
    const user = await User_1.User.findOne({ email }).lean();
    return res.json({ exists: !!user });
});
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.post("/logout", authController_1.logout);
router.get("/me", auth_1.requireAuth, authController_1.me);
router.patch("/profile", auth_1.requireAuth, authController_1.updateProfile);
router.post("/forgot-password", authController_1.forgotPassword);
router.post("/reset-password", authController_1.resetPassword);
router.get("/address", auth_1.requireAuth, authController_1.getAddress);
router.patch("/address", auth_1.requireAuth, authController_1.updateAddress);
// Addresses CRUD
router.get("/addresses", auth_1.requireAuth, authController_1.listAddresses);
router.post("/addresses", auth_1.requireAuth, authController_1.createAddress);
router.patch("/addresses/:id", auth_1.requireAuth, authController_1.updateAddressById);
router.delete("/addresses/:id", auth_1.requireAuth, authController_1.deleteAddressById);
router.patch("/addresses/:id/default", auth_1.requireAuth, authController_1.setDefaultAddress);
// Admin-only user management
router.get("/users", auth_1.requireAuth, auth_1.requireAdmin, async (_req, res) => {
    const users = await User_1.User.find({}, { passwordHash: 0, __v: 0 }).sort({ createdAt: -1 }).lean();
    res.json({ users });
});
router.patch("/users/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;
    const toUpdate = {};
    if (typeof name === "string")
        toUpdate.name = name;
    if (role === "user" || role === "admin")
        toUpdate.role = role;
    const user = await User_1.User.findByIdAndUpdate(id, toUpdate, { new: true, projection: { passwordHash: 0, __v: 0 } }).lean();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    res.json({ user });
});
router.delete("/users/:id", auth_1.requireAuth, auth_1.requireAdmin, async (req, res) => {
    const { id } = req.params;
    const deleted = await User_1.User.findByIdAndDelete(id).lean();
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
});
exports.default = router;
