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
    const { email, password, firstName, lastName, title, phone, areaCode, dob, marketingConsent } = req.body as {
      email: string;
      password: string;
      firstName?: string;
      lastName?: string;
      title?: string;
      phone?: string;
      areaCode?: string;
      dob?: string;
      marketingConsent?: boolean;
    };
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });
    const existing = await User.findOne({ email }).lean();
    if (existing) return res.status(409).json({ error: "Email already in use" });
    const passwordHash = await bcrypt.hash(password, 10);
    const name = [firstName, lastName].filter(Boolean).join(" ") || undefined;
    const fullPhone = areaCode && phone ? `${areaCode}${phone}` : phone;
  const created = await User.create({
    email,
    passwordHash,
    name,
    title,
    phone: fullPhone,
    dob,
    marketingConsent: !!marketingConsent,
  });
  const token = signToken({ sub: created.id, email: created.email, role: created.role });
    // Cookie options: allow configuring secure/sameSite via env for production
    const secure = process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
    const sameSite = process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: sameSite as any,
      secure,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (process.env.NODE_ENV !== "production") {
      const header = res.getHeader("Set-Cookie");
      console.log("[auth] Set-Cookie header (register):", header);
    }
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
    const secure = process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
    const sameSite = process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: sameSite as any,
      secure,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    if (process.env.NODE_ENV !== "production") {
      const header = res.getHeader("Set-Cookie");
      console.log("[auth] Set-Cookie header (login):", header);
    }
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
    // Prefer default address from addresses[]; fallback to legacy address field
    const defaultAddress = (user.addresses || []).find((a: any) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
    const addr = defaultAddress ? {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      line1: defaultAddress.line1,
      line2: defaultAddress.line2,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: defaultAddress.country,
    } : (user.address || null);
    return res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, dob: user.dob, role: user.role, address: addr } });
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
  const resetUrl = `${frontendBase}/reset-password?token=${encodeURIComponent(token)}`;
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
  // Use same options as when setting the cookie so browsers remove it reliably
  const secure = process.env.COOKIE_SECURE
    ? process.env.COOKIE_SECURE === "true"
    : process.env.NODE_ENV === "production";
  const sameSite = process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");
  res.clearCookie("token", { httpOnly: true, sameSite: sameSite as any, secure, path: "/" });
  if (process.env.NODE_ENV !== "production") {
    const header = res.getHeader("Set-Cookie");
    console.log("[auth] Clear-Cookie header (logout):", header);
  }
  return res.json({ ok: true });
}

export async function updateProfile(req: Request, res: Response) {
  try {
    const auth = (req as any).user as { sub: string } | undefined;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const { name, phone, dob } = req.body as { name?: string; phone?: string; dob?: string };
    const user = await User.findById(auth.sub).exec();
    if (!user) return res.status(404).json({ error: "Not found" });
    if (typeof name === "string") user.name = name;
    if (typeof phone === "string") user.phone = phone;
    if (typeof dob === "string") user.dob = dob;
    await user.save();
    // Return with computed default address for consistency
    const defaultAddress = (user.addresses || []).find((a: any) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
    const addr = defaultAddress ? {
      fullName: defaultAddress.fullName,
      phone: defaultAddress.phone,
      line1: defaultAddress.line1,
      line2: defaultAddress.line2,
      city: defaultAddress.city,
      state: defaultAddress.state,
      postalCode: defaultAddress.postalCode,
      country: defaultAddress.country,
    } : (user.address || null);
    return res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, dob: user.dob, role: user.role, address: addr } });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function getAddress(req: Request, res: Response) {
  try {
    const auth = (req as any).user as { sub: string } | undefined;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const user = await User.findById(auth.sub).exec();
    if (!user) return res.status(404).json({ error: "Not found" });
    // Return default address; fallback to legacy single address
    const defaultAddress = (user.addresses || []).find((a: any) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
    if (defaultAddress) {
      return res.json({ address: {
        fullName: defaultAddress.fullName,
        phone: defaultAddress.phone,
        line1: defaultAddress.line1,
        line2: defaultAddress.line2,
        city: defaultAddress.city,
        state: defaultAddress.state,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country,
      } });
    }
    return res.json({ address: user.address || null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to get address" });
  }
}

export async function updateAddress(req: Request, res: Response) {
  try {
    const auth = (req as any).user as { sub: string } | undefined;
    if (!auth) return res.status(401).json({ error: "Unauthorized" });
    const body = (req.body || {}) as Partial<{
      fullName: string;
      phone: string;
      line1: string;
      line2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }>;
    const user = await User.findById(auth.sub).exec();
    if (!user) return res.status(404).json({ error: "Not found" });
    // If addresses[] exists, upsert default address there; else write legacy field
    if (Array.isArray(user.addresses)) {
      // Find default or first
      const idx = user.addresses.findIndex((a: any) => a.isDefault);
      if (idx >= 0) {
        Object.assign(user.addresses[idx], body);
      } else if (user.addresses.length > 0) {
        Object.assign(user.addresses[0], body);
        // mark it default
        (user.addresses[0] as any).isDefault = true;
      } else {
        (user.addresses as any).push({ ...body, isDefault: true });
      }
      await user.save();
      const def = (user.addresses || []).find((a: any) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
      return res.json({ address: def ? {
        fullName: def.fullName,
        phone: def.phone,
        line1: def.line1,
        line2: def.line2,
        city: def.city,
        state: def.state,
        postalCode: def.postalCode,
        country: def.country,
      } : null });
    }
    // Legacy fallback
    user.address = { ...user.address, ...body };
    await user.save();
    return res.json({ address: user.address || null });
  } catch (err) {
    return res.status(500).json({ error: "Failed to update address" });
  }
}

// New: addresses CRUD
export async function listAddresses(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string } | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const user = await User.findById(auth.sub).exec();
  if (!user) return res.status(404).json({ error: "Not found" });
  const addresses = (user.addresses || []).map((a: any) => ({
    id: a._id,
    label: a.label,
    fullName: a.fullName,
    phone: a.phone,
    line1: a.line1,
    line2: a.line2,
    city: a.city,
    state: a.state,
    postalCode: a.postalCode,
    country: a.country,
    isDefault: !!a.isDefault,
  }));
  return res.json({ addresses });
}

export async function createAddress(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string } | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const body = (req.body || {}) as Partial<{ label: string; fullName: string; phone: string; line1: string; line2: string; city: string; state: string; postalCode: string; country: string; isDefault?: boolean }>;
  const user = await User.findById(auth.sub).exec();
  if (!user) return res.status(404).json({ error: "Not found" });
  const makeDefault = body.isDefault || !(user.addresses && user.addresses.length);
  if (makeDefault && Array.isArray(user.addresses)) {
    user.addresses.forEach((a: any) => (a.isDefault = false));
  }
  (user.addresses as any) = user.addresses || [];
  (user.addresses as any).push({
    label: body.label,
    fullName: body.fullName,
    phone: body.phone,
    line1: body.line1,
    line2: body.line2,
    city: body.city,
    state: body.state,
    postalCode: body.postalCode,
    country: body.country,
    isDefault: !!makeDefault,
  });
  await user.save();
  const created = user.addresses[user.addresses.length - 1] as any;
  return res.status(201).json({ address: {
    id: created._id,
    label: created.label,
    fullName: created.fullName,
    phone: created.phone,
    line1: created.line1,
    line2: created.line2,
    city: created.city,
    state: created.state,
    postalCode: created.postalCode,
    country: created.country,
    isDefault: !!created.isDefault,
  } });
}

export async function updateAddressById(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string } | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params as { id: string };
  const body = (req.body || {}) as Partial<{ label: string; fullName: string; phone: string; line1: string; line2: string; city: string; state: string; postalCode: string; country: string }>;
  const user = await User.findById(auth.sub).exec();
  if (!user) return res.status(404).json({ error: "Not found" });
  const addr = (user.addresses || []).find((a: any) => String(a._id) === id);
  if (!addr) return res.status(404).json({ error: "Address not found" });
  Object.assign(addr, body);
  await user.save();
  return res.json({ address: { id: addr._id, label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country, isDefault: !!addr.isDefault } });
}

export async function deleteAddressById(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string } | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params as { id: string };
  const user = await User.findById(auth.sub).exec();
  if (!user) return res.status(404).json({ error: "Not found" });
  const before = (user.addresses || []).length;
  user.addresses = (user.addresses || []).filter((a: any) => String(a._id) !== id) as any;
  const after = (user.addresses || []).length;
  if (after === before) return res.status(404).json({ error: "Address not found" });
  // Ensure one default remains
  if (!(user.addresses || []).some((a: any) => a.isDefault) && (user.addresses || []).length > 0) {
    (user.addresses as any)[0].isDefault = true;
  }
  await user.save();
  return res.json({ ok: true });
}

export async function setDefaultAddress(req: Request, res: Response) {
  const auth = (req as any).user as { sub: string } | undefined;
  if (!auth) return res.status(401).json({ error: "Unauthorized" });
  const { id } = req.params as { id: string };
  const user = await User.findById(auth.sub).exec();
  if (!user) return res.status(404).json({ error: "Not found" });
  let found = false;
  (user.addresses || []).forEach((a: any) => {
    if (String(a._id) === id) {
      a.isDefault = true;
      found = true;
    } else {
      a.isDefault = false;
    }
  });
  if (!found) return res.status(404).json({ error: "Address not found" });
  await user.save();
  return res.json({ ok: true });
}
