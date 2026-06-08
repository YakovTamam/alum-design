import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdminSession } from "@/lib/auth";
import { deleteImage } from "@/lib/cloudinary";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, type Media } from "@/lib/media";
import { SITE_CONTENT_COLLECTION, type SiteContentEntry } from "@/lib/content";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
  }

  const db = await getDb();
  const media = await db.collection<Media>(MEDIA_COLLECTION).findOne({ _id: new ObjectId(id) });
  if (!media) {
    return NextResponse.json({ error: "התמונה לא נמצאה" }, { status: 404 });
  }

  try {
    await deleteImage(media.publicId);
  } catch (err) {
    console.error("Failed to delete image from Cloudinary", err);
    return NextResponse.json({ error: "מחיקת התמונה נכשלה, נסו שוב מאוחר יותר" }, { status: 502 });
  }

  await db.collection<Media>(MEDIA_COLLECTION).deleteOne({ _id: media._id });
  await db
    .collection<SiteContentEntry>(SITE_CONTENT_COLLECTION)
    .deleteMany({ mediaId: id });

  return NextResponse.json({ ok: true });
}
