"use client";

import { useState } from "react";
import Image from "next/image";
import type { SerializedHeroSlide } from "@/lib/hero-slides";
import type { SerializedMedia } from "@/lib/media";

type Props = {
  slides: SerializedHeroSlide[];
  media: SerializedMedia[];
};

export default function HeroSlidesManager({ slides: initialSlides, media }: Props) {
  const [slides, setSlides] = useState<Record<number, SerializedHeroSlide>>(
    Object.fromEntries(initialSlides.map((s) => [s.id, s]))
  );
  const [pickerFor, setPickerFor] = useState<number | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [saved, setSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaById = new Map(media.map((m) => [m._id, m]));

  function update(id: number, patch: Partial<SerializedHeroSlide>) {
    setSlides((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function save(id: number) {
    setBusy(id);
    setError(null);
    const slide = slides[id];
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: slide.title,
          subtitle: slide.subtitle,
          ctaText: slide.ctaText,
          ctaLink: slide.ctaLink,
          duration: slide.duration,
          mediaId: slide.mediaId ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "השמירה נכשלה");
      setSlides((prev) => ({ ...prev, [id]: { ...prev[id], ...data.slide } }));
      setSaved(id);
      setTimeout(() => setSaved(null), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השמירה נכשלה");
    } finally {
      setBusy(null);
    }
  }

  function assignImage(slideId: number, mediaId: string) {
    const m = mediaById.get(mediaId);
    if (!m) return;
    update(slideId, {
      imageUrl: m.url,
      mediaId,
      mediaType: m.fileType === "video" ? "video" : "image",
    });
    setPickerFor(null);
  }

  function clearImage(slideId: number) {
    update(slideId, { imageUrl: undefined, mediaId: undefined });
  }

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((id) => {
          const slide = slides[id];
          if (!slide) return null;
          const isBusy = busy === id;
          const isSaved = saved === id;

          return (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]"
            >
              {/* Image/video preview */}
              <div className="relative aspect-video bg-black/30">
                {slide.imageUrl && slide.mediaType === "video" ? (
                  <video
                    src={slide.imageUrl + "#t=0.001"}
                    className="absolute inset-0 h-full w-full object-cover"
                    preload="metadata"
                    muted
                  />
                ) : slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-500">
                    אין תמונה
                  </div>
                )}
                {/* Overlay buttons */}
                <div className="absolute bottom-2 right-2 flex gap-1.5">
                  {slide.imageUrl && (
                    <button
                      type="button"
                      onClick={() => clearImage(id)}
                      className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-zinc-300 backdrop-blur-sm hover:bg-black/90"
                    >
                      הסר
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerFor(id)}
                    className="rounded-full bg-black/70 px-2.5 py-1 text-[11px] text-gold backdrop-blur-sm hover:bg-black/90"
                  >
                    בחר תמונה
                  </button>
                </div>
                {/* Slide number badge */}
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs font-bold text-white backdrop-blur-sm">
                  {id}
                </span>
              </div>

              {/* Form fields */}
              <div className="flex flex-col gap-3 p-4">
                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">כותרת ראשית</label>
                  <input
                    value={slide.title}
                    onChange={(e) => update(id, { title: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-zinc-400">תת-כותרת</label>
                  <textarea
                    rows={2}
                    value={slide.subtitle}
                    onChange={(e) => update(id, { subtitle: e.target.value })}
                    className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">טקסט כפתור</label>
                    <input
                      value={slide.ctaText}
                      onChange={(e) => update(id, { ctaText: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">קישור כפתור</label>
                    <input
                      value={slide.ctaLink}
                      dir="ltr"
                      onChange={(e) => update(id, { ctaLink: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] text-zinc-400">משך (שניות)</label>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={slide.duration}
                      onChange={(e) => update(id, { duration: Math.max(2, Math.min(30, Number(e.target.value))) })}
                      className="w-20 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => save(id)}
                  disabled={isBusy}
                  className={`mt-1 rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
                    isSaved
                      ? "border border-green-500/40 bg-green-500/10 text-green-400"
                      : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
                  }`}
                >
                  {isBusy ? "שומר…" : isSaved ? "✓ נשמר" : "שמור שינויים"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Media Picker Modal */}
      {pickerFor !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
          onClick={() => setPickerFor(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">
                בחירת תמונה לשקופית {pickerFor}
              </h2>
              <button
                type="button"
                onClick={() => setPickerFor(null)}
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
                    onClick={() => assignImage(pickerFor, item._id)}
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
                    {item.fileType === "video" && (
                      <span className="absolute left-1.5 top-1.5 rounded-full bg-gold/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1308]">
                        וידאו
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
