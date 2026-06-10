"use client";

import { useState, type FormEvent } from "react";
import {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
  type SerializedProject,
} from "@/lib/project-types";
import type { SerializedUser } from "@/lib/user-roles";

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

function clientLabel(clients: SerializedUser[], clientId: string) {
  const client = clients.find((c) => c._id === clientId);
  return client ? `${client.name} (${client.email})` : "לקוח לא ידוע";
}

export default function ProjectsManager({
  initialProjects,
  clients,
}: {
  initialProjects: SerializedProject[];
  clients: SerializedUser[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [clientId, setClientId] = useState(clients[0]?._id ?? "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("pending");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!clientId) {
      setError("יש להזמין לקוח לפני יצירת פרויקט");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, name, description, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "יצירת הפרויקט נכשלה");
        return;
      }
      setProjects((curr) => [data.project, ...curr]);
      setName("");
      setDescription("");
      setStatus("pending");
    } catch {
      setError("שגיאת רשת, נסו שוב");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateProject(id: string, patch: Partial<Pick<SerializedProject, "status" | "description">>) {
    setUpdatingId(id);
    const previous = projects;
    setProjects((curr) => curr.map((p) => (p._id === id ? { ...p, ...patch } : p)));

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error();
    } catch {
      setProjects(previous);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    setUpdatingId(id);
    const previous = projects;
    setProjects((curr) => curr.filter((p) => p._id !== id));

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setProjects(previous);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Create form */}
      <div className="rounded-2xl border border-white/10 p-6">
        <h2 className="mb-4 text-sm font-semibold text-white">פרויקט חדש</h2>
        {clients.length === 0 ? (
          <p className="text-sm text-zinc-400">
            אין עדיין לקוחות במערכת. הזמינו לקוח דרך עמוד &quot;משתמשים&quot; ואז חזרו לכאן.
          </p>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400" htmlFor="project-client">
                  לקוח
                </label>
                <select
                  id="project-client"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-64 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                >
                  {clients.map((c) => (
                    <option key={c._id} value={c._id} className="bg-panel">
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400" htmlFor="project-name">
                  שם פרויקט
                </label>
                <input
                  id="project-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-64 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-zinc-400" htmlFor="project-status">
                  סטטוס
                </label>
                <select
                  id="project-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-panel">
                      {PROJECT_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-400" htmlFor="project-description">
                תיאור קצר
              </label>
              <textarea
                id="project-description"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="self-start rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-[#1a1308] transition-colors hover:bg-gold-light disabled:opacity-60"
            >
              {submitting ? "יוצר…" : "יצירת פרויקט"}
            </button>
          </form>
        )}

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {/* Projects list */}
      <div>
        <h2 className="mb-4 text-sm font-semibold text-white">פרויקטים</h2>
        {projects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-zinc-400">
            אין עדיין פרויקטים.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-white/10 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{project.name}</h3>
                    <p className="mt-1 text-xs text-zinc-400">{clientLabel(clients, project.clientId)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={project.status}
                      disabled={updatingId === project._id}
                      onChange={(e) => updateProject(project._id, { status: e.target.value as ProjectStatus })}
                      className={`rounded-full border px-3 py-1.5 text-xs outline-none transition-opacity ${STATUS_STYLES[project.status]} ${
                        updatingId === project._id ? "opacity-50" : ""
                      }`}
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-panel text-zinc-200">
                          {PROJECT_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleDelete(project._id)}
                      disabled={updatingId === project._id}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-red-400/40 hover:text-red-400 disabled:opacity-50"
                    >
                      מחיקה
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end">
                  <textarea
                    rows={2}
                    value={drafts[project._id] ?? project.description}
                    onChange={(e) => setDrafts((d) => ({ ...d, [project._id]: e.target.value }))}
                    className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/60"
                  />
                  <button
                    type="button"
                    disabled={updatingId === project._id || drafts[project._id] === undefined}
                    onClick={() => {
                      const description = drafts[project._id];
                      updateProject(project._id, { description });
                      setDrafts((d) => {
                        const next = { ...d };
                        delete next[project._id];
                        return next;
                      });
                    }}
                    className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-40"
                  >
                    שמירת תיאור
                  </button>
                </div>

                <p className="mt-3 text-xs text-zinc-500">עודכן לאחרונה: {formatDate(project.updatedAt)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
