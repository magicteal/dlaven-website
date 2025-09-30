"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const Settings_1 = require("../models/Settings");
const email_1 = require("../utils/email");
const router = (0, express_1.Router)();
router.use(auth_1.requireAuth, auth_1.requireAdmin);
router.get("/settings", async (_req, res) => {
    const s = (await Settings_1.Settings.findOne().lean().exec()) || {};
    res.json({ settings: { smtpUser: s.smtpUser || "", mailFrom: s.mailFrom || "" } });
});
router.patch("/settings", async (req, res) => {
    const { smtpUser, smtpPass, mailFrom } = req.body;
    const s = (await Settings_1.Settings.findOne().exec()) || new Settings_1.Settings();
    if (typeof smtpUser === "string")
        s.smtpUser = smtpUser;
    if (typeof smtpPass === "string")
        s.smtpPass = smtpPass;
    if (typeof mailFrom === "string")
        s.mailFrom = mailFrom;
    await s.save();
    (0, email_1.resetEmailTransport)();
    res.json({ ok: true });
});
router.post("/settings/test-email", async (req, res) => {
    const { to } = req.body;
    if (!to)
        return res.status(400).json({ error: "Missing 'to'" });
    try {
        await (0, email_1.sendEmail)({ to, subject: "DLaven SMTP Test", text: "This is a test email." });
        res.json({ ok: true });
    }
    catch (e) {
        res.status(500).json({ error: "Failed to send test email" });
    }
});
exports.default = router;
