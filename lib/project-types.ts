export const PROJECT_STATUSES = ["pending", "in-progress", "completed"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "ממתין",
  "in-progress": "בתהליך",
  completed: "הושלם",
};

export type SerializedProject = {
  _id: string;
  clientId: string;
  name: string;
  status: ProjectStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
};
