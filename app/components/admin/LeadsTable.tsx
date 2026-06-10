"use client";

import { useState } from "react";
import {
  SOURCE_LABELS,
  STATUS_LABELS,
  type LeadStatus,
  type SerializedLead,
} from "@/lib/leads";

const STATUS_OPTIONS: LeadStatus[] = ["new", "contacted", "closed"];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-gold/50 bg-gold/10 text-gold",
  contacted: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  closed: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
};

const FOLLOW_UP_HOURS = 24;

function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("he-IL").format(value);
}

function needsFollowUp(lead: SerializedLead): boolean {
  if (lead.status !== "new") return false;
  const ageMs = Date.now() - new Date(lead.createdAt).getTime();
  return ageMs > FOLLOW_UP_HOURS * 60 * 60 * 1000;
}

export default function LeadsTable({
  leads,
  canDelete = false,
}: {
  leads: SerializedLead[];
  canDelete?: boolean;
}) {
  const [items, setItems] = useState(leads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<LeadStatus | "all" | "followup">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);

  async function updateStatus(id: string, status: LeadStatus) {
    setUpdatingId(id);
    const previous = items;
    setItems((curr) => curr.map((lead) => (lead._id === id ? { ...lead, status } : lead)));

    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("update failed");
    } catch {
      setItems(previous);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteLead(id: string) {
    if (!confirm("למחוק את הליד הזה לצמיתות?")) return;

    setDeletingId(id);
    const previous = items;
    setItems((curr) => curr.filter((lead) => lead._id !== id));

    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
    } catch {
      setItems(previous);
    } finally {
      setDeletingId(null);
    }
  }

  function openLead(lead: SerializedLead) {
    setSelectedId(lead._id);
    setNotesDraft(lead.notes ?? "");
    setNotesError(null);
  }

  function closeLead() {
    setSelectedId(null);
    setNotesError(null);
  }

  async function saveNotes(id: string) {
    setSavingNotes(true);
    setNotesError(null);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notesDraft }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setNotesError(data.error || "שמירת ההערות נכשלה");
        return;
      }
      setItems((curr) =>
        curr.map((lead) => (lead._id === id ? { ...lead, notes: data.notes ?? notesDraft.trim() } : lead)),
      );
      closeLead();
    } catch {
      setNotesError("שגיאת רשת, נסו שוב");
    } finally {
      setSavingNotes(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
        עדיין לא התקבלו לידים. ברגע שמישהו ישלח טופס יצירת קשר או ילחץ &quot;המשך
        להצעת מחיר&quot; בקונפיגורטור — הוא יופיע כאן.
      </div>
    );
  }

  const counts: Record<LeadStatus | "all" | "followup", number> = {
    all: items.length,
    new: 0,
    contacted: 0,
    closed: 0,
    followup: 0,
  };
  for (const lead of items) {
    counts[lead.status]++;
    if (needsFollowUp(lead)) counts.followup++;
  }

  const filteredItems =
    filter === "all"
      ? items
      : filter === "followup"
        ? items.filter(needsFollowUp)
        : items.filter((lead) => lead.status === filter);
  const selectedLead = items.find((lead) => lead._id === selectedId) ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUS_OPTIONS, "followup"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === key
                ? key === "all"
                  ? "border-white/30 bg-white/10 text-white"
                  : key === "followup"
                    ? "border-red-500/40 bg-red-500/10 text-red-300"
                    : STATUS_STYLES[key]
                : key === "followup" && counts.followup > 0
                  ? "border-red-500/30 text-red-300 hover:text-red-200"
                  : "border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {key === "all" ? "הכל" : key === "followup" ? "דורש מעקב" : STATUS_LABELS[key]} · {counts[key]}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
          אין לידים בסיווג זה.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[860px] text-right text-sm">
            <thead className="bg-panel-light text-xs text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-medium">תאריך</th>
                <th className="px-4 py-3 font-medium">שם</th>
                <th className="px-4 py-3 font-medium">טלפון</th>
                <th className="px-4 py-3 font-medium">עיר</th>
                <th className="px-4 py-3 font-medium">אימייל</th>
                <th className="px-4 py-3 font-medium">מקור</th>
                <th className="px-4 py-3 font-medium">פרטי פנייה</th>
                <th className="px-4 py-3 font-medium">הערות</th>
                <th className="px-4 py-3 font-medium">סטטוס</th>
                {canDelete && <th className="px-4 py-3 font-medium"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((lead) => (
                <tr
                  key={lead._id}
                  onClick={() => openLead(lead)}
                  className="cursor-pointer align-top text-zinc-200 transition-colors hover:bg-white/5"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    <span className="flex items-center gap-2">
                      {needsFollowUp(lead) && (
                        <span
                          className="h-2 w-2 shrink-0 rounded-full bg-red-500"
                          title="דורש מעקב — ליד חדש שטרם טופל מעל 24 שעות"
                        />
                      )}
                      {lead.name}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                    <a
                      href={`tel:${lead.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="hover:text-gold"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {lead.city || <span className="text-zinc-500">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                    {lead.email ? (
                      <a
                        href={`mailto:${lead.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-gold"
                      >
                        {lead.email}
                      </a>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-zinc-300">
                      {SOURCE_LABELS[lead.source]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs leading-6 text-zinc-400">
                    {lead.configurator ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-zinc-200">
                          {lead.configurator.systemType} · {lead.configurator.model}
                        </span>
                        <span>
                          {lead.configurator.width}×{lead.configurator.height} ס&quot;מ ·{" "}
                          {lead.configurator.color}
                          {lead.configurator.lighting ? " · תאורת LED" : ""}
                        </span>
                        <span className="font-semibold text-gold">
                          ₪ {formatPrice(lead.configurator.estimatedPrice)}
                        </span>
                      </div>
                    ) : lead.message ? (
                      <p className="max-w-xs truncate" title={lead.message}>
                        {lead.message}
                      </p>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs leading-6 text-zinc-400">
                    {lead.notes ? (
                      <p className="max-w-[12rem] truncate" title={lead.notes}>
                        {lead.notes}
                      </p>
                    ) : (
                      <span className="text-zinc-500">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      disabled={updatingId === lead._id}
                      onChange={(e) => updateStatus(lead._id, e.target.value as LeadStatus)}
                      className={`rounded-full border px-3 py-1.5 text-xs outline-none transition-opacity ${STATUS_STYLES[lead.status]} ${
                        updatingId === lead._id ? "opacity-50" : ""
                      }`}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status} className="bg-panel text-zinc-200">
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </td>
                  {canDelete && (
                    <td className="whitespace-nowrap px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => deleteLead(lead._id)}
                        disabled={deletingId === lead._id}
                        className="rounded-full border border-red-500/30 px-3 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                      >
                        {deletingId === lead._id ? "מוחק…" : "מחק"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead detail / notes modal */}
      {selectedLead && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
          onClick={closeLead}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-2xl border border-white/10 bg-[#0e0e11] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-white">{selectedLead.name}</h2>
                <p className="mt-1 text-xs text-zinc-400">{formatDate(selectedLead.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={closeLead}
                className="text-zinc-400 hover:text-white"
                aria-label="סגירה"
              >
                ✕
              </button>
            </div>

            {needsFollowUp(selectedLead) && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                ליד זה ממתין למעקב — נוצר לפני יותר מ-24 שעות וטרם טופל.
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-zinc-400">טלפון</p>
                <a href={`tel:${selectedLead.phone}`} className="hover:text-gold" dir="ltr">
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-zinc-400">מקור</p>
                <p>{SOURCE_LABELS[selectedLead.source]}</p>
              </div>
              {selectedLead.city && (
                <div>
                  <p className="text-xs text-zinc-400">עיר</p>
                  <p>{selectedLead.city}</p>
                </div>
              )}
              {selectedLead.email && (
                <div>
                  <p className="text-xs text-zinc-400">אימייל</p>
                  <a href={`mailto:${selectedLead.email}`} className="hover:text-gold" dir="ltr">
                    {selectedLead.email}
                  </a>
                </div>
              )}
            </div>

            {selectedLead.message && (
              <div>
                <p className="text-xs text-zinc-400">הודעה</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-200">{selectedLead.message}</p>
              </div>
            )}

            {selectedLead.configurator && (
              <div>
                <p className="text-xs text-zinc-400">פרטי קונפיגורטור</p>
                <div className="mt-1 flex flex-col gap-0.5 text-sm text-zinc-200">
                  <span>
                    {selectedLead.configurator.systemType} · {selectedLead.configurator.model}
                  </span>
                  <span>
                    {selectedLead.configurator.width}×{selectedLead.configurator.height} ס&quot;מ ·{" "}
                    {selectedLead.configurator.color}
                    {selectedLead.configurator.lighting ? " · תאורת LED" : ""}
                  </span>
                  <span className="font-semibold text-gold">
                    ₪ {formatPrice(selectedLead.configurator.estimatedPrice)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <p className="text-xs text-zinc-400">סטטוס</p>
              <select
                value={selectedLead.status}
                disabled={updatingId === selectedLead._id}
                onChange={(e) => updateStatus(selectedLead._id, e.target.value as LeadStatus)}
                className={`rounded-full border px-3 py-1.5 text-xs outline-none transition-opacity ${STATUS_STYLES[selectedLead.status]} ${
                  updatingId === selectedLead._id ? "opacity-50" : ""
                }`}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status} className="bg-panel text-zinc-200">
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-zinc-400" htmlFor="lead-notes">
                הערות — מי הלקוח ופרטי הפרויקט
              </label>
              <textarea
                id="lead-notes"
                rows={5}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="לדוגמה: קבלן מוכר, מעוניין בפרגולה לחצר 4x5 מ', תקציב גמיש, לחזור אליו בשבוע הבא..."
                className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>

            {notesError && <p className="text-sm text-red-400">{notesError}</p>}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeLead}
                className="rounded-xl border border-white/10 px-4 py-2 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                ביטול
              </button>
              <button
                type="button"
                onClick={() => saveNotes(selectedLead._id)}
                disabled={savingNotes}
                className="rounded-xl bg-gold px-5 py-2 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
              >
                {savingNotes ? "שומר…" : "שמירת הערות"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
