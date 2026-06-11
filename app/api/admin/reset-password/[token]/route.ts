import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/auth";
import {
  getPasswordResetByToken,
  isPasswordResetValid,
  markPasswordResetUsed,
} from "@/lib/password-reset";
import { getUserById, updateUserPassword } from "@/lib/users";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let reset;
  try {
    reset = await getPasswordResetByToken(token);
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  if (!reset || !isPasswordResetValid(reset)) {
    return NextResponse.json({ error: "הקישור אינו תקף או שפג תוקפו" }, { status: 404 });
  }

  return NextResponse.json({ email: reset.email });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { password } = body;
  if (typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "הסיסמה חייבת להכיל לפחות 8 תווים" }, { status: 400 });
  }

  let reset;
  try {
    reset = await getPasswordResetByToken(token);
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  if (!reset || !isPasswordResetValid(reset)) {
    return NextResponse.json({ error: "הקישור אינו תקף או שפג תוקפו" }, { status: 404 });
  }

  const user = await getUserById(reset.userId);
  if (!user) {
    return NextResponse.json({ error: "המשתמש לא נמצא" }, { status: 404 });
  }

  await updateUserPassword(reset.userId, password);
  await markPasswordResetUsed(token);

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
