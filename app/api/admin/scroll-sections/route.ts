import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import {
  SCROLL_SECTIONS_COLLECTION,
  ANIM_TYPES,
  FONT_SIZES,
  FONT_FAMILIES,
  serializeScrollSection,
  type ScrollSection,
  type TextOverlay,
} from "@/lib/scroll-sections";
import { getScrollSection } from "@/lib/scroll-sections-data";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }
  const section = await getScrollSection();
  return NextResponse.json({ section });
}

export async function PUT(request: Request) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON לא תקין" }, { status: 400 });
  }

  const { videoUrl, mediaId, sectionHeight, overlays } = body;

  const sanitizedOverlays: TextOverlay[] = Array.isArray(overlays)
    ? overlays.map((o): TextOverlay => ({
        id: typeof o.id === "string" ? o.id : crypto.randomUUID(),
        text: typeof o.text === "string" ? o.text : "",
        x: clamp(Number(o.x), 0, 100),
        y: clamp(Number(o.y), 0, 100),
        enterAt: clamp(Number(o.enterAt), 0, 99),
        enterDuration: clamp(Number(o.enterDuration), 1, 50),
        exitAt: clamp(Number(o.exitAt), 0, 100),
        exitDuration: clamp(Number(o.exitDuration), 1, 50),
        enterAnim: ANIM_TYPES.includes(o.enterAnim) ? o.enterAnim : "fade",
        exitAnim: ANIM_TYPES.includes(o.exitAnim) ? o.exitAnim : "fade",
        fontSize: FONT_SIZES.includes(o.fontSize) ? o.fontSize : "md",
        fontFamily: FONT_FAMILIES.includes(o.fontFamily) ? o.fontFamily : "heebo",
        color: typeof o.color === "string" && /^#[0-9a-fA-F]{6}$/.test(o.color) ? o.color : "#ffffff",
        fontWeight: o.fontWeight === "bold" ? "bold" : "normal",
        align: ["start", "center", "end"].includes(o.align) ? o.align : "start",
        maxWidth: clamp(typeof o.maxWidth === "number" ? o.maxWidth : 85, 10, 100),
        textShadow: o.textShadow === true,
        textShadowColor:
          typeof o.textShadowColor === "string" && /^#[0-9a-fA-F]{6}$/.test(o.textShadowColor)
            ? o.textShadowColor
            : "#000000",
        textShadowBlur: clamp(typeof o.textShadowBlur === "number" ? o.textShadowBlur : 8, 0, 50),
        textShadowOffsetX: clamp(typeof o.textShadowOffsetX === "number" ? o.textShadowOffsetX : 0, -50, 50),
        textShadowOffsetY: clamp(typeof o.textShadowOffsetY === "number" ? o.textShadowOffsetY : 2, -50, 50),
      }))
    : [];

  const updated: ScrollSection = {
    _id: "main",
    videoUrl: typeof videoUrl === "string" && videoUrl ? videoUrl : undefined,
    mediaId: typeof mediaId === "string" && mediaId ? mediaId : undefined,
    sectionHeight: clamp(typeof sectionHeight === "number" ? sectionHeight : 400, 100, 1000),
    overlays: sanitizedOverlays,
    updatedAt: new Date(),
  };

  const db = await getDb();
  await db
    .collection<ScrollSection>(SCROLL_SECTIONS_COLLECTION)
    .replaceOne({ _id: "main" } as never, updated, { upsert: true });

  revalidatePath("/");

  return NextResponse.json({ ok: true, section: serializeScrollSection(updated) });
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, isNaN(val) ? min : val));
}
