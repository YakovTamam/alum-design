"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { SerializedMedia } from "@/lib/media";
import {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_CATEGORY_LABELS,
  type PortfolioCategory,
  type SerializedPortfolioItem,
} from "@/lib/portfolio-types";

export default function PortfolioManager({
  initialItems,
  media,
}: {
  initialItems: SerializedPortfolioItem[];
  media: SerializedMedia[];
}) {
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PortfolioCategory>("pergola");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pickerId, setPickerId] = useState<string | "new" | null>(null);
  const [newImage, setNewImage] = useState<{ mediaId: string; url: string } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<SerializedPortfolioItem>>>({});

  function getDraft(item: SerializedPortfolioItem): SerializedPortfolioItem {
    return { ...item, ...drafts[item._id] };
  }

  function setDraft(id: string, patch: Partial<SerializedPortfolioItem>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("יש להזין כותרת");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          description,
          mediaId: newImage?.mediaId,
          imageUrl: newImage?.url,
          order: items.length,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "יצירת הפריט נכשלה");
        return;
      }
      setItems((curr) => [...curr, data.item]);
      setTitle("");
      setDescription("");
      setCategory("pergola");
      setNewImage(null);
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveItem(id: string) {
    const patch = drafts[id];
    if (!patch) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setItems((curr) => curr.map((item) => (item._id === id ? { ...item, ...patch } : item)));
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
    } catch {
      setError("שמירת הפריט נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const previous = items;
    setItems((curr) => curr.filter((item) => item._id !== id));

    try {
      const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setItems(previous);
    } finally {
      setBusyId(null);
    }
  }

  function selectImage(mediaId: string, url: string) {
    if (pickerId === "new") {
      setNewImage({ mediaId, url });
    } else if (pickerId) {
      setDraft(pickerId, { mediaId, imageUrl: url });
    }
    setPickerId(null);
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Create form */}
      <div className="rounded-2xl border border-white/10 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">פריט חדש בגלריה</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="portfolio-title">
                כותרת
              </label>
              <input
                id="portfolio-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-56 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="portfolio-category">
                קטגוריה
              </label>
              <select
                id="portfolio-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              >
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-panel">
                    {PORTFOLIO_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setPickerId("new")}
              className="self-stretch rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              {newImage ? "החלפת תמונה" : "הוספת תמונה"}
            </button>

            {newImage && (
              <div className="relative h-12 w-16 overflow-hidden rounded-lg border border-white/10">
                <Image src={newImage.url} alt="" fill sizes="64px" className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400" htmlFor="portfolio-description">
              תיאור קצר (אופציונלי)
            </label>
            <textarea
              id="portfolio-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {submitting ? "מוסיף…" : "הוספה לגלריה"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Items list */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">פריטי הגלריה ({items.length})</h2>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
            אין עדיין פריטים בגלריה.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item) => {
              const draft = getDraft(item);
              const dirty = Boolean(drafts[item._id]);
              return (
                <div key={item._id} className="rounded-2xl border border-white/10 p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setPickerId(item._id)}
                      className="group relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10"
                    >
                      {draft.imageUrl ? (
                        <Image src={draft.imageUrl} alt="" fill sizes="96px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/5 text-[10px] text-zinc-500">
                          אין תמונה
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        החלפה
                      </div>
                    </button>

                    <div className="flex flex-1 flex-wrap items-end gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400">כותרת</label>
                        <input
                          type="text"
                          value={draft.title}
                          onChange={(e) => setDraft(item._id, { title: e.target.value })}
                          className="w-48 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400">קטגוריה</label>
                        <select
                          value={draft.category}
                          onChange={(e) => setDraft(item._id, { category: e.target.value as PortfolioCategory })}
                          className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/60"
                        >
                          {PORTFOLIO_CATEGORIES.map((c) => (
                            <option key={c} value={c} className="bg-panel">
                              {PORTFOLIO_CATEGORY_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={busyId === item._id}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
                    >
                      מחיקה
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <textarea
                      rows={2}
                      value={draft.description ?? ""}
                      onChange={(e) => setDraft(item._id, { description: e.target.value })}
                      placeholder="תיאור קצר"
                      className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                    />
                    <button
                      type="button"
                      disabled={busyId === item._id || !dirty}
                      onClick={() => saveItem(item._id)}
                      className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
                    >
                      {busyId === item._id ? "שומר…" : "שמירה"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image picker modal */}
      {pickerId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
          onClick={() => setPickerId(null)}
        >
          <div
            className="flex max-h-[80vh] w-full max-w-3xl flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0e0e11] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-white">בחירת תמונה</h2>
              <button
                type="button"
                onClick={() => setPickerId(null)}
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
              <div className="grid grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-5">
                {media
                  .filter((m) => m.fileType !== "video")
                  .map((m) => (
                    <button
                      key={m._id}
                      type="button"
                      onClick={() => selectImage(m._id, m.url)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-gold/60"
                    >
                      <Image
                        src={m.url}
                        alt=""
                        fill
                        sizes="160px"
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
