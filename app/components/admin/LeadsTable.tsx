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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("he-IL").format(value);
}

export default function LeadsTable({ leads }: { leads: SerializedLead[] }) {
  const [items, setItems] = useState(leads);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
        עדיין לא התקבלו לידים. ברגע שמישהו ישלח טופס יצירת קשר או ילחץ &quot;המשך
        להצעת מחיר&quot; בקונפיגורטור — הוא יופיע כאן.
      </div>
    );
  }

  return (
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
            <th className="px-4 py-3 font-medium">סטטוס</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.map((lead) => (
            <tr key={lead._id} className="align-top text-zinc-200">
              <td className="whitespace-nowrap px-4 py-3 text-xs text-zinc-400">
                {formatDate(lead.createdAt)}
              </td>
              <td className="px-4 py-3 font-medium text-white">{lead.name}</td>
              <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                <a href={`tel:${lead.phone}`} className="hover:text-gold">
                  {lead.phone}
                </a>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {lead.city || <span className="text-zinc-500">—</span>}
              </td>
              <td className="whitespace-nowrap px-4 py-3" dir="ltr">
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="hover:text-gold">
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
              <td className="whitespace-nowrap px-4 py-3">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
