"use client";

import { useState } from "react";
import { useSaveAll } from "./SaveAllContext";
import type { SiteTheme } from "@/lib/theme";

const SETTING_KEYS: Record<keyof SiteTheme, string> = {
  headerBg: "header-bg-color",
  headerText: "header-text-color",
  footerBg: "footer-bg-color",
  footerText: "footer-text-color",
};

const FIELDS: { key: keyof SiteTheme; label: string; fallback: string }[] = [
  { key: "headerBg", label: "רקע ההדר", fallback: "#ffffff" },
  { key: "headerText", label: "צבע טקסטים בהדר", fallback: "#71717a" },
  { key: "footerBg", label: "רקע הפוטר", fallback: "#1a1614" },
  { key: "footerText", label: "צבע טקסטים בפוטר", fallback: "#a1a1aa" },
];

async function saveSetting(key: string, value: string): Promise<void> {
  const res = await fetch(`/api/admin/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("שמירת הצבעים נכשלה");
}

export default function ThemeColorsSettings({ initialTheme }: { initialTheme: SiteTheme }) {
  const [theme, setTheme] = useState(initialTheme);
  const [persisted, setPersisted] = useState(initialTheme);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function persist(): Promise<void> {
    const next: SiteTheme = { ...persisted };
    for (const field of FIELDS) {
      if (theme[field.key] !== persisted[field.key]) {
        await saveSetting(SETTING_KEYS[field.key], theme[field.key]);
        next[field.key] = theme[field.key];
      }
    }
    setPersisted(next);
  }

  const dirty = FIELDS.some((field) => theme[field.key] !== persisted[field.key]);
  useSaveAll("theme-colors", dirty, persist);

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
        {FIELDS.map((field) => {
          const value = theme[field.key];
          return (
            <div key={field.key}>
              <label className="mb-1.5 block text-xs text-zinc-500">{field.label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={value || field.fallback}
                  onChange={(e) => setTheme((t) => ({ ...t, [field.key]: e.target.value }))}
                  className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
                />
                <input
                  value={value}
                  onChange={(e) => setTheme((t) => ({ ...t, [field.key]: e.target.value }))}
                  placeholder={`ברירת מחדל (${field.fallback})`}
                  dir="ltr"
                  className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => setTheme((t) => ({ ...t, [field.key]: "" }))}
                    className="shrink-0 rounded-lg border border-white/10 px-2.5 py-2 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-white"
                  >
                    איפוס
                  </button>
                )}
              </div>
            </div>
          );
        })}
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
