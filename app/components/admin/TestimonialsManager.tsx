"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { SerializedMedia } from "@/lib/media";
import type { SerializedTestimonial } from "@/lib/testimonials";

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-lg leading-none transition-colors ${n <= value ? "text-gold" : "text-zinc-600"}`}
          aria-label={`${n} כוכבים`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function TestimonialsManager({
  initialTestimonials,
  media,
}: {
  initialTestimonials: SerializedTestimonial[];
  media: SerializedMedia[];
}) {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pickerId, setPickerId] = useState<string | "new" | null>(null);
  const [newImage, setNewImage] = useState<{ mediaId: string; url: string } | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Partial<SerializedTestimonial>>>({});

  function getDraft(t: SerializedTestimonial): SerializedTestimonial {
    return { ...t, ...drafts[t._id] };
  }

  function setDraft(id: string, patch: Partial<SerializedTestimonial>) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !quote.trim()) {
      setError("יש להזין שם ותוכן המלצה");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          quote,
          rating,
          mediaId: newImage?.mediaId,
          imageUrl: newImage?.url,
          order: testimonials.length,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "יצירת ההמלצה נכשלה");
        return;
      }
      setTestimonials((curr) => [...curr, data.testimonial]);
      setName("");
      setRole("");
      setQuote("");
      setRating(5);
      setNewImage(null);
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  async function saveTestimonial(id: string) {
    const patch = drafts[id];
    if (!patch) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
      setTestimonials((curr) => curr.map((t) => (t._id === id ? { ...t, ...patch } : t)));
      setDrafts((d) => {
        const next = { ...d };
        delete next[id];
        return next;
      });
    } catch {
      setError("שמירת ההמלצה נכשלה");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    const previous = testimonials;
    setTestimonials((curr) => curr.filter((t) => t._id !== id));

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTestimonials(previous);
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
        <h2 className="mb-4 text-sm font-semibold text-white">המלצה חדשה</h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="testimonial-name">
                שם הלקוח
              </label>
              <input
                id="testimonial-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-56 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="testimonial-role">
                תפקיד / עיר (אופציונלי)
              </label>
              <input
                id="testimonial-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-56 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-zinc-400">דירוג</span>
              <div className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5">
                <StarPicker value={rating} onChange={setRating} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPickerId("new")}
              className="self-stretch rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 transition-colors hover:border-gold/40 hover:text-gold"
            >
              {newImage ? "החלפת תמונה" : "הוספת תמונה"}
            </button>

            {newImage && (
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/10">
                <Image src={newImage.url} alt="" fill sizes="48px" className="object-cover" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-zinc-400" htmlFor="testimonial-quote">
              תוכן ההמלצה
            </label>
            <textarea
              id="testimonial-quote"
              rows={3}
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="self-start rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
          >
            {submitting ? "יוצר…" : "הוספת המלצה"}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Testimonials list */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">המלצות ({testimonials.length})</h2>
        {testimonials.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
            אין עדיין המלצות.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {testimonials.map((t) => {
              const draft = getDraft(t);
              const dirty = Boolean(drafts[t._id]);
              return (
                <div key={t._id} className="rounded-2xl border border-white/10 p-5">
                  <div className="flex flex-wrap items-start gap-4">
                    <button
                      type="button"
                      onClick={() => setPickerId(t._id)}
                      className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-white/10"
                    >
                      {draft.imageUrl ? (
                        <Image src={draft.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-white/5 text-sm font-semibold text-zinc-400">
                          {draft.name.slice(0, 1)}
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        החלפה
                      </div>
                    </button>

                    <div className="flex flex-1 flex-wrap items-end gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400">שם</label>
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) => setDraft(t._id, { name: e.target.value })}
                          className="w-48 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-zinc-400">תפקיד / עיר</label>
                        <input
                          type="text"
                          value={draft.role ?? ""}
                          onChange={(e) => setDraft(t._id, { role: e.target.value })}
                          className="w-48 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-gold/60"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <span className="text-xs text-zinc-400">דירוג</span>
                        <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2">
                          <StarPicker value={draft.rating} onChange={(n) => setDraft(t._id, { rating: n })} />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(t._id)}
                      disabled={busyId === t._id}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
                    >
                      מחיקה
                    </button>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                    <textarea
                      rows={2}
                      value={draft.quote}
                      onChange={(e) => setDraft(t._id, { quote: e.target.value })}
                      className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                    />
                    <button
                      type="button"
                      disabled={busyId === t._id || !dirty}
                      onClick={() => saveTestimonial(t._id)}
                      className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
                    >
                      {busyId === t._id ? "שומר…" : "שמירה"}
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
                  .filter((item) => item.fileType !== "video")
                  .map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => selectImage(item._id, item.url)}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-gold/60"
                    >
                      <Image
                        src={item.url}
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
