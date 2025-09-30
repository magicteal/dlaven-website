"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.logout = logout;
exports.updateProfile = updateProfile;
exports.getAddress = getAddress;
exports.updateAddress = updateAddress;
exports.listAddresses = listAddresses;
exports.createAddress = createAddress;
exports.updateAddressById = updateAddressById;
exports.deleteAddressById = deleteAddressById;
exports.setDefaultAddress = setDefaultAddress;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../utils/email");
function signToken(payload) {
    const secret = (process.env.JWT_SECRET || "dev-secret");
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
async function register(req, res) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });
        const existing = await User_1.User.findOne({ email }).lean();
        if (existing)
            return res.status(409).json({ error: "Email already in use" });
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const created = await User_1.User.create({ email, passwordHash, name });
        const token = signToken({ sub: created.id, email: created.email, role: created.role });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
        try {
            await (0, email_1.sendEmail)({
                to: created.email,
                subject: "Welcome to DLaven",
                text: `Hi${created.name ? " " + created.name : ""}, your account has been created.`,
            });
        }
        catch { }
        return res.status(201).json({ user: { id: created.id, email: created.email, name: created.name, role: created.role } });
    }
    catch (err) {
        return res.status(500).json({ error: "Registration failed" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });
        const user = await User_1.User.findOne({ email }).exec();
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = signToken({ sub: user.id, email: user.email, role: user.role });
        res.cookie("token", token, { httpOnly: true, sameSite: "lax", secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (err) {
        return res.status(500).json({ error: "Login failed" });
    }
}
async function me(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await User_1.User.findById(auth.sub).exec();
        if (!user)
            return res.status(404).json({ error: "Not found" });
        // Prefer default address from addresses[]; fallback to legacy address field
        const defaultAddress = (user.addresses || []).find((a) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
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
        return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, address: addr } });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed" });
    }
}
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ error: "Email is required" });
        const user = await User_1.User.findOne({ email }).exec();
        if (!user) {
            // Avoid user enumeration; respond OK
            return res.json({ ok: true });
        }
        const token = crypto_1.default.randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes
        user.passwordResetToken = token;
        user.passwordResetExpires = expires;
        await user.save();
        const frontendBase = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
        const resetUrl = `${frontendBase}/reset-password?token=${encodeURIComponent(token)}`;
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: "Reset your DLaven password",
                html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
            });
        }
        catch { }
        // For dev, also return token
        return res.json({ ok: true, resetToken: token, expiresAt: expires.toISOString() });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to init reset" });
    }
}
async function resetPassword(req, res) {
    try {
        const { token, password } = req.body;
        if (!token || !password)
            return res.status(400).json({ error: "Token and password are required" });
        const user = await User_1.User.findOne({ passwordResetToken: token }).exec();
        if (!user || !user.passwordResetExpires || user.passwordResetExpires.getTime() < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        user.passwordHash = passwordHash;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        try {
            await (0, email_1.sendEmail)({
                to: user.email,
                subject: "Your DLaven password was changed",
                text: "Your password was just updated. If this wasn't you, please contact support immediately.",
            });
        }
        catch { }
        return res.json({ ok: true });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to reset password" });
    }
}
async function logout(_req, res) {
    // Clear with the same attributes used when setting the cookie so browsers remove it reliably
    const secure = false; // consider Boolean(process.env.COOKIE_SECURE) in prod
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure, path: "/" });
    return res.json({ ok: true });
}
async function updateProfile(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ error: "Unauthorized" });
        const { name } = req.body;
        const user = await User_1.User.findById(auth.sub).exec();
        if (!user)
            return res.status(404).json({ error: "Not found" });
        if (typeof name === "string")
            user.name = name;
        await user.save();
        // Return with computed default address for consistency
        const defaultAddress = (user.addresses || []).find((a) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
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
        return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role, address: addr } });
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to update profile" });
    }
}
async function getAddress(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await User_1.User.findById(auth.sub).exec();
        if (!user)
            return res.status(404).json({ error: "Not found" });
        // Return default address; fallback to legacy single address
        const defaultAddress = (user.addresses || []).find((a) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
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
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to get address" });
    }
}
async function updateAddress(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ error: "Unauthorized" });
        const body = (req.body || {});
        const user = await User_1.User.findById(auth.sub).exec();
        if (!user)
            return res.status(404).json({ error: "Not found" });
        // If addresses[] exists, upsert default address there; else write legacy field
        if (Array.isArray(user.addresses)) {
            // Find default or first
            const idx = user.addresses.findIndex((a) => a.isDefault);
            if (idx >= 0) {
                Object.assign(user.addresses[idx], body);
            }
            else if (user.addresses.length > 0) {
                Object.assign(user.addresses[0], body);
                // mark it default
                user.addresses[0].isDefault = true;
            }
            else {
                user.addresses.push({ ...body, isDefault: true });
            }
            await user.save();
            const def = (user.addresses || []).find((a) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
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
    }
    catch (err) {
        return res.status(500).json({ error: "Failed to update address" });
    }
}
// New: addresses CRUD
async function listAddresses(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const addresses = (user.addresses || []).map((a) => ({
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
async function createAddress(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const body = (req.body || {});
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const makeDefault = body.isDefault || !(user.addresses && user.addresses.length);
    if (makeDefault && Array.isArray(user.addresses)) {
        user.addresses.forEach((a) => (a.isDefault = false));
    }
    user.addresses = user.addresses || [];
    user.addresses.push({
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
    const created = user.addresses[user.addresses.length - 1];
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
async function updateAddressById(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const body = (req.body || {});
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const addr = (user.addresses || []).find((a) => String(a._id) === id);
    if (!addr)
        return res.status(404).json({ error: "Address not found" });
    Object.assign(addr, body);
    await user.save();
    return res.json({ address: { id: addr._id, label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, state: addr.state, postalCode: addr.postalCode, country: addr.country, isDefault: !!addr.isDefault } });
}
async function deleteAddressById(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const before = (user.addresses || []).length;
    user.addresses = (user.addresses || []).filter((a) => String(a._id) !== id);
    const after = (user.addresses || []).length;
    if (after === before)
        return res.status(404).json({ error: "Address not found" });
    // Ensure one default remains
    if (!(user.addresses || []).some((a) => a.isDefault) && (user.addresses || []).length > 0) {
        user.addresses[0].isDefault = true;
    }
    await user.save();
    return res.json({ ok: true });
}
async function setDefaultAddress(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    let found = false;
    (user.addresses || []).forEach((a) => {
        if (String(a._id) === id) {
            a.isDefault = true;
            found = true;
        }
        else {
            a.isDefault = false;
        }
    });
    if (!found)
        return res.status(404).json({ error: "Address not found" });
    await user.save();
    return res.json({ ok: true });
}
