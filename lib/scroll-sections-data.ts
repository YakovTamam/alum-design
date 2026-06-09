import { getDb } from "./mongodb";
import {
  SCROLL_SECTIONS_COLLECTION,
  DEFAULT_SCROLL_SECTION,
  serializeScrollSection,
  type ScrollSection,
  type SerializedScrollSection,
} from "./scroll-sections";

export async function getScrollSection(): Promise<SerializedScrollSection> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<ScrollSection>(SCROLL_SECTIONS_COLLECTION)
      .findOne({ _id: "main" } as never);
    if (!doc) return DEFAULT_SCROLL_SECTION;
    return serializeScrollSection(doc);
  } catch {
    return DEFAULT_SCROLL_SECTION;
  }
}
