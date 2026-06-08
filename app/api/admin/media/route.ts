import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media } from "@/lib/media";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const db = await getDb();
  const items = await db
    .collection<Media>(MEDIA_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return NextResponse.json({ media: items.map(serializeMedia) });
}

export async function POST(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו multipart/form-data תקין" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "לא נבחר קובץ" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "סוג קובץ לא נתמך — יש להעלות תמונה (JPEG/PNG/WebP/GIF/AVIF)" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "הקובץ גדול מדי — הגודל המרבי הוא 8MB" }, { status: 400 });
  }

  let uploaded: Awaited<ReturnType<typeof uploadImage>>;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    uploaded = await uploadImage(buffer);
  } catch (err) {
    console.error("Failed to upload image to Cloudinary", err);
    return NextResponse.json({ error: "העלאת התמונה נכשלה, נסו שוב מאוחר יותר" }, { status: 502 });
  }

  const media: Media = {
    publicId: uploaded.public_id,
    url: uploaded.secure_url,
    width: uploaded.width,
    height: uploaded.height,
    format: uploaded.format,
    bytes: uploaded.bytes,
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection<Media>(MEDIA_COLLECTION).insertOne(media);
    return NextResponse.json({ media: serializeMedia({ ...media, _id: result.insertedId }) });
  } catch (err) {
    console.error("Failed to save media metadata", err);
    return NextResponse.json({ error: "שמירת התמונה נכשלה, נסו שוב מאוחר יותר" }, { status: 500 });
  }
}
