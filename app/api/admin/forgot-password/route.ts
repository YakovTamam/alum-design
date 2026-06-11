import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/users";
import { createPasswordReset } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { email } = body;
  if (typeof email !== "string" || !email.trim()) {
    return NextResponse.json({ error: "יש להזין אימייל" }, { status: 400 });
  }

  // Always return the same response, whether or not the account exists, to
  // avoid leaking which emails have admin accounts.
  try {
    const user = await getUserByEmail(email.toLowerCase().trim());
    if (user && (user.role === "super-admin" || user.role === "admin")) {
      const reset = await createPasswordReset({ userId: user._id!.toString(), email: user.email });
      const resetUrl = new URL(`/admin/reset-password/${reset.token}`, request.url).toString();
      await sendPasswordResetEmail({ email: user.email, resetUrl });
    }
  } catch {
    // ignore — DB issues must not change the response or leak state
  }

  return NextResponse.json({ ok: true });
}
