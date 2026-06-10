import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { createTestimonial, listTestimonials, serializeTestimonial } from "@/lib/testimonials";

export async function GET() {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const testimonials = await listTestimonials();
  return NextResponse.json({ testimonials: testimonials.map(serializeTestimonial) });
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

  const { name, role, quote, rating, imageUrl, mediaId, order } = body;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "יש להזין שם" }, { status: 400 });
  }
  if (typeof quote !== "string" || !quote.trim()) {
    return NextResponse.json({ error: "יש להזין תוכן המלצה" }, { status: 400 });
  }
  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "דירוג לא תקין" }, { status: 400 });
  }
  if (role !== undefined && typeof role !== "string") {
    return NextResponse.json({ error: "תפקיד לא תקין" }, { status: 400 });
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

  const testimonial = await createTestimonial({
    name,
    role: typeof role === "string" ? role : undefined,
    quote,
    rating,
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    mediaId: typeof mediaId === "string" ? mediaId : undefined,
    order: typeof order === "number" ? order : undefined,
  });

  return NextResponse.json({ ok: true, testimonial: serializeTestimonial(testimonial) });
}
