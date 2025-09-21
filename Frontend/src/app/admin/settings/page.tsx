"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Settings = { smtpUser: string; mailFrom: string };

export default function AdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = useMemo(() => user?.role === "admin", [user]);

  const [form, setForm] = useState<{ smtpUser: string; smtpPass: string; mailFrom: string }>({
    smtpUser: "",
    smtpPass: "",
    mailFrom: "",
  });
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [testTo, setTestTo] = useState<string>("");
  const [testMsg, setTestMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.replace("/");
  }, [loading, user, isAdmin, router]);

  useEffect(() => {
    async function load() {
      try {
        const res = await requestAdmin<{ settings: Settings }>("/api/admin/settings");
        setForm((prev) => ({ ...prev, smtpUser: res.settings.smtpUser || "", mailFrom: res.settings.mailFrom || "" }));
        setTestTo(user?.email || "");
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load settings");
      } finally {
        setInitialLoaded(true);
      }
    }
    if (isAdmin) load();
  }, [isAdmin, user]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    setError(null);
    try {
      const body: Record<string, string> = { smtpUser: form.smtpUser, mailFrom: form.mailFrom };
      if (form.smtpPass.trim()) body.smtpPass = form.smtpPass.trim();
      await requestAdmin<{ ok: boolean }>("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setSaveMsg("Settings saved. Note: Password unchanged if left blank.");
      setForm((prev) => ({ ...prev, smtpPass: "" }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function onTest() {
    setTesting(true);
    setTestMsg(null);
    setError(null);
    try {
      if (!testTo.trim()) throw new Error("Enter a recipient email to test");
      await requestAdmin<{ ok: boolean }>("/api/admin/settings/test-email", {
        method: "POST",
        body: JSON.stringify({ to: testTo.trim() }),
      });
      setTestMsg("Test email sent. Check the inbox (and spam) of the recipient.");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to send test email");
    } finally {
      setTesting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold">Email Settings</h1>
      <p className="mt-1 text-sm text-black/60">Configure SMTP credentials used for transactional emails.</p>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      {saveMsg ? <p className="mt-3 text-sm text-green-700">{saveMsg}</p> : null}
      {testMsg ? <p className="mt-3 text-sm text-green-700">{testMsg}</p> : null}

      {!initialLoaded ? (
        <p className="mt-6 text-sm">Loading…</p>
      ) : (
        <form onSubmit={onSave} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">SMTP User</label>
            <input
              className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="SMTP username (e.g., full email)"
              value={form.smtpUser}
              onChange={(e) => setForm((p) => ({ ...p, smtpUser: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">SMTP Password</label>
            <input
              className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="Leave blank to keep unchanged"
              type="password"
              value={form.smtpPass}
              onChange={(e) => setForm((p) => ({ ...p, smtpPass: e.target.value }))}
            />
            <p className="mt-1 text-xs text-black/50">For Gmail, use an App Password. Never share this value.</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Mail From</label>
            <input
              className="mt-1 w-full border border-black/20 px-3 py-2 text-sm"
              placeholder="Sender email address (MAIL_FROM)"
              value={form.mailFrom}
              onChange={(e) => setForm((p) => ({ ...p, mailFrom: e.target.value }))}
            />
            <p className="mt-1 text-xs text-black/50">Should be a valid address allowed by your SMTP provider.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save Settings"}
            </button>
          </div>
        </form>
      )}

      <div className="mt-10 border-t border-black/10 pt-6">
        <h2 className="font-medium">Send Test Email</h2>
        <p className="mt-1 text-sm text-black/60">
          Enter a recipient to verify your SMTP configuration. Make sure to save changes first if you updated credentials.
        </p>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <input
            className="flex-1 border border-black/20 px-3 py-2 text-sm"
            placeholder="recipient@example.com"
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
          />
          <button
            className="px-4 py-2 border border-black hover:bg-black hover:text-white disabled:opacity-60"
            onClick={onTest}
            disabled={testing}
          >
            {testing ? "Sending…" : "Send Test"}
          </button>
        </div>
      </div>

      <div className="mt-10 border-t border-black/10 pt-6 text-sm text-black/70 space-y-2">
        <p className="font-medium">Tips</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>Use a reliable SMTP (e.g., Gmail with App Password, Mailtrap, SendGrid).</li>
          <li>MAIL_FROM should be a verified/allowed sender for your provider.</li>
          <li>If emails don’t arrive, check spam and provider logs.</li>
        </ul>
      </div>
    </div>
  );
}

async function requestAdmin<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { API_BASE } = await import("@/lib/api");
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
