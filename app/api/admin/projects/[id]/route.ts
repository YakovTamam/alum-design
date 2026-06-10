import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { deleteProject, updateProject, PROJECT_STATUSES } from "@/lib/projects";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  const update: { name?: string; status?: (typeof PROJECT_STATUSES)[number]; description?: string } = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json({ error: "שם פרויקט לא תקין" }, { status: 400 });
    }
    update.name = body.name;
  }

  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !PROJECT_STATUSES.includes(body.status as (typeof PROJECT_STATUSES)[number])) {
      return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
    }
    update.status = body.status as (typeof PROJECT_STATUSES)[number];
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") {
      return NextResponse.json({ error: "תיאור לא תקין" }, { status: 400 });
    }
    update.description = body.description;
  }

  await updateProject(id, update);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const { id } = await params;
  await deleteProject(id);
  return NextResponse.json({ ok: true });
}
