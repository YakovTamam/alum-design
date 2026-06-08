import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import MediaLibrary from "../../../components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

async function fetchMedia(): Promise<SerializedMedia[]> {
  const db = await getDb();
  const items = await db
    .collection<Media>(MEDIA_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return items.map(serializeMedia);
}

export default async function MediaLibraryPage() {
  let media: SerializedMedia[] = [];
  let loadError: string | null = null;

  try {
    media = await fetchMedia();
  } catch (err) {
    console.error("Failed to load media library", err);
    loadError = "טעינת ספריית התמונות נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">ספריית התמונות</h1>
        <p className="mt-1 text-sm text-zinc-400">
          העלו תמונות ונהלו אותן — ניתן לבחור מהן בהמשך עבור אזורים שונים באתר דרך &quot;ניהול תצוגות&quot;.
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <MediaLibrary initialMedia={media} />
        )}
      </div>
    </div>
  );
}
