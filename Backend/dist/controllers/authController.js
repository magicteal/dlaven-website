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
function normalizeAddress(body) {
    const update = { ...body };
    if (!update.fullName && (update.title || update.firstName || update.lastName)) {
        const name = [update.title, update.firstName, update.lastName].filter(Boolean).join(" ").trim();
        if (name)
            update.fullName = name;
    }
    if (!update.phone && (update.areaCode || update.phoneNumber)) {
        const phone = [update.areaCode, update.phoneNumber].filter(Boolean).join(" ").trim();
        if (phone)
            update.phone = phone;
    }
    if (update.postalCode && update.zipPlus && !update.postalCode.includes("-")) {
        update.postalCode = `${update.postalCode}-${update.zipPlus}`;
    }
    return update;
}
function signToken(payload) {
    const secret = (process.env.JWT_SECRET || "dev-secret");
    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d");
    return jsonwebtoken_1.default.sign(payload, secret, { expiresIn });
}
async function register(req, res) {
    try {
        const { email, password, firstName, lastName, title, phone, areaCode, dob, marketingConsent } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });
        const existing = await User_1.User.findOne({ email }).lean();
        if (existing)
            return res.status(409).json({ error: "Email already in use" });
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const name = [firstName, lastName].filter(Boolean).join(" ") || undefined;
        const fullPhone = areaCode && phone ? `${areaCode}${phone}` : phone;
        const created = await User_1.User.create({
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
            sameSite: sameSite,
            secure,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        if (process.env.NODE_ENV !== "production") {
            const header = res.getHeader("Set-Cookie");
            console.log("[auth] Set-Cookie header (register):", header);
        }
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
        const secure = process.env.COOKIE_SECURE
            ? process.env.COOKIE_SECURE === "true"
            : process.env.NODE_ENV === "production";
        const sameSite = process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: sameSite,
            secure,
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        if (process.env.NODE_ENV !== "production") {
            const header = res.getHeader("Set-Cookie");
            console.log("[auth] Set-Cookie header (login):", header);
        }
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
            label: defaultAddress.label,
            title: defaultAddress.title,
            firstName: defaultAddress.firstName,
            lastName: defaultAddress.lastName,
            company: defaultAddress.company,
            fullName: defaultAddress.fullName,
            areaCode: defaultAddress.areaCode,
            phoneNumber: defaultAddress.phoneNumber,
            phone: defaultAddress.phone,
            line1: defaultAddress.line1,
            line2: defaultAddress.line2,
            city: defaultAddress.city,
            state: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            zipPlus: defaultAddress.zipPlus,
            country: defaultAddress.country,
        } : (user.address || null);
        return res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, dob: user.dob, role: user.role, address: addr } });
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
        // Prefer an explicit public frontend URL; otherwise pick the first non-wildcard origin from FRONTEND_ORIGIN.
        const frontendBase = (() => {
            const explicit = process.env.FRONTEND_PUBLIC_URL;
            if (explicit)
                return explicit;
            const raw = process.env.FRONTEND_ORIGIN;
            if (!raw)
                return "http://localhost:3000";
            const firstExact = raw
                .split(",")
                .map((s) => s.trim())
                .find((s) => s && !s.includes("*"));
            return firstExact || "http://localhost:3000";
        })();
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
    // Use same options as when setting the cookie so browsers remove it reliably
    const secure = process.env.COOKIE_SECURE
        ? process.env.COOKIE_SECURE === "true"
        : process.env.NODE_ENV === "production";
    const sameSite = process.env.COOKIE_SAMESITE || (secure ? "none" : "lax");
    res.clearCookie("token", { httpOnly: true, sameSite: sameSite, secure, path: "/" });
    if (process.env.NODE_ENV !== "production") {
        const header = res.getHeader("Set-Cookie");
        console.log("[auth] Clear-Cookie header (logout):", header);
    }
    return res.json({ ok: true });
}
async function updateProfile(req, res) {
    try {
        const auth = req.user;
        if (!auth)
            return res.status(401).json({ error: "Unauthorized" });
        const { name, phone, dob } = req.body;
        const user = await User_1.User.findById(auth.sub).exec();
        if (!user)
            return res.status(404).json({ error: "Not found" });
        if (typeof name === "string")
            user.name = name;
        if (typeof phone === "string")
            user.phone = phone;
        if (typeof dob === "string")
            user.dob = dob;
        await user.save();
        // Return with computed default address for consistency
        const defaultAddress = (user.addresses || []).find((a) => a.isDefault) || (user.addresses && user.addresses[0]) || null;
        const addr = defaultAddress ? {
            label: defaultAddress.label,
            title: defaultAddress.title,
            firstName: defaultAddress.firstName,
            lastName: defaultAddress.lastName,
            company: defaultAddress.company,
            fullName: defaultAddress.fullName,
            areaCode: defaultAddress.areaCode,
            phoneNumber: defaultAddress.phoneNumber,
            phone: defaultAddress.phone,
            line1: defaultAddress.line1,
            line2: defaultAddress.line2,
            city: defaultAddress.city,
            state: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            zipPlus: defaultAddress.zipPlus,
            country: defaultAddress.country,
        } : (user.address || null);
        return res.json({ user: { id: user.id, email: user.email, name: user.name, phone: user.phone, dob: user.dob, role: user.role, address: addr } });
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
                    label: defaultAddress.label,
                    title: defaultAddress.title,
                    firstName: defaultAddress.firstName,
                    lastName: defaultAddress.lastName,
                    company: defaultAddress.company,
                    fullName: defaultAddress.fullName,
                    areaCode: defaultAddress.areaCode,
                    phoneNumber: defaultAddress.phoneNumber,
                    phone: defaultAddress.phone,
                    line1: defaultAddress.line1,
                    line2: defaultAddress.line2,
                    city: defaultAddress.city,
                    state: defaultAddress.state,
                    postalCode: defaultAddress.postalCode,
                    zipPlus: defaultAddress.zipPlus,
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
        const body = normalizeAddress((req.body || {}));
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
                    label: def.label,
                    title: def.title,
                    firstName: def.firstName,
                    lastName: def.lastName,
                    company: def.company,
                    fullName: def.fullName,
                    areaCode: def.areaCode,
                    phoneNumber: def.phoneNumber,
                    phone: def.phone,
                    line1: def.line1,
                    line2: def.line2,
                    city: def.city,
                    state: def.state,
                    postalCode: def.postalCode,
                    zipPlus: def.zipPlus,
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
        title: a.title,
        firstName: a.firstName,
        lastName: a.lastName,
        company: a.company,
        fullName: a.fullName,
        areaCode: a.areaCode,
        phoneNumber: a.phoneNumber,
        phone: a.phone,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        postalCode: a.postalCode,
        zipPlus: a.zipPlus,
        country: a.country,
        isDefault: !!a.isDefault,
    }));
    return res.json({ addresses });
}
async function createAddress(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const body = normalizeAddress((req.body || {}));
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
        title: body.title,
        firstName: body.firstName,
        lastName: body.lastName,
        company: body.company,
        fullName: body.fullName,
        areaCode: body.areaCode,
        phoneNumber: body.phoneNumber,
        phone: body.phone,
        line1: body.line1,
        line2: body.line2,
        city: body.city,
        state: body.state,
        postalCode: body.postalCode,
        zipPlus: body.zipPlus,
        country: body.country,
        isDefault: !!makeDefault,
    });
    await user.save();
    const created = user.addresses[user.addresses.length - 1];
    return res.status(201).json({ address: {
            id: created._id,
            label: created.label,
            title: created.title,
            firstName: created.firstName,
            lastName: created.lastName,
            company: created.company,
            fullName: created.fullName,
            areaCode: created.areaCode,
            phoneNumber: created.phoneNumber,
            phone: created.phone,
            line1: created.line1,
            line2: created.line2,
            city: created.city,
            state: created.state,
            postalCode: created.postalCode,
            zipPlus: created.zipPlus,
            country: created.country,
            isDefault: !!created.isDefault,
        } });
}
async function updateAddressById(req, res) {
    const auth = req.user;
    if (!auth)
        return res.status(401).json({ error: "Unauthorized" });
    const { id } = req.params;
    const body = normalizeAddress((req.body || {}));
    const user = await User_1.User.findById(auth.sub).exec();
    if (!user)
        return res.status(404).json({ error: "Not found" });
    const addr = (user.addresses || []).find((a) => String(a._id) === id);
    if (!addr)
        return res.status(404).json({ error: "Address not found" });
    Object.assign(addr, body);
    await user.save();
    return res.json({ address: {
            id: addr._id,
            label: addr.label,
            title: addr.title,
            firstName: addr.firstName,
            lastName: addr.lastName,
            company: addr.company,
            fullName: addr.fullName,
            areaCode: addr.areaCode,
            phoneNumber: addr.phoneNumber,
            phone: addr.phone,
            line1: addr.line1,
            line2: addr.line2,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            zipPlus: addr.zipPlus,
            country: addr.country,
            isDefault: !!addr.isDefault,
        } });
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
