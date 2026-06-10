import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { requireStaff } from "@/lib/auth";
import { deleteTestimonial, updateTestimonial, type Testimonial } from "@/lib/testimonials";

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

  const update: Partial<Pick<Testimonial, "name" | "role" | "quote" | "rating" | "imageUrl" | "mediaId" | "order">> = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "שם לא תקין" }, { status: 400 });
    }
    update.name = body.name.trim();
  }

  if (body.role !== undefined) {
    if (typeof body.role !== "string") {
      return NextResponse.json({ error: "תפקיד לא תקין" }, { status: 400 });
    }
    update.role = body.role.trim() || undefined;
  }

  if (body.quote !== undefined) {
    if (typeof body.quote !== "string" || !body.quote.trim()) {
      return NextResponse.json({ error: "תוכן ההמלצה לא תקין" }, { status: 400 });
    }
    update.quote = body.quote.trim();
  }

  if (body.rating !== undefined) {
    if (typeof body.rating !== "number" || !Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "דירוג לא תקין" }, { status: 400 });
    }
    update.rating = body.rating;
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

  await updateTestimonial(id, update);
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

  await deleteTestimonial(id);
  return NextResponse.json({ ok: true });
}
