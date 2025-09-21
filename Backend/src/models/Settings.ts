import { Schema, model, models } from "mongoose";

type SettingsDoc = {
  smtpUser?: string | null;
  smtpPass?: string | null;
  mailFrom?: string | null;
};

const SettingsSchema = new Schema<SettingsDoc>({
  smtpUser: { type: String, default: null },
  smtpPass: { type: String, default: null },
  mailFrom: { type: String, default: null },
});

export const Settings = models.Settings || model<SettingsDoc>("Settings", SettingsSchema);
