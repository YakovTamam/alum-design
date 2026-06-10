import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import {
  createPortfolioItem,
  listPortfolioItems,
  serializePortfolioItem,
  PORTFOLIO_CATEGORIES,
  type PortfolioCategory,
} from "@/lib/portfolio";

export async function GET() {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const items = await listPortfolioItems();
  return NextResponse.json({ items: items.map(serializePortfolioItem) });
}

export async function POST(request: Request) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { title, category, description, imageUrl, mediaId, order } = body;

  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "יש להזין כותרת" }, { status: 400 });
  }
  if (typeof category !== "string" || !PORTFOLIO_CATEGORIES.includes(category as PortfolioCategory)) {
    return NextResponse.json({ error: "קטגוריה לא תקינה" }, { status: 400 });
  }
  if (description !== undefined && typeof description !== "string") {
    return NextResponse.json({ error: "תיאור לא תקין" }, { status: 400 });
  }
  if (imageUrl !== undefined && typeof imageUrl !== "string") {
    return NextResponse.json({ error: "תמונה לא תקינה" }, { status: 400 });
  }
  if (mediaId !== undefined && typeof mediaId !== "string") {
    return NextResponse.json({ error: "תמונה לא תקינה" }, { status: 400 });
  }
  if (order !== undefined && typeof order !== "number") {
    return NextResponse.json({ error: "סדר לא תקין" }, { status: 400 });
  }

  const item = await createPortfolioItem({
    title,
    category: category as PortfolioCategory,
    description: typeof description === "string" ? description : undefined,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    mediaId: typeof mediaId === "string" ? mediaId : undefined,
    order: typeof order === "number" ? order : undefined,
  });

  return NextResponse.json({ ok: true, item: serializePortfolioItem(item) });
}
