import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getDb } from "./mongodb";
import { type SerializedUser, type UserRole } from "./user-roles";

export { ROLE_LABELS, type SerializedUser, type UserRole } from "./user-roles";

export const USERS_COLLECTION = "users";

export type User = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  createdAt: Date;
};

export function serializeUser(user: User): SerializedUser {
  return {
    _id: user._id?.toString() ?? "",
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function countUsers(): Promise<number> {
  const db = await getDb();
  return db.collection(USERS_COLLECTION).countDocuments();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDb();
  return db.collection<User>(USERS_COLLECTION).findOne({ email: email.toLowerCase().trim() });
}

export async function getUserById(id: string): Promise<User | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await getDb();
  return db.collection<User>(USERS_COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function listUsers(role?: UserRole): Promise<User[]> {
  const db = await getDb();
  const filter = role ? { role } : {};
  return db.collection<User>(USERS_COLLECTION).find(filter).sort({ createdAt: -1 }).toArray();
}

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}): Promise<User> {
  const db = await getDb();
  const passwordHash = await bcrypt.hash(data.password, 10);
  const user: User = {
    email: data.email.toLowerCase().trim(),
    passwordHash,
    name: data.name.trim(),
    role: data.role,
    createdAt: new Date(),
  };
  const result = await db.collection<User>(USERS_COLLECTION).insertOne(user);
  return { ...user, _id: result.insertedId };
}

export async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.passwordHash);
}

export async function updateUserPassword(id: string, password: string): Promise<void> {
  const db = await getDb();
  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection<User>(USERS_COLLECTION).updateOne({ _id: new ObjectId(id) }, { $set: { passwordHash } });
}
