import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { LEADS_COLLECTION, type Lead } from "@/lib/leads";
import { requireStaff } from "@/lib/auth";

export async function GET() {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const db = await getDb();
  const leads = await db
    .collection<Lead>(LEADS_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(500)
    .toArray();

  return NextResponse.json({
    leads: leads.map((lead) => ({ ...lead, _id: lead._id?.toString() })),
  });
}
