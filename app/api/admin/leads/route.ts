import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { LEADS_COLLECTION, type Lead } from "@/lib/leads";
import { ADMIN_SESSION_COOKIE, isValidSessionToken } from "@/lib/auth";

async function requireSession() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function GET() {
  if (!(await requireSession())) {
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
