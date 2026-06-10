import { randomBytes } from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";
import type { UserRole } from "./user-roles";

export const INVITATIONS_COLLECTION = "invitations";
export const INVITATION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type Invitation = {
  _id?: ObjectId;
  token: string;
  email: string;
  role: UserRole;
  invitedBy: string; // user id of inviter
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
};

export type SerializedInvitation = {
  _id: string;
  email: string;
  role: UserRole;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
};

export function serializeInvitation(invite: Invitation): SerializedInvitation {
  return {
    _id: invite._id?.toString() ?? "",
    email: invite.email,
    role: invite.role,
    createdAt: invite.createdAt.toISOString(),
    expiresAt: invite.expiresAt.toISOString(),
    usedAt: invite.usedAt ? invite.usedAt.toISOString() : null,
  };
}

export async function createInvitation(data: {
  email: string;
  role: UserRole;
  invitedBy: string;
}): Promise<Invitation> {
  const db = await getDb();
  const now = new Date();
  const invitation: Invitation = {
    token: randomBytes(32).toString("hex"),
    email: data.email.toLowerCase().trim(),
    role: data.role,
    invitedBy: data.invitedBy,
    createdAt: now,
    expiresAt: new Date(now.getTime() + INVITATION_TTL_MS),
  };
  const result = await db.collection<Invitation>(INVITATIONS_COLLECTION).insertOne(invitation);
  return { ...invitation, _id: result.insertedId };
}

export async function getInvitationByToken(token: string): Promise<Invitation | null> {
  const db = await getDb();
  return db.collection<Invitation>(INVITATIONS_COLLECTION).findOne({ token });
}

export async function markInvitationUsed(token: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<Invitation>(INVITATIONS_COLLECTION)
    .updateOne({ token }, { $set: { usedAt: new Date() } });
}

export async function listInvitations(role?: UserRole): Promise<Invitation[]> {
  const db = await getDb();
  const filter = role ? { role } : {};
  return db
    .collection<Invitation>(INVITATIONS_COLLECTION)
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();
}

export function isInvitationValid(invitation: Invitation): boolean {
  return !invitation.usedAt && invitation.expiresAt.getTime() > Date.now();
}
