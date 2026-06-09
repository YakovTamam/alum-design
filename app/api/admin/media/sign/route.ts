import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  try {
    const result = generateUploadSignature();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to generate upload signature", err);
    return NextResponse.json({ error: "שגיאה פנימית בשרת" }, { status: 500 });
  }
}
