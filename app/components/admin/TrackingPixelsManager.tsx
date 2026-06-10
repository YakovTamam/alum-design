"use client";

import { useState } from "react";
import { TRACKING_PIXELS } from "@/lib/tracking-pixels";

type TrackingPixelsManagerProps = {
  initialValues: Record<string, string>;
};

export default function TrackingPixelsManager({ initialValues }: TrackingPixelsManagerProps) {
  const [values, setValues] = useState(initialValues);
  const [saved, setSaved] = useState(initialValues);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  async function save(key: string) {
    setBusyKey(key);
    setError(null);
    setSavedKey(null);
    try {
      const res = await fetch(`/api/admin/settings/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: values[key]?.trim() ?? "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "השמירה נכשלה");
      setSaved((prev) => ({ ...prev, [key]: values[key]?.trim() ?? "" }));
      setSavedKey(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השמירה נכשלה");
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-red-400">{error}</p>}

      {TRACKING_PIXELS.map((pixel) => {
        const value = values[pixel.key] ?? "";
        const dirty = value.trim() !== (saved[pixel.key] ?? "");
        const busy = busyKey === pixel.key;
        const active = Boolean((saved[pixel.key] ?? "").trim());

        return (
          <div
            key={pixel.key}
            className="rounded-2xl border border-white/10 bg-panel/60 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">{pixel.label}</h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    active
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-white/5 text-zinc-500"
                  }`}
                >
                  {active ? "פעיל" : "כבוי"}
                </span>
              </div>
              {savedKey === pixel.key && !dirty && (
                <span className="text-xs text-emerald-400">נשמר ✓</span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-500">{pixel.help}</p>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                dir="ltr"
                value={value}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [pixel.key]: e.target.value }))
                }
                placeholder={pixel.placeholder}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-gold/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => save(pixel.key)}
                disabled={busy || !dirty}
                className="shrink-0 rounded-full border border-gold/40 px-4 py-2 text-xs text-gold transition-colors hover:bg-gold/10 disabled:opacity-40"
              >
                {busy ? "שומר…" : "שמירה"}
              </button>
            </div>
            <p className="mt-2 text-[11px] text-zinc-600">
              להשבתה — נקו את השדה ושמרו.
            </p>
          </div>
        );
      })}
    </div>
  );
}
