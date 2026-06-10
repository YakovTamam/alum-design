import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  CLIENT_SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
} from "@/lib/auth";
import { getInvitationByToken, isInvitationValid, markInvitationUsed } from "@/lib/invitations";
import { createUser, getUserByEmail } from "@/lib/users";

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let invitation;
  try {
    invitation = await getInvitationByToken(token);
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  if (!invitation || !isInvitationValid(invitation)) {
    return NextResponse.json({ error: "ההזמנה אינה תקפה או שפג תוקפה" }, { status: 404 });
  }

  return NextResponse.json({ email: invitation.email, role: invitation.role });
}

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { name, password } = body;
  if (typeof name !== "string" || !name.trim() || typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "יש להזין שם וסיסמה בת 6 תווים לפחות" }, { status: 400 });
  }

  let invitation;
  try {
    invitation = await getInvitationByToken(token);
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  if (!invitation || !isInvitationValid(invitation)) {
    return NextResponse.json({ error: "ההזמנה אינה תקפה או שפג תוקפה" }, { status: 404 });
  }

  const existing = await getUserByEmail(invitation.email);
  if (existing) {
    return NextResponse.json({ error: "כבר קיים משתמש עם אימייל זה" }, { status: 409 });
  }

  const user = await createUser({
    email: invitation.email,
    password,
    name,
    role: invitation.role,
  });
  await markInvitationUsed(token);

  const isClient = user.role === "client";
  const cookieName = isClient ? CLIENT_SESSION_COOKIE : ADMIN_SESSION_COOKIE;
  const redirectTo = isClient ? "/client" : "/admin";

  const response = NextResponse.json({ ok: true, redirect: redirectTo });
  response.cookies.set(cookieName, createSessionToken(user._id!.toString(), user.role), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return response;
}
