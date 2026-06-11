// Resets (or creates) a super-admin account's password directly in MongoDB.
// Use this if you're locked out of /admin/login.
//
// Usage: node scripts/reset-admin-password.mjs <email> <new-password>
//   - If a user with that email exists, its password is reset (role unchanged).
//   - If not, a new super-admin account is created with that email/password.
//
// Requires MONGODB_URI (and optionally MONGODB_DB) in .env.local or the environment.
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(rootDir, envFile);
  if (existsSync(envPath)) process.loadEnvFile(envPath);
}

const [, , email, password] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/reset-admin-password.mjs <email> <new-password>");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local (point it at the target database) before running this.");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "alum-design";

const normalizedEmail = email.toLowerCase().trim();
const passwordHash = await bcrypt.hash(password, 10);

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const users = db.collection("users");

  const existing = await users.findOne({ email: normalizedEmail });
  if (existing) {
    await users.updateOne({ _id: existing._id }, { $set: { passwordHash } });
    console.log(`Password updated for ${normalizedEmail} (role: ${existing.role}).`);
  } else {
    await users.insertOne({
      email: normalizedEmail,
      passwordHash,
      name: "Admin",
      role: "super-admin",
      createdAt: new Date(),
    });
    console.log(`Created new super-admin account for ${normalizedEmail}.`);
  }

  const all = await users.find({}, { projection: { email: 1, role: 1, _id: 0 } }).toArray();
  console.log("Users in database:", all.map((u) => `${u.email} (${u.role})`).join(", ") || "(none)");
} finally {
  await client.close();
}
