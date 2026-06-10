import { getDb } from "./mongodb";

export const CONTENT_SLOTS = [
  { key: "site-logo", label: "לוגו האתר (כותרת ופוטר)" },
  { key: "final-cta", label: "באנר סיום (Final CTA)" },
  { key: "category-luxury-villas", label: "קטגוריה: וילות יוקרה" },
  { key: "category-residential", label: "קטגוריה: בנייני מגורים" },
  { key: "category-business", label: "קטגוריה: עסקים ומסעדות" },
  { key: "category-commercial", label: "קטגוריה: מתחמים מסחריים" },
] as const;

export type ContentSlotKey = (typeof CONTENT_SLOTS)[number]["key"];

export const SITE_CONTENT_COLLECTION = "site_content";

export type SiteContentEntry = {
  _id: ContentSlotKey;
  url: string;
  mediaId: string;
  updatedAt: Date;
};

export async function getSiteContentMap(): Promise<Partial<Record<ContentSlotKey, string>>> {
  const db = await getDb();
  const entries = await db
    .collection<SiteContentEntry>(SITE_CONTENT_COLLECTION)
    .find({})
    .toArray();

  const map: Partial<Record<ContentSlotKey, string>> = {};
  for (const entry of entries) {
    map[entry._id] = entry.url;
  }
  return map;
}
