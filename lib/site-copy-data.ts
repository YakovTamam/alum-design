import { getDb } from "./mongodb";
import {
  SITE_COPY_COLLECTION,
  DEFAULT_SITE_COPY,
  DEFAULT_SITE_IDENTITY,
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
    const copy = serializeSiteCopy(doc);
    return { ...copy, siteIdentity: copy.siteIdentity ?? DEFAULT_SITE_IDENTITY };
  } catch {
    return DEFAULT_SITE_COPY;
  }
}
