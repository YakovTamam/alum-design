import { getDb } from "./mongodb";
import {
  PORTFOLIO_COLLECTION,
  serializePortfolioItem,
  type PortfolioItem,
  type SerializedPortfolioItem,
} from "./portfolio";

const DEFAULT_ITEMS: SerializedPortfolioItem[] = [
  {
    _id: "default-1",
    title: "פרגולת אלומיניום",
    category: "pergola",
    description: "תכנון ממוחשב, ביצוע מדויק",
    order: 0,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-2",
    title: "חלונות מעוצבים",
    category: "window",
    description: "בידוד תרמי ואקוסטי מתקדם",
    order: 1,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-3",
    title: "שערי כניסה חכמים",
    category: "gate",
    description: "אוטומציה ואבטחה משולבות",
    order: 2,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-4",
    title: "סגירות זכוכית",
    category: "glass",
    description: "מרחב מוגן ואסתטי",
    order: 3,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-5",
    title: "חזיתות בניין",
    category: "facade",
    description: "עיצוב ארכיטקטוני מרהיב",
    order: 4,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-6",
    title: "מערכות הצללה",
    category: "shade",
    description: "נוחות תרמית לכל עונה",
    order: 5,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-7",
    title: "גגות אלומיניום",
    category: "pergola",
    description: "עמידות לאורך עשרות שנים",
    order: 6,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    _id: "default-8",
    title: "מחיצות זכוכית",
    category: "glass",
    description: "עיצוב פנים מודרני ופתוח",
    order: 7,
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
];

export async function getPortfolioItems(): Promise<SerializedPortfolioItem[]> {
  try {
    const db = await getDb();
    const docs = await db
      .collection<PortfolioItem>(PORTFOLIO_COLLECTION)
      .find({})
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    if (docs.length === 0) return DEFAULT_ITEMS;
    return docs.map(serializePortfolioItem);
  } catch {
    return DEFAULT_ITEMS;
  }
}
