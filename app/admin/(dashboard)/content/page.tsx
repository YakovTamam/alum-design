import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import {
  CONTENT_SLOTS,
  SITE_CONTENT_COLLECTION,
  type SiteContentEntry,
} from "@/lib/content";
import ContentSlotsManager from "../../../components/admin/ContentSlotsManager";

export const dynamic = "force-dynamic";

export default async function ContentSlotsPage() {
  let media: SerializedMedia[] = [];
  let assignments: Record<string, string> = {};
  let loadError: string | null = null;

  try {
    const db = await getDb();
    const [mediaItems, contentEntries] = await Promise.all([
      db.collection<Media>(MEDIA_COLLECTION).find({}).sort({ createdAt: -1 }).limit(500).toArray(),
      db.collection<SiteContentEntry>(SITE_CONTENT_COLLECTION).find({}).toArray(),
    ]);

    media = mediaItems.map(serializeMedia);
    assignments = Object.fromEntries(contentEntries.map((entry) => [entry._id, entry.mediaId]));
  } catch (err) {
    console.error("Failed to load site content data", err);
    loadError = "טעינת נתוני התוכן נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">ניהול תצוגות</h1>
        <p className="mt-1 text-sm text-zinc-400">
          בחרו תמונה מספריית התמונות עבור כל אזור באתר. אזור ללא תמונה ימשיך להציג עיצוב ברירת מחדל.
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <ContentSlotsManager slots={CONTENT_SLOTS} media={media} initialAssignments={assignments} />
        )}
      </div>
    </div>
  );
}
