import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { listSignupRequests, serializeSignupRequest } from "@/lib/signup-requests";

export async function GET() {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const requests = await listSignupRequests();
  return NextResponse.json({ requests: requests.map(serializeSignupRequest) });
}
