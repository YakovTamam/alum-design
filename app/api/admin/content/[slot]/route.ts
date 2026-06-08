import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, type Media } from "@/lib/media";
import {
  CONTENT_SLOTS,
  SITE_CONTENT_COLLECTION,
  type ContentSlotKey,
  type SiteContentEntry,
} from "@/lib/content";

const SLOT_KEYS = CONTENT_SLOTS.map((slot) => slot.key) as ContentSlotKey[];

function isSlotKey(value: string): value is ContentSlotKey {
  return (SLOT_KEYS as string[]).includes(value);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { slot } = await params;
  if (!isSlotKey(slot)) {
    return NextResponse.json({ error: "מיקום תוכן לא תקין" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { mediaId } = body;
  if (typeof mediaId !== "string" || !ObjectId.isValid(mediaId)) {
    return NextResponse.json({ error: "מזהה תמונה לא תקין" }, { status: 400 });
  }

  const db = await getDb();
  const media = await db.collection<Media>(MEDIA_COLLECTION).findOne({ _id: new ObjectId(mediaId) });
  if (!media) {
    return NextResponse.json({ error: "התמונה לא נמצאה" }, { status: 404 });
  }

  const entry: SiteContentEntry = {
    _id: slot,
    url: media.url,
    mediaId,
    updatedAt: new Date(),
  };

  await db
    .collection<SiteContentEntry>(SITE_CONTENT_COLLECTION)
    .replaceOne({ _id: slot }, entry, { upsert: true });

  return NextResponse.json({ ok: true, url: media.url });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slot: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { slot } = await params;
  if (!isSlotKey(slot)) {
    return NextResponse.json({ error: "מיקום תוכן לא תקין" }, { status: 400 });
  }

  const db = await getDb();
  await db.collection<SiteContentEntry>(SITE_CONTENT_COLLECTION).deleteOne({ _id: slot });

  return NextResponse.json({ ok: true });
}
