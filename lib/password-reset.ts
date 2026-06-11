import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export const PASSWORD_RESETS_COLLECTION = "password_resets";
export const PASSWORD_RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

export type PasswordReset = {
  _id?: ObjectId;
  token: string;
  userId: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
};

export async function createPasswordReset(data: { userId: string; email: string }): Promise<PasswordReset> {
  const db = await getDb();
  const now = new Date();
  const reset: PasswordReset = {
    token: randomBytes(32).toString("hex"),
    userId: data.userId,
    email: data.email,
    createdAt: now,
    expiresAt: new Date(now.getTime() + PASSWORD_RESET_TTL_MS),
  };
  const result = await db.collection<PasswordReset>(PASSWORD_RESETS_COLLECTION).insertOne(reset);
  return { ...reset, _id: result.insertedId };
}

export async function getPasswordResetByToken(token: string): Promise<PasswordReset | null> {
  const db = await getDb();
  return db.collection<PasswordReset>(PASSWORD_RESETS_COLLECTION).findOne({ token });
}

export async function markPasswordResetUsed(token: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<PasswordReset>(PASSWORD_RESETS_COLLECTION)
    .updateOne({ token }, { $set: { usedAt: new Date() } });
}

export function isPasswordResetValid(reset: PasswordReset): boolean {
  return !reset.usedAt && reset.expiresAt.getTime() > Date.now();
}
