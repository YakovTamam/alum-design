import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireStaff } from "@/lib/auth";
import {
  deletePortfolioItem,
  updatePortfolioItem,
  PORTFOLIO_CATEGORIES,
  type PortfolioItem,
  type PortfolioCategory,
} from "@/lib/portfolio";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const update: Partial<Pick<PortfolioItem, "title" | "category" | "description" | "imageUrl" | "mediaId" | "order">> = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "כותרת לא תקינה" }, { status: 400 });
    }
    update.title = body.title.trim();
  }

  if (body.category !== undefined) {
    if (typeof body.category !== "string" || !PORTFOLIO_CATEGORIES.includes(body.category as PortfolioCategory)) {
      return NextResponse.json({ error: "קטגוריה לא תקינה" }, { status: 400 });
    }
    update.category = body.category as PortfolioCategory;
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      return NextResponse.json({ error: "תיאור לא תקין" }, { status: 400 });
    }
    update.description = body.description.trim() || undefined;
  }

  if (body.imageUrl !== undefined) {
    if (typeof body.imageUrl !== "string") {
      return NextResponse.json({ error: "תמונה לא תקינה" }, { status: 400 });
    }
    update.imageUrl = body.imageUrl || undefined;
  }

  if (body.mediaId !== undefined) {
    if (typeof body.mediaId !== "string") {
      return NextResponse.json({ error: "תמונה לא תקינה" }, { status: 400 });
    }
    update.mediaId = body.mediaId || undefined;
  }

  if (body.order !== undefined) {
    if (typeof body.order !== "number") {
      return NextResponse.json({ error: "סדר לא תקין" }, { status: 400 });
    }
    update.order = body.order;
  }

  await updatePortfolioItem(id, update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "מזהה לא תקין" }, { status: 400 });
  }

  await deletePortfolioItem(id);
  return NextResponse.json({ ok: true });
}
