export type UserRole = "super-admin" | "admin" | "client";

export const ROLE_LABELS: Record<UserRole, string> = {
  "super-admin": "סופר אדמין",
  admin: "אדמין",
  client: "לקוח",
};

export type SerializedUser = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
};
