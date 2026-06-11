"use client";

import { useState } from "react";
import { useSaveAll } from "./SaveAllContext";

const PRESETS = ["75", "100", "125", "150", "175", "200"];

export default function LogoSizeSetting({ initialValue }: { initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  const [persisted, setPersisted] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function persist(): Promise<void> {
    const res = await fetch("/api/admin/settings/logo-size", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    if (!res.ok) throw new Error("שמירת גודל הלוגו נכשלה");
    setPersisted(value);
  }

  useSaveAll("logo-size", value.trim() !== persisted.trim(), persist);

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
    <div className="flex flex-wrap items-end gap-3">
      {/* Preset chips */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(p)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              value === p
                ? "bg-gold/20 text-gold border border-gold/40"
                : "border border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
            }`}
          >
            {p}%
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={50}
          max={200}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="100"
          dir="ltr"
          className="w-20 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
        />
        <span className="text-sm text-zinc-500">%</span>
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
