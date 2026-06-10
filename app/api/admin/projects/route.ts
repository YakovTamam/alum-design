import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { createProject, listProjects, serializeProject, PROJECT_STATUSES } from "@/lib/projects";
import { getUserById } from "@/lib/users";

export async function GET() {
  const session = await requireStaff();
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 401 });
  }

  const projects = await listProjects();
  return NextResponse.json({ projects: projects.map(serializeProject) });
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

  const { clientId, name, status, description } = body;
  if (typeof clientId !== "string" || !clientId.trim()) {
    return NextResponse.json({ error: "יש לבחור לקוח" }, { status: 400 });
  }
  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "יש להזין שם פרויקט" }, { status: 400 });
  }
  if (typeof status !== "string" || !PROJECT_STATUSES.includes(status as (typeof PROJECT_STATUSES)[number])) {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 });
  }

  const client = await getUserById(clientId);
  if (!client || client.role !== "client") {
    return NextResponse.json({ error: "לקוח לא נמצא" }, { status: 404 });
  }

  const project = await createProject({
    clientId,
    name,
    status: status as (typeof PROJECT_STATUSES)[number],
    description: typeof description === "string" ? description : "",
  });

  return NextResponse.json({ ok: true, project: serializeProject(project) });
}
