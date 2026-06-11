import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import {
  CONTENT_SLOTS,
  SITE_CONTENT_COLLECTION,
  type SiteContentEntry,
} from "@/lib/content";
import type { SerializedHeroSlide } from "@/lib/hero-slides";
import { getHeroSlides } from "@/lib/hero-slides-data";
import { getSetting } from "@/lib/settings";
import { getScrollSection } from "@/lib/scroll-sections-data";
import { getContactInfo } from "@/lib/contact-data";
import ContentAccordion from "../../../components/admin/ContentAccordion";
import ContentSlotsManager from "../../../components/admin/ContentSlotsManager";
import HeroSlidesManager from "../../../components/admin/HeroSlidesManager";
import HeroHeightSetting from "../../../components/admin/HeroHeightSetting";
import ScrollSectionManager from "../../../components/admin/ScrollSectionManager";
import ContactInfoSettings from "../../../components/admin/ContactInfoSettings";
import { SaveAllProvider } from "../../../components/admin/SaveAllContext";

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
  const scrollSection = await getScrollSection();
  const contactInfo = await getContactInfo();

  const logoSlots = CONTENT_SLOTS.filter((slot) => slot.key === "site-logo" || slot.key === "favicon");
  const categorySlots = CONTENT_SLOTS.filter((slot) => slot.key.startsWith("category-"));
  const finalCtaSlots = CONTENT_SLOTS.filter((slot) => slot.key === "final-cta");

  const slotsUnavailable = (
    <p className="text-sm text-zinc-500">תמונות לא זמינות ללא חיבור למסד הנתונים.</p>
  );

  return (
    <SaveAllProvider>
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-lg font-semibold text-white">ניהול תצוגות</h1>
        <p className="mt-1 text-sm text-zinc-400">
          הקטגוריות מסודרות לפי סדר הסקשנים בדף הבית — לחצו על קטגוריה כדי לערוך אותה.
        </p>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
          {loadError} — ניתן לערוך טקסטים, אבל תמונות לא יטענו.
        </div>
      )}

      <ContentAccordion
        sections={[
          {
            id: "contact-info",
            title: "פרטי יצירת קשר",
            description: "מספר הטלפון והאימייל המוצגים באתר ובהתראות מיילים",
            content: (
              <ContactInfoSettings initialPhone={contactInfo.phone} initialEmail={contactInfo.email} />
            ),
          },
          {
            id: "site-logo",
            title: "לוגו האתר",
            description: "החלפת הלוגו המוצג בכותרת העליונה ובפוטר, וה-favicon המוצג בלשונית הדפדפן",
            content: loadError ? (
              slotsUnavailable
            ) : (
              <ContentSlotsManager
                slots={logoSlots}
                media={media}
                initialAssignments={assignments}
              />
            ),
          },
          {
            id: "hero",
            title: "הירו (סלידר ראשי)",
            description: "3 שקופיות מתחלפות — כותרות, תמונות, משך וגובה במובייל",
            content: (
              <div className="flex flex-col gap-8">
                <HeroSlidesManager slides={heroSlides} media={media} />
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-white">גובה הירו במובייל</h3>
                  <p className="mb-4 text-xs text-zinc-500">
                    בחרו ערך vh או px (למשל 75vh, 600px). בדסקטופ הגובה תמיד 100vh.
                  </p>
                  <HeroHeightSetting initialValue={heroMobileHeight} />
                </div>
              </div>
            ),
          },
          {
            id: "categories",
            title: "קטגוריות פרויקטים",
            description: "תמונות 4 קטגוריות הפרויקטים — וילות, מגורים, עסקים ומסחר",
            content: loadError ? (
              slotsUnavailable
            ) : (
              <ContentSlotsManager
                slots={categorySlots}
                media={media}
                initialAssignments={assignments}
              />
            ),
          },
          {
            id: "scroll-video",
            title: "סקשן סקרול וידאו",
            description: "וידאו המתקדם עם הגלילה עם שכבות טקסט מונפשות",
            content: <ScrollSectionManager initialSection={scrollSection} media={media} />,
          },
          {
            id: "final-cta",
            title: "באנר סיום (Final CTA)",
            description: "תמונת הבאנר הגדול שלפני אזור יצירת הקשר",
            content: loadError ? (
              slotsUnavailable
            ) : (
              <ContentSlotsManager
                slots={finalCtaSlots}
                media={media}
                initialAssignments={assignments}
              />
            ),
          },
        ]}
      />
    </div>
    </SaveAllProvider>
  );
}
