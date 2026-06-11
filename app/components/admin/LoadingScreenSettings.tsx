"use client";

import { useState } from "react";
import { useSaveAll } from "./SaveAllContext";
import { LOADING_SCREEN_SETTING_KEYS, type LoadingScreenSettings as LoadingScreenSettingsType } from "@/lib/loading-screen";

async function saveSetting(key: string, value: string): Promise<void> {
  const res = await fetch(`/api/admin/settings/${key}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("השמירה נכשלה");
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-gold" : "bg-white/15"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-zinc-500">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          dir="ltr"
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
        />
      </div>
    </div>
  );
}

export default function LoadingScreenSettings({ initialSettings }: { initialSettings: LoadingScreenSettingsType }) {
  const [settings, setSettings] = useState(initialSettings);
  const [persisted, setPersisted] = useState(initialSettings);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update(patch: Partial<LoadingScreenSettingsType>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  async function persist(): Promise<void> {
    const entries = Object.keys(LOADING_SCREEN_SETTING_KEYS) as (keyof LoadingScreenSettingsType)[];
    for (const key of entries) {
      if (settings[key] !== persisted[key]) {
        await saveSetting(LOADING_SCREEN_SETTING_KEYS[key], String(settings[key]));
      }
    }
    setPersisted(settings);
  }

  const dirty = JSON.stringify(settings) !== JSON.stringify(persisted);
  useSaveAll("loading-screen", dirty, persist);

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
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/20 p-3">
        <div>
          <p className="text-sm font-medium text-white">הצגת מסך טעינה</p>
          <p className="mt-0.5 text-xs text-zinc-500">מסך פתיחה קצר המוצג בזמן טעינת האתר</p>
        </div>
        <Toggle checked={settings.enabled} onChange={() => update({ enabled: !settings.enabled })} />
      </div>

      {settings.enabled && (
        <>
          <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/20 p-3">
            <div>
              <p className="text-sm font-medium text-white">הצגת לוגו האתר</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                הצגת לוגו האתר שהועלה (כמו בהדר) במקום הסמל והכיתוב המוגדרים כברירת מחדל
              </p>
            </div>
            <Toggle checked={settings.useSiteLogo} onChange={() => update({ useSiteLogo: !settings.useSiteLogo })} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField label="צבע רקע" value={settings.backgroundColor} onChange={(v) => update({ backgroundColor: v })} />
            <ColorField
              label="צבע מבטא (סמל, כיתוב וסרגל טעינה)"
              value={settings.accentColor}
              onChange={(v) => update({ accentColor: v })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/[0.07] bg-black/20 p-3">
            <div>
              <label className="mb-1.5 block text-[11px] text-zinc-500">משך מינימלי (שניות)</label>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                value={settings.minDuration / 1000}
                onChange={(e) => update({ minDuration: clamp(Number(e.target.value), 0, 10) * 1000 })}
                dir="ltr"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] text-zinc-500">משך מקסימלי (שניות)</label>
              <input
                type="number"
                min={1}
                max={15}
                step={0.1}
                value={settings.maxDuration / 1000}
                onChange={(e) => update({ maxDuration: clamp(Number(e.target.value), 1, 15) * 1000 })}
                dir="ltr"
                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
              />
            </div>
          </div>
        </>
      )}

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

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(val) ? min : val));
}
