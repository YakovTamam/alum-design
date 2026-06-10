import { getDb } from "./mongodb";
import { TESTIMONIALS_COLLECTION, serializeTestimonial, type Testimonial, type SerializedTestimonial } from "./testimonials";

const DEFAULT_TESTIMONIALS: SerializedTestimonial[] = [
  {
    _id: "default-1",
    name: "משה כהן",
    role: "קבלן ביצוע, ראשון לציון",
    quote: "עובדים עם אלום דיזיין כבר שנים — עמידה בלוחות זמנים, גימור מושלם ושירות זמין גם אחרי ההתקנה.",
    rating: 5,
    order: 0,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-2",
    name: "מירב לוי",
    role: "בעלת בית, הרצליה",
    quote: "הפרגולה יצאה בדיוק כמו בתכנון, הצוות היה מקצועי ונעים והתוצאה שינתה לנו את החצר לגמרי.",
    rating: 5,
    order: 1,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-3",
    name: "אבי שטרן",
    role: "מנהל פרויקטים, חברת בנייה",
    quote: "מענה מהיר, הצעות מחיר מסודרות והתקנה נקייה גם בפרויקטים גדולים בהיקף רחב.",
    rating: 5,
    order: 2,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
];

export async function getTestimonials(): Promise<SerializedTestimonial[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<Testimonial>(TESTIMONIALS_COLLECTION)
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (docs.length === 0) return DEFAULT_TESTIMONIALS;
    return docs.map(serializeTestimonial);
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}
