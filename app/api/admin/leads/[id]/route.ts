import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { LEAD_STATUSES, LEADS_COLLECTION, type Lead, type LeadStatus } from "@/lib/leads";
import { requireStaff, requireSuperAdmin } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { status, notes } = body;

  const update: Partial<Pick<Lead, "status" | "notes">> = {};

  if (status !== undefined) {
    if (!LEAD_STATUSES.includes(status as LeadStatus)) {
      return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
    }
    update.status = status as LeadStatus;
  }

  if (notes !== undefined) {
    if (typeof notes !== "string") {
      return NextResponse.json({ error: "הערות לא תקינות" }, { status: 400 });
    }
    update.notes = notes.trim().slice(0, 5000);
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "לא נשלחו שדות לעדכון" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection<Lead>(LEADS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: update });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "ליד לא נמצא" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ...update });
}

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
  const result = await db.collection<Lead>(LEADS_COLLECTION).deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "ליד לא נמצא" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
