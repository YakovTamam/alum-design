import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { PortfolioCategory, SerializedPortfolioItem } from "./portfolio-types";

export {
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_CATEGORY_LABELS,
  type PortfolioCategory,
  type SerializedPortfolioItem,
} from "./portfolio-types";

export const PORTFOLIO_COLLECTION = "portfolio_items";

export type PortfolioItem = {
  _id?: ObjectId;
  title: string;
  category: PortfolioCategory;
  description?: string;
  imageUrl?: string;
  mediaId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export function serializePortfolioItem(item: PortfolioItem): SerializedPortfolioItem {
  return {
    title: item.title,
    category: item.category,
    description: item.description,
    imageUrl: item.imageUrl,
    mediaId: item.mediaId,
    order: item.order,
    _id: item._id?.toString() ?? "",
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}

export async function listPortfolioItems(): Promise<PortfolioItem[]> {
  const db = await getDb();
  return db.collection<PortfolioItem>(PORTFOLIO_COLLECTION).find({}).sort({ order: 1, createdAt: 1 }).toArray();
}

export async function createPortfolioItem(data: {
  title: string;
  category: PortfolioCategory;
  description?: string;
  imageUrl?: string;
  mediaId?: string;
  order?: number;
}): Promise<PortfolioItem> {
  const db = await getDb();
  const now = new Date();
  const item: PortfolioItem = {
    title: data.title.trim(),
    category: data.category,
    description: data.description?.trim() || undefined,
    imageUrl: data.imageUrl,
    mediaId: data.mediaId,
    order: data.order ?? 0,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<PortfolioItem>(PORTFOLIO_COLLECTION).insertOne(item);
  return { ...item, _id: result.insertedId };
}

export async function updatePortfolioItem(
  id: string,
  data: Partial<Pick<PortfolioItem, "title" | "category" | "description" | "imageUrl" | "mediaId" | "order">>,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db
    .collection<PortfolioItem>(PORTFOLIO_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } });
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection<PortfolioItem>(PORTFOLIO_COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
