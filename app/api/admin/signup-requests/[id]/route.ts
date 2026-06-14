import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { sendInvitationEmail } from "@/lib/email";
import { createInvitation } from "@/lib/invitations";
import { getUserByEmail } from "@/lib/users";
import {
  getSignupRequestById,
  serializeSignupRequest,
  updateSignupRequestStatus,
} from "@/lib/signup-requests";

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

  const { action } = body;
  if (action !== "approve" && action !== "reject") {
    return NextResponse.json({ error: "פעולה לא תקינה" }, { status: 400 });
  }

  const signupRequest = await getSignupRequestById(id);
  if (!signupRequest) {
    return NextResponse.json({ error: "הבקשה לא נמצאה" }, { status: 404 });
  }
  if (signupRequest.status !== "pending") {
    return NextResponse.json({ error: "הבקשה כבר טופלה" }, { status: 409 });
  }

  if (action === "reject") {
    await updateSignupRequestStatus(id, "rejected");
    return NextResponse.json({
      ok: true,
      request: serializeSignupRequest({ ...signupRequest, status: "rejected" }),
    });
  }

  const existingUser = await getUserByEmail(signupRequest.email);
  if (existingUser) {
    return NextResponse.json({ error: "כבר קיים משתמש עם אימייל זה" }, { status: 409 });
  }

  const invitation = await createInvitation({
    email: signupRequest.email,
    role: "client",
    invitedBy: session.uid,
  });

  const inviteUrl = new URL(`/invite/${invitation.token}`, request.url).toString();
  await sendInvitationEmail({ email: invitation.email, role: invitation.role, inviteUrl });

  await updateSignupRequestStatus(id, "approved");

  return NextResponse.json({
    ok: true,
    request: serializeSignupRequest({ ...signupRequest, status: "approved" }),
  });
}
