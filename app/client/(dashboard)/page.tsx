import { getClientSession } from "@/lib/auth";
import { listProjects, PROJECT_STATUS_LABELS, serializeProject, type ProjectStatus } from "@/lib/projects";
import { getSiteCopy } from "@/lib/site-copy-data";
import { getSiteName } from "@/lib/site-copy";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  pending: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  "in-progress": "border-sky-400/40 bg-sky-400/10 text-sky-300",
  completed: "border-green-500/40 bg-green-500/10 text-green-300",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(
    new Date(value),
  );
}

export default async function ClientDashboardPage() {
  const session = await getClientSession();
  const { siteIdentity } = await getSiteCopy();

  let projects: ReturnType<typeof serializeProject>[] = [];
  let loadError: string | null = null;

  try {
    if (session) {
      const docs = await listProjects(session.uid);
      projects = docs.map(serializeProject);
    }
  } catch (err) {
    console.error("Failed to load client projects", err);
    loadError = "טעינת הפרויקטים נכשלה. נסו לרענן את העמוד.";
  }

  return (
    <div>
      <div>
        <h1 className="text-lg font-semibold text-white">הפרויקטים שלי</h1>
        <p className="mt-1 text-sm text-zinc-400">סטטוס עדכני של הפרויקטים שלכם אצל {getSiteName(siteIdentity)}.</p>
      </div>

      <div className="mt-8">
        {loadError ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {loadError}
          </div>
        ) : projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
            עדיין לא נוספו פרויקטים עבורכם. בקרוב הם יופיעו כאן.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-white/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">{project.name}</h2>
                  <span className={`rounded-full border px-3 py-1.5 text-xs ${STATUS_STYLES[project.status]}`}>
                    {PROJECT_STATUS_LABELS[project.status]}
                  </span>
                </div>
                {project.description && (
                  <p className="mt-3 text-sm leading-7 text-zinc-300">{project.description}</p>
                )}
                <p className="mt-3 text-xs text-zinc-500">עודכן לאחרונה: {formatDate(project.updatedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
