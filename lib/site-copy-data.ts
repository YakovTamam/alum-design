import { getDb } from "./mongodb";
import {
  SITE_COPY_COLLECTION,
  DEFAULT_SITE_COPY,
  serializeSiteCopy,
  type SiteCopy,
  type SerializedSiteCopy,
} from "./site-copy";

export async function getSiteCopy(): Promise<SerializedSiteCopy> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<SiteCopy>(SITE_COPY_COLLECTION)
      .findOne({ _id: "main" } as never);
    if (!doc) return DEFAULT_SITE_COPY;
    return serializeSiteCopy(doc);
  } catch {
    return DEFAULT_SITE_COPY;
  }
}
