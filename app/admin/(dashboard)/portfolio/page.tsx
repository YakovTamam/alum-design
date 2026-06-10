import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import { listPortfolioItems, serializePortfolioItem, type SerializedPortfolioItem } from "@/lib/portfolio";
import PortfolioManager from "../../../components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  let items: SerializedPortfolioItem[] = [];
  let media: SerializedMedia[] = [];
  let loadError: string | null = null;

  try {
    const db = await getDb();
    const [itemDocs, mediaItems] = await Promise.all([
      listPortfolioItems(),
      db.collection<Media>(MEDIA_COLLECTION).find({}).sort({ createdAt: -1 }).limit(500).toArray(),
    ]);
    items = itemDocs.map(serializePortfolioItem);
    media = mediaItems.map(serializeMedia);
  } catch (err) {
    console.error("Failed to load portfolio items", err);
    loadError = "טעינת הגלריה נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">גלריית פרויקטים</h1>
        <p className="mt-1 text-sm text-zinc-400">
          ניהול הפריטים המוצגים בעמוד &quot;פרויקטים&quot; הציבורי — כותרת, קטגוריה, תיאור ותמונה.
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <PortfolioManager initialItems={items} media={media} />
        )}
      </div>
    </div>
  );
}
