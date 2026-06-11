import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth";
import { setSetting } from "@/lib/settings";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  if (!(await requireSuperAdmin())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { key } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "גוף הבקשה אינו JSON תקין" }, { status: 400 });
  }

  const { value } = body;
  if (typeof value !== "string") {
    return NextResponse.json({ error: "value חייב להיות מחרוזת" }, { status: 400 });
  }

  await setSetting(key, value);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, key, value });
}
