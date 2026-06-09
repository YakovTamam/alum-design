import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import {
  CONTENT_SLOTS,
  SITE_CONTENT_COLLECTION,
  type SiteContentEntry,
} from "@/lib/content";
import { getHeroSlides, type SerializedHeroSlide } from "@/lib/hero-slides";
import { getSetting } from "@/lib/settings";
import ContentSlotsManager from "../../../components/admin/ContentSlotsManager";
import HeroSlidesManager from "../../../components/admin/HeroSlidesManager";
import HeroHeightSetting from "../../../components/admin/HeroHeightSetting";

export const dynamic = "force-dynamic";

export default async function ContentSlotsPage() {
  let media: SerializedMedia[] = [];
  let assignments: Record<string, string> = {};
  let heroSlides: SerializedHeroSlide[] = [];
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

  // getHeroSlides handles its own errors and always returns data (defaults as fallback)
  heroSlides = await getHeroSlides();
  const heroMobileHeight = await getSetting("hero-mobile-height", "75vh");

  return (
    <div className="flex flex-col gap-12">
      <div>
        <h1 className="text-lg font-semibold text-white">ניהול תצוגות</h1>
        <p className="mt-1 text-sm text-zinc-400">
          עריכת שקופיות ה-Hero ותמונות אזורי האתר.
        </p>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
          {loadError} — ניתן לערוך טקסטים, אבל תמונות לא יטענו.
        </div>
      )}

      {/* Hero Slider */}
      <div>
        <h2 className="mb-1 text-sm font-semibold text-white">הירו סלידר</h2>
        <p className="mb-5 text-xs text-zinc-500">
          3 שקופיות מתחלפות — עדכנו כותרת, תת-כותרת, כפתור, תמונה ומשך לכל שקופית.
        </p>
        <HeroSlidesManager slides={heroSlides} media={media} />
      </div>

      {/* Hero mobile height */}
      <div>
        <h2 className="mb-1 text-sm font-semibold text-white">גובה הירו במובייל</h2>
        <p className="mb-4 text-xs text-zinc-500">
          בחרו ערך vh או px (למשל 75vh, 600px). בדסקטופ הגובה תמיד 100vh.
        </p>
        <HeroHeightSetting initialValue={heroMobileHeight} />
      </div>

      {/* Image Slots */}
      <div>
        <h2 className="mb-1 text-sm font-semibold text-white">תמונות אזורים</h2>
        <p className="mb-5 text-xs text-zinc-500">
          בחרו תמונה מספריית התמונות עבור כל אזור באתר. אזור ללא תמונה ימשיך להציג עיצוב ברירת מחדל.
        </p>
        {!loadError && (
          <ContentSlotsManager
            slots={CONTENT_SLOTS}
            media={media}
            initialAssignments={assignments}
          />
        )}
      </div>
    </div>
  );
}
