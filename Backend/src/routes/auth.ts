import { Router } from "express";
import { login, me, register, logout, forgotPassword, resetPassword, updateProfile } from "../controllers/authController";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { User } from "../models/User";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);
router.patch("/profile", requireAuth, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Admin-only user management
router.get("/users", requireAuth, requireAdmin, async (_req, res) => {
	const users = await User.find({}, { passwordHash: 0, __v: 0 }).sort({ createdAt: -1 }).lean();
	res.json({ users });
});

router.patch("/users/:id", requireAuth, requireAdmin, async (req, res) => {
	const { id } = req.params;
	const { name, role } = req.body as { name?: string; role?: "user" | "admin" };
	const toUpdate: Record<string, unknown> = {};
	if (typeof name === "string") toUpdate.name = name;
	if (role === "user" || role === "admin") toUpdate.role = role;
	const user = await User.findByIdAndUpdate(id, toUpdate, { new: true, projection: { passwordHash: 0, __v: 0 } }).lean();
	if (!user) return res.status(404).json({ error: "Not found" });
	res.json({ user });
});

router.delete("/users/:id", requireAuth, requireAdmin, async (req, res) => {
	const { id } = req.params;
	const deleted = await User.findByIdAndDelete(id).lean();
	if (!deleted) return res.status(404).json({ error: "Not found" });
	res.json({ ok: true });
});

	export default router;
