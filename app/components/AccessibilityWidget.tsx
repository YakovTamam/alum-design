"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "a11y-settings";
const MAX_FONT_STEP = 4;

type Settings = {
  fontStep: number;
  contrast: boolean;
  grayscale: boolean;
  underline: boolean;
  pauseAnim: boolean;
};

const DEFAULT_SETTINGS: Settings = {
  fontStep: 0,
  contrast: false,
  grayscale: false,
  underline: false,
  pauseAnim: false,
};

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load saved preferences once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from localStorage on mount
      if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
    } catch {
      // ignore
    }
    setLoaded(true);
  }, []);

  // Apply settings to the document and persist
  useEffect(() => {
    if (!loaded) return;
    const html = document.documentElement;
    html.style.fontSize = settings.fontStep > 0 ? `${100 + settings.fontStep * 12.5}%` : "";
    html.classList.toggle("a11y-contrast", settings.contrast);
    html.classList.toggle("a11y-grayscale", settings.grayscale);
    html.classList.toggle("a11y-underline-links", settings.underline);
    html.classList.toggle("a11y-pause-anim", settings.pauseAnim);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings, loaded]);

  function update(patch: Partial<Settings>) {
    setSettings((s) => ({ ...s, ...patch }));
  }

  function reset() {
    setSettings(DEFAULT_SETTINGS);
  }

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="תפריט נגישות"
          className="fixed bottom-24 left-6 z-50 flex w-72 flex-col gap-3 rounded-2xl border border-white/10 bg-[#1a1614] p-4 shadow-2xl shadow-black/50"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">נגישות</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="סגירת תפריט נגישות"
              className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Font size */}
          <div>
            <label className="mb-1.5 block text-[11px] text-zinc-400">גודל טקסט</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update({ fontStep: Math.max(0, settings.fontStep - 1) })}
                aria-label="הקטן טקסט"
                className="flex h-9 flex-1 items-center justify-center rounded-lg border border-white/10 text-sm font-bold text-zinc-300 transition-colors hover:border-gold/50 hover:text-gold"
              >
                א-
              </button>
              <button
                type="button"
                onClick={() => update({ fontStep: 0 })}
                aria-label="גודל טקסט רגיל"
                className="flex h-9 flex-1 items-center justify-center rounded-lg border border-white/10 text-xs text-zinc-300 transition-colors hover:border-gold/50 hover:text-gold"
              >
                איפוס
              </button>
              <button
                type="button"
                onClick={() => update({ fontStep: Math.min(MAX_FONT_STEP, settings.fontStep + 1) })}
                aria-label="הגדל טקסט"
                className="flex h-9 flex-1 items-center justify-center rounded-lg border border-white/10 text-base font-bold text-zinc-300 transition-colors hover:border-gold/50 hover:text-gold"
              >
                א+
              </button>
            </div>
          </div>

          {/* Toggles */}
          {(
            [
              { key: "contrast", label: "ניגודיות גבוהה" },
              { key: "grayscale", label: "גווני אפור" },
              { key: "underline", label: "הדגשת קישורים" },
              { key: "pauseAnim", label: "עצירת אנימציות" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => update({ [opt.key]: !settings[opt.key] } as Partial<Settings>)}
              aria-pressed={settings[opt.key]}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                settings[opt.key]
                  ? "border-gold/40 bg-gold/10 text-gold"
                  : "border-white/10 text-zinc-300 hover:border-white/20"
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`flex h-5 w-9 items-center rounded-full border border-white/10 p-0.5 transition-colors ${
                  settings[opt.key] ? "justify-end bg-gold/30" : "justify-start bg-black/30"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded-full ${
                    settings[opt.key] ? "bg-gold" : "bg-zinc-500"
                  }`}
                />
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-white/10 py-2 text-xs text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-400"
          >
            איפוס כל ההגדרות
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="תפריט נגישות"
        aria-expanded={open}
        className="fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-black shadow-lg shadow-black/40 transition-transform hover:scale-110"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="7.5" r="1.4" fill="white" stroke="none" />
          <path d="M7 9.5c1.5 1 3.2 1.5 5 1.5s3.5-.5 5-1.5" />
          <path d="M12 11v3" />
          <path d="M12 14l-2.5 5.5" />
          <path d="M12 14l2.5 5.5" />
        </svg>
      </button>
    </>
  );
}
