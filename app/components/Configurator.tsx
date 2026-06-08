"use client";

import { useMemo, useState } from "react";
import PhotoPlaceholder from "./PhotoPlaceholder";

const STEPS = [
  "בחירת פרופיל",
  "התאמה אישית",
  "סימולציה",
  "הזמנה",
  "מחיר מדויק",
];

const SYSTEM_TYPES = [
  { id: "pergola", label: "פרגולת אלומיניום", pricePerSqm: 1450 },
  { id: "windows", label: "חלונות אלומיניום", pricePerSqm: 980 },
  { id: "gate", label: "שער כניסה חשמלי", pricePerSqm: 1750 },
  { id: "glass", label: "סגירת זכוכית", pricePerSqm: 1280 },
] as const;

const MODELS = [
  { id: "classic", label: "דגם קלאסי", multiplier: 1 },
  { id: "premium", label: "דגם פרימיום", multiplier: 1.18 },
  { id: "smart", label: "דגם חכם (מנוע + חיישנים)", multiplier: 1.35 },
] as const;

const COLORS = [
  { id: "anthracite", label: "אנתרציט", hex: "#2b2b2e" },
  { id: "graphite", label: "גרפיט", hex: "#6b6b6f" },
  { id: "silver", label: "כסוף", hex: "#a6a6a6" },
  { id: "gold", label: "זהב שמפניה", hex: "#cfa15c" },
  { id: "black", label: "שחור מט", hex: "#171717" },
] as const;

function formatPrice(value: number) {
  return new Intl.NumberFormat("he-IL").format(Math.round(value / 10) * 10);
}

export default function Configurator() {
  const [systemId, setSystemId] = useState<(typeof SYSTEM_TYPES)[number]["id"]>("pergola");
  const [modelId, setModelId] = useState<(typeof MODELS)[number]["id"]>("premium");
  const [colorId, setColorId] = useState<(typeof COLORS)[number]["id"]>("gold");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(250);
  const [lighting, setLighting] = useState(true);

  const system = SYSTEM_TYPES.find((s) => s.id === systemId)!;
  const model = MODELS.find((m) => m.id === modelId)!;
  const color = COLORS.find((c) => c.id === colorId)!;

  const price = useMemo(() => {
    const area = (width / 100) * (height / 100);
    const base = area * system.pricePerSqm * model.multiplier;
    const colorAddOn = colorId === "gold" ? base * 0.04 : 0;
    const lightingAddOn = lighting ? 1850 : 0;
    return Math.max(base + colorAddOn + lightingAddOn, 1500);
  }, [width, height, system, model, colorId, lighting]);

  const adjust = (setter: (v: number) => void, value: number, delta: number, min: number, max: number) => {
    setter(Math.min(max, Math.max(min, value + delta)));
  };

  return (
    <section id="configurator" className="bg-[#0e0e11] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Steps */}
        <ol className="mb-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-xs text-zinc-400 sm:gap-x-6">
          {STEPS.map((step, i) => (
            <li key={step} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  i === 0
                    ? "border-gold bg-gold text-[#1a1308]"
                    : "border-white/15 text-zinc-400"
                }`}
              >
                {i + 1}
              </span>
              <span className={i === 0 ? "text-white" : ""}>{step}</span>
              {i < STEPS.length - 1 && (
                <span className="hidden h-px w-8 bg-white/10 sm:block" aria-hidden />
              )}
            </li>
          ))}
        </ol>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-panel/60 p-6 shadow-2xl shadow-black/40 lg:grid-cols-[260px_minmax(0,1fr)_300px] lg:p-8">
          {/* Left: system + model */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-3 text-xs text-zinc-400">סוג מערכת</p>
              <div className="flex flex-col gap-2">
                {SYSTEM_TYPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSystemId(s.id)}
                    className={`rounded-xl border px-4 py-2.5 text-right text-sm transition-colors ${
                      s.id === systemId
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-white/10 text-zinc-300 hover:border-white/25"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs text-zinc-400">דגם</p>
              <div className="flex flex-col gap-2">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setModelId(m.id)}
                    className={`rounded-xl border px-4 py-2.5 text-right text-sm transition-colors ${
                      m.id === modelId
                        ? "border-gold/60 bg-gold/10 text-gold"
                        : "border-white/10 text-zinc-300 hover:border-white/25"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle: preview */}
          <div className="flex flex-col gap-4">
            <PhotoPlaceholder
              label={`${system.label} · ${model.label} · ${color.label}`}
              className="aspect-[4/3] w-full rounded-2xl border border-white/10"
            />
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <span aria-hidden>♡</span> שמור פרויקט
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <span aria-hidden>⇪</span> שתף
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                <span aria-hidden>⤓</span> הדפס הצעה
              </span>
            </div>
          </div>

          {/* Right: dimensions, color, lighting, price */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="mb-3 text-xs text-zinc-400">מידות (ס&quot;מ)</p>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <span className="text-xs text-zinc-400">רוחב</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjust(setWidth, width, -10, 100, 800)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-gold/60 hover:text-gold"
                      aria-label="הקטן רוחב"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm text-white">{width}</span>
                    <button
                      type="button"
                      onClick={() => adjust(setWidth, width, 10, 100, 800)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-gold/60 hover:text-gold"
                      aria-label="הגדל רוחב"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                  <span className="text-xs text-zinc-400">גובה</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => adjust(setHeight, height, -10, 100, 400)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-gold/60 hover:text-gold"
                      aria-label="הקטן גובה"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm text-white">{height}</span>
                    <button
                      type="button"
                      onClick={() => adjust(setHeight, height, 10, 100, 400)}
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-white/15 text-zinc-300 hover:border-gold/60 hover:text-gold"
                      aria-label="הגדל גובה"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs text-zinc-400">גוון אלומיניום</p>
              <div className="flex flex-wrap items-center gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setColorId(c.id)}
                    aria-label={c.label}
                    title={c.label}
                    className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                      c.id === colorId ? "border-gold" : "border-white/20"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setLighting((v) => !v)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                lighting ? "border-gold/50 bg-gold/10 text-gold" : "border-white/10 text-zinc-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <span aria-hidden>☀</span> תאורת LED משולבת
              </span>
              <span
                className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors ${
                  lighting ? "bg-gold justify-end" : "bg-white/15 justify-start"
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-[#1a1308]" />
              </span>
            </button>

            <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 to-transparent p-5">
              <p className="text-xs text-zinc-400">מחיר משוער</p>
              <p className="mt-1 text-2xl font-bold text-gold">
                ₪ {formatPrice(price)}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">כולל מע&quot;מ · אינדיקציה בלבד</p>
            </div>

            <a
              href="#contact"
              className="flex items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light"
            >
              המשך להצעת מחיר <span aria-hidden>←</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
