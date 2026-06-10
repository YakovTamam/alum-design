import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/auth";
import { countUsers, createUser, getUserByEmail, verifyPassword } from "@/lib/users";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { email, password, name } = body;
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "יש להזין אימייל וסיסמה" }, { status: 400 });
  }

  let user;
  try {
    const existingCount = await countUsers();

    if (existingCount === 0) {
      // Bootstrap: the very first account created becomes the super-admin.
      if (typeof name !== "string" || !name.trim()) {
        return NextResponse.json({ error: "יש להזין שם" }, { status: 400 });
      }
      user = await createUser({
        email,
        password,
        name,
        role: "super-admin",
      });
    } else {
      const existing = await getUserByEmail(email);
      if (!existing || !(await verifyPassword(existing, password))) {
        return NextResponse.json({ error: "אימייל או סיסמה שגויים" }, { status: 401 });
      }
      if (existing.role !== "super-admin" && existing.role !== "admin") {
        return NextResponse.json({ error: "אין הרשאה לפאנל הניהול" }, { status: 403 });
      }
      user = existing;
    }
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(user._id!.toString(), user.role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
