"use client";

import { useState } from "react";
import { useSaveAll } from "./SaveAllContext";
import type { SocialLinks } from "@/lib/contact";

async function saveSetting(key: string, value: string): Promise<void> {
  const res = await fetch(`/api/admin/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("השמירה נכשלה");
}

export default function ContactInfoSettings({
  initialPhone,
  initialEmail,
  initialSocial,
}: {
  initialPhone: string;
  initialEmail: string;
  initialSocial: SocialLinks;
}) {
  const [phone, setPhone] = useState(initialPhone);
  const [email, setEmail] = useState(initialEmail);
  const [social, setSocial] = useState(initialSocial);
  const [persistedPhone, setPersistedPhone] = useState(initialPhone);
  const [persistedEmail, setPersistedEmail] = useState(initialEmail);
  const [persistedSocial, setPersistedSocial] = useState(initialSocial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function persist(): Promise<void> {
    if (phone.trim() !== persistedPhone.trim()) {
      await saveSetting("contact-phone", phone.trim());
      setPersistedPhone(phone.trim());
    }
    if (email.trim() !== persistedEmail.trim()) {
      await saveSetting("contact-email", email.trim());
      setPersistedEmail(email.trim());
    }
    const socialKeys = ["instagram", "facebook", "waze"] as const;
    for (const key of socialKeys) {
      if (social[key].trim() !== persistedSocial[key].trim()) {
        await saveSetting(`social-${key}`, social[key].trim());
      }
    }
    if (JSON.stringify(social) !== JSON.stringify(persistedSocial)) {
      setPersistedSocial({ ...social, instagram: social.instagram.trim(), facebook: social.facebook.trim(), waze: social.waze.trim() });
    }
  }

  const dirty =
    phone.trim() !== persistedPhone.trim() ||
    email.trim() !== persistedEmail.trim() ||
    JSON.stringify(social) !== JSON.stringify(persistedSocial);
  useSaveAll("contact-info", dirty, persist);

  async function save() {
    setStatus("saving");
    try {
      await persist();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">טלפון</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="058-7886764"
            dir="ltr"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-zinc-500">אימייל</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contact@alum-design.co.il"
            dir="ltr"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold text-white">רשתות חברתיות</h3>
        <p className="mb-3 text-xs text-zinc-500">
          קישורים המוצגים כאייקונים בפוטר. השדה ריק = האייקון לא מוצג.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Instagram</label>
            <input
              value={social.instagram}
              onChange={(e) => setSocial((prev) => ({ ...prev, instagram: e.target.value }))}
              placeholder="https://instagram.com/..."
              dir="ltr"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Facebook</label>
            <input
              value={social.facebook}
              onChange={(e) => setSocial((prev) => ({ ...prev, facebook: e.target.value }))}
              placeholder="https://facebook.com/..."
              dir="ltr"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-zinc-500">Waze</label>
            <input
              value={social.waze}
              onChange={(e) => setSocial((prev) => ({ ...prev, waze: e.target.value }))}
              placeholder="https://waze.com/ul/..."
              dir="ltr"
              className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
            />
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className={`rounded-xl px-4 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            status === "saved"
              ? "border border-green-500/40 bg-green-500/10 text-green-400"
              : status === "error"
                ? "border border-red-500/40 bg-red-500/10 text-red-400"
                : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
          }`}
        >
          {status === "saving" ? "שומר…" : status === "saved" ? "✓ נשמר" : status === "error" ? "שגיאה" : "שמור"}
        </button>
      </div>
    </div>
  );
}
