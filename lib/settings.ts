import { getDb } from "./mongodb";

const SETTINGS_COLLECTION = "site_settings";

interface SiteSetting {
  _id: string;
  value: string;
}

export async function getSetting(key: string, defaultValue: string): Promise<string> {
  try {
    const db = await getDb();
    const doc = await db
      .collection<SiteSetting>(SETTINGS_COLLECTION)
      .findOne({ _id: key } as never);
    return doc?.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db
    .collection<SiteSetting>(SETTINGS_COLLECTION)
    .updateOne({ _id: key } as never, { $set: { value } }, { upsert: true });
}
