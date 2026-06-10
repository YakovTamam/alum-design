import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, serializeMedia, type Media } from "@/lib/media";

export async function GET() {
  if (!(await requireSuperAdmin())) {
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
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { publicId, url, width, height, format, bytes, fileType } = body;

  if (typeof publicId !== "string" || !publicId) {
    return NextResponse.json({ error: "שדה publicId חסר או לא תקין" }, { status: 400 });
  }
  if (typeof url !== "string" || !url) {
    return NextResponse.json({ error: "שדה url חסר או לא תקין" }, { status: 400 });
  }
  if (typeof width !== "number" || typeof height !== "number") {
    return NextResponse.json({ error: "שדות width/height חסרים או לא תקינים" }, { status: 400 });
  }
  if (typeof format !== "string") {
    return NextResponse.json({ error: "שדה format חסר או לא תקין" }, { status: 400 });
  }
  if (typeof bytes !== "number") {
    return NextResponse.json({ error: "שדה bytes חסר או לא תקין" }, { status: 400 });
  }

  const resolvedFileType: "image" | "video" | undefined =
    fileType === "video" ? "video" : fileType === "image" ? "image" : undefined;

  const media: Media = {
    publicId: publicId as string,
    url: url as string,
    width: width as number,
    height: height as number,
    format: format as string,
    bytes: bytes as number,
    fileType: resolvedFileType,
    createdAt: new Date(),
  };

  try {
    const db = await getDb();
    const result = await db.collection<Media>(MEDIA_COLLECTION).insertOne(media);
    return NextResponse.json({ media: serializeMedia({ ...media, _id: result.insertedId }) });
  } catch (err) {
    console.error("Failed to save media metadata", err);
    return NextResponse.json({ error: "שמירת המדיה נכשלה, נסו שוב מאוחר יותר" }, { status: 500 });
  }
}
