import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { sendInvitationEmail } from "@/lib/email";
import { createInvitation, listInvitations, serializeInvitation } from "@/lib/invitations";
import { getUserByEmail, listUsers, serializeUser, type UserRole } from "@/lib/users";

const INVITABLE_ROLES: UserRole[] = ["admin", "client"];

export async function GET() {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const roleFilter = session.role === "admin" ? "client" : undefined;

  const [users, invitations] = await Promise.all([
    listUsers(roleFilter),
    listInvitations(roleFilter),
  ]);

  return NextResponse.json({
    users: users.map(serializeUser),
    invitations: invitations.map(serializeInvitation),
  });
}

export async function POST(request: Request) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { email, role } = body;
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "יש להזין אימייל" }, { status: 400 });
  }
  if (typeof role !== "string" || !INVITABLE_ROLES.includes(role as UserRole)) {
    return NextResponse.json({ error: "תפקיד לא תקין" }, { status: 400 });
  }
  if (session.role === "admin" && role !== "client") {
    return NextResponse.json({ error: "אדמין יכול להזמין לקוחות בלבד" }, { status: 403 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await getUserByEmail(normalizedEmail);
  if (existingUser) {
    return NextResponse.json({ error: "כבר קיים משתמש עם אימייל זה" }, { status: 409 });
  }

  const invitation = await createInvitation({
    email: normalizedEmail,
    role: role as UserRole,
    invitedBy: session.uid,
  });

  const inviteUrl = new URL(`/invite/${invitation.token}`, request.url).toString();
  await sendInvitationEmail({ email: invitation.email, role: invitation.role, inviteUrl });

  return NextResponse.json({ ok: true, invitation: serializeInvitation(invitation) });
}
