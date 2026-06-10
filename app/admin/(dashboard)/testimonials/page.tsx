import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media, type SerializedMedia } from "@/lib/media";
import { listTestimonials, serializeTestimonial, type SerializedTestimonial } from "@/lib/testimonials";
import TestimonialsManager from "../../../components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  let testimonials: SerializedTestimonial[] = [];
  let media: SerializedMedia[] = [];
  let loadError: string | null = null;

  try {
    const db = await getDb();
    const [testimonialDocs, mediaItems] = await Promise.all([
      listTestimonials(),
      db.collection<Media>(MEDIA_COLLECTION).find({}).sort({ createdAt: -1 }).limit(500).toArray(),
    ]);
    testimonials = testimonialDocs.map(serializeTestimonial);
    media = mediaItems.map(serializeMedia);
  } catch (err) {
    console.error("Failed to load testimonials", err);
    loadError = "טעינת ההמלצות נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">המלצות לקוחות</h1>
        <p className="mt-1 text-sm text-zinc-400">
          ניהול ההמלצות המוצגות באתר — שם, תפקיד, דירוג ותמונה.
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <TestimonialsManager initialTestimonials={testimonials} media={media} />
        )}
      </div>
    </div>
  );
}
