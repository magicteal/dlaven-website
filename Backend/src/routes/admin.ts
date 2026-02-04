import { Router, type Request, type Response } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { Settings } from "../models/Settings";
import { sendEmail, resetEmailTransport } from "../utils/email";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/settings", async (_req: Request, res: Response) => {
  const s = ((await Settings.findOne().lean().exec()) as any) || {};
  res.json({ settings: { smtpUser: s.smtpUser || "", mailFrom: s.mailFrom || "" } });
});

router.patch("/settings", async (req: Request, res: Response) => {
  const { smtpUser, smtpPass, mailFrom } = req.body as { smtpUser?: string; smtpPass?: string; mailFrom?: string };
  const s = (await Settings.findOne().exec()) || new Settings();
  if (typeof smtpUser === "string") s.smtpUser = smtpUser;
  if (typeof smtpPass === "string") s.smtpPass = smtpPass;
  if (typeof mailFrom === "string") s.mailFrom = mailFrom;
  await s.save();
  resetEmailTransport();
  res.json({ ok: true });
});

router.post("/settings/test-email", async (req: Request, res: Response) => {
  const { to } = req.body as { to: string };
  if (!to) return res.status(400).json({ error: "Missing 'to'" });
  try {
    await sendEmail({ to, subject: "DLaven SMTP Test", text: "This is a test email." });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to send test email" });
  }
});

export default router;
