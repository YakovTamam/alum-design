import { getDb } from "./mongodb";
import {
  GALLERY_COLLECTION,
  DEFAULT_GALLERY_SECTION,
  serializeGallerySection,
  type GallerySection,
  type SerializedGallerySection,
} from "./gallery";

export async function getGallerySection(): Promise<SerializedGallerySection> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<GallerySection>(GALLERY_COLLECTION)
      .findOne({ _id: "main" } as never);
    if (!doc) return DEFAULT_GALLERY_SECTION;
    return serializeGallerySection(doc);
  } catch {
    return DEFAULT_GALLERY_SECTION;
  }
}
