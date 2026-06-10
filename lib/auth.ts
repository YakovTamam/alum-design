import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { UserRole } from "./users";

export const ADMIN_SESSION_COOKIE = "alum_admin_session";
export const CLIENT_SESSION_COOKIE = "alum_client_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;

export type SessionPayload = {
  uid: string;
  role: UserRole;
  exp: number;
};

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createSessionToken(uid: string, role: UserRole): string {
  const payload = Buffer.from(
    JSON.stringify({ uid, role, exp: Date.now() + SESSION_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (
      typeof data.uid !== "string" ||
      typeof data.role !== "string" ||
      typeof data.exp !== "number" ||
      Date.now() >= data.exp
    ) {
      return null;
    }
    return { uid: data.uid, role: data.role as UserRole, exp: data.exp };
  } catch {
    return null;
  }
}

export async function getStaffSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
  if (!session || (session.role !== "super-admin" && session.role !== "admin")) return null;
  return session;
}

export async function getClientSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = readSessionToken(cookieStore.get(CLIENT_SESSION_COOKIE)?.value);
  if (!session || session.role !== "client") return null;
  return session;
}

export async function requireStaff(): Promise<SessionPayload | null> {
  return getStaffSession();
}

export async function requireSuperAdmin(): Promise<SessionPayload | null> {
  const session = await getStaffSession();
  if (!session || session.role !== "super-admin") return null;
  return session;
}

export async function requireClient(): Promise<SessionPayload | null> {
  return getClientSession();
}
