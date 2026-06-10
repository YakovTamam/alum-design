import { listProjects, serializeProject } from "@/lib/projects";
import { listUsers, serializeUser } from "@/lib/users";
import ProjectsManager from "../../../components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  let projects: ReturnType<typeof serializeProject>[] = [];
  let clients: ReturnType<typeof serializeUser>[] = [];
  let loadError: string | null = null;

  try {
    const [projectDocs, clientDocs] = await Promise.all([listProjects(), listUsers("client")]);
    projects = projectDocs.map(serializeProject);
    clients = clientDocs.map(serializeUser);
  } catch (err) {
    console.error("Failed to load projects", err);
    loadError = "טעינת הפרויקטים נכשלה. ודאו שמחרוזת ה-MongoDB מוגדרת כראוי.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">ניהול פרויקטים</h1>
        <p className="mt-1 text-sm text-zinc-400">
          צרו פרויקטים עבור לקוחות ועדכנו את הסטטוס שלהם — הלקוח יראה את העדכון בדשבורד שלו.
        </p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : (
          <ProjectsManager initialProjects={projects} clients={clients} />
        )}
      </div>
    </div>
  );
}
