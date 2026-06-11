import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, type Media } from "@/lib/media";
import {
  GALLERY_COLLECTION,
  GALLERY_DIRECTIONS,
  serializeGallerySection,
  type GallerySection,
  type GalleryImage,
} from "@/lib/gallery";
import { getGallerySection } from "@/lib/gallery-data";

export async function GET() {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
  const section = await getGallerySection();
  return NextResponse.json({ section });
}

export async function PUT(request: Request) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON לא תקין" }, { status: 400 });
  }

  const { title, enabled, images, speed, direction, height, gap } = body;

  const db = await getDb();

  const rawImages = Array.isArray(images) ? images : [];
  const mediaIds = rawImages
    .map((img) => (img && typeof img === "object" ? (img as Record<string, unknown>).mediaId : null))
    .filter((id): id is string => typeof id === "string" && ObjectId.isValid(id));

  const mediaDocs = mediaIds.length
    ? await db
        .collection<Media>(MEDIA_COLLECTION)
        .find({ _id: { $in: mediaIds.map((id) => new ObjectId(id)) } })
        .toArray()
    : [];
  const mediaById = new Map(mediaDocs.map((m) => [m._id!.toString(), m]));

  const sanitizedImages: GalleryImage[] = rawImages
    .map((img): GalleryImage | null => {
      if (!img || typeof img !== "object") return null;
      const mediaId = (img as Record<string, unknown>).mediaId;
      if (typeof mediaId !== "string") return null;
      const media = mediaById.get(mediaId);
      if (!media) return null;
      const id = (img as Record<string, unknown>).id;
      return {
        id: typeof id === "string" && id ? id : crypto.randomUUID(),
        mediaId,
        url: media.url,
        width: media.width,
        height: media.height,
      };
    })
    .filter((img): img is GalleryImage => img !== null);

  const updated: GallerySection = {
    _id: "main",
    title: typeof title === "string" ? title.trim() : "",
    enabled: enabled === true,
    images: sanitizedImages,
    speed: clamp(typeof speed === "number" ? speed : 50, 5, 300),
    direction: GALLERY_DIRECTIONS.includes(direction as never) ? (direction as GallerySection["direction"]) : "left",
    height: clamp(typeof height === "number" ? height : 220, 80, 600),
    gap: clamp(typeof gap === "number" ? gap : 16, 0, 64),
    updatedAt: new Date(),
  };

  await db
    .collection<GallerySection>(GALLERY_COLLECTION)
    .replaceOne({ _id: "main" } as never, updated, { upsert: true });

  revalidatePath("/");

  return NextResponse.json({ ok: true, section: serializeGallerySection(updated) });
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(val) ? min : val));
}
