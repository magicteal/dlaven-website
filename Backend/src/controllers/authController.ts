import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import crypto from "crypto";
import { sendEmail } from "../utils/email";

function signToken(payload: object) {
  const secret = (process.env.JWT_SECRET || "dev-secret") as jwt.Secret;
  const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"];
  return jwt.sign(payload as jwt.JwtPayload, secret, { expiresIn } as jwt.SignOptions);
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body as { email: string; password: string; name?: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
  const created = await User.create({ email, passwordHash, name });
  const token = signToken({ sub: created.id, email: created.email, role: created.role });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
    try {
      await sendEmail({
        to: created.email,
        subject: "Welcome to DLaven",
        text: `Hi${created.name ? " " + created.name : ""}, your account has been created.`,
      });
    } catch {}
    return res.status(201).json({ user: { id: created.id, email: created.email, name: created.name, role: created.role } });
  } catch (err) {
    return res.status(500).json({ error: "Registration failed" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = signToken({ sub: user.id, email: user.email, role: user.role });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
  return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const auth = (req as any).user as { sub: string; email: string } | undefined;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(auth.sub).exec();
    if (!user) return res.status(404).json({ error: "Not found" });
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: "Failed" });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body as { email: string };
    if (!email) return res.status(400).json({ error: "Email is required" });
    const user = await User.findOne({ email }).exec();
    if (!user) {
      // Avoid user enumeration; respond OK
      return res.json({ ok: true });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
    user.passwordResetToken = token;
    user.passwordResetExpires = expires;
    await user.save();
    const frontendBase = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
    const resetUrl = `${frontendBase}/auth/reset-password?token=${encodeURIComponent(token)}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset your DLaven password",
        html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
      });
    } catch {}
    // For dev, also return token
    return res.json({ ok: true, resetToken: token, expiresAt: expires.toISOString() });
  } catch (err) {
    return res.status(500).json({ error: "Failed to init reset" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { token, password } = req.body as { token: string; password: string };
    if (!token || !password) return res.status(400).json({ error: "Token and password are required" });
    const user = await User.findOne({ passwordResetToken: token }).exec();
    if (!user || !user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();
    try {
      await sendEmail({
        to: user.email,
        subject: "Your DLaven password was changed",
        text: "Your password was just updated. If this wasn't you, please contact support immediately.",
      });
    } catch {}
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: "Failed to reset password" });
  }
}

export async function logout(_req: Request, res: Response) {
  // Clear with the same attributes used when setting the cookie so browsers remove it reliably
  const secure = false; // consider Boolean(process.env.COOKIE_SECURE) in prod
  res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure, path: "/" });
  return res.json({ ok: true });
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const auth = (req as any).user as { sub: string } | undefined;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const { name } = req.body as { name?: string };
    const user = await User.findById(auth.sub).exec();
    if (!user) return res.status(404).json({ error: "Not found" });
    if (typeof name === "string") user.name = name;
    await user.save();
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
}
