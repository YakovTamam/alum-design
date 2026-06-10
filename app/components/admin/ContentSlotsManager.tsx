"use client";

import { useState } from "react";
import Image from "next/image";
import type { SerializedMedia } from "@/lib/media";

type ContentSlotsManagerProps = {
  slots: ReadonlyArray<{ key: string; label: string }>;
  media: SerializedMedia[];
  initialAssignments: Record<string, string>;
};

export default function ContentSlotsManager({ slots, media, initialAssignments }: ContentSlotsManagerProps) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [pickerSlot, setPickerSlot] = useState<string | null>(null);
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaById = new Map(media.map((item) => [item._id, item]));

  async function assign(slotKey: string, mediaId: string) {
    setBusySlot(slotKey);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${slotKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "השיוך נכשל");
      setAssignments((prev) => ({ ...prev, [slotKey]: mediaId }));
      setPickerSlot(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "השיוך נכשל");
    } finally {
      setBusySlot(null);
    }
  }

  async function clear(slotKey: string) {
    setBusySlot(slotKey);
    setError(null);
    try {
      const res = await fetch(`/api/admin/content/${slotKey}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "האיפוס נכשל");
      setAssignments((prev) => {
        const next = { ...prev };
        delete next[slotKey];
        return next;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "האיפוס נכשל");
    } finally {
      setBusySlot(null);
    }
  }

  const activePicker = slots.find((slot) => slot.key === pickerSlot);

  return (
    <div className="flex flex-col gap-6">
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {slots.map((slot) => {
          const assignedId = assignments[slot.key];
          const assignedMedia = assignedId ? mediaById.get(assignedId) : undefined;
          const busy = busySlot === slot.key;

          return (
            <div key={slot.key} className="overflow-hidden rounded-2xl border border-white/10 bg-panel/60">
              <div
                className={`relative w-full bg-black/30 ${
                  slot.key === "site-logo" ? "aspect-[3/1]" : "aspect-video"
                }`}
              >
                {assignedMedia ? (
                  <Image
                    src={assignedMedia.url}
                    alt={slot.label}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className={slot.key === "site-logo" ? "object-contain p-4" : "object-cover"}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500">
                    אין תמונה משויכת — מוצג עיצוב ברירת מחדל
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <span className="text-sm text-white">{slot.label}</span>
                <div className="flex items-center gap-2">
                  {assignedMedia && (
                    <button
                      type="button"
                      onClick={() => clear(slot.key)}
                      disabled={busy}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-white/30 disabled:opacity-60"
                    >
                      איפוס
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPickerSlot(slot.key)}
                    disabled={busy}
                    className="rounded-full border border-gold/40 px-3 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10 disabled:opacity-60"
                  >
                    {busy ? "שומר…" : "בחירת תמונה"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activePicker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPickerSlot(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">בחירת תמונה עבור: {activePicker.label}</h2>
              <button
                type="button"
                onClick={() => setPickerSlot(null)}
                className="text-zinc-400 hover:text-white"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            {media.length === 0 ? (
              <p className="text-sm text-zinc-400">
                אין עדיין תמונות בספרייה. עברו ל&quot;ספריית התמונות&quot; כדי להעלות תמונה תחילה.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 overflow-y-auto sm:grid-cols-4">
                {media.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => assign(activePicker.key, item._id)}
                    className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-gold/60"
                  >
                    <Image
                      src={item.url}
                      alt=""
                      fill
                      sizes="200px"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
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
