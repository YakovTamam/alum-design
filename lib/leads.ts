import type { ObjectId } from "mongodb";

export type LeadSource = "contact-form" | "configurator";
export type LeadStatus = "new" | "contacted" | "closed";

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
  message?: string;
  configurator?: ConfiguratorSnapshot;
  status: LeadStatus;
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
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "חדש",
  contacted: "נוצר קשר",
  closed: "סגור",
};
