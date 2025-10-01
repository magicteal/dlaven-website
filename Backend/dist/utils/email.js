"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetEmailTransport = resetEmailTransport;
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const Settings_1 = require("../models/Settings");
let transporter = null;
function resetEmailTransport() {
    transporter = null;
}
async function getTransporter() {
    if (transporter)
        return transporter;
    const s = (await Settings_1.Settings.findOne().lean().exec().catch(() => null));
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = s?.smtpUser || process.env.SMTP_USER;
    const pass = s?.smtpPass || process.env.SMTP_PASS;
    if (!host || !user || !pass) {
        console.warn("SMTP not fully configured; emails will be logged to console.");
        return null;
    }
    transporter = nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
    return transporter;
}
async function sendEmail({ to, subject, html, text, from }) {
    const t = await getTransporter();
    const s = (await Settings_1.Settings.findOne().lean().exec().catch(() => null));
    const fromAddr = from || s?.mailFrom || process.env.MAIL_FROM || "no-reply@localhost";
    if (!t) {
        // Dev fallback: log to console
        console.log("[EMAIL]", { to, subject, text, html });
        return { queued: false, devLogged: true };
    }
    const info = await t.sendMail({ from: fromAddr, to, subject, html, text });
    return { queued: true, messageId: info.messageId };
}
