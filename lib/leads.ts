import type { ObjectId } from "mongodb";

export type LeadSource = "contact-form" | "configurator" | "contractor-leads" | "sticky-cta";
export type LeadStatus =
  | "new"
  | "no-answer-1"
  | "no-answer-2"
  | "no-answer-3"
  | "no-answer-4"
  | "contacted"
  | "not-relevant"
  | "closed-won"
  | "closed-lost";

export type ConfiguratorSnapshot = {
  systemType: string;
  model: string;
  color: string;
  width: number;
  height: number;
  lighting: boolean;
  estimatedPrice: number;
};

export type Lead = {
  _id?: ObjectId;
  source: LeadSource;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  configurator?: ConfiguratorSnapshot;
  status: LeadStatus;
  notes?: string;
  createdAt: Date;
};

export const LEADS_COLLECTION = "leads";

export type SerializedLead = Omit<Lead, "_id" | "createdAt"> & {
  _id: string;
  createdAt: string;
};

export const SOURCE_LABELS: Record<LeadSource, string> = {
  "contact-form": "טופס יצירת קשר",
  configurator: "קונפיגורטור",
  "contractor-leads": "פנייה עסקית (קבלנים)",
  "sticky-cta": "כפתור פנייה מהירה",
};

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "no-answer-1",
  "no-answer-2",
  "no-answer-3",
  "no-answer-4",
  "contacted",
  "not-relevant",
  "closed-won",
  "closed-lost",
];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "חדש",
  "no-answer-1": "אין מענה 1",
  "no-answer-2": "אין מענה 2",
  "no-answer-3": "אין מענה 3",
  "no-answer-4": "אין מענה 4",
  contacted: "נוצר קשר",
  "not-relevant": "לא רלוונטי",
  "closed-won": "נסגר בהצלחה",
  "closed-lost": "נסגר בלי הצלחה",
};

/** Maps legacy status values (e.g. the old "closed") to the current LeadStatus set. */
export function normalizeLeadStatus(status: string): LeadStatus {
  if ((LEAD_STATUSES as string[]).includes(status)) return status as LeadStatus;
  if (status === "closed") return "closed-won";
  return "new";
}
