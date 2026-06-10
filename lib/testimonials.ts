import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export const TESTIMONIALS_COLLECTION = "testimonials";

export type Testimonial = {
  _id?: ObjectId;
  name: string;
  role?: string;
  quote: string;
  rating: number;
  imageUrl?: string;
  mediaId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SerializedTestimonial = Omit<Testimonial, "_id" | "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export function serializeTestimonial(t: Testimonial): SerializedTestimonial {
  return {
    name: t.name,
    role: t.role,
    quote: t.quote,
    rating: t.rating,
    imageUrl: t.imageUrl,
    mediaId: t.mediaId,
    order: t.order,
    _id: t._id?.toString() ?? "",
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  };
}

export async function listTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  return db.collection<Testimonial>(TESTIMONIALS_COLLECTION).find({}).sort({ order: 1, createdAt: 1 }).toArray();
}

export async function createTestimonial(data: {
  name: string;
  role?: string;
  quote: string;
  rating: number;
  imageUrl?: string;
  mediaId?: string;
  order?: number;
}): Promise<Testimonial> {
  const db = await getDb();
  const now = new Date();
  const testimonial: Testimonial = {
    name: data.name.trim(),
    role: data.role?.trim() || undefined,
    quote: data.quote.trim(),
    rating: data.rating,
    imageUrl: data.imageUrl,
    mediaId: data.mediaId,
    order: data.order ?? 0,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<Testimonial>(TESTIMONIALS_COLLECTION).insertOne(testimonial);
  return { ...testimonial, _id: result.insertedId };
}

export async function updateTestimonial(
  id: string,
  data: Partial<Pick<Testimonial, "name" | "role" | "quote" | "rating" | "imageUrl" | "mediaId" | "order">>,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db
    .collection<Testimonial>(TESTIMONIALS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } });
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection<Testimonial>(TESTIMONIALS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
