import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/auth";
import { countUsers, createUser } from "@/lib/users";

// Bootstrap-only endpoint: creates the first super-admin account when no
// users exist yet. Normal logins go through /api/login.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { email, password, name } = body;
  if (
    typeof email !== "string" || !email.trim() ||
    typeof password !== "string" || !password ||
    typeof name !== "string" || !name.trim()
  ) {
    return NextResponse.json({ error: "יש להזין שם, אימייל וסיסמה" }, { status: 400 });
  }

  let user;
  try {
    const existingCount = await countUsers();
    if (existingCount > 0) {
      return NextResponse.json({ error: "כבר קיימים משתמשים במערכת" }, { status: 409 });
    }
    user = await createUser({ email, password, name, role: "super-admin" });
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
