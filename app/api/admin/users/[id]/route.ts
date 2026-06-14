import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { getUserById, serializeUser, updateUserStatus, type UserStatus } from "@/lib/users";

const VALID_STATUSES: UserStatus[] = ["active", "disabled"];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { status } = body;
  if (typeof status !== "string" || !VALID_STATUSES.includes(status as UserStatus)) {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
  }

  if (id === session.uid) {
    return NextResponse.json({ error: "לא ניתן לשנות את הסטטוס של המשתמש שלך" }, { status: 400 });
  }

  const target = await getUserById(id);
  if (!target) {
    return NextResponse.json({ error: "המשתמש לא נמצא" }, { status: 404 });
  }

  if (target.role === "super-admin") {
    return NextResponse.json({ error: "לא ניתן לשנות את הסטטוס של סופר אדמין" }, { status: 403 });
  }

  if (session.role === "admin" && target.role !== "client") {
    return NextResponse.json({ error: "אדמין יכול לנהל לקוחות בלבד" }, { status: 403 });
  }

  await updateUserStatus(id, status as UserStatus);

  return NextResponse.json({ ok: true, user: serializeUser({ ...target, status: status as UserStatus }) });
}
