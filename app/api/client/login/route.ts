import { NextResponse } from "next/server";
import { CLIENT_SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/auth";
import { getUserByEmail, verifyPassword } from "@/lib/users";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { email, password } = body;
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
    return NextResponse.json({ error: "יש להזין אימייל וסיסמה" }, { status: 400 });
  }

  let user;
  try {
    user = await getUserByEmail(email);
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  if (!user || user.role !== "client" || !(await verifyPassword(user, password))) {
    return NextResponse.json({ error: "אימייל או סיסמה שגויים" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_SESSION_COOKIE, createSessionToken(user._id!.toString(), user.role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
