import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/strings";
import { getUserByEmail } from "@/lib/users";
import { createSignupRequest, getPendingSignupRequestByEmail } from "@/lib/signup-requests";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { name, phone, city, email } = body;
  if (
    typeof name !== "string" || !name.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof city !== "string" || !city.trim() ||
    typeof email !== "string" || !email.trim()
  ) {
    return NextResponse.json({ error: "יש למלא את כל השדות" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return NextResponse.json({ error: "כבר קיים משתמש עם אימייל זה" }, { status: 409 });
    }

    const existingRequest = await getPendingSignupRequestByEmail(normalizedEmail);
    if (existingRequest) {
      return NextResponse.json({ error: "כבר קיימת בקשה ממתינה לאישור עם אימייל זה" }, { status: 409 });
    }

    await createSignupRequest({ name, phone, city, email: normalizedEmail });
  } catch {
    return NextResponse.json(
      { error: "החיבור למסד הנתונים נכשל, נסו שוב מאוחר יותר" },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
