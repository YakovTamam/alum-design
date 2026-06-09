import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { MEDIA_COLLECTION, type Media } from "@/lib/media";
import {
  HERO_SLIDES_COLLECTION,
  DEFAULT_SLIDES,
  TITLE_SIZES,
  SUBTITLE_SIZES,
  serializeHeroSlide,
  type HeroSlide,
} from "@/lib/hero-slides";

const VALID_IDS = [1, 2, 3];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  const slideId = parseInt(id, 10);
  if (!VALID_IDS.includes(slideId)) {
    return NextResponse.json({ error: "מזהה שקופית לא תקין" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { title, subtitle, ctaText, ctaLink, mediaId, duration, titleSize, titleColor, subtitleSize, subtitleColor } = body;

  const db = await getDb();
  const existing = await db
    .collection<HeroSlide>(HERO_SLIDES_COLLECTION)
    .findOne({ _id: slideId });
  const def = DEFAULT_SLIDES.find((s) => s._id === slideId)!;

  let imageUrl = existing?.imageUrl;
  let resolvedMediaId = existing?.mediaId;
  let resolvedMediaType = existing?.mediaType;

  if (typeof mediaId === "string") {
    if (mediaId === "") {
      imageUrl = undefined;
      resolvedMediaId = undefined;
      resolvedMediaType = undefined;
    } else if (ObjectId.isValid(mediaId)) {
      const media = await db
        .collection<Media>(MEDIA_COLLECTION)
        .findOne({ _id: new ObjectId(mediaId) });
      if (!media) {
        return NextResponse.json({ error: "התמונה לא נמצאה" }, { status: 404 });
      }
      imageUrl = media.url;
      resolvedMediaId = mediaId;
      resolvedMediaType = media.fileType ?? "image";
    }
  }

  const updated: HeroSlide = {
    _id: slideId,
    title: typeof title === "string" && title.trim() ? title.trim() : (existing?.title ?? def.title),
    subtitle:
      typeof subtitle === "string" ? subtitle.trim() : (existing?.subtitle ?? def.subtitle),
    ctaText:
      typeof ctaText === "string" && ctaText.trim()
        ? ctaText.trim()
        : (existing?.ctaText ?? def.ctaText),
    ctaLink:
      typeof ctaLink === "string" && ctaLink.trim()
        ? ctaLink.trim()
        : (existing?.ctaLink ?? def.ctaLink),
    duration:
      typeof duration === "number" && duration >= 2 && duration <= 30
        ? Math.round(duration)
        : (existing?.duration ?? def.duration),
    imageUrl,
    mediaId: resolvedMediaId,
    mediaType: resolvedMediaType,
    titleSize: TITLE_SIZES.includes(titleSize as never) ? (titleSize as HeroSlide["titleSize"]) : (existing?.titleSize),
    titleColor: typeof titleColor === "string" && /^#[0-9a-fA-F]{6}$/.test(titleColor) ? titleColor : existing?.titleColor,
    subtitleSize: SUBTITLE_SIZES.includes(subtitleSize as never) ? (subtitleSize as HeroSlide["subtitleSize"]) : (existing?.subtitleSize),
    subtitleColor: typeof subtitleColor === "string" && /^#[0-9a-fA-F]{6}$/.test(subtitleColor) ? subtitleColor : existing?.subtitleColor,
    updatedAt: new Date(),
  };

  await db
    .collection<HeroSlide>(HERO_SLIDES_COLLECTION)
    .replaceOne({ _id: slideId }, updated, { upsert: true });

  return NextResponse.json({ ok: true, slide: serializeHeroSlide(updated) });
}
