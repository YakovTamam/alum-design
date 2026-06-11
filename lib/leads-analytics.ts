import { getDb } from "./mongodb";
import {
  LEAD_STATUSES,
  LEADS_COLLECTION,
  normalizeLeadStatus,
  type Lead,
  type LeadSource,
  type LeadStatus,
} from "./leads";

const FOLLOW_UP_HOURS = 24;
const DAILY_RANGE_DAYS = 14;

export type DailyLeadCount = {
  date: string;
  label: string;
  count: number;
};

export type LeadAnalytics = {
  totalLeads: number;
  last7DaysCount: number;
  previous7DaysCount: number;
  followUpCount: number;
  dailyCounts: DailyLeadCount[];
  sourceCounts: Record<LeadSource, number>;
  statusCounts: Record<LeadStatus, number>;
  closedWonCount: number;
  closedLostCount: number;
  conversionRate: number | null;
  winRate: number | null;
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getLeadAnalytics(): Promise<LeadAnalytics> {
  const db = await getDb();
  const leads = await db
    .collection<Lead>(LEADS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(2000)
    .toArray();

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  const sourceCounts: Record<LeadSource, number> = {
    "contact-form": 0,
    configurator: 0,
    "contractor-leads": 0,
    "sticky-cta": 0,
  };

  const statusCounts: Record<LeadStatus, number> = Object.fromEntries(
    LEAD_STATUSES.map((status) => [status, 0]),
  ) as Record<LeadStatus, number>;

  let last7DaysCount = 0;
  let previous7DaysCount = 0;
  let followUpCount = 0;

  const today = startOfDay(new Date());
  const dailyMap = new Map<string, number>();
  for (let i = DAILY_RANGE_DAYS - 1; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(day.getDate() - i);
    dailyMap.set(day.toISOString().slice(0, 10), 0);
  }

  for (const lead of leads) {
    sourceCounts[lead.source]++;

    const status = normalizeLeadStatus(lead.status);
    statusCounts[status]++;

    const ageMs = now - lead.createdAt.getTime();
    if (ageMs <= sevenDaysMs) last7DaysCount++;
    else if (ageMs <= sevenDaysMs * 2) previous7DaysCount++;

    if (status === "new" && ageMs > FOLLOW_UP_HOURS * 60 * 60 * 1000) followUpCount++;

    const dayKey = startOfDay(lead.createdAt).toISOString().slice(0, 10);
    if (dailyMap.has(dayKey)) {
      dailyMap.set(dayKey, (dailyMap.get(dayKey) ?? 0) + 1);
    }
  }

  const dailyCounts: DailyLeadCount[] = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date,
    label: new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit" }).format(new Date(date)),
    count,
  }));

  const closedWonCount = statusCounts["closed-won"];
  const closedLostCount = statusCounts["closed-lost"];
  const closedTotal = closedWonCount + closedLostCount;

  return {
    totalLeads: leads.length,
    last7DaysCount,
    previous7DaysCount,
    followUpCount,
    dailyCounts,
    sourceCounts,
    statusCounts,
    closedWonCount,
    closedLostCount,
    conversionRate: closedTotal > 0 ? (closedWonCount / closedTotal) * 100 : null,
    winRate: leads.length > 0 ? (closedWonCount / leads.length) * 100 : null,
  };
}
