import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { getDb } from "./mongodb";

const ADMIN_SETTINGS_COLLECTION = "admin_settings";
const ADMIN_SETTINGS_ID = "admin";

type AdminSettings = { _id: string; passwordHash: string };

export const ADMIN_SESSION_COOKIE = "alum_admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days
const SESSION_TTL_MS = SESSION_TTL_SECONDS * 1000;

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function createSessionToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }),
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = sign(payload);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof exp === "number" && Date.now() < exp;
  } catch {
    return false;
  }
}

/**
 * First password ever entered becomes the admin password (stored hashed in
 * MongoDB). Every later attempt is verified against that stored hash.
 */
export async function verifyOrSetAdminPassword(password: string): Promise<boolean> {
  const db = await getDb();
  const settings = db.collection<AdminSettings>(ADMIN_SETTINGS_COLLECTION);
  const existing = await settings.findOne({ _id: ADMIN_SETTINGS_ID });

  if (!existing) {
    const passwordHash = await bcrypt.hash(password, 10);
    await settings.insertOne({ _id: ADMIN_SETTINGS_ID, passwordHash });
    return true;
  }

  return bcrypt.compare(password, existing.passwordHash);
}
