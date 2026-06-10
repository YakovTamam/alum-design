import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { LEADS_COLLECTION, type Lead, type LeadStatus } from "@/lib/leads";
import { requireStaff } from "@/lib/auth";

const STATUSES: LeadStatus[] = ["new", "contacted", "closed"];

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

  const { status } = body;
  if (!STATUSES.includes(status as LeadStatus)) {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
  }

  const db = await getDb();
  const result = await db
    .collection<Lead>(LEADS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { status: status as LeadStatus } });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: "ליד לא נמצא" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
