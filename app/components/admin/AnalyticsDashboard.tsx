import { LEAD_STATUSES, SOURCE_LABELS, STATUS_LABELS, type LeadSource, type LeadStatus } from "@/lib/leads";
import type { LeadAnalytics } from "@/lib/leads-analytics";

const STATUS_BAR_COLORS: Record<LeadStatus, string> = {
  new: "bg-gold",
  "no-answer-1": "bg-amber-400",
  "no-answer-2": "bg-orange-400",
  "no-answer-3": "bg-orange-500",
  "no-answer-4": "bg-rose-400",
  contacted: "bg-sky-400",
  "not-relevant": "bg-zinc-500",
  "closed-won": "bg-emerald-400",
  "closed-lost": "bg-red-500",
};

const SOURCE_BAR_COLORS: Record<LeadSource, string> = {
  "contact-form": "bg-gold",
  configurator: "bg-sky-400",
  "contractor-leads": "bg-emerald-400",
  "sticky-cta": "bg-violet-400",
};

function formatPercent(value: number | null): string {
  if (value === null) return "—";
  return `${value.toFixed(0)}%`;
}

function Card({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 p-5">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

export default function AnalyticsDashboard({ data }: { data: LeadAnalytics }) {
  const {
    totalLeads,
    last7DaysCount,
    previous7DaysCount,
    followUpCount,
    dailyCounts,
    sourceCounts,
    statusCounts,
    closedWonCount,
    closedLostCount,
    conversionRate,
    winRate,
  } = data;

  const trend = last7DaysCount - previous7DaysCount;
  const trendLabel =
    previous7DaysCount === 0
      ? null
      : trend === 0
        ? "ללא שינוי לעומת השבוע הקודם"
        : `${trend > 0 ? "+" : ""}${trend} לעומת השבוע הקודם`;

  const maxDaily = Math.max(1, ...dailyCounts.map((d) => d.count));
  const maxSource = Math.max(1, ...Object.values(sourceCounts));
  const maxStatus = Math.max(1, ...Object.values(statusCounts));

  return (
    <div className="flex flex-col gap-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="סה״כ לידים" value={String(totalLeads)} />
        <Card label="לידים ב-7 הימים האחרונים" value={String(last7DaysCount)} hint={trendLabel ?? undefined} />
        <Card
          label="אחוז המרה (מתוך עסקאות שנסגרו)"
          value={formatPercent(conversionRate)}
          hint={`${closedWonCount} נסגרו בהצלחה · ${closedLostCount} נסגרו בלי הצלחה`}
        />
        <Card
          label="דורשים מעקב"
          value={String(followUpCount)}
          hint={winRate !== null ? `${formatPercent(winRate)} מכלל הלידים הסתיימו בעסקה` : undefined}
        />
      </div>

      {/* Daily chart */}
      <div className="rounded-2xl border border-white/10 p-5">
        <h2 className="text-sm font-semibold text-white">לידים לפי יום (14 הימים האחרונים)</h2>
        <div className="mt-6 flex h-40 items-end gap-1.5 sm:gap-2">
          {dailyCounts.map((day) => (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[10px] text-zinc-500">{day.count > 0 ? day.count : ""}</span>
              <div
                className="w-full rounded-t bg-gold/70"
                style={{ height: `${Math.max((day.count / maxDaily) * 100, day.count > 0 ? 4 : 1)}%` }}
              />
              <span className="text-[10px] text-zinc-500">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Source breakdown */}
        <div className="rounded-2xl border border-white/10 p-5">
          <h2 className="text-sm font-semibold text-white">לידים לפי מקור</h2>
          <div className="mt-5 flex flex-col gap-4">
            {(Object.keys(SOURCE_LABELS) as LeadSource[]).map((source) => {
              const count = sourceCounts[source];
              return (
                <div key={source}>
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>{SOURCE_LABELS[source]}</span>
                    <span className="text-zinc-400">{count}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${SOURCE_BAR_COLORS[source]}`}
                      style={{ width: `${(count / maxSource) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="rounded-2xl border border-white/10 p-5">
          <h2 className="text-sm font-semibold text-white">לידים לפי סטטוס</h2>
          <div className="mt-5 flex flex-col gap-4">
            {LEAD_STATUSES.map((status) => {
              const count = statusCounts[status];
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs text-zinc-300">
                    <span>{STATUS_LABELS[status]}</span>
                    <span className="text-zinc-400">{count}</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${STATUS_BAR_COLORS[status]}`}
                      style={{ width: `${(count / maxStatus) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
