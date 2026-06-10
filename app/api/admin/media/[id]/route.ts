import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireSuperAdmin } from "@/lib/auth";
import { deleteMedia } from "@/lib/cloudinary";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, type Media } from "@/lib/media";
import { SITE_CONTENT_COLLECTION, type SiteContentEntry } from "@/lib/content";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
  }

  const db = await getDb();
  const media = await db.collection<Media>(MEDIA_COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!media) {
    return NextResponse.json({ error: "הקובץ לא נמצא" }, { status: 404 });
  }

  try {
    await deleteMedia(media.publicId, media.fileType);
  } catch (err) {
    console.error("Failed to delete media from Cloudinary", err);
    return NextResponse.json({ error: "מחיקת הקובץ נכשלה, נסו שוב מאוחר יותר" }, { status: 502 });
  }

  await db.collection<Media>(MEDIA_COLLECTION).deleteOne({ _id: media._id });
  await db
    .collection<SiteContentEntry>(SITE_CONTENT_COLLECTION)
    .deleteMany({ mediaId: id });

  const { HERO_SLIDES_COLLECTION } = await import("@/lib/hero-slides");
  await db.collection(HERO_SLIDES_COLLECTION).updateMany(
    { mediaId: id },
    { $unset: { imageUrl: "", mediaId: "", mediaType: "" } },
  );

  return NextResponse.json({ ok: true });
}
