// Seeds a fresh MongoDB database with the values from client.config.mjs.
// Usage: npm run seed
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { MongoClient } from "mongodb";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

for (const envFile of [".env.local", ".env"]) {
  const envPath = path.join(rootDir, envFile);
  if (existsSync(envPath)) process.loadEnvFile(envPath);
}

const configPath = path.join(rootDir, "client.config.mjs");
if (!existsSync(configPath)) {
  console.error(
    "client.config.mjs not found.\n" +
      "Copy client.config.example.mjs to client.config.mjs, fill in the new client's details, and re-run this script."
  );
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local before seeding.");
  process.exit(1);
}
const dbName = process.env.MONGODB_DB || "alum-design";

const { default: config } = await import(pathToFileURL(configPath).href);

const settings = {
  "contact-phone": config.contact?.phone,
  "contact-email": config.contact?.email,
  "header-bg-color": config.theme?.headerBg,
  "header-text-color": config.theme?.headerText,
  "footer-bg-color": config.theme?.footerBg,
  "footer-text-color": config.theme?.footerText,
  "logo-size": config.logoSize,
  "footer-logo-size": config.footerLogoSize,
  "loading-screen-enabled": config.loadingScreen?.enabled,
  "loading-screen-use-site-logo": config.loadingScreen?.useSiteLogo,
  "loading-screen-bg-color": config.loadingScreen?.backgroundColor,
  "loading-screen-accent-color": config.loadingScreen?.accentColor,
  "loading-screen-min-duration": config.loadingScreen?.minDuration,
  "loading-screen-max-duration": config.loadingScreen?.maxDuration,
  "pixel-meta": config.trackingPixels?.["pixel-meta"],
  "pixel-tiktok": config.trackingPixels?.["pixel-tiktok"],
  "pixel-ga": config.trackingPixels?.["pixel-ga"],
  "pixel-clarity": config.trackingPixels?.["pixel-clarity"],
};

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  console.log(`Seeding "${dbName}" from client.config.mjs...`);

  let written = 0;
  for (const [key, value] of Object.entries(settings)) {
    if (value === undefined) continue;
    await db
      .collection("site_settings")
      .updateOne({ _id: key }, { $set: { value: String(value) } }, { upsert: true });
    written++;
  }
  console.log(`Wrote ${written} settings to "site_settings".`);

  if (config.gallery) {
    await db.collection("image_gallery").updateOne(
      { _id: "main" },
      {
        $set: {
          title: config.gallery.title ?? "",
          enabled: config.gallery.enabled ?? false,
          speed: config.gallery.speed ?? 50,
          direction: config.gallery.direction ?? "left",
          height: config.gallery.height ?? 220,
          gap: config.gallery.gap ?? 16,
          updatedAt: new Date(),
        },
        $setOnInsert: { images: [] },
      },
      { upsert: true }
    );
    console.log('Wrote gallery defaults to "image_gallery".');
  }

  if (config.siteIdentity || config.navLinks || config.categories || config.services) {
    await db.collection("site_copy").updateOne(
      { _id: "main" },
      {
        $set: {
          ...(config.siteIdentity ? { siteIdentity: config.siteIdentity } : {}),
          ...(config.navLinks ? { navLinks: config.navLinks } : {}),
          ...(config.categories ? { categories: config.categories } : {}),
          ...(config.services
            ? {
                services: config.services.map((s) => ({
                  id: s.id ?? crypto.randomUUID(),
                  label: s.label,
                  desc: s.desc ?? "",
                  icon: s.icon ?? "pergola",
                })),
              }
            : {}),
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    console.log('Wrote site identity, nav links, categories and services to "site_copy".');
  }

  console.log("Seed complete.");
} finally {
  await client.close();
}
