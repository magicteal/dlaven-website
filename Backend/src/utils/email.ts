import nodemailer from "nodemailer";
import { Settings } from "../models/Settings";

export type MailOptions = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

let transporter: nodemailer.Transporter | null = null;

export function resetEmailTransport() {
  transporter = null;
}

async function getTransporter() {
  if (transporter) return transporter;
  const s = (await Settings.findOne().lean().exec().catch(() => null)) as any;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = s?.smtpUser || process.env.SMTP_USER;
  const pass = s?.smtpPass || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn("SMTP not fully configured; emails will be logged to console.");
    return null;
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

export async function sendEmail({ to, subject, html, text, from }: MailOptions) {
  const t = await getTransporter();
  const s = (await Settings.findOne().lean().exec().catch(() => null)) as any;
  const fromAddr = from || s?.mailFrom || process.env.MAIL_FROM || "no-reply@localhost";
  if (!t) {
    // Dev fallback: log to console
    console.log("[EMAIL]", { to, subject, text, html });
    return { queued: false, devLogged: true };
  }
  const info = await t.sendMail({ from: fromAddr, to, subject, html, text });
  return { queued: true, messageId: info.messageId };
}
