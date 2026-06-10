import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import { type ProjectStatus, type SerializedProject } from "./project-types";

export {
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
  type SerializedProject,
} from "./project-types";

export const PROJECTS_COLLECTION = "projects";

export type Project = {
  _id?: ObjectId;
  clientId: string;
  name: string;
  status: ProjectStatus;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export function serializeProject(project: Project): SerializedProject {
  return {
    _id: project._id?.toString() ?? "",
    clientId: project.clientId,
    name: project.name,
    status: project.status,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function listProjects(clientId?: string): Promise<Project[]> {
  const db = await getDb();
  const filter = clientId ? { clientId } : {};
  return db.collection<Project>(PROJECTS_COLLECTION).find(filter).sort({ updatedAt: -1 }).toArray();
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<Project>(PROJECTS_COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function createProject(data: {
  clientId: string;
  name: string;
  status: ProjectStatus;
  description: string;
}): Promise<Project> {
  const db = await getDb();
  const now = new Date();
  const project: Project = {
    clientId: data.clientId,
    name: data.name.trim(),
    status: data.status,
    description: data.description.trim(),
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection<Project>(PROJECTS_COLLECTION).insertOne(project);
  return { ...project, _id: result.insertedId };
}

export async function updateProject(
  id: string,
  data: Partial<Pick<Project, "name" | "status" | "description" | "clientId">>,
): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db
    .collection<Project>(PROJECTS_COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } });
}

export async function deleteProject(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return;
  const db = await getDb();
  await db.collection<Project>(PROJECTS_COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
