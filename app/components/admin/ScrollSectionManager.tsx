"use client";

import { useState } from "react";
import Image from "next/image";
import type { SerializedScrollSection, TextOverlay } from "@/lib/scroll-sections";
import { ANIM_TYPES, FONT_SIZES } from "@/lib/scroll-sections";
import type { SerializedMedia } from "@/lib/media";
import Accordion from "./Accordion";

type Props = {
  initialSection: SerializedScrollSection;
  media: SerializedMedia[];
};

export default function ScrollSectionManager({ initialSection, media }: Props) {
  const [section, setSection] = useState<SerializedScrollSection>(initialSection);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch("/api/admin/scroll-sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(section),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "השמירה נכשלה");
      setSection(data.section);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השמירה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  function addOverlay() {
    const newOverlay: TextOverlay = {
      id: crypto.randomUUID(),
      text: "",
      x: 50,
      y: 50,
      enterAt: 20,
      enterDuration: 10,
      exitAt: 70,
      exitDuration: 10,
      enterAnim: "fade",
      exitAnim: "fade",
      fontSize: "lg",
      color: "#ffffff",
      fontWeight: "normal",
      align: "center",
    };
    setSection((s) => ({ ...s, overlays: [...s.overlays, newOverlay] }));
  }

  function removeOverlay(id: string) {
    setSection((s) => ({ ...s, overlays: s.overlays.filter((o) => o.id !== id) }));
  }

  function updateOverlay(id: string, patch: Partial<TextOverlay>) {
    setSection((s) => ({
      ...s,
      overlays: s.overlays.map((o) => (o.id === id ? { ...o, ...patch } : o)),
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header save row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">סקשן סקרול וידאו</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            הוידאו מתקדם בגלילה. הוסיפו שכבות טקסט עם כניסות ויציאות.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
            saved
              ? "border border-green-500/40 bg-green-500/10 text-green-400"
              : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
          }`}
        >
          {busy ? "שומר…" : saved ? "✓ נשמר" : "שמור הכל"}
        </button>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {/* Video + height row */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Video picker card */}
        <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
          <div className="relative aspect-video bg-black/30">
            {section.videoUrl ? (
              <video
                src={section.videoUrl + "#t=0.001"}
                className="absolute inset-0 h-full w-full object-cover"
                preload="metadata"
                muted
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                אין וידאו נבחר
              </div>
            )}
            <div className="absolute bottom-2 right-2 flex gap-1.5">
              {section.videoUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setSection((s) => ({ ...s, videoUrl: undefined, mediaId: undefined }))
                  }
                  className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-zinc-300 backdrop-blur-sm hover:bg-black/90"
                >
                  הסר
                </button>
              )}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-gold backdrop-blur-sm hover:bg-black/90"
              >
                בחר וידאו
              </button>
            </div>
          </div>
        </div>

        {/* Height control */}
        <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4">
          <label className="text-[11px] text-zinc-400">גובה סקרול (vh)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={100}
              max={1000}
              step={50}
              value={section.sectionHeight}
              onChange={(e) =>
                setSection((s) => ({ ...s, sectionHeight: Number(e.target.value) }))
              }
              className="flex-1 accent-gold"
            />
            <span className="w-16 text-center text-sm text-white">{section.sectionHeight}vh</span>
          </div>
          <p className="text-[11px] text-zinc-600">ערך גבוה = גלילה ארוכה יותר לעבור את הסקשן</p>
        </div>
      </div>

      {/* Overlays */}
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-xs font-semibold text-zinc-400">
            שכבות טקסט ({section.overlays.length})
          </h4>
          <button
            type="button"
            onClick={addOverlay}
            className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs text-gold hover:bg-gold/20"
          >
            + הוסף שכבה
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {section.overlays.map((overlay, idx) => (
            <Accordion
              key={overlay.id}
              title={`שכבה ${idx + 1}${overlay.text ? ` — ${overlay.text.slice(0, 30)}` : ""}`}
              subtitle={`כניסה: ${overlay.enterAt}% | יציאה: ${overlay.exitAt}%`}
            >
              <div className="flex flex-col gap-4 p-4">
                {/* Text */}
                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">טקסט</label>
                  <textarea
                    rows={2}
                    value={overlay.text}
                    onChange={(e) => updateOverlay(overlay.id, { text: e.target.value })}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>

                {/* Position: X Y */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">מיקום X (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={overlay.x}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { x: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.x}</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">מיקום Y (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={overlay.y}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { y: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.y}</span>
                    </div>
                  </div>
                </div>

                {/* Timing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">כניסה ב-% גלילה</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={95}
                        value={overlay.enterAt}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { enterAt: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.enterAt}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">משך כניסה (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={40}
                        value={overlay.enterDuration}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { enterDuration: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.enterDuration}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">יציאה ב-% גלילה</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={overlay.exitAt}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { exitAt: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.exitAt}%</span>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">משך יציאה (%)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={1}
                        max={40}
                        value={overlay.exitDuration}
                        onChange={(e) =>
                          updateOverlay(overlay.id, { exitDuration: Number(e.target.value) })
                        }
                        className="flex-1 accent-gold"
                      />
                      <span className="w-8 text-xs text-zinc-400">{overlay.exitDuration}%</span>
                    </div>
                  </div>
                </div>

                {/* Animations */}
                {(["enter", "exit"] as const).map((phase) => {
                  const key = phase === "enter" ? "enterAnim" : "exitAnim";
                  const label = phase === "enter" ? "אנימציית כניסה" : "אנימציית יציאה";
                  return (
                    <div key={phase}>
                      <label className="mb-1.5 block text-[11px] text-zinc-400">{label}</label>
                      <div className="flex flex-wrap gap-1.5">
                        {ANIM_TYPES.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => updateOverlay(overlay.id, { [key]: a })}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
                              overlay[key] === a
                                ? "bg-gold/20 text-gold"
                                : "border border-white/10 text-zinc-500 hover:text-zinc-300"
                            }`}
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Style row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-[11px] text-zinc-400">גודל פונט</label>
                    <div className="flex gap-1">
                      {FONT_SIZES.map((fs) => (
                        <button
                          key={fs}
                          type="button"
                          onClick={() => updateOverlay(overlay.id, { fontSize: fs })}
                          className={`flex-1 rounded py-1 text-[11px] font-medium transition-colors ${
                            overlay.fontSize === fs
                              ? "bg-gold/20 text-gold"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {fs}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] text-zinc-400">יישור</label>
                    <div className="flex gap-1">
                      {(["start", "center", "end"] as const).map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => updateOverlay(overlay.id, { align: a })}
                          className={`flex-1 rounded py-1 text-[11px] transition-colors ${
                            overlay.align === a
                              ? "bg-gold/20 text-gold"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          {a === "start" ? "ימין" : a === "center" ? "מרכז" : "שמאל"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color + weight + delete */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-zinc-400">צבע</label>
                    <input
                      type="color"
                      value={overlay.color}
                      onChange={(e) => updateOverlay(overlay.id, { color: e.target.value })}
                      className="h-7 w-10 cursor-pointer rounded border border-white/10 bg-transparent p-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateOverlay(overlay.id, {
                        fontWeight: overlay.fontWeight === "bold" ? "normal" : "bold",
                      })
                    }
                    className={`rounded px-2.5 py-1 text-xs font-bold transition-colors ${
                      overlay.fontWeight === "bold"
                        ? "bg-gold/20 text-gold"
                        : "border border-white/10 text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => removeOverlay(overlay.id)}
                    className="mr-auto rounded-full border border-red-500/30 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    מחק שכבה
                  </button>
                </div>
              </div>
            </Accordion>
          ))}

          {section.overlays.length === 0 && (
            <p className="py-2 text-sm text-zinc-600">
              אין שכבות טקסט. לחצו &quot;הוסף שכבה&quot; כדי להתחיל.
            </p>
          )}
        </div>
      </div>

      {/* Media Picker Modal */}
      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">בחירת וידאו</h2>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            {media.length === 0 ? (
              <p className="text-sm text-zinc-400">
                אין עדיין קבצים בספרייה. עברו ל&quot;ספריית המדיה&quot; כדי להעלות קובץ תחילה.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                {media.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      if (item.fileType !== "video") {
                        // Allow but show implicit warning via badge
                      }
                      setSection((s) => ({ ...s, videoUrl: item.url, mediaId: item._id }));
                      setPickerOpen(false);
                    }}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-gold/60"
                  >
                    {item.fileType === "video" ? (
                      <video
                        src={item.url + "#t=0.001"}
                        className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                        preload="metadata"
                        muted
                      />
                    ) : (
                      <Image
                        src={item.url}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    {item.fileType === "video" ? (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-gold/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1308]">
                        וידאו
                      </span>
                    ) : (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-yellow-500/90 px-1.5 py-0.5 text-[10px] font-semibold text-black">
                        תמונה ⚠
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
