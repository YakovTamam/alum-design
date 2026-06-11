"use client";

import { useState } from "react";
import Image from "next/image";
import type { SerializedGallerySection, GalleryDirection, GalleryImage } from "@/lib/gallery";
import type { SerializedMedia } from "@/lib/media";
import { useSaveAll } from "./SaveAllContext";

const DIRECTION_LABELS: Record<GalleryDirection, string> = {
  left: "ימין ← שמאל",
  right: "שמאל ← ימין",
};

type Props = {
  initialSection: SerializedGallerySection;
  media: SerializedMedia[];
};

export default function GalleryManager({ initialSection, media }: Props) {
  const [section, setSection] = useState(initialSection);
  const [persisted, setPersisted] = useState(initialSection);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function update(patch: Partial<SerializedGallerySection>) {
    setSection((prev) => ({ ...prev, ...patch }));
  }

  async function persist(): Promise<void> {
    const res = await fetch("/api/admin/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(section),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error ?? "השמירה נכשלה");
    setSection(data.section);
    setPersisted(data.section);
  }

  const dirty = JSON.stringify(section) !== JSON.stringify(persisted);
  useSaveAll("image-gallery", dirty, persist);

  async function save() {
    setStatus("saving");
    setError(null);
    try {
      await persist();
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השמירה נכשלה");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  function addImage(item: SerializedMedia) {
    const img: GalleryImage = {
      id: crypto.randomUUID(),
      mediaId: item._id,
      url: item.url,
      width: item.width,
      height: item.height,
    };
    update({ images: [...section.images, img] });
  }

  function removeImage(id: string) {
    update({ images: section.images.filter((img) => img.id !== id) });
  }

  function moveImage(id: string, dir: -1 | 1) {
    const idx = section.images.findIndex((img) => img.id === id);
    const newIdx = idx + dir;
    if (idx === -1 || newIdx < 0 || newIdx >= section.images.length) return;
    const next = [...section.images];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    update({ images: next });
  }

  const usedMediaIds = new Set(section.images.map((img) => img.mediaId));

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Enable toggle */}
      <div className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-black/20 p-3">
        <div>
          <p className="text-sm font-medium text-white">הצגת הגלריה באתר</p>
          <p className="mt-0.5 text-xs text-zinc-500">כאשר כבוי, הסקשן לא יוצג בדף הבית גם אם הוגדרו תמונות</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={section.enabled}
          onClick={() => update({ enabled: !section.enabled })}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${section.enabled ? "bg-gold" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform ${section.enabled ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="mb-1 block text-[11px] text-zinc-400">כותרת הסקשן (לא חובה)</label>
        <input
          value={section.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="לדוגמה: מהפרויקטים שלנו"
          className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-zinc-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
        />
      </div>

      {/* Speed / Direction / Height / Gap */}
      <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/[0.07] bg-black/20 p-3 sm:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[11px] text-zinc-500">מהירות (פיקסלים לשנייה)</label>
          <input
            type="number"
            min={5}
            max={300}
            value={section.speed}
            onChange={(e) => update({ speed: clamp(Number(e.target.value), 5, 300) })}
            dir="ltr"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] text-zinc-500">כיוון תנועה</label>
          <div className="flex gap-1">
            {(Object.keys(DIRECTION_LABELS) as GalleryDirection[]).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => update({ direction: d })}
                className={`flex-1 rounded py-2 text-[11px] font-medium transition-colors ${
                  section.direction === d ? "bg-gold/20 text-gold" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {DIRECTION_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] text-zinc-500">גובה תמונות (px)</label>
          <input
            type="number"
            min={80}
            max={600}
            value={section.height}
            onChange={(e) => update({ height: clamp(Number(e.target.value), 80, 600) })}
            dir="ltr"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] text-zinc-500">ריווח בין תמונות (px)</label>
          <input
            type="number"
            min={0}
            max={64}
            value={section.gap}
            onChange={(e) => update({ gap: clamp(Number(e.target.value), 0, 64) })}
            dir="ltr"
            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/50"
          />
        </div>
      </div>

      {/* Images list */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-[11px] text-zinc-400">תמונות בגלריה ({section.images.length})</label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold transition-colors hover:bg-gold/20"
          >
            + הוספת תמונה
          </button>
        </div>

        {section.images.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/10 p-4 text-center text-xs text-zinc-500">
            לא נבחרו תמונות עדיין
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {section.images.map((img, idx) => (
              <div key={img.id} className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-black/20 p-2">
                <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded">
                  <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <span className="flex-1 truncate text-xs text-zinc-400">תמונה {idx + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(img.id, -1)}
                    disabled={idx === 0}
                    className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    aria-label="הזז למעלה"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(img.id, 1)}
                    disabled={idx === section.images.length - 1}
                    className="flex h-7 w-7 items-center justify-center rounded text-zinc-400 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                    aria-label="הזז למטה"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="flex h-7 w-7 items-center justify-center rounded text-red-400 transition-colors hover:bg-red-500/10"
                    aria-label="הסר"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={save}
        disabled={status === "saving"}
        className={`rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
          status === "saved"
            ? "border border-green-500/40 bg-green-500/10 text-green-400"
            : status === "error"
              ? "border border-red-500/40 bg-red-500/10 text-red-400"
              : "border border-gold/40 bg-gold/10 text-gold hover:bg-gold/20"
        }`}
      >
        {status === "saving" ? "שומר…" : status === "saved" ? "✓ נשמר" : status === "error" ? "שגיאה" : "שמור שינויים"}
      </button>

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
              <h2 className="text-sm font-semibold text-white">הוספת תמונות לגלריה</h2>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                className="text-zinc-400 hover:text-white"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            {media.filter((m) => m.fileType !== "video").length === 0 ? (
              <p className="text-sm text-zinc-400">
                אין עדיין תמונות בספרייה. עברו ל&quot;ספריית המדיה&quot; כדי להעלות תמונה תחילה.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                {media
                  .filter((item) => item.fileType !== "video")
                  .map((item) => {
                    const used = usedMediaIds.has(item._id);
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => addImage(item)}
                        className={`group relative aspect-square overflow-hidden rounded-xl border transition-colors ${
                          used ? "border-gold/60" : "border-white/10 hover:border-gold/60"
                        }`}
                      >
                        <Image
                          src={item.url}
                          alt=""
                          fill
                          sizes="200px"
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                        {used && (
                          <span className="absolute left-1.5 top-1.5 rounded-full bg-gold/90 px-1.5 py-0.5 text-[10px] font-semibold text-[#1a1308]">
                            נוסף
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(val) ? min : val));
}
